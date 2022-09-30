import type { NextApiRequest, NextApiResponse } from 'next';
import createSlykClient from '@slyk/slyk-sdk-node';
import { ServerSession } from 'server/server-session';
import Cookies from 'cookies';
import { User } from 'types/user';
import { ApiError } from 'types/api';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<User | ApiError>
) {
  if (request.method !== 'POST') {
    response.status(404);
    return;
  }

  const slyk = createSlykClient({
    apikey: process.env.SLYK_API_KEY,
    host: 'api.stg.slyk.io',
  });

  const { email, password } = request.body;
  const session = new ServerSession(slyk, new Cookies(request, response));
  try {
    const { token, refreshToken } = await slyk.auth.login({ email, password });

    session.setTokens({ token, refreshToken });

    const { user } = await slyk.auth.validate({ token });

    response.status(200).json(user);
  } catch (error: any) {
    console.log('error', error);
    const apiError: ApiError = {
      code: (error.data?.code as string) ?? error.message,
      status: 401,
    };

    response.status(401).json(apiError);
  }
}
