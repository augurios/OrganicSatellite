<script setup>
import { ref, defineProps, onMounted, onUnmounted, watch} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ReleasesData from '../assets/releases.json';
import LatestReleases from '../components/LatestReleases.vue';
import SatelliteSpinner from '../components/SatelliteSpinner.vue';
import LoadingIndicator from '../components/LoadingIndicator.vue';
import { useLazyLoading } from '../composables/useLazyLoading.js';

const props = defineProps({
  GridData: {
    type: Array,
    required: false,
    default: null
  }
});

// Router setup
const route = useRoute();
const router = useRouter();

// Define refs
const gridData = ref(props.GridData);
const grid = ref(null);
const gridWrap = ref(null);
const isAnimating = ref(false);
const showLoader = ref(false);
const showContent = ref(false);
const gridActive = ref(false);
const selectedItem = ref(null);
const itemSize = ref(null);
const placeholderStyle = ref({
    width: '0px',
    height: '0px',
    left: '0px',
    top: '0px'
});
const itemRefs = ref({});
const resizeTimeout = ref(null);
const didScroll = ref(false);
const currentReleases = ref(null);

// Use the lazy loading composable for grid images
const { loading: gridLoading, handleItemLoad: handleGridImageLoad, loadingMessage: gridLoadingMessage } = useLazyLoading(
  () => gridData.value?.length || 0,
  () => gridData.value,
  { 
    loadingMessage: 'Loading Artists...',
    itemIdentifier: (item) => item.id
  }
);

const handleImageLoad = (gridItem) => {
  handleGridImageLoad(gridItem);
};

// Main Features
function resizePlaceholder() {
		// need to recalculate all these values as the size of the window changes
        itemSize.value = { width: itemRefs.value[gridData.value[0].id].offsetWidth, height: itemRefs.value[gridData.value[0].id].offsetHeight };
		if( selectedItem.value && selectedItem.value.itemId ) {
			// set the placeholders top to "0 - grid offsetTop" and left to "0 - grid offsetLeft"
			
			var gridOffset = getOffset( grid.value );
			
			placeholderStyle.value.left = Number( -1 * ( gridOffset.left - scrollX() ) ) + 'px';
			placeholderStyle.value.top = Number( -1 * ( gridOffset.top - scrollY() ) ) + 'px';
			// set the placeholders width to windows width and height to windows height
			placeholderStyle.value.width = getViewportW() + 'px';
			placeholderStyle.value.height = getViewportH() + 'px';
		}
}

function loadContent() {
    showContent.value = true;
    showLoader.value = true;

    setTimeout(() => {
      showLoader.value = false;
      gridData.value[selectedItem.value.index].show = true;
      isAnimating.value = false;
      document.body.classList.add('noscroll');
    }, 1000);
}

function hideContent() {
		showContent.value = false;
        gridData.value[selectedItem.value.index].show = false;
		gridActive.value = false;
        
        // Clear URL parameter
        clearUrlParameter();
        
        setTimeout( function() { document.body.classList.remove('noscroll'); }, 25 );

		// reset placeholder style values
        placeholderStyle.value.left = itemRefs.value[selectedItem.value.itemId].offsetLeft + 'px';
		placeholderStyle.value.top = itemRefs.value[selectedItem.value.itemId].offsetTop + 'px';
		placeholderStyle.value.width = itemSize.value.width + 'px';
		placeholderStyle.value.height = itemSize.value.height + 'px';
}

function animFn() {
    gridData.value[selectedItem.value.index].active = true;
    gridActive.value = true;
    resizePlaceholder();    
}

function onFigureClick(itemId, index) {
  if (isAnimating.value) return false;
  selectedItem.value = {itemId: itemId, index: index};
  isAnimating.value = true;

  currentReleases.value = ReleasesData.releases.filter(release => release.artist.toLowerCase().includes(gridData.value[selectedItem.value.index].name.toLowerCase()));

  // Update URL parameter
  router.push({ 
    path: route.path, 
    query: { ...route.query, artist: itemId } 
  });

  placeholderStyle.value.left = itemRefs.value[selectedItem.value.itemId].offsetLeft + 'px';
  placeholderStyle.value.top = itemRefs.value[selectedItem.value.itemId].offsetTop + 'px';
  
  setTimeout(animFn, 25);
}

function onEndTransitionFn(ev) {
      if (ev.propertyName.indexOf('transform') === -1) return false;
      if (selectedItem.value && gridActive.value) loadContent();
      if (!gridActive.value) {
          gridData.value[selectedItem.value.index].active = false;
          selectedItem.value = null;
      }
}

