/**
 * Common variables
 */
let frame;
let fpsValue = 60;
let interval = 1000 / fpsValue;
const batch = [];
const now = typeof performance !== 'undefined' ? performance.now.bind(performance) : Date.now;

/**
 * Schedule a frame to batch DOM
 * updates at the specified fps
 *
 * @api private
 */
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

/**
 * Set the frames-per-second
 *
 * @param {Number} value
 * @api public
 */
function fps(value) {
    fpsValue = value;
    interval = 1000 / fpsValue;
}

/**
 * Cancel the frame if one has been
 * scheduled and empty the batch
 *
 * @api public
 */
function clear() {
    if (frame) {
        cancelAnimationFrame(frame);
    }
    batch.length = 0;
}

/**
 * Use `requestAnimationFrame` to
 * batch DOM updates to boost
 * performance
 *
 * @param {Function} fn
 * @api public
 */
export default function write(fn) {
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

/**
 * Add helper functions to the
 * `write` default export
 */
write.fps = fps;
write.clear = clear;
