import type { NextApiRequest, NextApiResponse } from 'next';
import createSlykClient from '@slyk/slyk-sdk-node';
import { User } from 'types/user';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<User>
) {
  if (request.method !== 'POST') {
    response.status(404);
    return;
  }

  const slyk = createSlykClient({
    apikey: process.env.SLYK_API_KEY,
    host: 'api.dev.seegno.net',
  });
  const { name, email, password } = request.body;
  const user = await slyk.user.create({
    name,
    email,
    password,
    verified: true,
  });
  response.status(200).json(user);
}
