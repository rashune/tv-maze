<script setup lang="ts">
const query = defineModel<string>({ required: true })
</script>

<template>
  <label class="search-wrapper">
    <span class="visually-hidden">Search shows by name</span>
    <span class="search-icon" aria-hidden="true">
      <i class="fa-solid fa-magnifying-glass" />
    </span>
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
  position: relative;
  display: block;
}

.search-input {
  @include atoms.field-control(md, md);
  border-color: #9eb0d8;
  background: #f8fbff;
  box-shadow: 0 0 0 1px rgb(23 48 114 / 12%);
  height: var(--search-control-height, 2.7rem);
  line-height: 1;
  transition:
    border-color 140ms ease,
    box-shadow 140ms ease,
    background-color 140ms ease;
  padding: 0 tokens.get-map(tokens.$spacer, 3.8) 0 2.2rem;
}

.search-icon {
  position: absolute;
  left: tokens.get-map(tokens.$spacer, 3);
  top: 50%;
  transform: translateY(-50%);
  color: #2f4a84;
  font-size: tokens.get-map(tokens.$fonts, md);
  pointer-events: none;
}

.search-input:focus {
  background: tokens.get-map(tokens.$colors, surface);
}

.search-input:focus-visible {
  @include atoms.focus-shadow(#37589b, rgb(55 88 155 / 30%), 3px);
}

.visually-hidden {
  @include atoms.visually-hidden;
}
</style>
