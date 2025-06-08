<script setup>
import { ref } from 'vue';

const isOpen = ref(false);
const itNowExists = ref(false);

const toggleDrawer = () => {
    isOpen.value = !isOpen.value;
    itNowExists.value = true; // Ensure the drawer exists when toggled

    if (isOpen.value) {
        document.body.style.overflow = 'hidden'; // Prevent scrolling when the drawer is open
        // Add iOS Safari specific fix
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
    } else {
        document.body.style.overflow = ''; // Restore scrolling when the drawer is closed
        document.body.style.position = '';
        document.body.style.width = '';
    }
};
</script>
<template>
  <div class="soundcloud-overlay" :class="{ 'is-open': isOpen }">
    <button class="soundcloud-overlay__toggle" @click="toggleDrawer">
        <i class="fa-solid fa-headphones-simple"></i>
        <i class="fa-solid fa-close"></i>
    </button>

    <div class="soundcloud-overlay__drawer">
        <iframe v-if="itNowExists" width="100%" height="450" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1989650404&color=%233fced0&auto_play=false&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false"></iframe>
    </div>
  </div>
</template>
<style lang="scss">
.soundcloud-overlay {
    position: fixed;
    z-index: 999;
    bottom: -456px;
    width: 100%;
    text-align: left;
    transition: bottom 0.6s ease-in-out;
    -webkit-transition: bottom 0.6s ease-in-out;
    will-change: bottom;

    &__toggle {
        font-size: 24px;
        background: var(--turkish);
        border: 0;
        padding: 6px 12px;
        box-shadow: 3px -4px 19px #000;
        width: 48px;
        transition: width 0.6s ease-in-out;
        -webkit-transition: width 0.6s ease-in-out;
        text-align: left;
        position: relative;
        will-change: width;

        .fa-xmark {
            opacity: 0;
            transition: opacity 0.6s ease-in-out;
            -webkit-transition: opacity 0.6s ease-in-out;
            position: absolute;
            top: 9px;
            right: 12px;
            will-change: opacity;
        }
    }

    &__drawer {
        height: 456px;
        background-color: #f5f5f5;
        -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
        overflow-y: auto;
        
        iframe {
            /* Ensure iframe is responsive */
            max-width: 100%;
            border: none;
        }
    }

    &.is-open {
        bottom: -62px;
        
        .soundcloud-overlay__toggle {
            width: 100vw;
            box-shadow: initial;

            .fa-xmark {
                opacity: 1;
            }
        }
    }
}
</style>