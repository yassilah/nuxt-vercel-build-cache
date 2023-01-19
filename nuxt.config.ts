export default defineNuxtConfig({
    modules: [
        __dirname + '/modules/vercel-cache/index.ts'
    ],

    nitro: {
        prerender: {
            crawlLinks: true,
            routes: ['/']
        },

        preset: 'vercel',

        routeRules: {
            '/**': {
                cache: {
                    swr: true,
                    maxAge: 60,
                    staleMaxAge: 60,
                }
            }
        }
    }
})