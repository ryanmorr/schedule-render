# schedule-render

[![Version Badge][version-image]][project-url]
[![Build Status][build-image]][build-url]
[![License][license-image]][license-url]

> Batch DOM manipulations in a performant manner

## Install

Download the [CJS](https://github.com/ryanmorr/schedule-render/raw/master/dist/schedule-render.cjs.js), [ESM](https://github.com/ryanmorr/schedule-render/raw/master/dist/schedule-render.esm.js), [UMD](https://github.com/ryanmorr/schedule-render/raw/master/dist/schedule-render.umd.js) versions or install via NPM:

``` sh
npm install @ryanmorr/schedule-render
```

## Usage

Schedule a frame to invoke a callback function that mutates the DOM, returning a promise that is fulfilled when rendering is complete:

``` javascript
import { scheduleRender } from '@ryanmorr/schedule-render';

scheduleRender(() => {
    // Manipulate the DOM within the callback function
    // The return value is provided to all thenables
}).then((value) => {
    // Rendering complete
});
```

By default, all callbacks in the queue are invoked in the next frame. To throttle frames to a specific frame rate, use the `fps` function. This will establish a budget in milliseconds to complete rendering before a frame is dropped. When the frame rate budget has been exceeded and more callbacks still exist within the queue, a new frame will be automatically scheduled until everything in the queue has been rendered:

``` javascript
import { fps } from '@ryanmorr/schedule-render';

// Set the frames-per-second to 60,
// establishing a budget of 16.67 ms per frame
fps(60);

// If the first callback exceeds the budget threshold
// a new frame is scheduled for the second callback
scheduleRender(render1);
scheduleRender(render2);
```

Use the `clear` function to cancel the frame, reject the rendering proomises, and clear the queue:

``` javascript
import { clear } from '@ryanmorr/schedule-render';

scheduleRender(render1);
scheduleRender(render2);

// Removes both scheduled callbacks
clear();
```

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).

[project-url]: https://github.com/ryanmorr/schedule-render
[version-image]: https://badge.fury.io/gh/ryanmorr%2Fschedule-render.svg
[build-url]: https://travis-ci.org/ryanmorr/schedule-render
[build-image]: https://travis-ci.org/ryanmorr/schedule-render.svg
[license-image]: https://img.shields.io/badge/license-Unlicense-blue.svg
[license-url]: UNLICENSE