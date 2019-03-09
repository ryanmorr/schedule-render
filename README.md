# schedule-render

[![Version Badge][version-image]][project-url]
[![Build Status][build-image]][build-url]
[![License][license-image]][license-url]

> Batch DOM manipulations in a performant manner

## Install

Download the [development](http://github.com/ryanmorr/schedule-render/raw/master/dist/schedule-render.js) or [minified](http://github.com/ryanmorr/schedule-render/raw/master/dist/schedule-render.min.js) version, or install via NPM:

``` sh
npm install @ryanmorr/schedule-render
```

## Usage

Schedule a frame to batch DOM mutations and returns a promise that is fulfilled when rendering is complete:

``` javascript
import { scheduleRender } from '@ryanmorr/schedule-render';

scheduleRender(() => {
    // Manipulate the DOM within the callback function
    // The value returned by the callback is provided to all thenables
}).then((value) => {
    // Rendering complete
});
```

Throttle frames to a specific frame rate (defaults to 60fps):

``` javascript
import { fps } from '@ryanmorr/schedule-render';

// Set the frames-per-second to 30
fps(30);

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