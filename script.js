const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
canvas.width = 1280;
canvas.height = 2560;

const camera = { x: 0, y: 0 };

const player = {
    x: 10,
    y: canvas.height - 70,
    height: 30,
    width: 30,
    gravity: 0.5,
    velocity: 0,
    velocityX: 0,
    speed: 5,
    ground: false,
};

const clones = [];

let current_locations = [];

const grass = {
    x: 0,
    y: canvas.height - 30,
    width: canvas.width,
    height: 30,
    friction: 1,
};

const wind_zones = [
    {
        x: 600,
        y: canvas.height - 814,
        width: 300,
        height: 150,
        forceX: 2.5,
        forceY: -0.15,
        maxSpeedX: 8,
    }
];

const BOOST_SPEED = 32;
const BOOST_POP = -15;
const BOOST_TIME = 20;
const BOOST_CD = 400;

const conveyer = [
    { x: 1470, y: canvas.height - 814 - 135, width: 100, height: 20, dir: -1 },
    { x: 700, y: wind_zones[0].y - wind_zones[0].height - 90, width: 100, height: 20, dir: -1 },
    { x: 200, y: wind_zones[0].y - wind_zones[0].height - 150, width: 100, height: 20, dir: -1 },
];

const platforms = [
    { width: 100, height: 20, x: 200, y: grass.y - grass.height - 30, friction: 1 },
    { width: 200, height: 20, x: 485, y: canvas.height - 134, friction: 1 },
    { width: 100, height: 20, x: 850, y: canvas.height - 174, friction: 1 },
    { width: 200, height: 20, x: 850, y: canvas.height - 354, friction: 1 },
    { width: 50, height: 20, x: 700, y: canvas.height - 344, friction: 0.01 },
    { width: 50, height: 20, x: 780, y: canvas.height - 454, friction: 0.08 },
    { width: 200, height: 20, x: 100, y: canvas.height - 524, friction: 0.5 },
    { width: 20, height: 10, x: 200, y: canvas.height - 674, friction: 1 },
    { width: 5, height: 2, x: 410, y: canvas.height - 724, friction: 1 },
    { width: 300, height: 20, x: wind_zones[0].x, y: wind_zones[0].y + wind_zones[0].height, friction: 1 },
    {width:50,height : 20,x: wind_zones[0].x + wind_zones[0].width + 100,y:canvas.height-814 - 15,friction:1},
    {width:50,height : 20,x: wind_zones[0].x + wind_zones[0].width + 200,y:canvas.height-814 - 35,friction:1},
    {width:50,height : 20,x: wind_zones[0].x + wind_zones[0].width + 300,y:canvas.height-814 - 60,friction:1},
    {width:50,height : 20,x: wind_zones[0].x + wind_zones[0].width + 400,y:canvas.height-814 - 80,friction:1},
    {width:50,height : 20,x: wind_zones[0].x + wind_zones[0].width + 500,y:canvas.height-814 - 95,friction:1},
];

const wall = [
    {
        x: 200,
        y: platforms[0].y + platforms[0].height,
        width: 20,
        height: grass.y - (platforms[0].y + platforms[0].height),
    },
];

const spikes = [
    {
        width: 50,
        height: 93,
        x: platforms[0].x + platforms[0].width / 3 - 27,
        y: platforms[0].y - 73,
    },
    {
        width: grass.width - 200,
        height: 15,
        x: 200,
        y: grass.y - 15,
    },
    {
        width: 75,
        height: 15,
        x: platforms[6].x + platforms[6].width + 20,
        y: platforms[6].y - platforms[6].height - 100,
    },
];

const fake_sky = [
    { x: 525, y: platforms[1].y - 264, width: 130, height: 170 },
    { x: 250, y: platforms[6].y - 15, width: 30, height: 15 },
];

const fake_spikes = [{
    x: 555,
    y: platforms[1].y - 93,
    width: 80,
    height: 93,
}];

const fake_platform = {
    x: 525,
    y: platforms[1].y - 304,
    width: 50,
    height: 20
};

const button = [
    {
        x: platforms[2].x + platforms[2].width / 5 - 0.5,
        y: platforms[2].y - platforms[2].height - 8.7,
        width: 60,
        height: 30,
        teleport_coords: {
            x: 870,
            y: platforms[2].y - platforms[2].height - 8.7 - 200,
        }
    }
];

const checkpoint = [
    {
        x: 850 + platforms[3].width / 2,
        y: platforms[3].y - platforms[3].height - 20,
        width: 40,
        height: 40,
    }
];

