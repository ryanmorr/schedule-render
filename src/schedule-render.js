let frame;
let start;
const tasks = [];
const THRESHOLD = 5;

function getTime() {
    return performance.now();
}

function hasTasks() {
    return tasks.length > 0;
}

function shouldRender() {
    return hasTasks() && (getTime() - start) < THRESHOLD;
}

function flush() {
    frame = null;
    start = getTime();
    do {
        tasks.shift().render();
    } while (shouldRender());
    if (hasTasks()) {
        frame = requestAnimationFrame(flush);
    }
}

export function clear() {
    if (frame) {
        cancelAnimationFrame(frame);
    }
    while (hasTasks()) {
        tasks.shift().cancel();
    }
}

export function scheduleRender(callback) {
    return new Promise((resolve, reject) => {
        if (!frame) {
            frame = requestAnimationFrame(flush);
        }
        tasks.push({
            render: () => resolve(callback()),
            cancel: reject
        });
    });
}