//Helpers
var docElem = window.document.documentElement;

function scrollX() {
	return window.pageXOffset || docElem.scrollLeft; 
}

function scrollY() {
	return window.pageYOffset || docElem.scrollTop;
}

function getOffset(el) {
	var offset = el.getBoundingClientRect();
	return { top : offset.top + scrollY(), left : offset.left + scrollX() };
}

function getViewportW() {
	var client = docElem['clientWidth'],
		inner = window['innerWidth'];
	
	if( client < inner )
		return inner;
	else
		return client;
}

function getViewportH() {
	var client = docElem['clientHeight'],
		inner = window['innerHeight'];
	
	if( client < inner )
		return inner;
	else
		return client;
}

function scrollPage() {
		var perspY = scrollY() + getViewportH() / 2;

		gridWrap.value.style.WebkitPerspectiveOrigin = '50% ' + perspY + 'px';
		gridWrap.value.style.MozPerspectiveOrigin = '50% ' + perspY + 'px';
		gridWrap.value.style.perspectiveOrigin = '50% ' + perspY + 'px';
		didScroll.value = false;
};

function scrollHandler() {
	if( !didScroll.value ) {
		didScroll.value = true;
		setTimeout( () => { scrollPage(); }, 60 );
	}
};

function onScroll() {
	if ( isAnimating.value ) {
		window.scrollTo( gridWrap.value.scrollPosition ? gridWrap.value.scrollPosition.x : 0, gridWrap.value.scrollPosition ? gridWrap.valscrollPosition.y : 0 );
	}
	else {
		gridWrap.value.scrollPosition = { x : window.pageXOffset || docElem.scrollLeft, y : window.pageYOffset || docElem.scrollTop };
		// change the grid perspective origin as we scroll the page
		scrollHandler();
	}
}

function resizeHandler() {
		function delayed() {
			resizePlaceholder();
			scrollPage();
			resizeTimeout.value = null;
		}
		if ( resizeTimeout.value ) {
			clearTimeout( resizeTimeout.value );
		}
		resizeTimeout.value = setTimeout( delayed, 50 );
}

function setItemRef(id, el) {
  if (el) itemRefs.value[id] = el;
}

// Function to check URL parameters and activate corresponding item
function checkUrlParameter() {
  const artistId = route.query.artist;
  if (artistId && gridData.value) {
    const index = gridData.value.findIndex(item => item.id === artistId);
    if (index !== -1) {
      // Wait for next tick to ensure refs are set
      setTimeout(() => {
        onFigureClick(artistId, index);
      }, 100);
    }
  }
}

// Function to clear URL parameter when content is hidden
function clearUrlParameter() {
  const { artist, ...restQuery } = route.query;
  router.push({ 
    path: route.path, 
    query: restQuery 
  });
}

//Life Cycle Hooks
onMounted(() => {
    itemSize.value = { width: itemRefs.value[gridData.value[0].id].offsetWidth, height: itemRefs.value[gridData.value[0].id].offsetHeight };

    placeholderStyle.value.width = itemSize.value.width + 'px';
	placeholderStyle.value.height = itemSize.value.height + 'px';

    window.addEventListener('resize', resizeHandler);
    window.addEventListener('scroll', onScroll);
    
    // Check for URL parameter on mount
    checkUrlParameter();
});

onUnmounted(() => {
    window.removeEventListener('resize', resizeHandler);
    window.removeEventListener('scroll', onScroll);
});
</script>

