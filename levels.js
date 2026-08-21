let WORLD_WIDTH = 1650;
let WORLD_HEIGHT = 2560;

let grass;
let wind_zones;
let conveyer;
let platforms;
let wall;
let spikes;
let fake_sky;
let fake_spikes;
let fake_platform;
let button;
let checkpoint;
let invisible_platform;
let moving_platforms;
let goal;

const meteors = [];

const EMPTY_RECT = { x: 0, y: 0, width: 0, height: 0 };

function level1() {
    const W = 1650;
    const H = 2560;

    const grass = {
        x: 0,
        y: H - 30,
        width: W,
        height: 30,
        friction: 1,
    };

    const wind_zones = [
        { x: 600, y: H - 814, width: 300, height: 150, forceX: 2.5, forceY: -0.15, maxSpeedX: 8 },
    ];

    const conveyer = [
        { x: 1470, y: H - 814 - 135, width: 100, height: 20, dir: -1 },
        { x: 700, y: wind_zones[0].y - wind_zones[0].height - 90, width: 100, height: 20, dir: -1 },
        { x: 50, y: wind_zones[0].y - wind_zones[0].height - 150, width: 100, height: 20, dir: -1 },
    ];

    const platforms = [
        { width: 100, height: 20, x: 200, y: grass.y - grass.height - 30, friction: 1 },
        { width: 200, height: 20, x: 485, y: H - 134, friction: 1 },
        { width: 100, height: 20, x: 850, y: H - 174, friction: 1 },
        { width: 200, height: 20, x: 850, y: H - 354, friction: 1 },
        { width: 50, height: 20, x: 700, y: H - 344, friction: 0.01 },
        { width: 50, height: 20, x: 780, y: H - 454, friction: 0.08 },
        { width: 200, height: 20, x: 100, y: H - 524, friction: 0.5 },
        { width: 20, height: 10, x: 200, y: H - 674, friction: 1 },
        { width: 5, height: 2, x: 410, y: H - 724, friction: 1 },
        { width: 300, height: 20, x: wind_zones[0].x, y: wind_zones[0].y + wind_zones[0].height, friction: 1 },
        { width: 50, height: 20, x: wind_zones[0].x + wind_zones[0].width + 100, y: H - 714, friction: 1 },
        { width: 50, height: 20, x: wind_zones[0].x + wind_zones[0].width + 200, y: H - 764, friction: 1 },
        { width: 50, height: 20, x: wind_zones[0].x + wind_zones[0].width + 300, y: H - 814, friction: 1 },
        { width: 50, height: 20, x: wind_zones[0].x + wind_zones[0].width + 400, y: H - 864, friction: 1 },
        { width: 50, height: 20, x: wind_zones[0].x + wind_zones[0].width + 500, y: H - 814 - 115, friction: 1 },
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
        { x: 10, y: H - 70, height: 40, width: 40 },
    ];

    const invisible_platform = [
        { width: 0.25, height: 0.25, x: 680, y: H - 364 },
        { width: 20, height: 20, x: 650, y: H - 454 },
        { width: 10, height: 5, x: platforms[6].x, y: platforms[6].y - platforms[6].height - 30 },
        { width: 10, height: 5, x: platforms[6].x - 100, y: platforms[6].y - platforms[6].height - 85 },
    ];

    const moving_platforms = [
        { width: 15, height: 10, x: 600, y: H - 524 },
    ];

    const goal = {
        x: conveyer[2].x + (conveyer[2].width - 40) / 2,
        y: conveyer[2].y - 40,
        width: 40,
        height: 40,
    };

    return {
        name: "Ground Floor",
        width: W,
        height: H,
        spawn: { x: 10, y: H - 70 },
        grass, wind_zones, conveyer, platforms, wall, spikes,
        fake_sky, fake_spikes, fake_platform, button, checkpoint,
        invisible_platform, moving_platforms, goal,
    };
}

function level2() {
    const W = 1200;
    const H = 1400;

    const grass = {
        x: 0,
        y: H - 30,
        width: W,
        height: 30,
        friction: 1,
    };

    const platforms = [
        { width: 160, height: 20, x: 120, y: H - 180, friction: 1 },
        { width: 120, height: 20, x: 380, y: H - 320, friction: 1 },
        { width: 120, height: 20, x: 640, y: H - 460, friction: 0.05 },
        { width: 160, height: 20, x: 880, y: H - 600, friction: 1 },
        { width: 120, height: 20, x: 620, y: H - 740, friction: 1 },
        { width: 120, height: 20, x: 340, y: H - 880, friction: 0.02 },
        { width: 200, height: 20, x: 80, y: H - 1020, friction: 1 },
        { width: 140, height: 20, x: 420, y: H - 1160, friction: 1 },
    ];

    const spikes = [
        { width: W - 200, height: 15, x: 200, y: grass.y - 15 },
        { width: 60, height: 15, x: 500, y: platforms[1].y - 15 },
    ];

    const checkpoint = [
        { x: platforms[3].x + (platforms[3].width - 40) / 2, y: platforms[3].y - 40, width: 40, height: 40 },
        { x: platforms[6].x + (platforms[6].width - 40) / 2, y: platforms[6].y - 40, width: 40, height: 40 },
    ];

    const goal = {
        x: platforms[7].x + (platforms[7].width - 40) / 2,
        y: platforms[7].y - 40,
        width: 40,
        height: 40,
    };

    return {
        name: "The Climb",
        width: W,
        height: H,
        spawn: { x: 20, y: H - 70 },
        grass, platforms, spikes, checkpoint, goal,
    };
}

const LEVELS = [level1, level2];

function loadLevel(index) {
    const L = LEVELS[index]();

    WORLD_WIDTH = L.width;
    WORLD_HEIGHT = L.height;

    grass              = L.grass              ?? { x: 0, y: L.height, width: L.width, height: 0, friction: 1 };
    wind_zones         = L.wind_zones         ?? [];
    conveyer           = L.conveyer           ?? [];
    platforms          = L.platforms          ?? [];
    wall               = L.wall               ?? [];
    spikes             = L.spikes             ?? [];
    fake_sky           = L.fake_sky           ?? [];
    fake_spikes        = L.fake_spikes        ?? [];
    fake_platform      = L.fake_platform      ?? { ...EMPTY_RECT };
    button             = L.button             ?? [];
    checkpoint         = L.checkpoint         ?? [];
    invisible_platform = L.invisible_platform ?? [];
    moving_platforms   = L.moving_platforms   ?? [];
    goal               = L.goal               ?? { ...EMPTY_RECT };

    meteors.length = 0;

    return L;
}
