import{H as b,s as h}from"./index.fa90b121.js";const t=[];function g(n,a=b){let o;const i=new Set;function r(e){if(h(n,e)&&(n=e,o)){const c=!t.length;for(const s of i)s[1](),t.push(s,n);if(c){for(let s=0;s<t.length;s+=2)t[s][0](t[s+1]);t.length=0}}}function l(e){r(e(n))}function _(e,c=b){const s=[e,c];return i.add(s),i.size===1&&(o=a(r)||b),e(n),()=>{i.delete(s),i.size===0&&o&&(o(),o=null)}}return{set:r,update:l,subscribe:_}}var f;const p=((f=globalThis.__sveltekit_kfvjz0)==null?void 0:f.base)??"/neuro-scheduler";var u;const k=((u=globalThis.__sveltekit_kfvjz0)==null?void 0:u.assets)??p;export{k as a,p as b,g as w};