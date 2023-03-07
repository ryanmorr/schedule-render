/*! @ryanmorr/schedule-render v3.0.2 | https://github.com/ryanmorr/schedule-render */
"use strict";let n,e;const t=[],r=5;function o(){return performance.now()}function u(){return t.length>0}function i(){e=o();do{u()&&t.shift()()}while(o()-e<r);n=null,u()&&(n=requestAnimationFrame(i))}module.exports=function(e){return new Promise((r=>{n||(n=requestAnimationFrame(i)),t.push((()=>r(e())))}))};
