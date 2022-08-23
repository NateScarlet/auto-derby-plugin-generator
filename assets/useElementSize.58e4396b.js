import{u as e}from"./index.e7370584.js";import{a as t,w as n}from"./vendor.e09d404b.js";var r,i,o=[],s="ResizeObserver loop completed with undelivered notifications.";(i=r||(r={})).BORDER_BOX="border-box",i.CONTENT_BOX="content-box",i.DEVICE_PIXEL_CONTENT_BOX="device-pixel-content-box";var a,c=function(e){return Object.freeze(e)},u=function(e,t){this.inlineSize=e,this.blockSize=t,c(this)},h=function(){function e(e,t,n,r){return this.x=e,this.y=t,this.width=n,this.height=r,this.top=this.y,this.left=this.x,this.bottom=this.top+this.height,this.right=this.left+this.width,c(this)}return e.prototype.toJSON=function(){var e=this;return{x:e.x,y:e.y,top:e.top,right:e.right,bottom:e.bottom,left:e.left,width:e.width,height:e.height}},e.fromRect=function(t){return new e(t.x,t.y,t.width,t.height)},e}(),d=function(e){return e instanceof SVGElement&&"getBBox"in e},f=function(e){if(d(e)){var t=e.getBBox(),n=t.width,r=t.height;return!n&&!r}var i=e,o=i.offsetWidth,s=i.offsetHeight;return!(o||s||e.getClientRects().length)},v=function(e){var t,n;if(e instanceof Element)return!0;var r=null===(n=null===(t=e)||void 0===t?void 0:t.ownerDocument)||void 0===n?void 0:n.defaultView;return!!(r&&e instanceof r.Element)},l="undefined"!=typeof window?window:{},p=new WeakMap,g=/auto|scroll/,b=/^tb|vertical/,w=/msie|trident/i.test(l.navigator&&l.navigator.userAgent),x=function(e){return parseFloat(e||"0")},m=function(e,t,n){return void 0===e&&(e=0),void 0===t&&(t=0),void 0===n&&(n=!1),new u((n?t:e)||0,(n?e:t)||0)},E=c({devicePixelContentBoxSize:m(),borderBoxSize:m(),contentBoxSize:m(),contentRect:new h(0,0,0,0)}),T=function(e,t){if(void 0===t&&(t=!1),p.has(e)&&!t)return p.get(e);if(f(e))return p.set(e,E),E;var n=getComputedStyle(e),r=d(e)&&e.ownerSVGElement&&e.getBBox(),i=!w&&"border-box"===n.boxSizing,o=b.test(n.writingMode||""),s=!r&&g.test(n.overflowY||""),a=!r&&g.test(n.overflowX||""),u=r?0:x(n.paddingTop),v=r?0:x(n.paddingRight),l=r?0:x(n.paddingBottom),T=r?0:x(n.paddingLeft),B=r?0:x(n.borderTopWidth),y=r?0:x(n.borderRightWidth),z=r?0:x(n.borderBottomWidth),S=T+v,O=u+l,R=(r?0:x(n.borderLeftWidth))+y,C=B+z,k=a?e.offsetHeight-C-e.clientHeight:0,N=s?e.offsetWidth-R-e.clientWidth:0,D=i?S+R:0,W=i?O+C:0,M=r?r.width:x(n.width)-D-N,F=r?r.height:x(n.height)-W-k,P=M+S+N+R,_=F+O+k+C,A=c({devicePixelContentBoxSize:m(Math.round(M*devicePixelRatio),Math.round(F*devicePixelRatio),o),borderBoxSize:m(P,_,o),contentBoxSize:m(M,F,o),contentRect:new h(T,u,M,F)});return p.set(e,A),A},B=function(e,t,n){var i=T(e,n),o=i.borderBoxSize,s=i.contentBoxSize,a=i.devicePixelContentBoxSize;switch(t){case r.DEVICE_PIXEL_CONTENT_BOX:return a;case r.BORDER_BOX:return o;default:return s}},y=function(e){var t=T(e);this.target=e,this.contentRect=t.contentRect,this.borderBoxSize=c([t.borderBoxSize]),this.contentBoxSize=c([t.contentBoxSize]),this.devicePixelContentBoxSize=c([t.devicePixelContentBoxSize])},z=function(e){if(f(e))return 1/0;for(var t=0,n=e.parentNode;n;)t+=1,n=n.parentNode;return t},S=function(){var e=1/0,t=[];o.forEach((function(n){if(0!==n.activeTargets.length){var r=[];n.activeTargets.forEach((function(t){var n=new y(t.target),i=z(t.target);r.push(n),t.lastReportedSize=B(t.target,t.observedBox),i<e&&(e=i)})),t.push((function(){n.callback.call(n.observer,r,n.observer)})),n.activeTargets.splice(0,n.activeTargets.length)}}));for(var n=0,r=t;n<r.length;n++){(0,r[n])()}return e},O=function(e){o.forEach((function(t){t.activeTargets.splice(0,t.activeTargets.length),t.skippedTargets.splice(0,t.skippedTargets.length),t.observationTargets.forEach((function(n){n.isActive()&&(z(n.target)>e?t.activeTargets.push(n):t.skippedTargets.push(n))}))}))},R=function(){var e,t=0;for(O(t);o.some((function(e){return e.activeTargets.length>0}));)t=S(),O(t);return o.some((function(e){return e.skippedTargets.length>0}))&&("function"==typeof ErrorEvent?e=new ErrorEvent("error",{message:s}):((e=document.createEvent("Event")).initEvent("error",!1,!1),e.message=s),window.dispatchEvent(e)),t>0},C=[],k=function(e){if(!a){var t=0,n=document.createTextNode("");new MutationObserver((function(){return C.splice(0).forEach((function(e){return e()}))})).observe(n,{characterData:!0}),a=function(){n.textContent=""+(t?t--:t++)}}C.push(e),a()},N=0,D={attributes:!0,characterData:!0,childList:!0,subtree:!0},W=["resize","load","transitionend","animationend","animationstart","animationiteration","keyup","keydown","mouseup","mousedown","mouseover","mouseout","blur","focus"],M=function(e){return void 0===e&&(e=0),Date.now()+e},F=!1,P=new(function(){function e(){var e=this;this.stopped=!0,this.listener=function(){return e.schedule()}}return e.prototype.run=function(e){var t=this;if(void 0===e&&(e=250),!F){F=!0;var n,r=M(e);n=function(){var n=!1;try{n=R()}finally{if(F=!1,e=r-M(),!N)return;n?t.run(1e3):e>0?t.run(e):t.start()}},k((function(){requestAnimationFrame(n)}))}},e.prototype.schedule=function(){this.stop(),this.run()},e.prototype.observe=function(){var e=this,t=function(){return e.observer&&e.observer.observe(document.body,D)};document.body?t():l.addEventListener("DOMContentLoaded",t)},e.prototype.start=function(){var e=this;this.stopped&&(this.stopped=!1,this.observer=new MutationObserver(this.listener),this.observe(),W.forEach((function(t){return l.addEventListener(t,e.listener,!0)})))},e.prototype.stop=function(){var e=this;this.stopped||(this.observer&&this.observer.disconnect(),W.forEach((function(t){return l.removeEventListener(t,e.listener,!0)})),this.stopped=!0)},e}()),_=function(e){!N&&e>0&&P.start(),!(N+=e)&&P.stop()},A=function(){function e(e,t){this.target=e,this.observedBox=t||r.CONTENT_BOX,this.lastReportedSize={inlineSize:0,blockSize:0}}return e.prototype.isActive=function(){var e,t=B(this.target,this.observedBox,!0);return e=this.target,d(e)||function(e){switch(e.tagName){case"INPUT":if("image"!==e.type)break;case"VIDEO":case"AUDIO":case"EMBED":case"OBJECT":case"CANVAS":case"IFRAME":case"IMG":return!0}return!1}(e)||"inline"!==getComputedStyle(e).display||(this.lastReportedSize=t),this.lastReportedSize.inlineSize!==t.inlineSize||this.lastReportedSize.blockSize!==t.blockSize},e}(),I=function(e,t){this.activeTargets=[],this.skippedTargets=[],this.observationTargets=[],this.observer=e,this.callback=t},L=new WeakMap,X=function(e,t){for(var n=0;n<e.length;n+=1)if(e[n].target===t)return n;return-1},V=function(){function e(){}return e.connect=function(e,t){var n=new I(e,t);L.set(e,n)},e.observe=function(e,t,n){var r=L.get(e),i=0===r.observationTargets.length;X(r.observationTargets,t)<0&&(i&&o.push(r),r.observationTargets.push(new A(t,n&&n.box)),_(1),P.schedule())},e.unobserve=function(e,t){var n=L.get(e),r=X(n.observationTargets,t),i=1===n.observationTargets.length;r>=0&&(i&&o.splice(o.indexOf(n),1),n.observationTargets.splice(r,1),_(-1))},e.disconnect=function(e){var t=this,n=L.get(e);n.observationTargets.slice().forEach((function(n){return t.unobserve(e,n.target)})),n.activeTargets.splice(0,n.activeTargets.length)},e}(),H=function(){function e(e){if(0===arguments.length)throw new TypeError("Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.");if("function"!=typeof e)throw new TypeError("Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.");V.connect(this,e)}return e.prototype.observe=function(e,t){if(0===arguments.length)throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.");if(!v(e))throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element");V.observe(this,e,t)},e.prototype.unobserve=function(e){if(0===arguments.length)throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.");if(!v(e))throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element");V.unobserve(this,e)},e.prototype.disconnect=function(){V.disconnect(this)},e.toString=function(){return"function ResizeObserver () { [polyfill code] }"},e}();function q(r){const i=t(0),o=t(0),s=t(0),a=t(0),c=()=>{const{value:e}=r;if(!e)return;const t=e.getBoundingClientRect();i.value=t.width,o.value=t.height,s.value=e.clientWidth,a.value=e.clientHeight};c();const{addCleanup:u,cleanup:h}=e();return n(r,(e=>{h(),e&&u(function(e,t){const n=new H((e=>{e.forEach((e=>t(e)))}));return n.observe(e),()=>n.unobserve(e)}(e,(()=>{requestAnimationFrame(c)})))}),{immediate:!0}),{borderBoxHeight:o,borderBoxWidth:i,contentBoxHeight:a,contentBoxWidth:s}}export{q as u};
