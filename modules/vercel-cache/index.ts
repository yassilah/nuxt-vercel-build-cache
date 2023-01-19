import { defineNuxtModule, createResolver } from '@nuxt/kit'
import { defu } from 'defu'

export interface ModuleOptions {
    base: string
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: 'vercel-cache',
        configKey: 'vercelCache'
    },
    defaults: {
        base: process.env.NUXT_VERCEL_CACHE_BASE || './cache'
    },
    setup(options, nuxt) {
        nuxt.hook('nitro:config', config => {
            // Check that the Nitro preset is vercel
            if (config.preset === 'vercel') {
                // Set the base storage of all routes to 'vercel'
                config.routeRules = defu(config.routeRules, {
                    '/**': {
                        cache: {
                            base: 'vercel'
                        }
                    }
                })

                // Create the vercel storage driver
                const { resolve } = createResolver(import.meta.url)
                config.storage = defu(config.storage, {
                    vercel: {
                        driver: resolve('runtime/driver.mjs'),
                        base: options.base
                    }

                })

                nuxt.hook('nitro:init', nitro => {
                    nitro.hooks.hook('prerender:routes', () => {
                        // Not sure if there's another way to tell when Nuxt is pre-rendering?
                        process.env.NUXT_PRERENDER = 'true'
                    })

                    nitro.hooks.hook('compiled', async nitro => {
                        // After nitro is done, move the folder containing all your cached routes
                        // to the output folder to make it readable from Serveless functions
                        const { renameSync } = await import('fs')
                        const { resolve } = await import('pathe')
                        const source = resolve(nuxt.options.rootDir, options.base)
                        const target = resolve(nitro.options.output.serverDir, options.base)
                        renameSync(source, target)
                    })
                })
            }
        })
    }

})