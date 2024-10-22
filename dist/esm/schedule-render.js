/*! @ryanmorr/schedule-render v3.0.3 | https://github.com/ryanmorr/schedule-render */
let n,e;const t=[],r=5;function o(){return performance.now()}function u(){return t.length>0}function i(){e=o();do{u()&&t.shift()()}while(o()-e<r);n=null,u()&&(n=requestAnimationFrame(i))}function a(e){return new Promise((r=>{n||(n=requestAnimationFrame(i)),t.push((()=>r(e())))}))}export{a as default};
