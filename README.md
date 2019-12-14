# schedule-render

[![Version Badge][version-image]][project-url]
[![Build Status][build-image]][build-url]
[![License][license-image]][license-url]

> Batch DOM manipulations in a performant manner

## Install

Download the [CJS](http://github.com/ryanmorr/schedule-render/raw/master/dist/schedule-render.cjs.js), [ESM](http://github.com/ryanmorr/schedule-render/raw/master/dist/schedule-render.esm.js), [UMD](http://github.com/ryanmorr/schedule-render/raw/master/dist/schedule-render.umd.js) versions or install via NPM:

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

By default, all callbacks in the queue are invoked in the next frame. To throttle frames to a specific frame rate, use the `fps` function:

``` javascript
import { fps } from '@ryanmorr/schedule-render';

// Set the frames-per-second to 60
fps(60);

// When the frame rate budget has been exceeded and more callbacks still exist within the queue,
// a new frame will be automatically scheduled until everything in the queue has been rendered
scheduleRender(renderer);
```

Clear the queue and cancel the frame:

``` javascript
import { clear } from '@ryanmorr/schedule-render';

scheduleRender(renderer1);
scheduleRender(renderer2);

// Removes the 2 scheduled callbacks
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