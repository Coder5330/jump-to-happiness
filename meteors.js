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
