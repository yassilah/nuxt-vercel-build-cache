import { createResolver, defineNuxtModule } from '@nuxt/kit'
import { defu } from 'defu'
import { resolve } from 'pathe'
export interface ModuleOptions {
    base: string
    enabled: boolean
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: 'vercel-cache',
        configKey: 'vercelCache'
    },
    defaults: nuxt => ({
        base: process.env.NUXT_VERCEL_CACHE_BASE || './cache',
        enabled: !!process.env.VERCEL ?? nuxt.options.nitro.preset === 'vercel'
    }),
    setup(options, nuxt) {
        nuxt.hook('nitro:config', config => {
            if (options.enabled) {
                const source = resolve(nuxt.options.rootDir, options.base)

                config.routeRules = defu(config.routeRules, {
                    '/**': {
                        cache: {
                            base: 'vercel'
                        }
                    }
                })

                config.storage = defu(config.storage, {
                    vercel: {
                        driver: createResolver(import.meta.url).resolve(
                            'runtime/driver.mjs'
                        ),
                        src: source,
                        target: options.base
                    }
                })

                nuxt.hook('nitro:init', nitro => {
                    console.log('✅ Setting up cached output for Vercel.')

                    nitro.hooks.hook('prerender:routes', () => {
                        process.env.NUXT_PRERENDER = 'true'
                    })

                    nitro.hooks.hook('compiled', async nitro => {
                        console.log('🔥 Moving cache to output dir...')
                        const { renameSync } = await import('fs')
                        const target = resolve(
                            nitro.options.output.serverDir,
                            options.base
                        )

                        console.log('🚀', source, '->', target)

                        renameSync(source, target)
                    })
                })
            }
        })
    }
})