const invisible_platform = [
    {
        width: 0.25,
        height: 0.25,
        x: 680,
        y: canvas.height - 364,
    },
    {
        width: 20,
        height: 20,
        x: 650,
        y: canvas.height - 454,
    },
    {
        width: 10,
        height: 5,
        x: platforms[6].x,
        y: platforms[6].y - platforms[6].height - 30,
    },
    {
        width: 10,
        height: 5,
        x: platforms[6].x - 100,
        y: platforms[6].y - platforms[6].height - 85,
    },
];

const moving_platforms = [
    {
        width: 15,
        height: 10,
        x: 600,
        y: canvas.height - 524,
    }
];

const keys = {};
let jumpBuffered = false;

document.addEventListener("keydown", e => {
    keys[e.key] = true;

    if (e.key === " ") {
        jumpBuffered = true;
        e.preventDefault();
    }
});

document.addEventListener("keyup", e => {
    keys[e.key] = false;
});

let paywall_timer = 2400;
let time = 0;
let random_controls = 1200;
let counter = 0;
let change_controls = false;
let buttonCooldown = false;
let checkpoint_set = false;
let invismessageshown = true;

let boosting = 0;
let launchDir = 0;
let onCooldown = false;

let mpDirection = -1;

const MP_SPEED = 2;
const MP_LEFT_BOUND = 350;
const MP_RIGHT_BOUND = 550;

function updateMovingPlatforms() {

    moving_platforms.forEach(platform => {

        platform.x += MP_SPEED * mpDirection;

        if (platform.x <= MP_LEFT_BOUND) {
            platform.x = MP_LEFT_BOUND;
            mpDirection = 1;
        }

        if (platform.x + platform.width >= MP_RIGHT_BOUND) {
            platform.x = MP_RIGHT_BOUND - platform.width;
            mpDirection = -1;
        }

    });

}

function death() {

    if (checkpoint_set) {

        player.x = 850 + platforms[3].width / 2;
        player.y = platforms[3].y - platforms[3].height - 20;

    } else {

        player.x = 10;
        player.y = canvas.height - 70;

    }

    player.velocityX = 0;
    player.velocity = 0;
    boosting = 0;

    if (current_locations.length > 0) {
        clones.push({ locations: current_locations, frames: 0 });
    }

    current_locations = [];

}

function collideRect(a, b) {

    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );

}

