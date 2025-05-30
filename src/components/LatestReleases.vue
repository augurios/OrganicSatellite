<script setup>
import { ref } from 'vue';
import { useLazyLoading } from '../composables/useLazyLoading.js';
import LoadingIndicator from '../components/LoadingIndicator.vue';

const props = defineProps({
  releases: {
    type: Array,
    required: false,
    default: null
  }
});

const Window = ref(window);

// Use the lazy loading composable
const { loading, handleItemLoad, loadingMessage } = useLazyLoading(
  () => props.releases?.length || 0,
  () => props.releases,
  { 
    loadingMessage: 'Retrieving Latest Releases',
    itemIdentifier: (release) => release.cover
  }
);

const handleImageLoad = (release) => {
  handleItemLoad(release);
};
</script>

<template>
    <section class="satellite-release-grid">
        <!-- Loading indicator -->
        <LoadingIndicator :show="loading" :message="loadingMessage" />
        
		<div class="satellite-release-grid__item" v-for="release in releases" :key="'item-'+release.cover" :class="{'video': release.type === 'VIDEO', 'loading': loading}">
            <!-- Cover image -->
	    	<figure class="satellite-release-grid__item--cover" @click="release.type === 'VIDEO' ? Window.open(release.youtube, '_blank') : null">
                <img 
                    :src="release.cover" 
                    :alt="release.title"
                    @load="handleImageLoad(release)"
                    loading="lazy"
                />
            </figure>
            <div class="satellite-release-grid__item--info">
                <h2>{{ release.title }}</h2>
                <h3>{{ release.artist }}</h3>

                <span>{{ release.type }}</span>

                <div class="satellite-release-grid__item--info--links">
                    <span>Listen:</span>
                    <a :href="release.soundcloud" target="_blank" v-if="release.soundcloud"><i class="fab fa-soundcloud"></i></a>
                    <a :href="release.spotify" target="_blank" v-if="release.spotify"><i class="fab fa-spotify"></i></a>
                    <a :href="release.youtube" target="_blank" v-if="release.youtube"><i class="fab fa-youtube"></i></a>
                </div>

                <i class="pinned fa-solid fa-thumbtack" v-if="release.pinned"></i>
            </div>
		</div>
	</section>
</template>

<style lang="scss">
.satellite-release-grid {
    margin: 0 1rem;

    @media screen and (min-width: 720px) {
        margin: 0 auto;
        max-width: 720px;
    }

    &__item {
        margin-bottom: 32px;
        display: flex;
        background: #000000;
        position: relative;
        transition: opacity 0.5s;
        opacity: 1;
        border-right: 3px solid var(--turkish-soft);

        &:after {
            content: "";
            display: block;
            width: 30%;
            height: 4px;
            background: #181818;
            position: absolute;
            bottom: 0;
            right: 16px;
            border-radius: 24px 24px 0 0;
        }

        &--cover {
            width: 88px;
            height: 88px;
            margin-right: 12px;

            img {
                width: 88px;
                height: 88px;
                display: block;
            }
        }

        &--info {
            padding-top: 6px;
                
            h2 {
                font-size: 18px;
                font-weight: bold;
                color: #eeeeee;
            }

            h3 {
                font-size: 14px;
                line-height: 12px;
            }

            > span {
                position: absolute;
                bottom: 0;
                left: 0;
                font-size: 8px;
                padding: 2px 8px;
                background: #000000;
                letter-spacing: 2px;
                font-weight: bold;
                color: var(--turkish);
                z-index: 2;
            }

            &--links {
                font-size: 20px;
                position: absolute;
                bottom: 6px;

                > span {
                    font-size: 12px;
                    color: #bebebe;
                    margin-right: 6px;
                    position: relative;
                    top: -2px;
                }

                a {
                    display: inline-block;
                    margin-right: 6px;
                    padding: 0 8px;

                    &:hover {
                        color: #ffffff
                    }
                }
            }

            .pinned {
                position: absolute;
                top: 8px;
                right: 6px;
                font-size: 12px;
                color: var(--turkish);
                opacity: 0.7;
                transform: rotate(32deg)
            }
        }
        
        &.video {
            .satellite-release-grid__item--cover {
                position: relative;
                &:before {
                    content: "";
                    display: block;
                    width: 100%;
                    height: 100%;
                    background: #000;
                    opacity: 0.3;
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 1;
                }

                &:after {
                    content: "";
                    display: block;
                    width: 0;
                    height: 0;
                    border: 12px solid transparent;
                    border-left: 20px solid var(--turkish);
                    position: absolute;
                    top: 30px;
                    z-index: 7;
                    left: 34px;
                    opacity: 0.4;
                }
            }
        }

        &.loading {
            opacity: 0;
        }
    }
}
</style>