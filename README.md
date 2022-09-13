# Slyk App Demo

This demo application shows how you can leverage the
[Slyk API](https://slyk.io/api) to build your coin-powered product or community.

This was built with [Next JS](https://nextjs.org/) and
[Tailwind CSS](https://tailwindcss.com/), but following the principals used here
you can use any other tech stack for your application.

A step by step guide can be found on
[our documentation](https://developers.slyk.io/slyk/).

## Running this application

You'll need at least Node v16 to run this application.

You'll also need a Slyk API key. Create a `.env` file with the following:

```
SLYK_API_KEY=<your-api-key>
```

To run the application in development mode use:

```sh
yarn dev
```

To run in production mode first create a build with `yarn build` and then run it
with `yarn start`.
