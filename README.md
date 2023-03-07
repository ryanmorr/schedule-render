# schedule-render

[![Version Badge][version-image]][project-url]
[![License][license-image]][license-url]
[![Build Status][build-image]][build-url]

> Deferred DOM rendering optimized for 60fps

## Install

Download the [CJS](https://github.com/ryanmorr/schedule-render/raw/master/dist/cjs/schedule-render.js), [ESM](https://github.com/ryanmorr/schedule-render/raw/master/dist/esm/schedule-render.js), [UMD](https://github.com/ryanmorr/schedule-render/raw/master/dist/umd/schedule-render.js) versions or install via NPM:

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
[version-image]: https://img.shields.io/github/package-json/v/ryanmorr/schedule-render?color=blue&style=flat-square
[build-url]: https://github.com/ryanmorr/schedule-render/actions
[build-image]: https://img.shields.io/github/actions/workflow/status/ryanmorr/schedule-render/node.js.yml?style=flat-square
[license-image]: https://img.shields.io/github/license/ryanmorr/schedule-render?color=blue&style=flat-square
[license-url]: UNLICENSE