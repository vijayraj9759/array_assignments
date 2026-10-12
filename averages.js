const r = require("raylib");

function simpleData() {
    return [
        10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
        170, 180, 190, 200,
    ];
}

function setup() {
    const WIDTH = 500;
    const HEIGHT = 500;
    const FPS = 60;

    r.InitWindow(WIDTH, HEIGHT, "Averages");
    r.SetTargetFPS(FPS);

    const palatte = {
        bg: r.WHITE,
        bar: r.DARKBLUE,
        average: r.RED,
    };

    const data = simpleData();

    const bar = {
        width: 10,
        gap: 12,
    };

    const world = {
        width: WIDTH,
        height: HEIGHT,
        palatte,
        bar,
        data,
    };

    return world;
}

function maxValue(array) {
    let max = array[0];

    for (let i = 1; i < array.length; i++) {
        max = Math.max(max, array[i]);
    }

    return max;
}

function calculateScalingFactor(data, height) {
    const max = maxValue(data);
    return (90 * height) / (100 * max);
}

function calculateBarHeight(value, scalingFactorV) {
    return value * scalingFactorV;
}

function calculateX(bar, currentBar) {
    return (bar.width + bar.gap) * currentBar;
}

function calculateY(barHeight, screenHeight) {
    return screenHeight - barHeight;
}

function calculateCoordinate(barHeight, world, currentBar) {
    const x = calculateX(world.bar, currentBar);
    const y = calculateY(barHeight, world.height);

    return { x, y };
}

function drawBar(coordinates, size, color) {
    r.DrawRectangle(
        coordinates.x,
        coordinates.y,
        size.width,
        size.height,
        color,
    );
}

function calculateGraphCoordinates(world, scalingFactorV) {
    const graphCoordinates = [];

    for (let i = 0; i < world.data.length; i++) {
        const barHeight = calculateBarHeight(world.data[i], scalingFactorV);

        const position = calculateCoordinate(barHeight, world, i);
        const size = { width: world.bar.width, height: barHeight };

        graphCoordinates[i] = { position, size };
    }

    return graphCoordinates;
}

function drawBarGraph(coordinates, color) {
    for (let i = 0; i < coordinates.length; i++) {
        drawBar(coordinates[i].position, coordinates[i].size, color);
    }
}

function calculateAverage(data) {
    let sum = 0;
    for (const value of data) {
        sum += value;
    }

    return sum / data.length;
}

function calAvgLineCoordinates(world, scalingFactorV) {
    const average = calculateAverage(world.data);
    const averageHeight = calculateBarHeight(average, scalingFactorV);
    const averagePosition = calculateY(averageHeight, world.height);

    return {
        st: { x: 0, y: averagePosition },
        end: { x: world.width, y: averagePosition },
    };
}

function drawAverageLine(coordinates, color) {
    r.DrawLineV(coordinates.st, coordinates.end, color);
}

function draw(world) {
    const scalingFactorV = calculateScalingFactor(world.data, world.height);
    const graphCoordinates = calculateGraphCoordinates(world, scalingFactorV);
    const avgLineCoordinates = calAvgLineCoordinates(world, scalingFactorV);

    drawBarGraph(graphCoordinates, world.palatte.bar);
    drawAverageLine(avgLineCoordinates, world.palatte.average);
}

function loop(world) {
    while (!r.WindowShouldClose()) {
        r.BeginDrawing();
        r.ClearBackground(world.palatte.bg);

        draw(world);
        r.EndDrawing();
    }
}

function main() {
    const world = setup();
    loop(world);
}

main();
