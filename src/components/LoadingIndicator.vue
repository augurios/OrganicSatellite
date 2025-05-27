<script setup>
import SatelliteSpinner from './SatelliteSpinner.vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: 'Loading...'
  },
  size: {
    type: String,
    default: '20px'
  }
});
</script>

<template>
  <div v-if="show" class="loading-indicator">
    <SatelliteSpinner :show="show" position="relative" :size="size" />
    <span>{{ message }}</span>
  </div>
</template>

<style lang="scss" scoped>
.loading-indicator {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    color: var(--turkish);
    font-weight: bold;
    font-size: 14px;

  .satellite-spinner {
    margin-right: 8px;
  }
}
</style>
