import { defineDriver } from 'unstorage'
import fs from 'unstorage/drivers/fs'
import memory from 'unstorage/drivers/memory'
import overlay from 'unstorage/drivers/overlay'

export default defineDriver(opts => {
    // When prerendering, we want to use the filesystem as the base layer
    // so that we can write the pre-rendered files to the filesystem.
    if (process.env.NUXT_PRERENDER) {
        return fs({ base: opts.src })
    }

    // Otherwise, we want to use the memory driver as the base layer.
    // Vercel cannot write to the filesystem, so we use the memory driver
    // as the base layer and the fs driver to read the pre-rendered files.
    return overlay({
        layers: [memory(), fs({ base: opts.target })]
    })
})
