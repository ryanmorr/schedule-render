let frame;
let start;
let budget = null;
const batch = [];

// Browser's require around 6ms to render a frame
// https://developers.google.com/web/fundamentals/performance/rail#animation
const BROWSER_RENDER_TIME = 6;

function render() {
    frame = null;
    if (budget == null) {
        while (batch.length > 0) batch.shift().render();
    } else {
        start = performance.now();
        do {
            batch.shift().render();
        } while (batch.length > 0 && ((performance.now() - start) < budget));
        if (batch.length > 0) {
            frame = requestAnimationFrame(render);
        }
    }
}

export function fps(value) {
    budget = (typeof value === 'number') ? (1000 / value) - BROWSER_RENDER_TIME : null;
}

export function clear() {
    if (frame) {
        cancelAnimationFrame(frame);
    }
    while (batch.length > 0) batch.shift().cancel();
}

export function scheduleRender(callback) {
    return new Promise((resolve, reject) => {
        if (!frame) {
            frame = requestAnimationFrame(render);
        }
        batch.push({
            render: () => resolve(callback()),
            cancel: reject
        });
    });
}
