<template>
    <header class="satellite-header">
        <canvas ref="starCanvas" class="star-canvas">
            <!-- Fallback content for browsers that don't support canvas -->
            <div class="star-fallback">
                <div class="star" v-for="n in 8" :key="n"></div>
            </div>
        </canvas>
        <div class="shooting-star-container">
            <div class='shooting-star' v-if="meteoro" :class="[meteoro]"></div>
        </div>
        <img alt="Organic Satellite" class="satellite-header__logo" src="@/assets/logo.png" />
        <img alt="Organic Satellite" class="satellite-header__logo-words" src="@/assets/logo_words_only.png" />
    </header>
</template>

<script>
import { browserSupport } from '../utils/browserDetection.js'

export default {
    name: 'SatelliteHeader',
    data() {
        return {
            style: ["style1", "style2", "style3", "style4"],
            randomNumber: 5000,
            meteoro: null,
            stars: [],
            widthWindow: window.innerWidth,
            heightWindow: window.innerHeight,
            rotation: 0,
            scale: 4,
            canvasSupported: browserSupport.canvas,
            reducedMotion: browserSupport.reducedMotion
        };
    },
    mounted() {
        // Only initialize canvas if supported and motion is not reduced
        if (this.canvasSupported && !this.reducedMotion) {
            this.initCanvas();
        }
        
        // Only start shooting star animation if motion is not reduced
        if (!this.reducedMotion) {
            setTimeout(() => {
                this.shootStar();
            }, this.randomNumber);
        }
        
        window.addEventListener('resize', this.resizeCanvas);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeCanvas);
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        // Clean up canvas context
        if (this.ctx) {
            this.ctx = null;
        }
        // Clear stars array to free memory
        this.stars = [];
    },
    methods: {
        getRandomArbitrary(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        },
        shootStar() {
            setTimeout(this.shootStar, this.randomNumber);
            this.randomNumber = this.getRandomArbitrary(5000, 10000);

            this.meteoro = this.style[this.getRandomArbitrary(0, 4)];
            
            setTimeout(() => {
                this.meteoro = null;
            }, 1000);
        },
        initCanvas() {
            const canvas = this.$refs.starCanvas;
            // Check for canvas support
            if (!canvas || !canvas.getContext) {
                console.warn('Canvas not supported');
                return;
            }
            
            this.ctx = canvas.getContext('2d');
            if (!this.ctx) {
                console.warn('2D context not supported');
                return;
            }
            
            this.resizeCanvas();
            this.createStars();
            this.animate();
        },
        resizeCanvas() {
            const canvas = this.$refs.starCanvas;
            if (!canvas) return;
            
            // Use device pixel ratio for better quality on high-DPI displays
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            
            if (this.ctx) {
                this.ctx.scale(dpr, dpr);
            }
        },
        createStars() {
            this.stars = [];
            const rect = this.$refs.starCanvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            
            for (let i = 0; i < 700; i++) {
                this.stars.push({
                    x: Math.random() * rect.width,
                    y: Math.random() * rect.height,
                    r: Math.random() * 1.5 + 0.5,
                    opacity: Math.random() * 0.8 + 0.2,
                    twinkle: Math.random() * Math.PI * 2,
                });
            }
        },
        animate() {
            if (!this.ctx || !this.$refs.starCanvas) return;
            
            const canvas = this.$refs.starCanvas;
            const rect = canvas.getBoundingClientRect();
            const ctx = this.ctx;
            
            // Performance optimization: skip animation if tab is not visible
            if (document.hidden) {
                this.animationId = requestAnimationFrame(this.animate);
                return;
            }
            
            ctx.clearRect(0, 0, rect.width, rect.height);

            // Save context state
            ctx.save();

            // Move to center and rotate
            ctx.translate(rect.width / 2, rect.height / 2);
            ctx.rotate(this.rotation);

            // Move back
            ctx.translate(-rect.width / 2, -rect.height / 2);

            // Batch star rendering for better performance
            ctx.fillStyle = '#fff';
            for (const star of this.stars) {
                star.twinkle += 0.02;
                ctx.globalAlpha = Math.max(0.1, star.opacity + Math.sin(star.twinkle) * 0.2);
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;

            // Restore context state
            ctx.restore();

            // Increment rotation (adjust speed as needed)
            this.rotation += 0.0001;

            this.animationId = requestAnimationFrame(this.animate);
        }
    }
};
</script>

