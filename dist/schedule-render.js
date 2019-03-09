/*! @ryanmorr/schedule-render v1.0.0 | https://github.com/ryanmorr/schedule-render */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.scheduleRender = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scheduleRender = scheduleRender;
exports.fps = fps;
exports.clear = clear;
var frame;
var budget;
var batch = []; // Browser's require around 6ms to render a frame
// https://developers.google.com/web/fundamentals/performance/rail#animation

var browserRenderTime = 6;

function render() {
  frame = null;
  var start = performance.now();

  do {
    var callback = batch.shift();

    if (callback) {
      callback();
    }
  } while (batch.length && performance.now() - start < budget);

  if (batch.length) {
    frame = requestAnimationFrame(render);
  }
}

function scheduleRender(callback) {
  return new Promise(function (resolve) {
    if (!frame) {
      frame = requestAnimationFrame(render);
    }

    batch.push(function () {
      return resolve(callback());
    });
  });
}

function fps(value) {
  budget = 1000 / value - browserRenderTime;
}

function clear() {
  if (frame) {
    cancelAnimationFrame(frame);
  }

  batch.length = 0;
}

fps(60);

},{}]},{},[1])(1)
});

