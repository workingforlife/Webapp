/* Token estimate, v2. A single "characters per token" rule fails for code, JSON and non-Latin scripts, so this adds up a rough
   token count for each kind of text. The numbers in EST_K are starting values: re-fit them with scripts/make-calibration.mjs
   whenever you have exact tokenizer counts. estParts() returns {mid, lo, hi, kind}; est() returns the middle figure. */
const EST_K={
 word:[.85,1,1.3],   // Latin word: 1 token up to 8 letters, then +1 per 4 letters; [low, middle, high] multipliers
 num:[.9,1,1.15],    // digit runs: 1 token per 3 digits
 brk:[.9,1,1.1],     // line breaks and indentation runs: 1 token each
 sym:[.75,1,1.3],    // punctuation runs: SYMW tokens per character, at least 1
 indic:[.6,.95,1.5],   // tokens per character for Devanagari, Bengali, Tamil and other Indic scripts
 cjk:[.7,.93,1.25],  // Chinese, Japanese, Korean
 cyr:[.3,.4,.58],    // Cyrillic and Greek
 arab:[.4,.62,1],  // Arabic and Hebrew
 thai:[.4,.6,1],
 symw:.4,           // tokens per punctuation character
 emoji:[2,2,3],
 other:[.4,.7,1.2]};
function estParts(t){
 if(!t||!t.trim())return{mid:0,lo:0,hi:0,kind:'prose'};
 const r=/([A-Za-zÀ-ɏḀ-ỿ]+)|(\d+)|(\s*\n\s*|[ \t]{2,})|([ \t])|([!-\/:-@\[-`{-~]+)|([\s\S])/gu,S=[0,0,0];let m,nl=0,sy=0,tot=0;
 const add=(b,k)=>{S[0]+=b*k[0];S[1]+=b*k[1];S[2]+=b*k[2]};
 while(m=r.exec(t)){
  const s=m[0];
  if(m[1]){add(s.length<=8?1:1+Math.ceil((s.length-8)/4),EST_K.word);tot+=s.length}
  else if(m[2]){add(Math.ceil(s.length/3),EST_K.num);tot+=s.length}
  else if(m[3])add(1,EST_K.brk);
  else if(m[4]){}
  else if(m[5]){add(Math.max(1,Math.round(s.length*EST_K.symw)),EST_K.sym);sy+=s.length;tot+=s.length}
  else{
   const c=s.codePointAt(0);tot++;
   const k=c>=0x900&&c<=0xDFF?EST_K.indic:c>=0xE00&&c<=0xE7F?EST_K.thai:(c>=0x3040&&c<=0x30FF)||(c>=0x3400&&c<=0x4DBF)||(c>=0x4E00&&c<=0x9FFF)||(c>=0xAC00&&c<=0xD7AF)||(c>=0xF900&&c<=0xFAFF)?EST_K.cjk:(c>=0x370&&c<=0x52F)?EST_K.cyr:(c>=0x590&&c<=0x6FF)||(c>=0x750&&c<=0x77F)?EST_K.arab:c>=0x1F000||(c>=0x2600&&c<=0x27BF)?EST_K.emoji:EST_K.other;
   add(1,k);if(k!==EST_K.emoji&&k!==EST_K.other)nl++}
 }
 return{mid:Math.ceil(S[1]),lo:Math.floor(S[0]),hi:Math.ceil(S[2]),kind:nl/Math.max(1,tot)>.2?'nonlatin':sy/Math.max(1,tot)>.2?'symbols':'prose'};
}
const est=t=>estParts(t).mid;
