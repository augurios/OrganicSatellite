<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>
<template>
  <div class="satellite-social-links">
        <a href="https://soundcloud.com/organic-satellite-records" class="satellite-social-link" target="_blank"><i class="fab fa-soundcloud"></i></a>
        <a href="https://www.youtube.com/channel/UCs1eXmxxLlG6Nm6baiALDuw/" class="satellite-social-link" target="_blank"><i class="fab fa-youtube"></i></a>
        <a href="https://open.spotify.com/playlist/4Wbbwx5zihjNkDSujsewQV" class="satellite-social-link" target="_blank"><i class="fab fa-spotify"></i></a>
  </div>
  <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
  </nav>
</template>
<style lang="scss">
    .satellite-social {
        &-links {
            text-align: center;
        }
        &-link {
            display: inline-block;
            margin: 0 10px;
            padding: 6px 13px;
            font-size: 24px;
            color: #eeebe28f;
            border: 1px solid #eeebe28f;
            text-decoration: none;
            background: var(--color-background);
            border-radius: 8px;
            &:hover {
                background: var(--turkish-soft);
                color: #eeebe2;
                border: 1px solid #eeebe2;
            }
        }
    }
</style>