<script setup>
import { RouterLink, RouterView } from 'vue-router'
import SatelliteHeader from './components/SatelliteHeader.vue'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <SatelliteHeader />
  <NavBar />
  <RouterView />
</template>

<style scoped>

</style>
