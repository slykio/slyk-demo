import type { NextApiRequest, NextApiResponse } from 'next';
import createSlykClient from '@slyk/slyk-sdk-node';
import { ServerSession } from 'server/server-session';
import Cookies from 'cookies';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'POST') {
    response.status(404);
    return;
  }

  const slyk = createSlykClient({
    apikey: process.env.SLYK_API_KEY,
    host: 'api.dev.seegno.net',
  });

  const session = new ServerSession(slyk, new Cookies(request, response));

  await session.revokeToken();
  session.clearTokens();

  response.status(204).send(null);
}
