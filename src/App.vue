<script setup>
import { RouterLink, RouterView } from 'vue-router'
import SatelliteHeader from './components/SatelliteHeader.vue'
import NavBar from './components/NavBar.vue'
import SatalliteFooter from './components/SatalliteFooter.vue'
</script>

<template>
  <SatelliteHeader />
  <NavBar />
  <div class="view-container">
    <RouterView />
  </div>
  <SatalliteFooter />
</template>

<style lang="scss">
  .view-container {
        min-height: calc(100vh - 516px);
  }
</style>
