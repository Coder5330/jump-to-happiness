const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const state = {
    currentLocations: [],
    jumpBuffered: false,

    meteorTimer: 90,
    meteorTime: 0,
    homeMeteorChance: 0.2,

    time: 0,
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

    resting: false,
    playTime: 10000,
    RestTime: 5000,
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

const goal = {
    x: platforms[14].x,
    y: platforms[14].y - 40,
    width: 40,
    height: 40,
};

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
    resetLava();
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

function recordTrail() {
    state.currentLocations.push({ x: player.x, y: player.y });
    clones.forEach(clone => {
        clone.frames++;
        if (clone.frames > clone.locations.length) {
            clone.frames = 0;
        }
    });
}

function updateCamera() {
    camera.x = player.x - canvas.width / 2 + player.width / 2;
    camera.y = player.y - canvas.height / 2 + player.height / 2;
    camera.x = Math.max(0, Math.min(camera.x, WORLD_WIDTH - canvas.width));
    camera.y = Math.max(0, Math.min(camera.y, WORLD_HEIGHT - canvas.height));
}

function loop() {
    requestAnimationFrame(loop);

    if (updateRest()) {
        draw();
        return;
    }

    updateControlScramble();
    updatePaywall();

    updateMovingPlatforms();
    move();
    updateCamera();

    state.meteorTime++;
    if (state.meteorTime > state.meteorTimer) {
        state.meteorTime = 0;
        spawnMeteor();
    }

    updateRedLight();
    updateLava();

    draw();
}

loop();
