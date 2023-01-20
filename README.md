# Nuxt 3 + SSG + Vercel

Simple Nuxt 3 app that allows for caching and retrieving API requests' output from build in Serverless functions after the app is deployed, without needing to do an initial request. This is mostly useful
when heavy API requests are made during build time that you don't want to have to do a second time after deployment.

If you deploy this app on Vercel and then go to `/api/test` you should see that the returned value is in fact the value that was pre-rendered at build time. After 60s, it will return a new server-rendered value. No more waiting after deploy 🚀
