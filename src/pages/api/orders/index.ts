import createSlykClient from '@slyk/slyk-sdk-node';
import Cookies from 'cookies';
import { NextApiRequest, NextApiResponse } from 'next';
import { ServerSession } from 'server/server-session';
import { Order } from 'types/order';
import { User } from 'types/user';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<Order>
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
  const token = await session.getToken();

  if (!token) {
    response.status(403);
    return;
  }

  const { paymentMethod, productId, quantity } = request.body;
  const { user }: { user: User } = await slyk.auth.validate({ token });
  const order = await slyk.order.create({
    walletId: user.primaryWalletId,
    lines: [{ productId, quantity }],
    deliveryMethod: 'pickup',
    chosenPaymentMethod: paymentMethod,
  });
  response.status(200).json(order);
}
