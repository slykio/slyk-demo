import Cookies from 'cookies';
import jwtDecode from 'jwt-decode';

export const cookieKeys = {
  refreshToken: 'refreshToken',
  token: 'sessionToken',
};

function isTokenExpired(token: string): boolean {
  const decodedToken = jwtDecode<any>(token);
  const expiresAt = decodedToken.exp * 1000;
  const margin = 2 * 60 * 1000;

  return expiresAt - margin < Date.now();
}

type Tokens = {
  refreshToken: string;
  token: string;
};

export class ServerSession {
  private refreshRequest: Promise<string> | null = null;

  constructor(
    // TODO: Provide a better type.
    private readonly client: any,
    private readonly cookies: Cookies
  ) {}

  hasToken(): boolean {
    return !!this.cookies.get(cookieKeys.token);
  }

  async getToken(): Promise<string | null> {
    let token = this.cookies.get(cookieKeys.token) ?? null;

    if (!token) {
      return null;
    }

    try {
      if (isTokenExpired(token)) {
        token = await this.refreshToken();
      }
    } catch (error) {
      throw new Error('Unauthorized');
    }

    return token;
  }

  setTokens({ refreshToken, token }: Tokens): void {
    this.cookies.set(cookieKeys.token, token, {
      httpOnly: true,
      overwrite: true,
      sameSite: 'lax',
    });

    this.cookies.set(cookieKeys.refreshToken, refreshToken, {
      httpOnly: true,
      overwrite: true,
      sameSite: 'lax',
    });
  }

  clearTokens(): void {
    this.cookies.set(cookieKeys.token, null, {
      httpOnly: true,
      overwrite: true,
      sameSite: 'lax',
    });

    this.cookies.set(cookieKeys.refreshToken, null, {
      httpOnly: true,
      overwrite: true,
      sameSite: 'lax',
    });
  }

  refreshToken(): Promise<string> {
    if (!this.refreshRequest) {
      const refreshToken = this.cookies.get(cookieKeys.refreshToken);

      this.refreshRequest = this.client.auth.refresh({ refreshToken }).then(
        (data: any) => {
          this.refreshRequest = null;
          this.setTokens(data);

          return data.token;
        },
        () => {
          this.refreshRequest = null;
          this.clearTokens();

          return Promise.reject(new Error('Unauthorized'));
        }
      ) as Promise<string>;
    }

    return this.refreshRequest;
  }

  async revokeToken(): Promise<void> {
    const refreshToken = this.cookies.get(cookieKeys.refreshToken);

    return await this.client.auth.logout({ refreshToken });
  }
}
