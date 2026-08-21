const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const WORLD_WIDTH = 1650;
const WORLD_HEIGHT = 2560;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const state = {
    currentLocations: [],
    jumpBuffered: false,
    paywallTimer: 2400,
    meteorTimer: 90,
    meteorTime: 0,
    time: 0,
    randomControls: 1200,
    counter: 0,
    changeControls: false,
    buttonCooldown: false,
    latestCheckpoint: null,
    invisMessageShown: true,
    boosting: 0,
    launchDir: 0,
    onCooldown: false,
    mpDirection: -1,
    redLight: false,
    redLightTimer: 300,
    greenLightTimer: 900,
    lavaHeight: WORLD_HEIGHT,
    lavaRiseSpeed: 0.05,
    homeMeteorChance: 0.2,
    isResting: true,
    MandatoryRest: 10000,
    RestTime: 500,
};

const camera = { x: 0, y: 0 };

const player = {
    x: 10,
    y: WORLD_HEIGHT - 70,
    height: 30,
    width: 30,
    gravity: 0.5,
    velocity: 0,
    velocityX: 0,
    speed: 5,
    ground: false,
};

const clones = [];

const grass = {
    x: 0,
    y: WORLD_HEIGHT - 30,
    width: WORLD_WIDTH,
    height: 30,
    friction: 1,
};

const wind_zones = [
    { x: 600, y: WORLD_HEIGHT - 814, width: 300, height: 150, forceX: 2.5, forceY: -0.15, maxSpeedX: 8 },
];

const BOOST_SPEED = 32;
const BOOST_POP = -15;
const BOOST_TIME = 20;
const BOOST_CD = 400;

const conveyer = [
    { x: 1470, y: WORLD_HEIGHT - 814 - 135, width: 100, height: 20, dir: -1 },
    { x: 700, y: wind_zones[0].y - wind_zones[0].height - 90, width: 100, height: 20, dir: -1 },
    { x: 200, y: wind_zones[0].y - wind_zones[0].height - 150, width: 100, height: 20, dir: -1 },
];

const meteors = [];

const platforms = [
    { width: 100, height: 20, x: 200, y: grass.y - grass.height - 30, friction: 1 },
    { width: 200, height: 20, x: 485, y: WORLD_HEIGHT - 134, friction: 1 },
    { width: 100, height: 20, x: 850, y: WORLD_HEIGHT - 174, friction: 1 },
    { width: 200, height: 20, x: 850, y: WORLD_HEIGHT - 354, friction: 1 },
    { width: 50, height: 20, x: 700, y: WORLD_HEIGHT - 344, friction: 0.01 },
    { width: 50, height: 20, x: 780, y: WORLD_HEIGHT - 454, friction: 0.08 },
    { width: 200, height: 20, x: 100, y: WORLD_HEIGHT - 524, friction: 0.5 },
    { width: 20, height: 10, x: 200, y: WORLD_HEIGHT - 674, friction: 1 },
    { width: 5, height: 2, x: 410, y: WORLD_HEIGHT - 724, friction: 1 },
    { width: 300, height: 20, x: wind_zones[0].x, y: wind_zones[0].y + wind_zones[0].height, friction: 1 },
    { width: 50, height: 20, x: wind_zones[0].x + wind_zones[0].width + 100, y: WORLD_HEIGHT - 714, friction: 1 },
    { width: 50, height: 20, x: wind_zones[0].x + wind_zones[0].width + 200, y: WORLD_HEIGHT - 764, friction: 1 },
    { width: 50, height: 20, x: wind_zones[0].x + wind_zones[0].width + 300, y: WORLD_HEIGHT - 814, friction: 1 },
    { width: 50, height: 20, x: wind_zones[0].x + wind_zones[0].width + 400, y: WORLD_HEIGHT - 864, friction: 1 },
    { width: 50, height: 20, x: wind_zones[0].x + wind_zones[0].width + 500, y: WORLD_HEIGHT - 814 - 115, friction: 1 },
];

