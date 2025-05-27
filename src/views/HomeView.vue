<script setup>
import ReleasesData from '../assets/releases.json';
import LatestReleases from '../components/LatestReleases.vue'
</script>

<template>
  <main>
    <LatestReleases :releases="ReleasesData.releases" />
  </main>
</template>
