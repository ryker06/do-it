## Vercel Deploy — Manual Step Required

Vercel token is expired. Run this in your terminal:

```
cd "P:\Apps\Do It\web"
npx vercel login
npx vercel --prod --yes
```

When `vercel login` runs, pick "Continue with GitHub" and approve in the browser.
After deploy completes, copy the `https://....vercel.app` URL — that's your live PWA.

GitHub repo is already live: https://github.com/ryker06/do-it
