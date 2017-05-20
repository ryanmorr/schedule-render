# write
[![GitHub version](https://badge.fury.io/gh/ryanmorr%2Fwrite.svg)](https://badge.fury.io/gh/ryanmorr%2Fwrite) [![Build Status](https://travis-ci.org/ryanmorr/write.svg)](https://travis-ci.org/ryanmorr/write) ![Size](https://badge-size.herokuapp.com/ryanmorr/write/master/dist/write.min.js.svg?color=blue&label=file%20size)

> A performant DOM writing library

## Usage

Schedule a frame to batch DOM mutations for better performance:

``` javascript
write(() => {
    // Add to the DOM
    document.body.appendChild(element);

    // Mutate existing element
    element.classList.add('foo');
});
```

Throttle frames to a specific frame rate (defaults to 60):

``` javascript
write.fps(60);

write(() => {
    element.innerHTML = '<div></div>';
});
```

Each invocation returns a function capable of removing the scheduled callback from the queue:

``` javascript
const remove = write(() => {
    element.classList.add('foo');
});

// Cancel the previously scheduled callback
remove();
```

Remove all callback functions from the queue and cancel the frame:

``` javascript
write(() => {
    element.setAttribute('id', 'bar');
});

write(() => {
    element.style.display = 'block';
});

// Removes the 2 scheduled callbacks
write.clear();
```

## Installation

Write is [CommonJS](http://www.commonjs.org/) and [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) compatible with no dependencies. You can download the [development](http://github.com/ryanmorr/write/raw/master/dist/write.js) or [minified](http://github.com/ryanmorr/write/raw/master/dist/write.min.js) version, or install it in one of the following ways:

``` sh
npm install ryanmorr/write

bower install ryanmorr/write
```

## Tests

Open `test/runner.html` in your browser or test with PhantomJS by issuing the following commands:

``` sh
npm install
npm install -g gulp
gulp test
```

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).