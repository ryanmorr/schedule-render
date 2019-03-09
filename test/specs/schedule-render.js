import { scheduleRender, fps, clear } from '../../src/schedule-render';
import { sleep } from '../setup';

describe('schedule-render', () => {
    it('should schedule a frame to render DOM updates and return a promise', (done) => {
        const callback = sinon.spy(() => 'foo');
        const spy = sinon.spy(window, 'requestAnimationFrame');

        const promise = scheduleRender(callback);
        expect(promise).to.be.a('promise');
        promise.then((value) => {
            expect(value).to.equal('foo');
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

    it('should execute all callback functions within a single frame if they do not exceed the fps budget', (done) => {
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

    it('should automatically schedule another frame if the fps budget has been exceeded', (done) => {
        fps(60);

        const callback1 = sinon.spy(() => sleep(13));
        const callback2 = sinon.spy(() => sleep(2));

        scheduleRender(callback1);
        scheduleRender(callback2);

        requestAnimationFrame(() => {
            expect(callback1.callCount).to.equal(1);
            expect(callback2.callCount).to.equal(0);

            requestAnimationFrame(() => {
                expect(callback2.callCount).to.equal(1);

                fps(30);

                scheduleRender(callback1);
                scheduleRender(callback1);
                scheduleRender(callback1);
                scheduleRender(callback2);

                requestAnimationFrame(() => {
                    expect(callback1.callCount).to.equal(4);
                    expect(callback2.callCount).to.equal(1);

                    requestAnimationFrame(() => {
                        expect(callback2.callCount).to.equal(2);
                        done();
                    });
                });
            });
        });
    });

    it('should clear the queue and cancel the frame', (done) => {
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