function applyButtonEffect(b) {

    if (buttonCooldown) return;

    buttonCooldown = true;

    setTimeout(() => {
        buttonCooldown = false;
    }, 500);

    let chance = Math.floor(Math.random() * 3) + 1;

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

function move() {

    let dy = 0;

    let left = "a";
    let right = "d";

    if (change_controls) {
        left = "d";
        right = "a";
    }

    let friction = 1;

    if (player.ground) {

        const feetRect = {
            x: player.x,
            y: player.y + player.height - 2,
            width: player.width,
            height: 4
        };

        if (collideRect(feetRect, grass)) {
            friction = grass.friction;
        }

        platforms.forEach(platform => {

            if (collideRect(feetRect, platform)) {
                friction = platform.friction;
            }

        });

        moving_platforms.forEach(platform => {

            if (collideRect(feetRect, platform)) {
                friction = 1;
            }

        });

    }

    let targetDx = 0;

    if (keys[left]) targetDx = -player.speed;
    if (keys[right]) targetDx = player.speed;

    if (boosting > 0) {

        player.velocityX = BOOST_SPEED * launchDir;
        boosting--;

    } else {

        player.velocityX =
            player.velocityX * (1 - friction) +
            targetDx * friction;

        if (targetDx === 0 && friction < 1) {
            player.velocityX *= (1 - friction * 0.5);
        }

    }

    let dx = player.velocityX;

    if (jumpBuffered && player.ground) {

        player.velocity = -10;
        player.ground = false;
        jumpBuffered = false;

    } else if (!player.ground) {

        jumpBuffered = false;

    }

    player.velocity += player.gravity;

    wind_zones.forEach(zone => {

        if (collideRect(player, zone)) {
            player.x -= zone.forceX;
            
            if (zone.forceY !== undefined) {
                if(player.velocity > 0){
                player.velocity *= 0.92;

                if (player.velocity > 2) {
                    player.velocity = 2;
                    }
                }
            }

        }

    });

    dy += player.velocity;

    player.ground = false;

    const new_x_rect = {
        x: player.x + dx,
        y: player.y,
        width: player.width,
        height: player.height
    };

    const new_y_rect = {
        x: player.x,
        y: player.y + dy,
        width: player.width,
        height: player.height
    };

    const grassRect = {
        x: grass.x,
        y: grass.y,
        width: grass.width,
        height: grass.height
    };

    if (collideRect(new_y_rect, grassRect)) {

        if (player.velocity > 0) {

            dy = grass.y - player.height - player.y;
            player.velocity = 0;
            player.ground = true;

        }

    }

    if (
        (collideRect(new_x_rect, platforms[5]) ||
        collideRect(new_y_rect, platforms[5])) &&
        invismessageshown
    ) {

        alert("From here, some platforms become invisible, have fun! :)");
        invismessageshown = false;

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

        if (!collideRect(player, belt)) return;

        const verticalHit = collideRect(new_y_rect, belt);
        const sideHit = collideRect(new_x_rect, belt) && !verticalHit;

        if (sideHit && !onCooldown) {

            onCooldown = true;
            setTimeout(() => { onCooldown = false; }, BOOST_CD);

            launchDir = belt.dir;
            boosting = BOOST_TIME;
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

                player.x += MP_SPEED * mpDirection;

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

        if (hit) {
            applyButtonEffect(b);
        }

    });

    checkpoint.forEach(c => {

        if (
            collideRect(new_x_rect, c) ||
            collideRect(new_y_rect, c)
        ) {

            checkpoint_set = true;

        }

    });

    wall.forEach(w => {

        if (collideRect(new_x_rect, w)) {

            if (new_x_rect.x < w.x) {

                player.x = w.x - player.width;

            } else {

                player.x = w.x + w.width;

            }

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

    player.x += dx;
    player.y += dy;

    if (player.x < 0) {

        player.x = 0;
        player.velocityX = 0;

    }

    if (player.x + player.width > canvas.width) {

        player.x = canvas.width - player.width;
        player.velocityX = 0;

    }

    if (player.y < 0) {

        player.y = 0;
        player.velocity = 0;

    }

    if (player.y + player.height > canvas.height) {

        player.y = canvas.height - player.height;
        player.velocity = 0;
        player.ground = true;

    }

    spikes.forEach(spike => {

        if (collideRect(player, spike)) {

            death();
            player.velocity = 0;

        }

    });

    fake_sky.forEach(false_sky => {

        if (collideRect(player, false_sky)) {

            death();
            player.velocity = 0;

        }

    });

    current_locations.push({x: player.x, y: player.y});

    clones.forEach((clone) => {
        clone["frames"]++;
        if ((clone["frames"]) > clone["locations"].length) {
            clone["frames"] = 0;
        }
    });

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

    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );

    ctx.fillStyle = "green";

    ctx.fillRect(
        grass.x,
        grass.y,
        grass.width,
        grass.height
    );

    ctx.fillStyle = "red";

    spikes.forEach(spike => {

        ctx.fillRect(
            spike.x,
            spike.y,
            spike.width,
            spike.height
        );

    });

    fake_spikes.forEach(s => ctx.fillRect(s.x,s.y,s.width,s.height));

    ctx.fillStyle = "#4A8FA8";

    platforms.forEach(platform => {

        ctx.fillRect(
            platform.x,
            platform.y,
            platform.width,
            platform.height
        );

    });

    ctx.fillStyle = "#FF6B00";

    conveyer.forEach(belt => {

        ctx.fillRect(belt.x, belt.y, belt.width, belt.height);

    });

    ctx.fillStyle = "#4A8FA8";

    ctx.fillRect(
        fake_platform.x,
        fake_platform.y,
        fake_platform.width,
        fake_platform.height
    );

    ctx.fillRect(
        moving_platforms[0].x,
        moving_platforms[0].y,
        moving_platforms[0].width,
        moving_platforms[0].height
    );

    ctx.fillStyle = "black";

    button.forEach(b => {

        ctx.fillRect(
            b.x,
            b.y,
            b.width,
            b.height
        );

    });

    ctx.fillStyle = "yellow";

    checkpoint.forEach(c => {

        ctx.fillRect(
            c.x,
            c.y,
            c.width,
            c.height
        );

    });

    ctx.fillStyle = "#FF6B00";
    ctx.globalAlpha = "0.75";

    clones.forEach(clone => {
    
        const idx = Math.min(clone.frames, clone.locations.length - 1);
        const pos = clone.locations[idx];
    
        if (pos) {
            ctx.fillRect(pos.x, pos.y, player.width, player.height);
        }
    
    });

    ctx.globalAlpha = "1";

    ctx.restore();

}

function loop() {

    if (counter > random_controls) {

        change_controls = !change_controls;
        counter = 0;

    }

    if (time > paywall_timer) {

        time = 0;

        alert("pay up");

        let paid = Math.floor(Math.random() * 2) + 1;

        if (paid === 1) {

            alert("you didn't pay");
            death();

        } else {

            alert("ty");

        }

    }

    time++;
    counter++;

    updateMovingPlatforms();

    move();

    camera.x =
        player.x - canvas.width / 2 + player.width / 2;

    camera.y =
        player.y - canvas.height / 2 + player.height / 2;

    draw();

    requestAnimationFrame(loop);

}

loop();
