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

function isWithinBudget() {
    return (getTime() - start) < THRESHOLD;
}

function flush() {
    start = getTime();
    do {
        if (hasTasks()) {
            tasks.shift()();
        }
    } while (isWithinBudget());
    frame = null;
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
