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
        tasks.shift()();
    } while (shouldRender());
    if (hasTasks()) {
        frame = requestAnimationFrame(flush);
    }
}

export default function scheduleRender(callback) {
    return new Promise((resolve) => {
        if (!frame) {
            frame = requestAnimationFrame(flush);
        }
        tasks.push(() => resolve(callback()));
    });
}
