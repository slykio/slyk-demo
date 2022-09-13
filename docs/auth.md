# Slyk Authentication

This is a step by step guide on how to implement authentication using the Slyk
Api and the Slyk SDK.

Each step has a code snippets with examples on how to do each part. Please do
not that the examples lack things like error handling for brevity.

## Sign up

1. Create the sign up endpoint

First create an API endpoint that uses the Slyk SDK to create a user.

The SDK method is `slyk.user.create` and it takes the user's email, password,
name, and other optional fields. For this example we'll pass `verified: true`
to the method to automatically verify users.

```ts
import createSlykClient from '@slyk/slyk-sdk-node';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(404);
    return;
  }

  const slyk = createSlykClient({ apikey: process.env.SLYK_API_KEY });
  const { name, email, password } = request.body;
  const user = await slyk.user.create({
    name,
    email,
    password,
    verified: true,
  });
  response.status(200).json(user);
}
```

2. Create the sign up page

Then create a page with a form that asks for the user's name, email and password
and sends the data to the API endpoint created on the previous step.

```tsx
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

const SignUp: NextPage = () => {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);

  return (
    <main>
      <h2>Create an account</h2>
      <form
        onSubmit={async event => {
          event.preventDefault();
          setSubmitting(true);
          try {
            const formData = new FormData(event.target as HTMLFormElement);
            const response = await fetch('/api/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
              }),
            });
            const user = await response.json();
            await router.push('/sign-up/success');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        <label>
          Name
          <input name='name' required type='text' />
        </label>
        <label>
          Email
          <input autoComplete='email' name='email' required type='email' />
        </label>
        <label>
          Password
          <input
            autoComplete='password'
            name='password'
            required
            type='password'
          />
        </label>
        <button type='submit' disabled={isSubmitting}>
          Sign up
        </button>
      </form>
    </main>
  );
};

export default SignUp;
```

After this step you can either create a success page with a link to the sign in
page or you can redirect to the sign in directly.

You can also update the endpoint to create a session using the `slyk.auth.login`
method. You can see how that is done in the sign in flow below.

## Sign in

1. Create the sign in endpoint

Create an API endpoint that takes in the user's email and password and uses the
`slyk.auth.login` method to create a session for the user. The session consists
on a JWT used to authorize the user in the API and a refresh token that is used
to request a new JWT when the old one expires.

The way you manage and secure these tokens is up to you. You can either store
them on the client-side using
[`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
or you can store them on
[secure cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies).

In this example we'll store them on cookies using the
[`cookies`](https://www.npmjs.com/package/cookies) module. They'll later be read
on API endpoints that need the JWT.

```ts
import Cookies from 'cookies';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(404);
    return;
  }

  const cookies = new Cookies(request, response);
  const slyk = createSlykClient({ apikey: process.env.SLYK_API_KEY });
  const { email, password } = request.body;
  const { token, refreshToken } = await slyk.auth.login({ email, password });

  cookies.set('token', token, {
    httpOnly: true,
    overwrite: true,
    sameSite: 'lax',
    secure: true,
  });
  cookies.set('refresh-token', refreshToken, {
    httpOnly: true,
    overwrite: true,
    sameSite: 'lax',
    secure: true,
  });

  response.status(204).send(null);
}
```

If you want, you can update this endpoint to respond with the user's data, by
using the `slyk.auth.validate` method.

2. Create the sign in page

Create a page with a form that asks for the user's email and password and sends
the data to the API endpoint created on the previous step.

```tsx
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

const SignIn: NextPage = () => {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);

  return (
    <main>
      <h2>Sign in to your account</h2>

      <form
        onSubmit={async event => {
          event.preventDefault();
          setSubmitting(true);
          try {
            const formData = new FormData(event.target as HTMLFormElement);
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password'),
              }),
            });
            const user = await response.json();
            await router.push('/overview');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        <label>
          Email
          <input autoComplete='email' name='email' required type='email' />
        </label>
        <label>
          Password
          <input
            autoComplete='password'
            name='password'
            required
            type='password'
          />
        </label>
        <button type='submit' disabled={isSubmitting}>
          Sign in
        </button>
      </form>
    </main>
  );
};

export default SignIn;
```

## Get the user's data

1. Create the user data endpoint

Create an API endpoint that reads the JWT from the cookies (or receives it from
the client-side on the request body if you decided to store the tokens on local
storage) and uses the `slyk.auth.validate` method to validate the token and
fetch the user's data.

```ts
import type { NextApiRequest, NextApiResponse } from 'next';
import createSlykClient from '@slyk/slyk-sdk-node';
import { ServerSession } from 'server/server-session';
import Cookies from 'cookies';
import { User } from 'types/user';
import { ApiError } from 'types/api';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(404);
    return;
  }

  const cookies = new Cookies(request, response);
  const token = cookies.get('token');
  const slyk = createSlykClient({ apikey: process.env.SLYK_API_KEY });
  const { user } = await slyk.auth.validate({ token });

  response.status(200).json(user);
}
```

2. Refreshing the tokens

Keep in mind that the JWT can expire. If that happens a new one can be requested
with the `slyk.auth.refresh` method, like this:

```ts
const refreshToken = cookies.get('refresh-token');
const { token, refreshToken: newRefreshToken } = await slyk.auth.refresh({
  refreshToken,
});

cookies.set('token', token, {
  httpOnly: true,
  overwrite: true,
  sameSite: 'lax',
  secure: true,
});
cookies.set('refresh-token', refreshToken, {
  httpOnly: true,
  overwrite: true,
  sameSite: 'lax',
  secure: true,
});
```

Make sure to abstract this in some way so that you don't forget to do it.

## Sign out

1. Create the sign out endpoint

Create an API endpoint that reads the refresh token from the cookies (or
receives it from the client-side on the request body if you decided to store the
tokens on local storage) and uses the `slyk.auth.logout` method to revoke it.
This endpoint should also clear the cookies used to store the tokens.

As we did on the sign in endpoint, we'll use the
[`cookies`](https://www.npmjs.com/package/cookies) module to handle cookies.

```ts
import createSlykClient from '@slyk/slyk-sdk-node';
import Cookies from 'cookies';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(404);
    return;
  }

  const cookies = new Cookies(request, response);
  const slyk = createSlykClient({ apikey: process.env.SLYK_API_KEY });
  const refreshToken = cookies.get('refresh-token');
  await this.client.auth.logout({ refreshToken });

  cookies.set('token', null, {
    httpOnly: true,
    overwrite: true,
    sameSite: 'lax',
    secure: true,
  });
  cookies.set('refresh-token', null, {
    httpOnly: true,
    overwrite: true,
    sameSite: 'lax',
    secure: true,
  });

  response.status(204).send(null);
}
```

2. Add a sign out button somewhere in your app

Next add a button to your app that invokes the sign out endpoint and then
redirects the user back to the sign in page (or any other non-authenticated
page in your app). This button is usually on the profile menu or page.

```tsx
<button
  type='button'
  onClick={async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    await router.push('/');
  }}
>
  Sign out
</button>
```
