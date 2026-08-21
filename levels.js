// put the levels here
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
    y: conveyer[2].y - 40,
    width: 40,
    height: 40,
}
