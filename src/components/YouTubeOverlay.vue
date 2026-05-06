<script setup>
import { ref } from "vue";

const isOpen = ref(false);
const itNowExists = ref(false);

const toggleDrawer = () => {
  isOpen.value = !isOpen.value;
  itNowExists.value = true; // Ensure the drawer exists when toggled

  if (isOpen.value) {
    document.body.style.overflow = "hidden"; // Prevent scrolling when the drawer is open
    // Add iOS Safari specific fix
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
  } else {
    document.body.style.overflow = ""; // Restore scrolling when the drawer is closed
    document.body.style.position = "";
    document.body.style.width = "";
  }
};
</script>
<template>
  <div class="youtube-overlay" :class="{ 'is-open': isOpen }">
    <button class="youtube-overlay__toggle" @click="toggleDrawer">
      LIVE
      <i class="fa-solid fa-xmark"></i>
    </button>

    <div class="youtube-overlay__drawer">
      <iframe
        v-if="itNowExists"
        width="100%"
        height="450"
        src="https://www.youtube.com/embed/zR-RH_q89b4"
        title="24/7 Dark Garage radio 💻 Work and programming beats"
        frameborder="0"
        allow="
          accelerometer;
          autoplay;
          clipboard-write;
          encrypted-media;
          gyroscope;
          picture-in-picture;
          web-share;
        "
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>
<style lang="scss">
.youtube-overlay {
  position: fixed;
  z-index: 999;
  bottom: -512px;
  right: 0;
  left: auto;
  width: 100%;
  text-align: right;
  transition: bottom 0.6s ease-in-out;
  -webkit-transition: bottom 0.6s ease-in-out;
  will-change: bottom;

  &__toggle {
    font-size: 24px;
    background: var(--turkish);
    border: 0;
    padding: 6px 12px;
    box-shadow: -3px -4px 19px #000;
    width: 79px;
    transition: width 0.6s ease-in-out;
    -webkit-transition: width 0.6s ease-in-out;
    text-align: right;
    position: relative;
    will-change: width;

    .fa-xmark {
      opacity: 0;
      transition: opacity 0.6s ease-in-out;
      -webkit-transition: opacity 0.6s ease-in-out;
      position: absolute;
      top: 9px;
      left: 12px;
      will-change: opacity;
    }
  }

  &__drawer {
    height: 512px;
    background-color: #f5f5f5;
    -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
    overflow-y: auto;

    iframe {
      /* Ensure iframe is responsive */
      border: none;
      max-width: 840px;
      display: block;
      margin: 0 auto;
    }
  }

  &.is-open {
    bottom: -62px;

    .youtube-overlay__toggle {
      width: 100vw;
      box-shadow: initial;

      .fa-xmark {
        opacity: 1;
      }
    }
  }
}
</style>
