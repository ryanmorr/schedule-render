let frame;
let fpsValue = 60;
let interval = 1000 / fpsValue;
const batch = [];
const now = typeof performance !== 'undefined' ? performance.now.bind(performance) : Date.now;

function scheduleFrame() {
    frame = requestAnimationFrame(() => {
        frame = null;
        const start = now();
        do {
            const fn = batch.shift();
            if (fn) {
                fn();
            }
        } while (batch.length && ((now() - start) < interval));
        if (batch.length) {
            scheduleFrame();
        }
    });
}

export function fps(value) {
    fpsValue = value;
    interval = 1000 / fpsValue;
}

export function clear() {
    if (frame) {
        cancelAnimationFrame(frame);
    }
    batch.length = 0;
}

export function write(fn) {
    if (frame) {
        cancelAnimationFrame(frame);
    }
    batch.push(fn);
    scheduleFrame();
    return function remove() {
        const index = batch.indexOf(fn);
        if (index === -1) {
            return;
        }
        batch.splice(index, 1);
        if (frame && !batch.length) {
            cancelAnimationFrame(frame);
        }
    };
}