<template>
    <section class="satellite-grid vertical" id="grid3d">
        <!-- Loading indicator for grid -->
        <LoadingIndicator :show="gridLoading" :message="gridLoadingMessage" />
        
        <div class="satellite-grid-wrap" :class="{ 'view-full' : gridActive }" ref="gridWrap">
          <div class="satellite-grid-gallery" ref="grid">
            <figure v-for="(gridItem, index) in gridData" :key="'item-'+gridItem.id" 
                   @click="onFigureClick(gridItem.id,index)" 
                   :class="{ active : gridItem.active, loading: gridLoading }" 
                   :ref="el => setItemRef(gridItem.id, el)">
                <img :src="gridItem.image" 
                     :alt="gridItem.name"
                     @load="handleImageLoad(gridItem)"
                     loading="lazy"/>
            </figure>

            <div class="placeholder" v-if="selectedItem && selectedItem.itemId" :style="placeholderStyle" @transitionend="onEndTransitionFn">
                <div class="front">
                    <img :src="gridData[selectedItem.index].image" alt="Placeholder Image"/>
                </div>  
                <div class="back"></div>
            </div>

          </div>
        </div><!-- /grid-wrap -->
        <div class="satellite-grid-content" :class="{ show : showContent }" ref="contentEl">
            <div :class="{ show : gridData[selectedItem.index].show }" v-if="selectedItem && selectedItem.itemId">
                <img :src="gridData[selectedItem.index].image" :alt="gridData[selectedItem.index].name" class="dummy-img"/>
                <!-- <h2>{{ gridData[selectedItem.index].name }}</h2> -->

                <div class="dummy-text">
                    <div> <small><strong>Joined: </strong> 2024</small></div>
                    <p> {{ gridData[selectedItem.index].description }} </p>
                    
                    <div class="social-sink">
                        <strong>Follow:</strong>
                        <a :href="gridData[selectedItem.index].soundcloud" target="_blank" v-if="gridData[selectedItem.index].soundcloud"> <i class="fab fa-soundcloud"></i> </a>
                        <a :href="gridData[selectedItem.index].spotify" target="_blank" v-if="gridData[selectedItem.index].spotify"> <i class="fab fa-spotify"></i> </a>
                        <a :href="gridData[selectedItem.index].youtube" target="_blank" v-if="gridData[selectedItem.index].youtube"> <i class="fab fa-youtube"></i> </a>
                    </div>

                    <h2 class="satellite-heading">RELEASES</h2>

                    <LatestReleases :releases="currentReleases" />
                </div>
            </div>
            <SatelliteSpinner :show="showLoader" />
            <span class="icon satellite-grid-close-content" @click="hideContent"><i class="fa-solid fa-close"></i></span>
        </div>
      </section>
</template>

<style lang="scss">

body {
	position: relative;

    strong {
        font-weight: bolder;
    }
}

.noscroll {
	overflow: hidden;
}

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
    margin-bottom: 48px;

    @media screen and (min-width: 1000px) {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        // grid-template-rows: repeat(5, 1fr);
        grid-column-gap: 0px;
        grid-row-gap: 0px;
    }

    figure,
    .placeholder {
        min-width: 340px;
        height: 300px;
        margin-bottom: 0;
        background: #080808;
        border-top: 1px solid rgb(63 206 208 / 16%);
        border-bottom: 1px solid #000000;
    }

    figure {
        cursor: pointer;
        user-select: none;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        transition: opacity 0.5s, background 0.5s;
        

        &.active {
            opacity: 0;
        }

        &.loading {
            opacity: 0;
        }

        img {
            display: block;
            width: 100%;
            height: 92px;
            object-fit: cover;

            @media screen and (min-width: 1000px) {
                height: auto;
            }
        }

        @media screen and (min-width: 1000px) {
            &:hover {
                background: #0f0f0f;
            }
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
            background: #080808;
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
    .satellite-grid-content > div.show .dummy-img,
    .satellite-grid-content > div.show .dummy-text {
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

.satellite-grid-content {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    overflow-y: scroll;
    height: 0;
    background: #080808;
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
        background: #080808;

        &.show {
            height: auto;
            opacity: 1;
            transition: opacity 0.6s;
            -webkit-transition: opacity 0.6s;
        }
    }

    img {
        width: 100%;
    }

    .satellite-release-grid {
        margin: 0;

        &__item {
            background: #181818;
            &:after {
                background: #080808;
            }
        }
    }

    .satellite-heading {
        margin-top: 48px;
    }
}

.satellite-grid-close-content {
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
}

.satellite-grid-content > div.show ~ .satellite-grid-close-content {
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

.dummy-img {
    margin: 0 auto;
    display: block;
}

.satellite-grid-content > div.show .dummy-img,
.satellite-grid-content > div.show .dummy-text {
    opacity: 1;
}

.dummy-text:nth-child(2) {
    transition-delay: 0.1s;
    -webkit-transition-delay: 0.1s;
}
.dummy-text:nth-child(3) {
    transition-delay: 0.2s;
    -webkit-transition-delay: 0.2s;
}


.dummy-text {
    margin: 0 auto;
    font-size: 1em;

    p {
        margin-bottom: 12px;
    }

    &:last-child {
        padding-bottom: 100px;
    }
}

.social-sink {
    a {
        display: inline-block;
        margin: 0 6px;
        font-size: 24px;
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
            width: 100vw;
            height: 94px;
        }
    }
}
</style>