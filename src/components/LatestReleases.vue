<script setup>
import ReleasesData from '../assets/releases.json';
import { ref } from 'vue';

const releases = ref(ReleasesData.releases);
</script>

<template>
    <section class="satellite-release-grid">
		<div class="satellite-release-grid__item"  v-for="release in releases" :key="'item-'+release.cover">
	    	<figure class="satellite-release-grid__item--cover">
                <img :src="release.cover" :alt="release.title"/>
            </figure>
            <div class="satellite-release-grid__item--info">
                <h2>{{ release.title }}</h2>
                <h3>{{ release.artist }}</h3>

                <span>{{ release.type }}</span>

                <div class="satellite-release-grid__item--info--links">
                    <span>Listen:</span>
                    <a :href="release.soundcloud" target="_blank" v-if="release.soundcloud"><i class="fab fa-soundcloud"></i></a>
                    <a :href="release.youtube" target="_blank" v-if="release.youtube"><i class="fab fa-youtube"></i></a>
                    <a :href="release.spotify" target="_blank" v-if="release.spotify"><i class="fab fa-spotify"></i></a>
                </div>

            </div>
		</div>
	</section>
</template>

<style lang="scss">
.satellite-release-grid {
    margin: 0 1rem;
    &__item {
        margin-bottom: 32px;
        display: flex;
        background: #000000;
        position: relative;
        border-right: 3px solid var(--turkish-soft);

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

            &--icon {

            }
        }
    }
}
</style>