<template>
    <footer class="satellite-footer">
        <SoundCloudOverlay />
        <div class="satellite-footer__content">
            <h3><i class="fas fa-copyright"></i> 2025 Organic Satellite Records.</h3>
            <p>Website by <a href="https://valerio-web.com/" target="_blank">Valerio-web.com</a></p>
        </div>
    </footer>
</template>
<script setup>
import SoundCloudOverlay from './SoundCloudOverlay.vue';
</script>
<style lang="scss">
.satellite-footer {
    color: #8c8b89;
    padding: 32px 0;
    text-align: center;
    font-size: 14px;
    // position: relative;
    z-index: 1;

    &__content {
        margin: 0 auto;
        padding: 0 1rem;

        a {
            text-decoration: none;
            &:hover {
                text-decoration: underline;
                color: #eeebe2;
            }
        }
    }
}
</style>