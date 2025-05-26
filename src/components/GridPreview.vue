<script setup>
import { ref, defineProps, onMounted} from 'vue';

const props = defineProps({
  GridData: {
    type: Array,
    required: false,
    default: null
  }
});

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


// Main features
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
    console.log('loadContent called');
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
        
        setTimeout( function() { document.body.classList.remove('noscroll'); }, 25 );

		// reset placeholder style values
        placeholderStyle.value.left = itemRefs.value[selectedItem.value.itemId].offsetLeft + 'px';
		placeholderStyle.value.top = itemRefs.value[selectedItem.value.itemId].offsetTop + 'px';
		placeholderStyle.value.width = itemSize.value.width + 'px';
		placeholderStyle.value.height = itemSize.value.height + 'px';
}

function animFn() {
    console.log('animFn called');
    gridData.value[selectedItem.value.index].active = true;
    gridActive.value = true;
    resizePlaceholder();    
}

function onFigureClick(itemId, index) {
  if (isAnimating.value) return false;
  selectedItem.value = {itemId: itemId, index: index};
  isAnimating.value = true;

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

//Life Cycle Hooks
onMounted(() => {
    itemSize.value = { width: itemRefs.value[gridData.value[0].id].offsetWidth, height: itemRefs.value[gridData.value[0].id].offsetHeight };

    placeholderStyle.value.width = itemSize.value.width + 'px';
	placeholderStyle.value.height = itemSize.value.height + 'px';

    window.addEventListener('resize', resizeHandler);
    window.addEventListener('scroll', () => {
				if ( isAnimating.value ) {
					window.scrollTo( gridWrap.value.scrollPosition ? gridWrap.value.scrollPosition.x : 0, gridWrap.value.scrollPosition ? gridWrap.value.scrollPosition.y : 0 );
				}
				else {
					gridWrap.value.scrollPosition = { x : window.pageXOffset || docElem.scrollLeft, y : window.pageYOffset || docElem.scrollTop };
					// change the grid perspective origin as we scroll the page
					scrollHandler();
				}
			});
});
</script>

<template>
    <section class="satellite-grid vertical" id="grid3d">
        <div class="satellite-grid-wrap" :class="{ 'view-full' : gridActive }" ref="gridWrap">
          <div class="satellite-grid-gallery" ref="grid">
            <figure v-for="(gridItem, index) in gridData" :key="'item-'+gridItem.id" @click="onFigureClick(gridItem.id,index)" :class="{ active : gridItem.active }" :ref="el => setItemRef(gridItem.id, el)">
                <img :src="gridItem.image" :alt="gridItem.name"/>
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
            <img :src="gridData[selectedItem.index].image" :alt="gridData[selectedItem.index].name"/>
            <h2>{{ gridData[selectedItem.index].name }}</h2>
            <p class="dummy-text"> {{ gridData[selectedItem.index].description }}</p>
          </div>
          <span class="satellite-grid-loading" :class="{ show : showLoader }"></span>
          <span class="icon satellite-grid-close-content" @click="hideContent"></span>
        </div>
      </section>
</template>

<style lang="scss">

body {
	position: relative;
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

    figure,
    .placeholder {
        width: 340px;
        height: 300px;
        margin-bottom: 0;
        background: #1f1e1e82;
        border-top: 1px solid #222121;
        border-bottom: 1px solid #151515;
    }

    figure {
        cursor: pointer;
        user-select: none;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;

        &:hover {
            background: #555555;
        }

        &.active {
            opacity: 0;
        }

        img {
            display: block;
            width: 100%;
            height: 92px;
            object-fit: cover;
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
            background: #555555;
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
    background: #555555;
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
        background: #555555;

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
}

.satellite-grid-loading {
    color: var(--turkish);
    opacity: 0;
    z-index: 1;
    transform: scale(0.5);
    -webkit-transform: scale(0.5);
    transition: opacity 0.5s, transform 0.5s;
    -webkit-transition: opacity 0.5s, -webkit-transform 0.5s;
    box-sizing: border-box;
    display: inline-block;
    width: 80px;
    height: 80px;
    top: calc(50% - 80px);
    left: calc(50% - 40px);

    &:after {
        box-sizing: border-box;
        content: " ";
        display: block;
        width: 64px;
        height: 64px;
        margin: 8px;
        border-radius: 50%;
        border: 6.4px solid currentColor;
        border-color: currentColor transparent currentColor transparent;
        animation: lds-dual-ring 1.2s linear infinite;
    }

    &.show {
        opacity: 1;
        transform: scale(1);
        -webkit-transform: scale(1);
    }
}

@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
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

    &:before {
        content: "\e602";
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