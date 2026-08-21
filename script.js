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
    resting: false,
    MandatoryRest: 10000,
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

const BOOST_SPEED = 32;
const BOOST_POP = -15;
const BOOST_TIME = 20;
const BOOST_CD = 400;
const MP_SPEED = 2;
const MP_LEFT_BOUND = 350;
const MP_RIGHT_BOUND = 550;

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

function recordTrail() {
    state.currentLocations.push({ x: player.x, y: player.y });
    clones.forEach(clone => {
        clone.frames++;
        if (clone.frames > clone.locations.length) {
            clone.frames = 0;
        }
    });
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

function spawnMeteor() {
    if (Math.random() < state.homeMeteorChance) {
        const x = randint(camera.x, camera.x + canvas.width - 50);
        const y = camera.y;
        const dx = player.x - x;
        const dy = player.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
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
        spawnMeteor();
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
