(function(){var C=window.TOOLX||{},d=document;function $(i){return d.getElementById(i)}
function say(m){var n=d.querySelector('.tp .tn');if(n){n.textContent=m;clearTimeout(say.t);say.t=setTimeout(function(){n.textContent=''},4000)}}
function fire(el){['input','change'].forEach(function(e){el.dispatchEvent(new Event(e,{bubbles:true}))})}
function setv(o){Object.keys(o).forEach(function(k){var e=$(k);if(e){e.value=o[k];fire(e)}})}
var ex=d.querySelector('[data-ex]');if(ex&&C.sample)ex.addEventListener('click',function(){setv(C.sample);say('Example loaded.')});
function b64(s){return btoa(unescape(encodeURIComponent(s))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function unb64(s){s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';return decodeURIComponent(escape(atob(s)))}
var sl=d.querySelector('[data-sl]');
if(sl&&C.share)sl.addEventListener('click',function(){var o={},any=false;C.share.forEach(function(k){var e=$(k);if(e&&e.value){o[k]=e.value;any=true}});
 if(!any){say('Add some text first.');return}
 var h=b64(JSON.stringify(o));if(h.length>3000){say('Too long for a link. Use a shorter sample.');return}
 var u=location.href.split('#')[0]+'#in='+h;
 (navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(function(){say('Link copied. It holds your text inside the link itself; our servers never see it.')}).catch(function(){prompt('Copy this link',u)})});
var m=/^#in=([\w-]+)$/.exec(location.hash);if(m&&C.share){try{var o=JSON.parse(unb64(m[1]));var ok={};C.share.forEach(function(k){if(typeof o[k]==='string')ok[k]=o[k]});setv(ok);say('Loaded from the link.')}catch(e){}}
var last=null;d.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button');if(b&&/^\s*(copy|share)/i.test(b.textContent)&&!b.hasAttribute('data-sl'))last=b},true);
if(navigator.clipboard&&navigator.clipboard.writeText){var w=navigator.clipboard.writeText.bind(navigator.clipboard);try{navigator.clipboard.writeText=function(t){var b=last;last=null;var p=w(t);if(b&&p&&p.then)p.then(function(){if(b.dataset.f)return;b.dataset.f=b.textContent;b.textContent='Copied ✓';setTimeout(function(){b.textContent=b.dataset.f;delete b.dataset.f},1600)},function(){});return p}}catch(e){}}
})();
