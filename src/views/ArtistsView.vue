<script setup>
import GridPreview from '@/components/GridPreview.vue';
import ArtistData from '@/assets/artists.json';
import { ref } from 'vue';

const artists = ref(ArtistData.artists);

</script>

<template>
  <main>
    <GridPreview :GridData="artists" />
  </main>
</template>
