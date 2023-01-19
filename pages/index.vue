<script setup lang="ts">
definePageMeta({
  async middleware() {
    await useTest().fetch()
  }
})

const { test } = useTest()
</script>

<template>
  <p>{{ test }}</p>
</template>