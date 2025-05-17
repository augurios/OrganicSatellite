<template>
    <header class="satellite-header">
        <div class="constellations">
            <span class='star' v-for="(star, index) in stars" :key="index"
                :class="[star.style, star.opacity, star.tam]"
                :style="{ animationDelay: '.' + star.delay + 's', left: star.left + 'px', top: star.top + 'px' }"></span>
        </div>
        <div class="shooting-star-container">
            <div class='shooting-star' v-if="meteoro" :class="[meteoro]"></div>
        </div>
        <img alt="Organic Satellite" class="satellite-header__logo" src="@/assets/logo.png" />
        <img alt="Organic Satellite" class="satellite-header__logo-words" src="@/assets/logo_words_only.png" />
    </header>
</template>

<script>
export default {
    name: 'SatelliteHeader',
    data() {
        return {
            style: ["style1", "style2", "style3", "style4"],
            tam: ["tam1", "tam1", "tam1", "tam2", "tam3"],
            opacity: ["opacity1", "opacity1", "opacity1", "opacity2", "opacity2", "opacity3"],
            starQuantity: 250,
            randomNumber: 5000,
            meteoro: null,
            stars: [],
            widthWindow: window.innerWidth,
            heightWindow: window.innerHeight,
        };
    },
    mounted() {
        for (var i = 0; i < this.starQuantity; i++) {
            this.stars.push({
                left: this.getRandomArbitrary(0, this.widthWindow),
                top: this.getRandomArbitrary(0, this.heightWindow),
                opacity: this.opacity[this.getRandomArbitrary(0, 6)],
                tam: this.tam[this.getRandomArbitrary(0, 5)],
                style: this.style[this.getRandomArbitrary(0, 4)],
                delay: this.getRandomArbitrary(0, 9)
            });
        }

        setTimeout(() => {
            this.shootStar();
        }, 
        this.randomNumber);
    },
    methods: {
        getRandomArbitrary(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        },
        shootStar() {
            setTimeout(this.shootStar, this.randomNumber);
            this.randomNumber = this.getRandomArbitrary(5000, 10000);

            this.meteoro = this.style[this.getRandomArbitrary(0, 4)]
            
            setTimeout(() => {
                this.meteoro = null;
            }, 1000);
        }
    }
};
</script>

<style lang="scss">
    .satellite-header {
        &__logo {
            margin: 0 auto;
            display: block;
            width: 125px;
            height: 125px;
            animation: float 6s ease-in-out infinite;
            will-change: transform;
        }

        &__logo-words {
            margin: 0 auto;
            display: block;
            width: 150px;
            height: auto;
        }
    }

    .constellations {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        animation: rotate 600s infinite linear;
    }

    .star {
        background-color: white;
        border-radius: 50%;
        position: absolute;
        animation-name: estrela;
        animation-timing-function: linear;
        animation-iteration-count: infinite;

        &.style1 { animation-duration: 0.5s; animation-name: estrela; }
        &.style2 { animation-duration: 1s; animation-name: estrela; }
        &.style3 { animation-duration: 1.5s; animation-name: estrela; }
        &.style4 { animation-duration: 2s; animation-name: estrelaDestacada; }

        &.tam1 { width: 1px; height: 1px; }
        &.tam2 { width: 2px; height: 2px; }
        &.tam3 { width: 3px; height: 3px; }

        &.opacity1 { opacity:  1; }
        &.opacity2 { opacity: .5; }
        &.opacity3 { opacity: .1; }
    }

    .shooting-star {
        position: absolute;
        background-color: #fff;
        width: 2px;
        height: 2px;
        border-radius: 50%;
        transform: rotate(-35deg);
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        animation-duration: 1s;

        &.style1 { animation-name: meteoroStyle1; }
        &.style2 { animation-name: meteoroStyle2; }
        &.style3 { animation-name: meteoroStyle3; }
        &.style4 { animation-name: meteoroStyle4; }

        &:before {
            content: "";
                display: inline-block;
                vertical-align: middle;
                margin-right: 10px;
                width: 0;
                height: 0;
                border-top: 1px solid transparent;
                border-bottom: 1px solid transparent;
                border-left: 85px solid white;
                position: absolute;
                left: 2px;
                top: 0;
            }
    }

    @keyframes escurecer {
        0%   { top: 0; }
        100% { top: 100%; }
    }
    
    @keyframes estrela {
        0% {
            box-shadow: 0 0 10px 0px rgba(255, 255, 255, 0.05);
        }
        50% {
            box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.4);
        }
        100% {
            box-shadow: 0 0 10px 0px rgba(255, 255, 255, 0.05);
        }
    }
    
    @keyframes estrelaDestacada {
        0% {
            background-color: #FFFFFF;
            box-shadow: 0 0 10px 0px rgba(255, 255, 255, 1);
        }
        20% {
            background-color: #FFC4C4;
            box-shadow: 0 0 10px 0px rgb(255, 196, 196, 1);
        }
        80% {
            background-color: #C4CFFF;
            box-shadow: 0 0 10px 0px rgb(196, 207, 255, 1);
        }
        100% {
            background-color: #FFFFFF;
            box-shadow: 0 0 10px 0px rgba(255, 255, 255, 0.2);
        }
    }

    @keyframes meteoroStyle1 {
        0% { opacity: 0; right: 300px; top: 100px; }
        30% { opacity: .3; }
        60% { opacity: .3; }
        100% { opacity: 0; right: 1000px; top: 600px; }
    }

    @keyframes meteoroStyle2 {
        0% { opacity: 0; right: 700px; top: 100px; }
        30% { opacity: 1; }
        60% { opacity: 1; }
        100% { opacity: 0; right: 1400px; top: 600px; }
    }

    @keyframes meteoroStyle3 {
        0% { opacity: 0; right: 300px; top: 300px; }
        30% { opacity: 1; }
        60% { opacity: 1; }
        100% { opacity: 0; right: 1000px; top: 800px; }
    }

    @keyframes meteoroStyle4 {
        0% { opacity: 0; right: 700px; top: 300px; }
        30% { opacity: 1; }
        60% { opacity: 1; }
        100% { opacity: 0; right: 1400px; top: 800px; }
    }

    @keyframes rotate {
        0% {
            -webkit-transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
        }
    }

    @keyframes float {
        0% {
            transform: translatey(0px);
        }
        50% {
            transform: translatey(-20px);
        }
        100% {
            transform: translatey(0px);
        }
    }
</style>