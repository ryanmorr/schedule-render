# schedule-render

[![Version Badge][version-image]][project-url]
[![Build Status][build-image]][build-url]
[![License][license-image]][license-url]

> Deferred DOM rendering optimized for 60fps

## Install

Download the [CJS](https://github.com/ryanmorr/schedule-render/raw/master/dist/schedule-render.cjs.js), [ESM](https://github.com/ryanmorr/schedule-render/raw/master/dist/schedule-render.esm.js), [UMD](https://github.com/ryanmorr/schedule-render/raw/master/dist/schedule-render.umd.js) versions or install via NPM:

``` sh
npm install @ryanmorr/schedule-render
```

## Usage

Schedule a callback function that manipulates the DOM. The callback is entered into a queue and run within a frame to maintain 60fps and prevent dropping the frame which could result in jank. When the frame rate budget has been exceeded and more callbacks still exist within the queue, a new frame will be automatically scheduled until every function in the queue has been executed. It returns a promise that is fulfilled when rendering is complete:

``` javascript
import scheduleRender from '@ryanmorr/schedule-render';

scheduleRender(() => {
    // Manipulate the DOM within the callback function
    // The return value is provided to all thenables
}).then((value) => {
    // Rendering complete
});
```

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).

[project-url]: https://github.com/ryanmorr/schedule-render
[version-image]: https://badge.fury.io/gh/ryanmorr%2Fschedule-render.svg
[build-url]: https://travis-ci.org/ryanmorr/schedule-render
[build-image]: https://travis-ci.org/ryanmorr/schedule-render.svg
[license-image]: https://img.shields.io/badge/license-Unlicense-blue.svg
[license-url]: UNLICENSE