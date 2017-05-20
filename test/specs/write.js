/* eslint-disable max-len */

import { expect } from 'chai';
import sinon from 'sinon';
import write from '../../src/write';

// Use high performance now if available
const now = typeof performance !== 'undefined' ? performance.now.bind(performance) : Date.now;

// Polyfill `requestAnimationFrame`
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || ((cb) => setTimeout(cb, 1000 / 60));

// Polyfill `cancelAnimationFrame`
window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || ((id) => clearTimeout(id));

// Pause execution to test functionality
function sleep(ms) {
    const start = now();
    for (let i = 0; i < 1e7; i++) {
        if ((now() - start) > ms) {
            break;
        }
    }
}

describe('write', () => {
    it('should schedule a frame to write to the DOM', (done) => {
        const fn = sinon.spy();
        const spy = sinon.spy(window, 'requestAnimationFrame');

        write(fn);
        requestAnimationFrame(() => {
            expect(fn.called).to.equal(true);
            expect(spy.called).to.equal(true);
            spy.restore();
            done();
        });
    });

    it('should only schedule one frame per cycle', (done) => {
        const fn1 = sinon.spy();
        const fn2 = sinon.spy();
        const requestSpy = sinon.spy(window, 'requestAnimationFrame');
        const cancelSpy = sinon.spy(window, 'cancelAnimationFrame');

        write(fn1);
        expect(requestSpy.callCount).to.equal(1);
        expect(cancelSpy.callCount).to.equal(0);

        write(fn2);
        expect(requestSpy.callCount).to.equal(2);
        expect(cancelSpy.callCount).to.equal(1);

        requestSpy.restore();
        cancelSpy.restore();

        requestAnimationFrame(() => {
            expect(fn1.called).to.equal(true);
            expect(fn2.called).to.equal(true);
            expect(requestSpy.callCount).to.equal(2);
            expect(cancelSpy.callCount).to.equal(1);
            done();
        });
    });

    it('should be able to set the frames-per-second', () => {
        expect(write.fps).to.be.a('function');
        expect(write.fps.length).to.equal(1);
    });

    it('should execute all callback functions within a single frame if they don\'t exceed the fps interval time', (done) => {
        const fn1 = sinon.spy(() => sleep(2));
        const fn2 = sinon.spy(() => sleep(2));
        const fn3 = sinon.spy(() => sleep(2));

        write(fn1);
        write(fn2);
        write(fn3);

        requestAnimationFrame(() => {
            expect(fn1.called).to.equal(true);
            expect(fn2.called).to.equal(true);
            expect(fn3.called).to.equal(true);
            done();
        });
    });

    it('should automatically schedule another frame if the fps interval time has been exceeded', (done) => {
        write.fps(60);

        const fn1 = sinon.spy(() => sleep(20));
        const fn2 = sinon.spy(() => sleep(2));

        write(fn1);
        write(fn2);

        requestAnimationFrame(() => {
            expect(fn1.called).to.equal(true);
            expect(fn2.called).to.equal(false);
            requestAnimationFrame(() => {
                expect(fn2.called).to.equal(true);
                done();
            });
        });
    });

    it('should return a function that can remove the callback function from the queue', (done) => {
        const fn1 = sinon.spy();
        const fn2 = sinon.spy();

        const remove1 = write(fn1);
        write(fn2);

        remove1();

        requestAnimationFrame(() => {
            expect(fn1.called).to.equal(false);
            expect(fn2.called).to.equal(true);
            done();
        });
    });

    it('should cancel a frame if the only callback function in the queue is removed', () => {
        const fn = sinon.spy();
        const requestSpy = sinon.spy(window, 'requestAnimationFrame');
        const cancelSpy = sinon.spy(window, 'cancelAnimationFrame');

        const remove = write(fn);
        expect(requestSpy.callCount).to.equal(1);

        remove();
        expect(cancelSpy.callCount).to.equal(1);

        requestSpy.restore();
        cancelSpy.restore();
    });

    it('should be able to cancel all functions in the queue and cancel the frame', (done) => {
        const fn1 = sinon.spy();
        const fn2 = sinon.spy();

        write(fn1);
        write(fn2);

        const cancelSpy = sinon.spy(window, 'cancelAnimationFrame');

        write.clear();

        expect(cancelSpy.callCount).to.equal(1);

        cancelSpy.restore();

        requestAnimationFrame(() => {
            expect(fn1.called).to.equal(false);
            expect(fn2.called).to.equal(false);
            done();
        });
    });
});
