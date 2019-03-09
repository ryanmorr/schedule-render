export function sleep(ms) {
    const start = performance.now();
    for (let i = 0; i < 1e7; i++) {
        if ((performance.now() - start) > ms) {
            break;
        }
    }
}
