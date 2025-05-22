<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>
<template>
  <div class="satellite-social-links">
        <a href="https://soundcloud.com/organic-satellite-records" class="satellite-social-link" target="_blank"><i class="fab fa-soundcloud"></i></a>
        <a href="https://www.youtube.com/channel/UCs1eXmxxLlG6Nm6baiALDuw/" class="satellite-social-link" target="_blank"><i class="fab fa-youtube"></i></a>
        <a href="https://open.spotify.com/playlist/4Wbbwx5zihjNkDSujsewQV" class="satellite-social-link" target="_blank"><i class="fab fa-spotify"></i></a>
        <a href="https://www.tiktok.com/@organicsatelliterecords" class="satellite-social-link" target="_blank"><i class="fab fa-tiktok"></i></a>
  </div>
  <nav class="satellite-navbar">
      <RouterLink class="satellite-navbar-link" to="/">Releases</RouterLink>
      <RouterLink class="satellite-navbar-link" to="/artists">Artists</RouterLink>
      <RouterLink class="satellite-navbar-link" to="/about">About</RouterLink>
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
            position: relative;
            &:hover {
                background: var(--turkish-soft);
                color: #eeebe2;
                border: 1px solid #eeebe2;
            }

            &:not(:first-child):before {
                content: "";
                width: 41%;
                display: block;
                height: 1px;
                background: rgba(238, 235, 226, 0.5607843137);
                position: absolute;
                top: 50%;
                left: -41%;
            }
        }

    }

    .satellite-navbar {
        text-align: center;
        margin: 32px 0;

        &-link {
            display: inline-block;
            margin: 0 8px;
            padding: 6px 12px;
            font-size: 12px;
            border: 1px solid #eeebe28f;
            text-decoration: none;
            background: var(--color-background);
            border-radius: 4px;
            position: relative;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 4px;

            &:first-child {
                margin-left: 0;
            }
            
            &:last-child {
                margin-right: 0;
            }

            &.router-link-active {
                animation-timing-function: linear;
                animation-iteration-count: infinite;
                animation-duration: 4s;
                animation-name: glowingBackground;
                color: #eeebe2;
                border: 1px solid #eeebe2;
            }

            &:hover {
                background: var(--turkish-soft);
                color: #eeebe2;
                border: 1px solid #eeebe2;
            }

            &:not(:first-child):before {
                content: "";
                width: 17px;
                display: block;
                height: 1px;
                background: rgba(238, 235, 226, 0.5607843137);
                position: absolute;
                top: 50%;
                left: -18px;
            }
        }
    }

    @keyframes glowingBackground {
        0% { background: rgba(63, 206, 208, 0.2); box-shadow: 0px 0px 0px var(--turkish); }
        20% { background: rgba(63, 206, 208, 0.3); box-shadow: 0px 0px 5px var(--turkish); }
        50% { background: rgba(63, 206, 208, 0.5); box-shadow: 0px 0px 8px var(--turkish); }
        60% { background: rgba(63, 206, 208, 0.3); box-shadow: 0px 0px 5px var(--turkish); }
        100% { background: rgba(63, 206, 208, 0.2); box-shadow: 0px 0px 0px var(--turkish); }
    }
</style>