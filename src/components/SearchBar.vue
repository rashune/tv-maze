<script setup lang="ts">
const query = defineModel<string>({ required: true })
</script>

<template>
  <label class="search-wrapper">
    <span class="visually-hidden">Search shows by name</span>
    <input
      v-model="query"
      class="search-input"
      type="search"
      placeholder="Search shows by name..."
      autocomplete="off"
    />
  </label>
</template>

<style scoped lang="scss">
@use '../styles/atoms/index' as atoms;
@use '../styles/tokens' as tokens;

.search-wrapper {
  display: block;
}

.search-input {
  @include atoms.field-control(md, md);
  padding: tokens.get-map(tokens.$spacer, 3) tokens.get-map(tokens.$spacer, 3.8);
}

.search-input:focus {
  @include atoms.focus-ring(text-primary, 0);
}

.visually-hidden {
  @include atoms.visually-hidden;
}
</style>
