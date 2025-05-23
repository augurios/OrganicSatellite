<template>
    <header class="satellite-header">
        <canvas ref="starCanvas" class="star-canvas"></canvas>
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
            randomNumber: 5000,
            meteoro: null,
            stars: [],
            widthWindow: window.innerWidth,
            heightWindow: window.innerHeight,
            rotation: 0,
            scale: 4
        };
    },
    mounted() {
        this.initCanvas();
        setTimeout(() => {
            this.shootStar();
        }, this.randomNumber);
        window.addEventListener('resize', this.resizeCanvas);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeCanvas);
        cancelAnimationFrame(this.animationId);
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
            this.ctx = canvas.getContext('2d');
            this.resizeCanvas();
            this.createStars();
            this.animate();
        },
        resizeCanvas() {
            const canvas = this.$refs.starCanvas;
            canvas.width = window.innerWidth * this.scale;
            canvas.height = window.innerHeight * this.scale;
        },
        createStars() {
            this.stars = [];
            for (let i = 0; i < 700; i++) {
                this.stars.push({
                    x: Math.random() * (window.innerWidth * this.scale),
                    y: Math.random() * (window.innerHeight * this.scale),
                    r: Math.random() * 1.5 + 0.5,
                    opacity: Math.random() * 0.8 + 0.2,
                    twinkle: Math.random() * Math.PI * 2,
                });
            }
        },
        animate() {
            const ctx = this.ctx;
            const w = window.innerWidth * this.scale;
            const h = window.innerHeight * this.scale;
            ctx.clearRect(0, 0, w, h);

            // Save context state
            ctx.save();

            // Move to center and rotate
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rotation);

            // Move back
            ctx.translate(-w / 2, -h / 2);

            for (const star of this.stars) {
                star.twinkle += 0.02;
                ctx.globalAlpha = star.opacity + Math.sin(star.twinkle) * 0.2;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
                ctx.fillStyle = '#fff';
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
            will-change: transform;
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

    .star-canvas {
        position: fixed;
        left: -50%; 
        top: -50%;
        width: 200vw; 
        height: 200vh;
        pointer-events: none;
        z-index: -1;
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