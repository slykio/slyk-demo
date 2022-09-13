# Developing an application that uses the Slyk API

This guide will cover what you need to know to get started on building your
application on top of the Slyk API using our
[Node SDK](https://github.com/slykio/slyk-sdk-node).

The first thing you'll need to do is create an API key on your Slyk dashboard.
You can see how that is done [here]().

Keep in mind that building an application that uses the Slyk API requires a bit
of backend development. This is because you'll want to keep your Slyk API key
secure, and not include it on your frontend code. The part of your application
that connects with the Slyk API should then be on the backend.

This guide uses [Next.js](https://nextjs.org/) as the framework to build the
examples, because it allows creating API routes, which is where we'll write the
integration with the Slyk API.

## Using the Slyk Node SDK

Install the Slyk Node SDK package with:

```sh
npm install @slyk/slyk-sdk-node
```

Or with:

```sh
yarn add @slyk/slyk-sdk-node
```

Then you'll need a way to configure the API key you created. We advise using
environment variables for this. In Next.js you can do so with a `.env` file,
which would look like this:

```
SLYK_API_KEY=your-api-key
```

The name you give this environment variable is up to you.

With this set up, you should be able to access it on your code. You'll need to
create an instance of the Slyk SDK, like this:

```ts
import createSlykClient from '@slyk/slyk-sdk-node';

const slyk = createSlykClient({ apikey: process.env.SLYK_API_KEY });
```

You're now ready to start using the Slyk API.

For more information on the Slyk Node SDK take a look at its
[documentation](https://developers.slyk.io/slyk/developing-with-slyk/sdks/server-sdk).

## Serializing Slyk SDK models

Next's `getServerSideProps` method [requires all returned values to be
serializable](https://nextjs.org/docs/api-reference/data-fetching/get-server-side-props#getserversideprops-return-values),
so it's necessary to serialize model instances returned by the Slyk SDK
manually. This can be done with `JSON.stringify` and `JSON.parse` for example,
like this:

```ts
JSON.parse(JSON.stringify(user));
```

Keep that in mind when getting data from the Slyk API using the Slyk SDK.
