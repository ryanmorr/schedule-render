import { scheduleRender, fps, clear } from '../../src/schedule-render';
import { sleep } from '../setup';

describe('schedule-render', () => {
    it('should schedule a frame to render DOM updates', (done) => {
        const callback = sinon.spy();
        const spy = sinon.spy(window, 'requestAnimationFrame');

        scheduleRender(callback);
        requestAnimationFrame(() => {
            expect(callback.called).to.equal(true);
            expect(spy.called).to.equal(true);
            spy.restore();
            done();
        });
    });

    it('should only schedule one frame per cycle', (done) => {
        const callback1 = sinon.spy();
        const callback2 = sinon.spy();
        const requestSpy = sinon.spy(window, 'requestAnimationFrame');

        scheduleRender(callback1);
        expect(requestSpy.callCount).to.equal(1);

        scheduleRender(callback2);
        expect(requestSpy.callCount).to.equal(1);

        requestSpy.restore();

        requestAnimationFrame(() => {
            expect(callback1.called).to.equal(true);
            expect(callback2.called).to.equal(true);
            done();
        });
    });

    it('should execute all callback functions within a single frame if they do not exceed the fps interval time', (done) => {
        fps(60);

        const callback1 = sinon.spy(() => sleep(2));
        const callback2 = sinon.spy(() => sleep(2));
        const callback3 = sinon.spy(() => sleep(2));

        scheduleRender(callback1);
        scheduleRender(callback2);
        scheduleRender(callback3);

        requestAnimationFrame(() => {
            expect(callback1.called).to.equal(true);
            expect(callback2.called).to.equal(true);
            expect(callback3.called).to.equal(true);
            done();
        });
    });

    it('should automatically schedule another frame if the fps interval time has been exceeded', (done) => {
        fps(60);

        const callback1 = sinon.spy(() => sleep(20));
        const callback2 = sinon.spy(() => sleep(2));

        scheduleRender(callback1);
        scheduleRender(callback2);

        requestAnimationFrame(() => {
            expect(callback1.called).to.equal(true);
            expect(callback2.called).to.equal(false);
            requestAnimationFrame(() => {
                expect(callback2.called).to.equal(true);
                done();
            });
        });
    });

    it('should return a function that can remove the callback function from the queue', (done) => {
        const callback1 = sinon.spy();
        const callback2 = sinon.spy();

        const remove1 = scheduleRender(callback1);
        scheduleRender(callback2);

        remove1();

        requestAnimationFrame(() => {
            expect(callback1.called).to.equal(false);
            expect(callback2.called).to.equal(true);
            done();
        });
    });

    it('should cancel a frame if the only callback function in the queue is removed', () => {
        const callback = sinon.spy();
        const requestSpy = sinon.spy(window, 'requestAnimationFrame');
        const cancelSpy = sinon.spy(window, 'cancelAnimationFrame');

        const remove = scheduleRender(callback);
        expect(requestSpy.callCount).to.equal(1);

        remove();
        expect(cancelSpy.callCount).to.equal(1);

        requestSpy.restore();
        cancelSpy.restore();
    });

    it('should be able to clear the queue and cancel the frame', (done) => {
        const callback1 = sinon.spy();
        const callback2 = sinon.spy();

        scheduleRender(callback1);
        scheduleRender(callback2);

        const cancelSpy = sinon.spy(window, 'cancelAnimationFrame');

        clear();

        expect(cancelSpy.callCount).to.equal(1);

        cancelSpy.restore();

        requestAnimationFrame(() => {
            expect(callback1.called).to.equal(false);
            expect(callback2.called).to.equal(false);
            done();
        });
    });
});
