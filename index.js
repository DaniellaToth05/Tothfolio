// entry point for landing page


// INTRO BUFFER
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
        trailPositions.push({ x: starX, y: starY, a:1.0});
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
        trailPositions.forEach(p => p.a *= 0.88);

        for (let i = 1; i < trailPositions.length; i++){
            const progress = i / trailPositions.length;
            const trailOpacity = trailPositions[i].a * progress;
            if(trailOpacity < 0.01){
                continue;
            }
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



// LANDING PAGE

// star field behind main content of landing page
const starCanvas = document.getElementById('star-canvas');
const starContext = starCanvas.getContext('2d');

let starCanvasWidth, starCanvasHeight;
let stars = [];
let starFrame = 0;

function resizeStarCanvas() {
    starCanvasWidth = starCanvas.width = window.innerWidth;
    starCanvasHeight = starCanvas.height = window.innerHeight;
}

function createStars() {
    const random = Math.random();

    let brightness;
    if (random > 0.97) {
        brightness = 2;
    } else if (random > 0.83) {
        brightness = 1;
    } else {
        brightness = 0;
    }

    let radius;
    if (brightness === 2) {
        radius = 1.0;
    } else if (brightness === 1) {
        radius = 0.6;
    } else {
        radius = Math.random() * 0.4 + 0.1;
    }

    let opacity;
    if (brightness === 2) {
        opacity = Math.random() * 0.3 + 0.65;
    } else if (brightness === 1) {
        opacity = Math.random() * 0.25 + 0.4;
    } else {
        opacity = Math.random() * 0.28 + 0.12;
    }

    // cool stars are blue-white, warm stars are yellow-white
    const isCool = Math.random() > 0.55;

    return{
        x: Math.random() * starCanvasWidth,
        y: Math.random() * starCanvasHeight * 0.72,
        radius: radius,
        opacity: opacity,
        twinkleSpeed: Math.random() * 0.007 + 0.002,
        twinklePhase: Math.random() * Math.PI * 2,
        brightness: brightness,
        isCool: isCool
    };
}

function initializeStars(){
    stars = Array.from({ length: 300}, createStars);
}

function makeStarField(){
    starContext.clearRect(0, 0, starCanvasWidth, starCanvasHeight);
    starFrame += 0.016;

    stars.forEach(function(star){
        const twinkledOpacity = star.opacity * (0.6 + 0.4 * Math.sin(starFrame * star.twinkleSpeed + star.twinklePhase));

        let colour;
        if(star.isCool){
            colour = 'rgba(200, 220, 255, ' + twinkledOpacity + ')';
        } else {
            colour = 'rgba(255, 252, 240, ' + twinkledOpacity + ')';
        }

        if(star.brightness === 2){
            // larger stars have a little flare 
            starContext.fillStyle = colour;
            starContext.beginPath();
            starContext.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            starContext.fill();

            let flareColour;
            if(star.isCool){
                flareColour = 'rgba(200, 220, 255, ' + (twinkledOpacity * 0.3) + ')';
            }  else {
                flareColour = 'rgba(255, 252, 220, ' + (twinkledOpacity * 0.3) + ')';
            }

            starContext.strokeStyle = flareColour;
            starContext.lineWidth = 0.4;
            starContext.beginPath();
            starContext.moveTo(star.x -4, star.y);
            starContext.lineTo(star.x + 4, star.y);
            starContext.stroke();
            starContext.beginPath();
            starContext.moveTo(star.x, star.y - 4);
            starContext.lineTo(star.x, star.y + 4);
            starContext.stroke();
        } else {
            // smaller stars are just points
            starContext.fillStyle = colour;
            starContext.fillRect(star.x - star.radius, star.y - star.radius, star.radius * 2, star.radius * 2);
        }
    });

    requestAnimationFrame(makeStarField);
}

window.addEventListener('resize', function(){
    resizeStarCanvas();
    initializeStars();
});

resizeStarCanvas();
initializeStars();
makeStarField();

// rocket launch sequence
const launchButton = document.getElementById('launch-btn');
const rocketNode = document.getElementById('rocket-on-earth');
const rocketExhaust = document.getElementById('rocket-exhaust');
const landingBlock = document.getElementById('landing-info');
const contentBlock = document.getElementById('content');
const transitionOverlay = document.getElementById('transition-overlay');

launchButton.addEventListener('click', function(){
    launchButton.style.pointerEvents = 'none';
    rocketExhaust.style.opacity = '1';
    launchButton.querySelector('span').setContent = '↑ Launching...';

    setTimeout(function(){
        landingBlock.classList.add('content-fadeout');
        rocketNode.classList.add('rocket-liftoff');
        spawnSmoke(rocketNode);

        setTimeout(function(){
            contentBlock.classList.add('screen-zoomout');
        }, 900);

        setTimeout(function(){
            transitionOverlay.classList.add('go');
        }, 2600);

        setTimeout(function(){
            window.location.href = 'page.html';
        }, 3500);
    }, 200);
});

function spawnSmoke(parent){
    const smokeInterval = setInterval(function(){
        const smokePuff = document.createElement('div');
        smokePuff.className = 'smoke';

        const size = Math.random() * 22 + 10;
        const driftX = (Math.random() - 0.5) * 70;
        const driftY = -(Math.random() * 50 + 20);

        smokePuff.style.cssText = 'width:' + size + 'px; height:' + size + 'px; bottom:-10px; left:50%; --dx:' + driftX + 'px; --dy:' + driftY + 'px;';

        parent.appendChild(smokePuff);

        setTimeout(function(){
            smokePuff.remove();
        }, 1600);
    }, 65);

    setTimeout(function() {
        clearInterval(smokeInterval);
    }, 1300);
}

// also let launch be triggered by enter or space on keyboard
document.addEventListener('keydown', function(e){
    if(e.key === 'Enter' || e.key === ' '){
        launchButton.click();
    }
});