const wall = [
    { x: 200, y: platforms[0].y + platforms[0].height, width: 20, height: grass.y - (platforms[0].y + platforms[0].height) },
];

const spikes = [
    { width: 50, height: 93, x: platforms[0].x + platforms[0].width / 3 - 27, y: platforms[0].y - 73 },
    { width: grass.width - 200, height: 15, x: 200, y: grass.y - 15 },
    { width: 75, height: 15, x: platforms[6].x + platforms[6].width + 20, y: platforms[6].y - platforms[6].height - 100 },
];

const fake_sky = [
    { x: 525, y: platforms[1].y - 264, width: 130, height: 170 },
    { x: 250, y: platforms[6].y - 15, width: 30, height: 15 },
];

const fake_spikes = [
    { x: 555, y: platforms[1].y - 93, width: 80, height: 93 },
];

const fake_platform = { x: 525, y: platforms[1].y - 304, width: 50, height: 20 };

const button = [
    {
        x: platforms[2].x + platforms[2].width / 5 - 0.5,
        y: platforms[2].y - platforms[2].height - 8.7,
        width: 60,
        height: 30,
        teleport_coords: { x: 870, y: platforms[2].y - platforms[2].height - 8.7 - 200 },
    },
];

const checkpoint = [
    { x: platforms[3].x + (platforms[3].width - 40) / 2, y: platforms[3].y - platforms[3].height - 20, width: 40, height: 40 },
    { x: platforms[6].x + (platforms[6].width - 40) / 2, y: platforms[6].y - platforms[6].height - 20, width: 40, height: 40 },
    { x: platforms[10].x + (platforms[10].width - 40) / 2, y: platforms[10].y - platforms[10].height - 20, width: 40, height: 40 },
    { x: 10, y: WORLD_HEIGHT - 70, height: 40, width: 40 },
];

const invisible_platform = [
    { width: 0.25, height: 0.25, x: 680, y: WORLD_HEIGHT - 364 },
    { width: 20, height: 20, x: 650, y: WORLD_HEIGHT - 454 },
    { width: 10, height: 5, x: platforms[6].x, y: platforms[6].y - platforms[6].height - 30 },
    { width: 10, height: 5, x: platforms[6].x - 100, y: platforms[6].y - platforms[6].height - 85 },
];

const moving_platforms = [
    { width: 15, height: 10, x: 600, y: WORLD_HEIGHT - 524 },
];

const goal = {
    x: conveyer[2].x + (conveyer[2].width - 40) / 2,
    y: conveyer[2].y - (conveyer[2].height + 40) / 2,
    width: 40,
    height: 40,
}

const MP_SPEED = 2;
const MP_LEFT_BOUND = 350;
const MP_RIGHT_BOUND = 550;

const keys = {};

document.addEventListener("keydown", e => {
    keys[e.key] = true;
    if (e.key === " ") {
        state.jumpBuffered = true;
        e.preventDefault();
    }
});

document.addEventListener("keyup", e => {
    keys[e.key] = false;
});

