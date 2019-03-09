let frame;
let budget;
const batch = [];

// Browser's require around 6ms to render a frame
// https://developers.google.com/web/fundamentals/performance/rail#animation
const browserRenderTime = 6;

function render() {
    frame = null;
    const start = performance.now();
    do {
        const callback = batch.shift();
        if (callback) {
            callback();
        }
    } while (batch.length && ((performance.now() - start) < budget));
    if (batch.length) {
        frame = requestAnimationFrame(render);
    }
}

export function scheduleRender(callback) {
    return new Promise((resolve) => {
        if (!frame) {
            frame = requestAnimationFrame(render);
        }
        batch.push(() => resolve(callback()));
    });
}

export function fps(value) {
    budget = (1000 / value) - browserRenderTime;
}

export function clear() {
    if (frame) {
        cancelAnimationFrame(frame);
    }
    batch.length = 0;
}

fps(60);
