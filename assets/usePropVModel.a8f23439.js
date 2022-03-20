import{G as t}from"./vendor.441c9f65.js";function e(e,o,r,n=(t=>t)){return t({get:()=>n(o[r]),set(t){const s=n(t);s!==o[r]&&e.emit(`update:${r}`,s)}})}export{e as u};
