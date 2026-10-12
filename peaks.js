const r = require("raylib");

function getData() {
    return [12, 45, 78, 23, 91, 56, 34, 67, 89, 40];
}

function setup() {
    const WIDTH = 500;
    const HEIGHT = 500;
    const FPS = 60;

    r.InitWindow(WIDTH, HEIGHT, "Peaks");
    r.SetTargetFPS(FPS);

    const palatte = {
        bg: r.WHITE,
        bar: r.DARKBLUE,
        peak: r.RED,
    };

    const data = getData();
    const peaks = getPeak(data);

    const bar = {
        width: 10,
    };

    const world = {
        width: WIDTH,
        height: HEIGHT,
        palatte,
        bar,
        data,
        peaks,
    };

    return world;
}

function getPeak(data) {
    const peak = [];

    for (let i = 0; i < data.length; i++) {
        if (isPeak(data, i)) peak.push(i);
    }

    return peak;
}

function maxValue(array) {
    let max = array[0];

    for (let i = 1; i < array.length; i++) {
        max = Math.max(max, array[i]);
    }

    return max;
}

function calcScalingFactor(data, height) {
    const max = maxValue(data);
    return (90 * height) / (100 * max);
}

function calcBarHeight(value, scalingFactorV) {
    return value * scalingFactorV;
}

function calcX(bar, currentBar) {
    return bar.width * currentBar + bar.width / 2;
}

function calcY(barHeight, screenHeight) {
    return screenHeight - barHeight;
}

function calcBarPosition(barHeight, world, currentBar) {
    const x = calcX(world.bar, currentBar);
    const y = calcY(barHeight, world.height);

    return { x, y };
}

function isPeak(data, currentBar) {
    if (currentBar === 0 || currentBar === data.length - 1) return false;

    return (
        data[currentBar] > data[currentBar - 1] &&
        data[currentBar] > data[currentBar + 1]
    );
}

function calcPosition(world, scalingFactorV) {
    const bar = [];

    for (let i = 0; i < world.data.length; i++) {
        const barHeight = calcBarHeight(world.data[i], scalingFactorV);
        const position = calcBarPosition(barHeight, world, i);

        bar[i] = position;
    }

    return bar;
}

function drawLineChart(bars, color) {
    for (let i = 0; i < bars.length - 1; i++) {
        r.DrawLineV(bars[i], bars[i + 1], color);
    }
}

function drawPeaks(peaks, bars, color) {
    for (let i = 0; i < peaks.length; i++) {
        r.DrawCircleV(bars[peaks[i]], 10, color);
    }
}

function draw(world) {
    const scalingFactorV = calcScalingFactor(world.data, world.height);
    const barPositions = calcPosition(world, scalingFactorV);

    drawLineChart(barPositions, world.palatte.bar);
    drawPeaks(world.peaks, barPositions, world.palatte.peak);
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
