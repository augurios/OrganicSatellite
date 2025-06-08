<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: '80px'
  },
  color: {
    type: String,
    default: 'var(--turkish)'
  },
  position: {
    type: String,
    default: 'fixed', // 'fixed', 'absolute', 'relative'
    validator: (value) => ['fixed', 'absolute', 'relative'].includes(value)
  }
});
</script>

<template>
  <span 
    class="satellite-spinner" 
    :class="{ 'show': show, [`position-${position}`]: true }"
    :style="{ 
      '--spinner-size': size, 
      '--spinner-color': color,
      width: size,
      height: size,
      top: position !== 'relative' ? `calc(50% - ${parseInt(size) / 2}px)` : 'auto',
      left: position !== 'relative' ? `calc(50% - ${parseInt(size) / 2}px)` : 'auto'
    }"
  >
  </span>
</template>

<style lang="scss" scoped>
.satellite-spinner {
  color: var(--spinner-color);
  opacity: 0;
  z-index: 1;
  transform: scale(0.5) translateZ(0);
  -webkit-transform: scale(0.5) translateZ(0);
  transition: opacity 0.5s, transform 0.5s;
  -webkit-transition: opacity 0.5s, -webkit-transform 0.5s;
  box-sizing: border-box;
  display: inline-block;
  pointer-events: none;
  will-change: opacity, transform;

  &.position-fixed {
    position: fixed;
  }

  &.position-absolute {
    position: absolute;
  }

  &.position-relative {
    position: relative;
  }

  &:after {
    box-sizing: border-box;
    content: " ";
    display: block;
    width: calc(var(--spinner-size) * 0.8);
    height: calc(var(--spinner-size) * 0.8);
    margin: calc(var(--spinner-size) * 0.1);
    border-radius: 50%;
    border: calc(var(--spinner-size) * 0.08) solid currentColor;
    border-color: currentColor transparent currentColor transparent;
    animation: satellite-spinner-rotate 1.2s linear infinite;
    -webkit-animation: satellite-spinner-rotate 1.2s linear infinite;
    will-change: transform;
  }

  &.show {
    opacity: 1;
    transform: scale(1) translateZ(0);
    -webkit-transform: scale(1) translateZ(0);
  }
}

@keyframes satellite-spinner-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@-webkit-keyframes satellite-spinner-rotate {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
</style>
