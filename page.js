// solar system page 

// exit the boot screen after the animation finishes
setTimeout(function() {
    document.getElementById('boot').classList.add('done');
}, 2800);

// star background
(function() {
    
    var starCanvas = document.getElementById('star-canvas');
    var starContext = starCanvas.getContext('2d');
    var canvasWidth;
    var canvasHeight;
    var stars = [];
    var frame = 0;

    function resizeCanvas() {
        canvasWidth = starCanvas.width = window.innerWidth;
        canvasHeight = starCanvas.height = window.innerHeight;
    }

    function createStar() {
        var random = Math.random();

        var brightness;
        if (random > 0.97) {
            brightness = 2;
        } else if (random > 0.82) {
            brightness = 1;
        } else {
            brightness = 0;
        }

        var radius;
        if (brightness === 2) {
            radius = 1.1;
        } else if (brightness === 1) {
            radius = 0.7;
        } else {
            radius = Math.random() * 0.45 + 0.15;
        }

        var opacity;
        if (brightness === 2) {
            opacity = Math.random() * 0.25 + 0.75;
        } else if (brightness === 1) {
            opacity = Math.random() * 0.25 + 0.5;
        } else {
            opacity = Math.random() * 0.35 + 0.15;
        }

        return {
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasHeight,
            radius: radius,
            opacity: opacity,
            twinkleSpeed: Math.random() * 0.008 + 0.002,
            twinklePhase: Math.random() * Math.PI * 2,
            depth: Math.random() * 0.07 + 0.01,
            brightness: brightness,
            isCool: Math.random() > 0.6
        };
    }

    function initStars() {
        stars = Array.from({ length: 420 }, createStar);
    }

    function drawStarfield() {
        starContext.clearRect(0, 0, canvasWidth, canvasHeight);
        frame += 0.016;

        // subtle nebulas in the background
        var nebula1 = starContext.createRadialGradient(canvasWidth * 0.7, canvasHeight * 0.25, 0, canvasWidth * 0.7, canvasHeight * 0.25, 320);
        nebula1.addColorStop(0, 'rgba(70, 140, 220, 0.04)');
        nebula1.addColorStop(1, 'transparent');
        starContext.fillStyle = nebula1;
        starContext.fillRect(0, 0, canvasWidth, canvasHeight);

        var nebula2 = starContext.createRadialGradient(canvasWidth * 0.2, canvasHeight * 0.75, 0, canvasWidth * 0.2, canvasHeight * 0.75, 240);
        nebula2.addColorStop(0, 'rgba(90, 60, 180, 0.03)');
        nebula2.addColorStop(1, 'transparent');
        starContext.fillStyle = nebula2;
        starContext.fillRect(0, 0, canvasWidth, canvasHeight);

        // parallax offset for dragging
        var offsetX = window._starOffX || 0;
        var offsetY = window._starOffY || 0;

        stars.forEach(function(star) {
            var twinkledOpacity = star.opacity * (0.65 + 0.35 * Math.sin(frame * star.twinkleSpeed + star.twinklePhase));

            var starX = ((star.x + offsetX * star.depth) % canvasWidth + canvasWidth) % canvasWidth;
            var starY = ((star.y + offsetY * star.depth) % canvasHeight + canvasHeight) % canvasHeight;

            var colour;
            if (star.isCool) {
                colour = 'rgba(200, 220, 255, ' + twinkledOpacity + ')';
            } else {
                colour = 'rgba(255, 252, 240, ' + twinkledOpacity + ')';
            }

            if (star.brightness === 2) {
                // brighter stars have a flare
                starContext.fillStyle = colour;
                starContext.beginPath();
                starContext.arc(starX, starY, star.radius, 0, Math.PI * 2);
                starContext.fill();

                var spikeLength = 4 + star.radius;
                var spikeColour;
                if (star.isCool) {
                    spikeColour = 'rgba(200, 220, 255, ' + (twinkledOpacity * 0.35) + ')';
                } else {
                    spikeColour = 'rgba(255, 252, 220, ' + (twinkledOpacity * 0.35) + ')';
                }

                starContext.strokeStyle = spikeColour;
                starContext.lineWidth = 0.4;
                starContext.beginPath();
                starContext.moveTo(starX - spikeLength, starY);
                starContext.lineTo(starX + spikeLength, starY);
                starContext.stroke();
                starContext.beginPath();
                starContext.moveTo(starX, starY - spikeLength);
                starContext.lineTo(starX, starY + spikeLength);
                starContext.stroke();

            } else {
                // smaller stars are just points
                starContext.fillStyle = colour;
                starContext.fillRect(starX - star.radius, starY - star.radius, star.radius * 2, star.radius * 2);
            }
        });

        requestAnimationFrame(drawStarfield);
    }

    window.addEventListener('resize', function() {
        resizeCanvas();
        initStars();
    });

    resizeCanvas();
    initStars();
    drawStarfield();
})();

// meteors
(function() {
    var galaxy = document.getElementById('galaxy');

    function spawnMeteor() {
        var meteor = document.createElement('div');
        meteor.classList.add('meteor');

        meteor.style.top = (Math.random() * 60) + '%';
        meteor.style.left = (30 + Math.random() * 70) + '%';

        var delay = Math.random() * 10;
        meteor.style.animationDelay = delay + 's';

        galaxy.appendChild(meteor);

        setTimeout(function() {
            meteor.remove();
            spawnMeteor();
        }, (delay + 3) * 1000);
    }

    spawnMeteor();
})();