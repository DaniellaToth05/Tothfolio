// solar system page 

// planets
var PLANETS = {

    sun: { 
        tag: 'SOL // SECTOR 00', 
        title: 'Mission <em>Control</em>', 
        glow: 'rgba(255, 180, 50, 0.6)', 
        src: 'assets/model-1.glb' 
    },

    mercury: { 
        tag: 'MERCURY // SECTOR 01', 
        title: '<em>About</em> Me', 
        glow: 'rgba(160, 140, 120, 0.5)', src: 'assets/model-2.glb' 
    },

    venus: { 
        tag: 'VENUS // SECTOR 02', 
        title: '<em>Education</em>',
        glow: 'rgba(220, 170, 60, 0.5)', 
        src: 'assets/model-3.glb' 
    },

    earth: { 
        tag: 'EARTH // SECTOR 03', 
        title: '<em>Mission</em> Files', 
        glow: 'rgba(30, 120, 220, 0.55)', 
        src: 'assets/model-4.glb' 
    },

    mars: { 
        tag: 'MARS // SECTOR 04', 
        title: '<em>Signal</em> Map', 
        glow: 'rgba(200, 80, 30, 0.5)',
        src: 'assets/model-5.glb' 
    },

    jupiter: { 
        tag: 'JUPITER // SECTOR 05', 
        title: '<em>Mission</em> Log', 
        glow: 'rgba(200, 150, 60, 0.5)', 
        src: 'assets/model-6.glb' 
    },

    saturn: { 
        tag: 'SATURN // SECTOR 06', 
        title: '<em>Open</em> Comms', 
        glow: 'rgba(200, 180, 80, 0.45)', 
        src: 'assets/model-7.glb' 
    },

    uranus: { 
        tag: 'URANUS // SECTOR 07', 
        title: '<em>Resume</em> File',
        glow: 'rgba(80, 200, 220, 0.45)', 
        src: 'assets/model-8.glb' 
    },

    neptune: { 
        tag: 'NEPTUNE // SECTOR 08', 
        title: '<em>Deep</em> Space Links', 
        glow: 'rgba(40, 80, 200, 0.5)',   
        src: 'assets/model-9.glb' 
    }
};

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

// map dragging 
var mapState = (function(){
    var wrap = document.getElementById('map-wrap');
    var map = document.getElementById('solar-map');

    function getInitialScale() {
        if (window.innerWidth < 480) {
            return 0.2;
        } else if (window.innerWidth < 768) {
            return 0.3;
        } else if (window.innerWidth < 1024) {
            return 0.5;
        } else if (window.innerWidth < 1440) {
            return 0.7;
        } else {
            return 0.85;
        }
    }


    var scale = getInitialScale();

    // center map on sun position at load
    var posX = window.innerWidth / 2 - 2600 * scale;
    var posY = window.innerHeight / 2 - 1700 * scale;

    var MIN_SCALE = 0.25;
    var MAX_SCALE = 2.2;

    var isDragging = false;
    var lastMouseX = 0;
    var lastMouseY = 0;
    var velocityX = 0;
    var velocityY = 0;
    var momentumRequest = null;
    var isLocked = false;

    function applyTransform(animate) {
        if (animate) {
            map.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        } else {
            map.style.transition = 'none';
        }
        map.style.transform = 'translate(' + posX + 'px, ' + posY + 'px) scale(' + scale + ')';

        // update zoom percentage display
        document.getElementById('zoom-value').textContent = Math.round(scale * 100) + '%';

        // give position to star parallax
        window._starOffX = posX;
        window._starOffY = posY;
    }

    // initial position
    setTimeout(function() {
        applyTransform(false);
    }, 50);

    // mouse drag
    wrap.addEventListener('mousedown', function(e) {
        if(isLocked || e.target.closest('.planet-node')){
            return;
        }
        isDragging = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        velocityX = 0;
        velocityY = 0;
        wrap.style.cursor = 'grabbing';
        cancelAnimationFrame(momentumRequest);
    });

    window.addEventListener('mousemove', function(e){
        if (!isDragging){
            return;
        }
        velocityX = e.clientX - lastMouseX;
        velocityY = e.clientY - lastMouseY;
        posX += velocityX;
        posY += velocityY;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        applyTransform(false);
    });

    window.addEventListener('mouseup', function(){
        if(!isDragging){
            return;
        }
        isDragging = false;
        wrap.style.cursor = '';

        // slight momentum after mouse releases slowing down after 
        function applyMomentum(){
            velocityX *= 0.93;
            velocityY *= 0.93;
            if(Math.abs(velocityX) > 0.25 || Math.abs(velocityY) > 0.25){
                posX += velocityX;
                posY += velocityY;
                applyTransform(false);
                momentumRequest = requestAnimationFrame(applyMomentum);
            }
        }
        momentumRequest = requestAnimationFrame(applyMomentum);
    });

    // scroll to zoom
    wrap.addEventListener('wheel', function(e){
        if(isLocked){
            return;
        }
        e.preventDefault();

        var zoomStep;
        if (e.deltaY > 0){
            zoomStep = -0.07;
        } else {
            zoomStep = 0.07;
        }

        var newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale + zoomStep));
        var rect = wrap.getBoundingClientRect();
        var cursorX = e.clientX - rect.left;
        var cursorY = e.clientY - rect.top;

        // zoom wherever the cursor is
        posX = cursorX - (cursorX - posX) * (newScale / scale);
        posY = cursorY - (cursorY - posY) * (newScale / scale);
        scale = newScale; 

        applyTransform(false);
    }, {passive: false});

    // zoom buttons
    document.getElementById('button-zoom-in').addEventListener('click', function() {
        scale = Math.min(MAX_SCALE, scale + 0.15);
        applyTransform(true);
    });
    document.getElementById('button-zoom-out').addEventListener('click', function() {
        scale = Math.max(MIN_SCALE, scale - 0.15);
        applyTransform(true);
    });

    var lastTouchX = 0;
    var lastTouchY = 0;

    wrap.addEventListener('touchstart', function(e){
        if (isLocked || e.target.closest('.planet-node')){
            return;
        }
        isDragging = true;
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
        velocityX = 0;
        velocityY = 0;
        cancelAnimationFrame(momentumRequest);
    });

    wrap.addEventListener('touchmove', function(e){
        if (!isDragging){
            return;
        }
        e.preventDefault();
        var moveX = e.touches[0].clientX - lastTouchX;
        var moveY = e.touches[0].clientY - lastTouchY;
        velocityX = moveX;
        velocityY = moveY;
        posX += moveX;
        posY += moveY;
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
        applyTransform(false);
    }, { passive: false });

    window.addEventListener('touchend', function(){
        isDragging = false;
    });

    window.addEventListener('resize', function() {
        scale = getInitialScale();
        posX  = window.innerWidth  / 2 - 2600 * scale;
        posY  = window.innerHeight / 2 - 1700 * scale;
        applyTransform(false);
    });

    return {
        lock: function() {
            isLocked = true;
        },
        unlock: function() {
            isLocked = false;
        },
        navTo: function(targetX, targetY) {
            posX = window.innerWidth  / 2 - targetX * scale;
            posY = window.innerHeight / 2 - targetY * scale;
            map.style.transition = 'transform 0.7s cubic-bezier(0.77, 0, 0.175, 1)';
            map.style.transform  = 'translate(' + posX + 'px, ' + posY + 'px) scale(' + scale + ')';
        }
    };
})();

