This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Issue Reproduction

Note that the GET endpoint at /resource/[resourceId] adds an ETag header in the form "hash". I would expect it to be received by a client as-is. However, if you run:

```bash
curl -i -X GET \
  -H "Cache-Control: no-cache" \
  -H "User-Agent: PostmanRuntime/7.43.3" \
  -H "Accept: */*" \
  -H "Accept-Encoding: gzip, deflate, br" \
  -H "Connection: keep-alive" \
  https://if-match-etag-reproduction.vercel.app/api/resource/1
```

You'll notice that the ETag header value has been prefixed with W/. Interestingly, if you exclude all the the `Accept-Encoding` header, the ETag value is not prefixed with a W/:

```bash
curl -i -X GET \
  -H "Cache-Control: no-cache" \
  -H "User-Agent: PostmanRuntime/7.43.3" \
  -H "Accept: */*" \
  -H "Connection: keep-alive" \
  https://if-match-etag-reproduction.vercel.app/api/resource/1
```

If you run:

```bash
curl -i -X PATCH -H "If-Match: \"abc123\"" https://if-match-etag-reproduction.vercel.app/api/resource/1
```

This will return a 412 error response including a x-vercel-error header with value PRECONDITION_FAILED, despite the NextJS app returning a 200 response. For example:

https://vercel.com/allign/if-match-etag-reproduction/HywR72TAN6AazWcraWDCGaEr4JLi/logs?selectedLogId=8v8mb-1745424555357-045243b2df13

However, in the case of a PATCH, you would expect the ETag returned in the response to be different to the If-Match header value because the resource has been modified.

This behaviour prevents the use of If-Match/ETag for concurrency control.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
