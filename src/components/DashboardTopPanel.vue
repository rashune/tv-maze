<script setup lang="ts">
import { computed } from 'vue'
import SearchBar from './SearchBar.vue'

const query = defineModel<string>({ required: true })
const hasSearchQuery = computed(() => query.value.trim().length > 0)
</script>

<template>
  <section class="top-panel">
    <h1 class="dashboard-title">TV Maze Dashboard</h1>
    <div class="search-row">
      <SearchBar v-model="query" />
      <button
        v-if="hasSearchQuery"
        class="search-clear"
        type="button"
        aria-label="Clear search and show all results"
        @click="query = ''"
      >
        <i class="fa-solid fa-rotate-left" aria-hidden="true" />
        <span>Show All</span>
      </button>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '../styles/atoms/index' as atoms;
@use '../styles/tokens' as tokens;

.top-panel {
  @include atoms.stack(3);
  position: sticky;
  top: -1px;
  z-index: 6;
  margin-inline: calc(-1 * var(--app-shell-side-padding, 0.9rem));
  padding: tokens.get-map(tokens.$spacer, 2) var(--app-shell-side-padding, 0.9rem);
  background: var(--app-background);
  isolation: isolate;
}

.top-panel::before {
  content: '';
  position: absolute;
  inset: -1px -1px 0;
  background: var(--app-background);
  z-index: -1;
}

.dashboard-title {
  @include atoms.text-title(xl);
}

.search-row {
  --search-control-height: 2.7rem;
  display: flex;
  gap: tokens.get-map(tokens.$spacer, 2);
  align-items: center;
}

.search-row > :first-child {
  flex: 1 1 auto;
  min-width: 0;
}

.search-clear {
  display: inline-flex;
  align-items: center;
  gap: tokens.get-map(tokens.$spacer, 2);
  flex: 0 0 auto;
  border: 1px solid #15306d;
  border-radius: tokens.get-map(tokens.$radius, md);
  background: #1a3d89;
  color: tokens.get-map(tokens.$colors, text-contrast);
  font-size: tokens.get-map(tokens.$fonts, md);
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
  white-space: nowrap;
  height: var(--search-control-height);
  padding: tokens.get-map(tokens.$spacer, 2) tokens.get-map(tokens.$spacer, 4);
  box-shadow: 0 4px 12px rgb(15 27 61 / 18%);
  transition:
    background-color 140ms ease,
    transform 100ms ease,
    box-shadow 140ms ease;
}

.search-clear:hover {
  background: #2149a1;
  box-shadow: 0 7px 16px rgb(15 27 61 / 26%);
}

.search-clear:active {
  transform: translateY(1px);
}

.search-clear:focus-visible {
  @include atoms.focus-shadow(#3c62ae, rgb(60 98 174 / 35%), 3px);
}

.search-clear i,
.search-clear span {
  line-height: 1;
}
</style>
