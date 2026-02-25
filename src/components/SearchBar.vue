<script setup lang="ts">
const query = defineModel<string>({ required: true })
</script>

<template>
  <label class="search-shell">
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

<style scoped>
.search-shell {
  display: block;
}

.search-input {
  width: 100%;
  padding: 0.8rem 0.95rem;
  border-radius: 0.7rem;
  border: 1px solid #ccd4e4;
  font-size: 1rem;
  color: #0f1b3d;
}

.search-input:focus {
  outline: 2px solid #0f1b3d;
  outline-offset: 1px;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
