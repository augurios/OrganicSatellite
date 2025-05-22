<script setup>
import ReleasesData from '../assets/releases.json';
import { ref } from 'vue';

const releases = ref(ReleasesData.releases);
</script>

<template>
    <section class="satellite-grid vertical" id="grid3d">
				<div class="satellite-grid-wrap">
					<div class="satellite-grid-gallery">
						<figure v-for="release in releases" :key="'img-'+release.cover"><img :src="release.cover" :alt="release.title"/></figure>
					</div>
				</div><!-- /grid-wrap -->
				<div class="satellite-grid-content">
					<div v-for="release in releases" :key="'cont-'+release.cover">
						<img :src="release.cover" :alt="release.title"/>
						<h2>{{ release.title }}</h2>
                        <h3>By {{ release.artist }}</h3>
						<p class="dummy-text"> {{ release.date }}</p>
					</div>
					<span class="satellite-grid-loading"></span>
					<span class="icon satellite-grid-close-content"></span>
				</div>
			</section>
</template>

<style lang="scss">
.satellite-grid-wrap {
    margin: 10px auto 0;
    max-width: 1090px;
    width: 100%;
    padding: 0;
    -webkit-perspective: 1500px;
    perspective: 1500px;
}

.satellite-grid-gallery {
    position: relative;
    transition: all 0.5s cubic-bezier(0,0,0.25,1);
    -webkit-transition: all 0.5s cubic-bezier(0,0,0.25,1);
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;

    figure,
    .placeholder {
        width: 340px;
        height: 300px;
        margin-bottom: 24px;
    }

    figure {
        display: inline-block;
        cursor: pointer;
        user-select: none;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;

        &.active {
            opacity: 0;
        }

        img {
            display: block;
            width: 100%;
            
        }
    }

    .placeholder {
        pointer-events: none;
        position: absolute;
        transform-style: preserve-3d;
        -webkit-transform-style: preserve-3d;
        transition: all 0.5s ease-out;
        -webkit-transition: all 0.5s ease-out;

        > div {
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
        }

        .front img {
            width: 100%;
            height: 100%;
        }

        .back {
            background: white;
            transform: rotateY(180deg);
            -webkit-transform: rotateY(180deg);
        }
    }
}

.view-full {
    .satellite-grid-gallery {
        transform: translateZ(-1500px);
        -webkit-transform: translateZ(-1500px);
    }

    .placeholder {
        transition: all 0.5s 0.1s cubic-bezier(0,0,0.25,1);
        -webkit-transition: all 0.5s 0.1s cubic-bezier(0,0,0.25,1);
    }
}

.vertical {
    .view-full .placeholder {
        transform: translateZ(1500px) rotateX(-179.9deg);
        -webkit-transform: translateZ(1500px) rotateX(-179.9deg);
    }
    .dummy-img,
    .dummy-text {
        transform: translateY(100px);
        -webkit-transform: translateY(100px);
    }
    .content > div.show .dummy-img,
    .content > div.show .dummy-text {
        transform: translateY(0);
        -webkit-transform: translateY(0);
    }
}

.horizontal {
    .view-full .placeholder {
        transform: translateZ(1500px) rotateY(-179.9deg);
        -webkit-transform: translateZ(1500px) rotateY(-179.9deg);
    }
    .dummy-img,
    .dummy-text {
        transform: translateX(-100px);
        -webkit-transform: translateX(-100px);
    }
    .content > div.show .dummy-img,
    .content > div.show .dummy-text {
        transform: translateX(0);
        -webkit-transform: translateX(0);
    }
}

.satellite-grid-content,
.satellite-grid-loading {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
}

.satellite-grid-content {
    overflow-y: scroll;
    height: 0;
    background: #fff;
    visibility: hidden;
    z-index: 400;
    -webkit-overflow-scrolling: touch;

    &.show {
        height: auto;
        pointer-events: auto;
        visibility: visible;
    }

    > div {
        z-index: 10;
        position: absolute;
        top: 0;
        width: 100%;
        overflow: hidden;
        height: 0;
        opacity: 0;
        background: #fff;

        &.show {
            height: auto;
            opacity: 1;
            transition: opacity 0.6s;
            -webkit-transition: opacity 0.6s;
        }
    }
}

.satellite-grid-loading {
    opacity: 0;
    z-index: 1;
    background: transparent url(../img/preloader.gif) no-repeat center center;
    transform: scale(0.5);
    -webkit-transform: scale(0.5);
    transition: opacity 0.5s, transform 0.5s;
    -webkit-transition: opacity 0.5s, -webkit-transform 0.5s;

    &.show {
        opacity: 1;
        transform: scale(1);
        -webkit-transform: scale(1);
    }
}

.icon:before {
    font-family: 'fontawesome';
    speak: none;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.close-content {
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 10px;
    font-size: 1.6em;
    color: #aaa;
    cursor: pointer;
    pointer-events: none;
    padding: 1em;
    opacity: 0;
    transition: opacity 0.3s;
    -webkit-transition: opacity 0.3s;

    &:hover {
        color: #999;
    }

    &:before {
        content: "\e602";
    }
}

.satellite-grid-content > div.show ~ .close-content {
    opacity: 1;
    pointer-events: auto;
}

/* Dummy content */
.dummy-img,
.dummy-text {
    max-width: 600px;
    width: 90%;
    opacity: 0;
    transition: opacity 0.5s, transform 0.5s;
    -webkit-transition: opacity 0.5s, -webkit-transform 0.5s;
}

.satellite-grid-content > div.show .dummy-img,
.satellite-grid-content > div.show .dummy-text {
    opacity: 1;
}

p.dummy-text:nth-child(2) {
    transition-delay: 0.1s;
    -webkit-transition-delay: 0.1s;
}
p.dummy-text:nth-child(3) {
    transition-delay: 0.2s;
    -webkit-transition-delay: 0.2s;
}

.dummy-img {
    height: 400px;
    background-color: #ddd;
    margin: 30px auto;
}

.dummy-text {
    text-align: left;
    margin: 0 auto;
    padding: 10px 0;
    color: #ddd;
    font-size: 1em;
    font-family: 'Blokk', Arial, serif;

    &:last-child {
        padding-bottom: 100px;
    }
}

/* Simple fallback */
.no-pointerevents,
.no-csstransforms3d,
.no-csstransitions {
    .content,
    .content > div,
    .close-content {
        opacity: 1;
        visibility: visible;
        display: none;
        height: auto;
    }
    .show .close-content,
    div.show,
    .dummy-img,
    .dummy-text {
        display: block !important;
        opacity: 1;
    }
}

@media screen and (max-width: 1000px) {
    .satellite-grid-gallery {
        figure,
        .placeholder {
            width: 100%;
            height: auto;
        }
    }
}
</style>