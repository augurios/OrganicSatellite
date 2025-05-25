<script setup>
import { RouterLink, RouterView } from 'vue-router'
import SatelliteHeader from './components/SatelliteHeader.vue'
import NavBar from './components/NavBar.vue'
import SatalliteFooter from './components/SatalliteFooter.vue'
</script>

<template>
  <SatelliteHeader />
  <NavBar />
  <RouterView />
  <SatalliteFooter />
</template>

<style scoped>

</style>
