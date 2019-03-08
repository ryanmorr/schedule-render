const now = typeof performance !== 'undefined' ? performance.now.bind(performance) : Date.now;

export function sleep(ms) {
    const start = now();
    for (let i = 0; i < 1e7; i++) {
        if ((now() - start) > ms) {
            break;
        }
    }
}
