/*! write v0.1.0 | https://github.com/ryanmorr/write */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.write = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = write;
/**
 * Common variables
 */
var frame = void 0;
var fpsValue = 60;
var interval = 1000 / fpsValue;
var batch = [];
var now = typeof performance !== 'undefined' ? performance.now.bind(performance) : Date.now;

/**
 * Schedule a frame to batch DOM
 * updates at the specified fps
 *
 * @api private
 */
function scheduleFrame() {
    frame = requestAnimationFrame(function () {
        frame = null;
        var start = now();
        do {
            var fn = batch.shift();
            if (fn) {
                fn();
            }
        } while (batch.length && now() - start < interval);
        if (batch.length) {
            scheduleFrame();
        }
    });
}

/**
 * Set the frames-per-second
 *
 * @param {Number} value
 * @api public
 */
function fps(value) {
    fpsValue = value;
    interval = 1000 / fpsValue;
}

/**
 * Cancel the frame if one has been
 * scheduled and empty the batch
 *
 * @api public
 */
function clear() {
    if (frame) {
        cancelAnimationFrame(frame);
    }
    batch.length = 0;
}

/**
 * Use `requestAnimationFrame` to
 * batch DOM updates to boost
 * performance
 *
 * @param {Function} fn
 * @api public
 */
function write(fn) {
    if (frame) {
        cancelAnimationFrame(frame);
    }
    batch.push(fn);
    scheduleFrame();
    return function remove() {
        var index = batch.indexOf(fn);
        if (index === -1) {
            return;
        }
        batch.splice(index, 1);
        if (frame && !batch.length) {
            cancelAnimationFrame(frame);
        }
    };
}

/**
 * Add helper functions to the
 * `write` default export
 */
write.fps = fps;
write.clear = clear;
module.exports = exports['default'];

},{}]},{},[1])(1)
});

