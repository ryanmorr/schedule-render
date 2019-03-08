let frame;
let fpsValue = 60;
let interval = 1000 / fpsValue;
const batch = [];
const now = typeof performance !== 'undefined' ? performance.now.bind(performance) : Date.now;

function render() {
    frame = null;
    const start = now();
    do {
        const callback = batch.shift();
        if (callback) {
            callback();
        }
    } while (batch.length && ((now() - start) < interval));
    if (batch.length) {
        frame = requestAnimationFrame(render);
    }
}

export function scheduleRender(callback) {
    if (!frame) {
        frame = requestAnimationFrame(render);
    }
    batch.push(callback);
    return () => {
        const index = batch.indexOf(callback);
        if (index === -1) {
            return;
        }
        batch.splice(index, 1);
        if (frame && !batch.length) {
            cancelAnimationFrame(frame);
        }
    };
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
