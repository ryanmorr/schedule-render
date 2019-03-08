import { scheduleRender, fps, clear } from '../../src/schedule-render';
import { sleep } from '../setup';

describe('schedule-render', () => {
    it('should schedule a frame to render DOM updates', (done) => {
        const fn = sinon.spy();
        const spy = sinon.spy(window, 'requestAnimationFrame');

        scheduleRender(fn);
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

        scheduleRender(fn1);
        expect(requestSpy.callCount).to.equal(1);

        scheduleRender(fn2);
        expect(requestSpy.callCount).to.equal(1);

        requestSpy.restore();

        requestAnimationFrame(() => {
            expect(fn1.called).to.equal(true);
            expect(fn2.called).to.equal(true);
            expect(requestSpy.callCount).to.equal(1);
            done();
        });
    });

    it('should be able to set the frames-per-second', () => {
        expect(fps).to.be.a('function');
        expect(fps.length).to.equal(1);
    });

    it('should execute all callback functions within a single frame if they don\'t exceed the fps interval time', (done) => {
        const fn1 = sinon.spy(() => sleep(2));
        const fn2 = sinon.spy(() => sleep(2));
        const fn3 = sinon.spy(() => sleep(2));

        scheduleRender(fn1);
        scheduleRender(fn2);
        scheduleRender(fn3);

        requestAnimationFrame(() => {
            expect(fn1.called).to.equal(true);
            expect(fn2.called).to.equal(true);
            expect(fn3.called).to.equal(true);
            done();
        });
    });

    it('should automatically schedule another frame if the fps interval time has been exceeded', (done) => {
        fps(60);

        const fn1 = sinon.spy(() => sleep(20));
        const fn2 = sinon.spy(() => sleep(2));

        scheduleRender(fn1);
        scheduleRender(fn2);

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

        const remove1 = scheduleRender(fn1);
        scheduleRender(fn2);

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

        const remove = scheduleRender(fn);
        expect(requestSpy.callCount).to.equal(1);

        remove();
        expect(cancelSpy.callCount).to.equal(1);

        requestSpy.restore();
        cancelSpy.restore();
    });

    it('should be able to cancel all functions in the queue and cancel the frame', (done) => {
        const fn1 = sinon.spy();
        const fn2 = sinon.spy();

        scheduleRender(fn1);
        scheduleRender(fn2);

        const cancelSpy = sinon.spy(window, 'cancelAnimationFrame');

        clear();

        expect(cancelSpy.callCount).to.equal(1);

        cancelSpy.restore();

        requestAnimationFrame(() => {
            expect(fn1.called).to.equal(false);
            expect(fn2.called).to.equal(false);
            done();
        });
    });
});
