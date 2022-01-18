import scheduleRender from '../../src/schedule-render';

function wait(ms) {
    const start = performance.now();
    for (let i = 0; i < 1e7; i++) {
        if ((performance.now() - start) > ms) {
            break;
        }
    }
}

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

    it('should execute all callback functions in proper order', (done) => {
        const callback1 = sinon.spy();
        const callback2 = sinon.spy();
        const callback3 = sinon.spy();

        scheduleRender(callback1);
        scheduleRender(callback2);
        scheduleRender(callback3);

        requestAnimationFrame(() => {
            expect(callback1.called).to.equal(true);
            expect(callback2.called).to.equal(true);
            expect(callback3.called).to.equal(true);

            expect(callback2.calledAfter(callback1)).to.equal(true);
            expect(callback3.calledAfter(callback2)).to.equal(true);
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
        const callback1 = sinon.spy(() => wait(1));
        const callback2 = sinon.spy(() => wait(1));
        const callback3 = sinon.spy(() => wait(2));

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
        const callback1 = sinon.spy(() => wait(5));
        const callback2 = sinon.spy(() => wait(2));

        scheduleRender(callback1);
        scheduleRender(callback2);

        requestAnimationFrame(() => {
            expect(callback1.callCount).to.equal(1);
            expect(callback2.callCount).to.equal(0);

            requestAnimationFrame(() => {
                expect(callback2.callCount).to.equal(1);

                done();
            });
        });
    });

    it('should support nested calls across frames', (done) => {
        const callback1 = sinon.spy();
        const callback2 = sinon.spy(() => {
            wait(5);
            scheduleRender(callback1);
        });

        scheduleRender(callback2);

        requestAnimationFrame(() => {
            expect(callback2.callCount).to.equal(1);
            expect(callback1.callCount).to.equal(0);
            
            requestAnimationFrame(() => {
                expect(callback2.callCount).to.equal(1);
                expect(callback1.callCount).to.equal(1);
                done();
            });
        });
    });
});