// planet overlays
(function() {
    var overlay = document.getElementById('zoom-overlay');
    var zoomModel = document.getElementById('zoom-mv');
    var zoomTag = document.getElementById('zoom-tag');
    var zoomTitle = document.getElementById('zoom-title');
    var zoomBody = document.getElementById('zoom-body');
    var closeBtn = document.getElementById('zoom-close');
    var zoomContent = document.getElementById('zoom-content');
    var modelWrap = document.getElementById('zoom-model-wrap');

    function openOverlay(planetId) {
        var planetData = PLANETS[planetId];
        if (!planetData) {
            return;
        }

        var template = document.getElementById('tpl-' + planetId);


        zoomModel.setAttribute('src', planetData.src);
        zoomModel.setAttribute('alt', planetId);
        zoomModel.style.setProperty('--planet-glow', planetData.glow);
        zoomTag.textContent = planetData.tag;
        zoomTitle.innerHTML = planetData.title;
        zoomBody.innerHTML = template ? template.innerHTML : '';
        zoomContent.scrollTop = 0;

        // saturn has rings that take up a lot of the model-viewer frame so it gets a bigger window than the other planets
        if (planetId === 'saturn') {
            zoomModel.style.width = '520px';
            zoomModel.style.height = '520px';
            modelWrap.style.width = '520px';
            modelWrap.style.height = '520px';
        } else {
            zoomModel.style.width = '320px';
            zoomModel.style.height = '320px';
            modelWrap.style.width = '320px';
            modelWrap.style.height = '320px';
        }

        overlay.classList.add('open');
        mapState.lock();
        document.getElementById('top-bar').classList.add('hidden');
        document.getElementById('bottom-bar').classList.add('hidden');
    }

    function closeOverlay() {
        overlay.classList.remove('open');
        mapState.unlock();
        document.getElementById('top-bar').classList.remove('hidden');
        document.getElementById('bottom-bar').classList.remove('hidden');
        setTimeout(function() {
            zoomModel.removeAttribute('auto-rotate');
        }, 600);
    }

    // click a planet to open the overlay
    document.querySelectorAll('.planet-node').forEach(function(node) {
        node.addEventListener('click', function(e) {
            e.stopPropagation();
            var planetId = node.dataset.planet;
            var nodeX = parseFloat(node.style.left);
            var nodeY = parseFloat(node.style.top);

            // pan the map to center on the planet before opening
            mapState.navTo(nodeX, nodeY);

            setTimeout(function() {
                openOverlay(planetId);
                zoomModel.setAttribute('auto-rotate', '');
            }, 750);
        });
    });

    // sun is also clickable
    document.getElementById('sun-click-target').addEventListener('click', function(e) {
        e.stopPropagation();
        mapState.navTo(2600, 1700);
        setTimeout(function() {
            openOverlay('sun');
            zoomModel.setAttribute('auto-rotate', '');
        }, 300);
    });

    closeBtn.addEventListener('click', closeOverlay);

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeOverlay();
        }
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeOverlay();
        }
    });
})();