<style lang="scss">
    .satellite-header {
        margin-bottom: 12px;
        &__logo {
            margin: 0 auto -14px;
            display: block;
            width: 125px;
            height: 125px;
            animation: float 6s ease-in-out infinite;
            -webkit-animation: float 6s ease-in-out infinite;
            will-change: transform;
            transform: translateZ(0); /* Force hardware acceleration */
            -webkit-transform: translateZ(0);
        }

        &__logo-words {
            margin: 0 auto;
            display: block;
            width: 150px;
            height: auto;
        }
    }

    .shooting-star {
        position: absolute;
        background-color: #fff;
        width: 2px;
        height: 2px;
        border-radius: 50%;
        transform: rotate(-35deg) translateZ(0);
        -webkit-transform: rotate(-35deg) translateZ(0);
        animation-timing-function: linear;
        -webkit-animation-timing-function: linear;
        animation-iteration-count: infinite;
        -webkit-animation-iteration-count: infinite;
        animation-duration: 1s;
        -webkit-animation-duration: 1s;
        will-change: transform, opacity;

        &.style1 { 
            animation-name: meteoroStyle1; 
            -webkit-animation-name: meteoroStyle1;
        }
        &.style2 { 
            animation-name: meteoroStyle2; 
            -webkit-animation-name: meteoroStyle2;
        }
        &.style3 { 
            animation-name: meteoroStyle3; 
            -webkit-animation-name: meteoroStyle3;
        }
        &.style4 { 
            animation-name: meteoroStyle4; 
            -webkit-animation-name: meteoroStyle4;
        }

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

    .star-canvas {
        position: fixed;
        left: -50%; 
        top: -50%;
        width: 200vw; 
        height: 200vh;
        pointer-events: none;
        z-index: -1;
        background: var(--color-background);
    }

    /* Canvas fallback for browsers that don't support canvas */
    .star-fallback {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
        
        .star {
            position: absolute;
            background: white;
            border-radius: 50%;
            width: 2px;
            height: 2px;
            animation: twinkle 3s infinite;
            -webkit-animation: twinkle 3s infinite;
            
            &:nth-child(1) { top: 10%; left: 20%; animation-delay: 0s; }
            &:nth-child(2) { top: 20%; left: 80%; animation-delay: 0.5s; }
            &:nth-child(3) { top: 30%; left: 40%; animation-delay: 1s; }
            &:nth-child(4) { top: 50%; left: 70%; animation-delay: 1.5s; }
            &:nth-child(5) { top: 70%; left: 30%; animation-delay: 2s; }
            &:nth-child(6) { top: 15%; left: 60%; animation-delay: 2.5s; }
            &:nth-child(7) { top: 85%; left: 10%; animation-delay: 1.2s; }
            &:nth-child(8) { top: 35%; left: 90%; animation-delay: 0.8s; }
        }
    }

    @keyframes twinkle {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
    }

    @-webkit-keyframes twinkle {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
    }

    @keyframes meteoroStyle1 {
        0% { opacity: 0; right: 300px; top: 100px; }
        30% { opacity: .3; }
        60% { opacity: .3; }
        100% { opacity: 0; right: 1000px; top: 600px; }
    }

    @-webkit-keyframes meteoroStyle1 {
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

    @-webkit-keyframes meteoroStyle2 {
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

    @-webkit-keyframes meteoroStyle3 {
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

    @-webkit-keyframes meteoroStyle4 {
        0% { opacity: 0; right: 700px; top: 300px; }
        30% { opacity: 1; }
        60% { opacity: 1; }
        100% { opacity: 0; right: 1400px; top: 800px; }
    }

    @keyframes float {
        0% {
            transform: translatey(0px);
            -webkit-transform: translatey(0px);
        }
        50% {
            transform: translatey(-20px);
            -webkit-transform: translatey(-20px);
        }
        100% {
            transform: translatey(0px);
            -webkit-transform: translatey(0px);
        }
    }

    @-webkit-keyframes float {
        0% {
            -webkit-transform: translatey(0px);
        }
        50% {
            -webkit-transform: translatey(-20px);
        }
        100% {
            -webkit-transform: translatey(0px);
        }
    }
</style>