function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function collideRect(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function death() {
    if (state.latestCheckpoint !== null) {
        player.x = checkpoint[state.latestCheckpoint].x;
        player.y = checkpoint[state.latestCheckpoint].y;
    } else {
        player.x = 10;
        player.y = WORLD_HEIGHT - 70;
    }

    player.velocityX = 0;
    player.velocity = 0;
    state.boosting = 0;

    if (state.currentLocations.length > 0) {
        clones.push({ locations: state.currentLocations, frames: 0 });
    }

    state.currentLocations = [];
    state.lavaHeight = WORLD_HEIGHT;
}

function applyButtonEffect(b) {
    if (state.buttonCooldown) return;

    state.buttonCooldown = true;
    setTimeout(() => { state.buttonCooldown = false; }, 500);

    const chance = Math.floor(Math.random() * 3) + 1;

    if (chance === 1) {
        player.x = b.teleport_coords.x;
        player.y = b.teleport_coords.y;
    } else if (chance === 2) {
        death();
    } else {
        player.x = 270;
        player.y = grass.y - grass.height - 30 - platforms[0].height;
    }

    player.velocity = 0;
    player.velocityX = 0;
}

function makeMeteorShape() {
    const numPoints = randint(7, 10);
    const shape = [];

    for (let i = 0; i < numPoints; i++) {
        shape.push({
            angle: (i / numPoints) * Math.PI * 2,
            r: 0.7 + Math.random() * 0.3,
        });
    }

    return shape;
}

function MandatoryRest(){
    ctx.fillStyle = "rgba(255,255,255,0)";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Mandatory Rest Break", canvas.width / 2, canvas.height / 2);
}

function drawMeteor(m) {
    const cx = m.x + m.width / 2;
    const cy = m.y + m.height / 2;
    const rx = m.width / 2;
    const ry = m.height / 2;

    ctx.beginPath();
    m.shape.forEach((p, i) => {
        const px = cx + Math.cos(p.angle) * rx * p.r;
        const py = cy + Math.sin(p.angle) * ry * p.r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    });
    ctx.closePath();

    const grad = ctx.createRadialGradient(cx - rx * 0.3, cy - ry * 0.3, rx * 0.1, cx, cy, rx);
    grad.addColorStop(0, "#C97A3D");
    grad.addColorStop(0.6, "#8B4A1F");
    grad.addColorStop(1, "#4A2510");

    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = "#2E1608";
    ctx.lineWidth = 2;
    ctx.stroke();
}

function updateMeteors() {
    for (let i = meteors.length - 1; i >= 0; i--) {
        const meteor = meteors[i];
        meteor.x += meteor.dx;
        meteor.y += meteor.dy;

        if (meteor.y > WORLD_HEIGHT) {
            meteors.splice(i, 1);
        }
    }

    meteors.forEach(meteor => {
        if (collideRect(player, meteor)) death();
    });
}

function updateMovingPlatforms() {
    moving_platforms.forEach(platform => {
        platform.x += MP_SPEED * state.mpDirection;

        if (platform.x <= MP_LEFT_BOUND) {
            platform.x = MP_LEFT_BOUND;
            state.mpDirection = 1;
        }

        if (platform.x + platform.width >= MP_RIGHT_BOUND) {
            platform.x = MP_RIGHT_BOUND - platform.width;
            state.mpDirection = -1;
        }
    });
}

function computeGroundFriction() {
    if (!player.ground) return 1;

    const feetRect = { x: player.x, y: player.y + player.height - 2, width: player.width, height: 4 };
    let friction = 1;

    if (collideRect(feetRect, grass)) friction = grass.friction;

    platforms.forEach(platform => {
        if (collideRect(feetRect, platform)) friction = platform.friction;
    });

    moving_platforms.forEach(platform => {
        if (collideRect(feetRect, platform)) friction = 1;
    });

    return friction;
}

function applyHorizontalMovement(friction) {
    let left = "a";
    let right = "d";

    if (state.changeControls) {
        left = "d";
        right = "a";
    }

    let targetDx = 0;
    if (keys[left]) targetDx = -player.speed;
    if (keys[right]) targetDx = player.speed;

    if (state.boosting > 0) {
        player.velocityX = BOOST_SPEED * state.launchDir;
        state.boosting--;
    } else {
        player.velocityX = player.velocityX * (1 - friction) + targetDx * friction;
        if (targetDx === 0 && friction < 1) {
            player.velocityX *= (1 - friction * 0.5);
        }
    }
}

function applyVerticalForces() {
    if (state.jumpBuffered && player.ground) {
        player.velocity = -10;
        player.ground = false;
        state.jumpBuffered = false;
    } else if (!player.ground) {
        state.jumpBuffered = false;
    }

    player.velocity += player.gravity;

    wind_zones.forEach(zone => {
        if (!collideRect(player, zone)) return;

        player.x -= zone.forceX;

        if (zone.forceY !== undefined && player.velocity > 0) {
            player.velocity *= 0.92;
            if (player.velocity > 2) player.velocity = 2;
        }
    });

    return player.velocity;
}

function resolveCollisions(dx, dy) {
    const new_x_rect = { x: player.x + dx, y: player.y, width: player.width, height: player.height };
    const new_y_rect = { x: player.x, y: player.y + dy, width: player.width, height: player.height };
    const grassRect = { x: grass.x, y: grass.y, width: grass.width, height: grass.height };

    if (collideRect(new_y_rect, grassRect) && player.velocity > 0) {
        dy = grass.y - player.height - player.y;
        player.velocity = 0;
        player.ground = true;
    }

    if (
        (collideRect(new_x_rect, platforms[5]) || collideRect(new_y_rect, platforms[5])) &&
        state.invisMessageShown
    ) {
        alert("From here, some platforms become invisible, have fun! :)");
        state.invisMessageShown = false;
    }

    platforms.forEach(platform => {
        const verticalHit = collideRect(new_y_rect, platform);

        if (collideRect(new_x_rect, platform) && !verticalHit) {
            dx = 0;
            player.velocityX = 0;
        }

        if (verticalHit) {
            if (player.velocity > 0) {
                dy = platform.y - player.height - player.y;
                player.velocity = 0;
                player.ground = true;
            } else {
                dy = platform.y + platform.height - player.y;
                player.velocity = 0;
            }
        }
    });

    conveyer.forEach(belt => {
        const willHitX = collideRect(new_x_rect, belt);
        const willHitY = collideRect(new_y_rect, belt);
        if (!willHitX && !willHitY) return;

        const xOverlapBefore = player.x < belt.x + belt.width && player.x + player.width > belt.x;
        const yOverlapBefore = player.y < belt.y + belt.height && player.y + player.height > belt.y;

        const sideHit = !xOverlapBefore && yOverlapBefore && willHitX;
        const verticalHit = !yOverlapBefore && xOverlapBefore && willHitY;

        if (sideHit && !state.onCooldown) {
            state.onCooldown = true;
            setTimeout(() => { state.onCooldown = false; }, BOOST_CD);
            state.launchDir = belt.dir;
            state.boosting = BOOST_TIME;
            player.velocity = BOOST_POP;
            dx = 0;
        } else if (sideHit) {
            dx = 0;
        }

        if (verticalHit) {
            if (player.velocity > 0) {
                dy = belt.y - player.height - player.y;
                player.velocity = 0;
                player.ground = true;
            } else {
                dy = belt.y + belt.height - player.y;
                player.velocity = 0;
            }
        }
    });

    invisible_platform.forEach(invis => {
        const verticalHit = collideRect(new_y_rect, invis);

        if (collideRect(new_x_rect, invis) && !verticalHit) {
            dx = 0;
            player.velocityX = 0;
        }

        if (verticalHit) {
            if (player.velocity > 0) {
                dy = invis.y - player.height - player.y;
                player.velocity = 0;
                player.ground = true;
            } else {
                dy = invis.y + invis.height - player.y;
                player.velocity = 0;
            }
        }
    });

    moving_platforms.forEach(platform => {
        const verticalHit = collideRect(new_y_rect, platform);

        if (collideRect(new_x_rect, platform) && !verticalHit) {
            dx = 0;
            player.velocityX = 0;
        }

        if (verticalHit) {
            if (player.velocity > 0) {
                dy = platform.y - player.height - player.y;
                player.velocity = 0;
                player.ground = true;
                player.x += MP_SPEED * state.mpDirection;
            } else {
                dy = platform.y + platform.height - player.y;
                player.velocity = 0;
            }
        }
    });

    button.forEach(b => {
        let hit = false;

        if (collideRect(new_x_rect, b)) {
            dx = 0;
            player.velocityX = 0;
            hit = true;
        }

        if (collideRect(new_y_rect, b)) {
            if (player.velocity > 0) {
                dy = b.y - player.height - player.y;
                player.velocity = 0;
                player.ground = true;
            } else {
                dy = b.y + b.height - player.y;
                player.velocity = 0;
            }
            hit = true;
        }

        if (hit) applyButtonEffect(b);
    });

    checkpoint.forEach((c, i) => {
        if (collideRect(new_x_rect, c) || collideRect(new_y_rect, c)) {
            state.latestCheckpoint = i;
        }
    });

    wall.forEach(w => {
        if (collideRect(new_x_rect, w)) {
            player.x = new_x_rect.x < w.x ? w.x - player.width : w.x + w.width;
            dx = 0;
            player.velocityX = 0;
        }

        if (collideRect(new_y_rect, w)) {
            if (player.velocity > 0) {
                dy = w.y - player.height - player.y;
                player.velocity = 0;
                player.ground = true;
            } else {
                dy = w.y + w.height - player.y;
                player.velocity = 0;
            }
        }
    });

    return { dx, dy };
}

function clampPlayerToWorld() {
    if (player.x < 0) {
        player.x = 0;
        player.velocityX = 0;
    }

    if (player.x + player.width > WORLD_WIDTH) {
        player.x = WORLD_WIDTH - player.width;
        player.velocityX = 0;
    }

    if (player.y < 0) {
        player.y = 0;
        player.velocity = 0;
    }

    if (player.y + player.height > WORLD_HEIGHT) {
        player.y = WORLD_HEIGHT - player.height;
        player.velocity = 0;
        player.ground = true;
    }
}

function checkHazards() {
    spikes.forEach(spike => {
        if (collideRect(player, spike)) {
            death();
            player.velocity = 0;
        }
    });

    fake_sky.forEach(zone => {
        if (collideRect(player, zone)) {
            death();
            player.velocity = 0;
        }
    });
}

function checkLava() {
    const lavaRect = { x: 0, y: state.lavaHeight, width: WORLD_WIDTH, height: WORLD_HEIGHT - state.lavaHeight };

    if (collideRect(player, lavaRect)) {
        death();
        player.velocity = 0;
    }
}

function recordTrail() {
    state.currentLocations.push({ x: player.x, y: player.y });

    clones.forEach(clone => {
        clone.frames++;
        if (clone.frames > clone.locations.length) {
            clone.frames = 0;
        }
    });
}

function move() {
    const friction = computeGroundFriction();
    applyHorizontalMovement(friction);

    let dx = player.velocityX;
    let dy = applyVerticalForces();
    player.ground = false;

    ({ dx, dy } = resolveCollisions(dx, dy));

    updateMeteors();

    if (state.redLight) {
        if (dx !== 0 || dy !== 0) {
            death();
        }
    }

    player.x += dx;
    player.y += dy;

    clampPlayerToWorld();
    checkHazards();
    checkLava();
    recordTrail();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    wind_zones.forEach(zone => {
        ctx.fillStyle = "rgba(0, 206, 209, 0.15)";
        ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
    });

    ctx.fillStyle = "#FF6B00";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = "green";
    ctx.fillRect(grass.x, grass.y, grass.width, grass.height);

    ctx.fillStyle = "red";
    spikes.forEach(spike => {
        ctx.fillRect(spike.x, spike.y, spike.width, spike.height);
    });

    fake_spikes.forEach(s => ctx.fillRect(s.x, s.y, s.width, s.height));

    ctx.fillStyle = "#4A8FA8";
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    ctx.fillStyle = "#FF6B00";
    conveyer.forEach(belt => {
        ctx.fillRect(belt.x, belt.y, belt.width, belt.height);
    });

    ctx.fillStyle = "#4A8FA8";
    ctx.fillRect(fake_platform.x, fake_platform.y, fake_platform.width, fake_platform.height);
    ctx.fillRect(moving_platforms[0].x, moving_platforms[0].y, moving_platforms[0].width, moving_platforms[0].height);

    ctx.fillStyle = "black";
    button.forEach(b => {
        ctx.fillRect(b.x, b.y, b.width, b.height);
    });

    ctx.fillStyle = "yellow";
    checkpoint.forEach(c => {
        ctx.fillRect(c.x, c.y, c.width, c.height);
    });

    ctx.fillStyle = "purple";
    ctx.fillRect(goal.x, goal.y, goal.width, goal.height);

    meteors.forEach(drawMeteor);

    ctx.fillStyle = "#FF6B00";
    ctx.globalAlpha = 0.1;
    clones.forEach(clone => {
        const idx = Math.min(clone.frames, clone.locations.length - 1);
        const pos = clone.locations[idx];
        if (pos) ctx.fillRect(pos.x, pos.y, player.width, player.height);
    });
    ctx.globalAlpha = 1;

    ctx.fillStyle = "#FF3300";
    ctx.fillRect(0, state.lavaHeight, WORLD_WIDTH, WORLD_HEIGHT - state.lavaHeight);

    ctx.restore();

    if (state.redLight) {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
    }

    const isGreenLight = !state.redLight;
    const timerValue = state.redLight ? state.redLightTimer : state.greenLightTimer;
    const text = Math.ceil(timerValue / 60);

    if (isGreenLight && text <= 3 && text >= 1) {
        const framesSinceChange = text * 60 - timerValue;
        const popDuration = 15;
        const popScale = 1 + Math.max(0, 1 - framesSinceChange / popDuration) * 0.8;

        ctx.save();
        ctx.fillStyle = "white";
        ctx.font = `${Math.round(60 * popScale)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        ctx.restore();
    } else {
        ctx.fillStyle = "white";
        ctx.font = "30px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, canvas.width / 2, 20);
    }
    if (state.resting) MandatoryRest();
}

function loop() {
    requestAnimationFrame(loop);

    if (state.resting) {
        state.RestTime--;
        if (state.RestTime <= 0) {
            state.resting = false;
            state.MandatoryRest = 10000;
        }
        draw();
        return;
    }

    state.MandatoryRest--;
    if (state.MandatoryRest <= 0) {
        state.resting = true;
        state.RestTime = 5000;
    }
    if (state.counter > state.randomControls) {
        state.changeControls = !state.changeControls;
        state.counter = 0;
    }

    if (state.time > state.paywallTimer) {
        state.time = 0;
        alert("pay up");

        const paid = Math.floor(Math.random() * 2) + 1;

        if (paid === 1) {
            alert("you didn't pay");
            death();
        } else {
            alert("ty");
        }
    }

    state.time++;
    state.meteorTime++;
    state.counter++;

    updateMovingPlatforms();
    move();

    camera.x = player.x - canvas.width / 2 + player.width / 2;
    camera.y = player.y - canvas.height / 2 + player.height / 2;
    camera.x = Math.max(0, Math.min(camera.x, WORLD_WIDTH - canvas.width));
    camera.y = Math.max(0, Math.min(camera.y, WORLD_HEIGHT - canvas.height));

    if (state.meteorTime > state.meteorTimer) {
        state.meteorTime = 0;

        if (Math.random() < state.homeMeteorChance) {
            let x = randint(camera.x, camera.x + canvas.width - 50);
            let y = camera.y;
            let dx = player.x - x;
            let dy = player.y - y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let ndx = 0;
            let ndy = 0;
            
            if (distance > 0) {
                ndx = dx / distance;
                ndy = dy / distance;
            }
            
            meteors.push({
                x: x,
                y: y,
                width: randint(20, 50),
                height: randint(20, 50),
                dx: ndx * 10,
                dy: ndy * 10,
                shape: makeMeteorShape(),
            });
        } else {
            meteors.push({
                x: randint(camera.x, camera.x + canvas.width - 50),
                y: camera.y,
                width: randint(20, 50),
                height: randint(20, 50),
                dx: randint(-3, 3),
                dy: randint(2, 5),
                shape: makeMeteorShape(),
            });
        }
    }
    
    if (state.redLight) {
        state.redLightTimer--;
        if (state.redLightTimer <= 0) {
            state.redLight = false;
            state.greenLightTimer = 900;
            state.redLightTimer = 300;
        }
    } else {
        state.greenLightTimer--;
        if (state.greenLightTimer <= 0) {
            state.redLight = true;
            state.greenLightTimer = 900;
            state.redLightTimer = 300;
        }
    }

    state.lavaHeight -= state.lavaRiseSpeed;

    draw();
}

loop();
