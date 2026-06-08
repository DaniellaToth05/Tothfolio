// entry point for landing page

// intro: shooting star across the screen for loading time
const intro = document.getElementById('intro');
const canvas = document.getElementById('intro-canvas');
const context = canvas.getContext('2d');

let canvasWidth, canvasHeight;

function resizeCanvas() {
    canvasWidth = canvas.width = window.innerWidth;
    canvasHeight = canvas.height = window.innerHeight;
}
resizeCanvas();

// background scattered stars with different brightness levels (3)
const backgroundStars = Array.from({ length: 280 }, () => {
    const random = Math.random();
    let brightness;
    if (random > 0.96){
        brightness = 2;
    } else if (random > 0.82){
        brightness = 1;
    } else {
        brightness = 0;
    }

    let radius;
    if(brightness === 2){
        radius = 1.0;
    } else if (brightness === 1){
        radius = 0.6;
    } else {
        radius = Math.random() * 0.35 + 0.1;
    }

    let opacity;
    if (brightness === 2){
        opacity = Math.random() * 0.3 + 0.7;
    } else if (brightness === 1){
        opacity = Math.random() * 0.25 + 0.4;
    } else {
        opacity = Math.random() * 0.3 + 0.1;
    }

    return{
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        radius: radius,
        opacity: opacity,
        twinkleSpeed: Math.random() * 0.006 + 0.002,
        twinklePhase: Math.random() * Math.PI * 2
    };
});

// shooting star, enters top-right of screen and travels down-left
const travelAngle = Math.PI * 0.82; // around 23 degrees from horizontal
const travelSpeed = canvasWidth * 0.018; // adjust speed based on canvas width

let starX = canvasWidth * 0.75 + Math.random() * canvasWidth * 0.15; // start in top-right quadrant
let starY = canvasHeight * 0.05 + Math.random() * canvasHeight * 0.12; // start near top edge

const velocityX = Math.cos(travelAngle) * travelSpeed; // horizontal velocity
const velocityY = Math.sin(travelAngle) * travelSpeed; // vertical velocity

const MAX_TRAIL_LENGTH = 38;
const trailPositions = [];
let starOffScreen = false;
let animationStopped = false;
let frame = 0;

function startIntro(){
    if (animationStopped) {
        return;
    }
    frame++;

    context.clearRect(0, 0, canvasWidth, canvasHeight);

    // make background stars slightly twinkle
    backgroundStars.forEach(star => {
        const twinkledOpacity = star.opacity * (0.7 + 0.3 * Math.sin(frame * star.twinkleSpeed + star.twinklePhase));
        context.fillStyle = 'rgba(220, 232, 255, ' + twinkledOpacity.toFixed(2) + ')';
        context.fillRect(star.x - star.radius, star.y - star.radius, star.radius * 2, star.radius * 2);
    });

    if(!starOffScreen){
        trailPositions.push({ x: starX, y: starY});
        if(trailPositions.length > MAX_TRAIL_LENGTH){
            trailPositions.shift();
        }

        // trail should fade out to the back
        for (let i = 1; i < trailPositions.length; i++) {
            const progress = i / trailPositions.length;
            const trailOpacity = progress * progress * 0.9;
            const redShift = Math.round(180 + progress * 75);
            const greenShift = Math.round(210 + progress * 45);

            context.beginPath();
            context.moveTo(trailPositions[i-1].x, trailPositions[i-1].y);
            context.lineTo(trailPositions[i].x, trailPositions[i].y);
            context.strokeStyle = 'rgba(' + redShift + ', ' + greenShift + ', 255, ' + trailOpacity.toFixed(2) + ')';
            context.lineWidth = progress * 2.5;
            context.lineCap = 'round';
            context.stroke();
        }

        // glowing head of shooting star
        const headGlow = context.createRadialGradient(starX, starY, 0, starX, starY, 9);
        headGlow.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        headGlow.addColorStop(0.3, 'rgba(200, 255, 255, 0.5)');
        headGlow.addColorStop(1, 'rgba(150, 200, 255, 0.0)');
        context.beginPath();
        context.arc(starX, starY, 9, 0, Math.PI * 2);
        context.fillStyle = headGlow;
        context.fill();

        starX += velocityX;
        starY += velocityY;

        if(starX < -50 || starY > canvasHeight + 50 || starX > canvasWidth + 50){
            starOffScreen = true;
        }

    } else {
        // once the star if off screen, let the trail fade out and then stop the animation
        for (let i = 1; i < trailPositions.length; i++){
            const progress = i / trailPositions.length;
            const trailOpacity = progress * 0.5;
            context.beginPath();
            context.moveTo(trailPositions[i-1].x, trailPositions[i-1].y);
            context.lineTo(trailPositions[i].x, trailPositions[i].y);
            context.strokeStyle = 'rgba(200, 255, 255, ' + trailOpacity.toFixed(2) + ')';
            context.lineWidth = progress * 2;
            context.stroke();
        }
    }
    requestAnimationFrame(startIntro);
}
    

startIntro();

// fade the intro out after the star crosses the screen
setTimeout(function() {
    intro.classList.add('fade-out');
    setTimeout(function() { animationStopped = true; }, 1000);
}, 1400);
