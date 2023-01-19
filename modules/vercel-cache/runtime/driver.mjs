import overlay from 'unstorage/drivers/overlay'
import memory from 'unstorage/drivers/memory'
import fs from 'unstorage/drivers/fs'
import { defineDriver } from 'unstorage'

export default defineDriver((opts) => {
    const base = opts?.base 
    const fsDriver =  fs({ base })
    const memoryDriver = memory()

    // When prerendering, we want to use the filesystem as the base layer
    // so that we can write the pre-rendered files to the filesystem.
    if (process.env.NUXT_PRERENDER) {
        return overlay({
            layers: [
                fsDriver,
                memoryDriver
            ]
        })
    }

    // Otherwise, we want to use the memory driver as the base layer.
    // Vercel cannot write to the filesystem, so we use the memory driver
    // as the base layer and the fs driver to read the pre-rendered files.
    return overlay({
        layers: [
            memoryDriver,
            fsDriver
        ]
    })
})