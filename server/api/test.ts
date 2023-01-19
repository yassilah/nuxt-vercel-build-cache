export default defineEventHandler(() => {
    return process.env.NODE_ENV ==='prerender' ? 'This was pre-rendered.' : 'This was rendered on the server.'
})