export function useTest() {
    const test = useState<string>('test')

    async function fetch() {
        test.value = await $fetch('/api/test')
    }

    return {
        test,
        fetch
    }
}