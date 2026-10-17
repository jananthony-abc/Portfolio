(()=>{
 const runway=document.querySelector('.canvas-runway'),stage=document.querySelector('.canvas-stage'),track=document.querySelector('.canvas-track'),slides=[...document.querySelectorAll('.canvas-slide')],contact=document.querySelector('.canvas-contact');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),short=matchMedia('(max-height: 620px)');
 const names=['Social AI','Voice AI','Demo lifecycle','Payments','Discovery email'];
 let width=0,height=0,start=0,active=-1,enabled=false,queued=false;
 const nav=document.querySelector('.canvas-nav');
 const atmosphere=document.querySelector('.canvas-atmosphere'),themes=['social','voice','demo','payments','discovery'];

 // Each tile has a constant trajectory; wrapping occurs only beyond the viewport.
 let iconParallaxX=0,iconParallaxY=0,motionFrame=0,lastFrame=0,lastRead=0,copyRects=[];
 const floats=[...document.querySelectorAll('.ambient-position')].map((el,i)=>({el,x:innerWidth*[.92,.28,.58][i],y:innerHeight*[.23,.82,.18][i],vx:[24,-18,15][i],vy:[-5,-7,6][i]}));
 const copyNodes=[...document.querySelectorAll('.canvas-hero-copy > *, .canvas-about, .canvas-project-copy > *, .canvas-work-heading > div, .canvas-contact-main > *, .canvas-footer')];
 function floatFrame(now){
  const dt=lastFrame?Math.min((now-lastFrame)/1000,.05):0;lastFrame=now;
  const mobile=innerWidth<=700,speed=mobile?.58:1;
  if(now-lastRead>120){copyRects=copyNodes.map(el=>el.getBoundingClientRect()).filter(r=>r.width&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth);lastRead=now;}
  floats.forEach((f,i)=>{
   if(mobile&&i===2)return;
   f.x+=f.vx*speed*dt;f.y+=f.vy*speed*dt;
   if(f.x>innerWidth+90)f.x=-90;else if(f.x< -90)f.x=innerWidth+90;
   if(f.y>innerHeight+90)f.y=-90;else if(f.y< -90)f.y=innerHeight+90;
   const x=f.x+iconParallaxX,y=f.y+iconParallaxY,size=mobile?36:56;
   f.el.style.transform=`translate3d(${x}px,${y}px,0)`;
   f.el.classList.toggle('is-behind-copy',copyRects.some(r=>x+size>r.left-10&&x<r.right+10&&y+size>r.top-10&&y<r.bottom+10));
  });
  motionFrame=requestAnimationFrame(floatFrame);
 }
 function syncFloatMotion(){cancelAnimationFrame(motionFrame);lastFrame=0;if(!reduced.matches&&!document.hidden)motionFrame=requestAnimationFrame(floatFrame);}
 reduced.addEventListener('change',syncFloatMotion);document.addEventListener('visibilitychange',syncFloatMotion);
 addEventListener('resize',()=>{floats.forEach((f,i)=>{f.x=innerWidth*[.92,.28,.58][i];f.y=innerHeight*[.23,.82,.18][i]});lastRead=0;});
 syncFloatMotion();

 function updateAtmosphere(){
  if(!atmosphere)return;
  const d=Math.max(0,Math.min(scrollY-start,4*width+height));
  let theme='neutral';
  if(enabled){if(scrollY>=start-height*.22&&d<4*width+height*.3)theme=themes[Math.min(4,Math.round(d/width))];}
  else {const middle=innerHeight*.5;const visible=slides.find(s=>{const r=s.getBoundingClientRect();return r.top<=middle&&r.bottom>middle});if(visible)theme=themes[slides.indexOf(visible)];}
  if(atmosphere.dataset.theme!==theme)atmosphere.dataset.theme=theme;
  if(reduced.matches)return;
  const x=enabled?Math.min(d,4*width):0;
  const y=enabled?Math.min(scrollY,start)+Math.max(0,d-4*width):scrollY;
  atmosphere.style.setProperty('--grid-x',(-x*.12%768)+'px');
  atmosphere.style.setProperty('--grid-y',(-y*.09%768)+'px');
  iconParallaxX=-Math.sin(x/Math.max(width,1)*Math.PI)*17;
  iconParallaxY=-Math.sin(y/Math.max(height,1))*22;
 }

 function update(){queued=false;updateAtmosphere();if(!enabled)return;const d=Math.max(0,Math.min(scrollY-start,4*width+height));track.style.transform=`translate3d(${-Math.min(d,4*width)}px,${-Math.max(0,d-4*width)}px,0)`;const i=d>4*width+height*.45?5:Math.min(4,Math.round(d/width));stage.classList.toggle('is-contact',d>4*width+height*.2);if(i!==active){active=i;slides.forEach((s,n)=>{s.inert=n!==i});contact.inert=i!==5;document.querySelector('.canvas-current').textContent=names[Math.min(i,4)];document.querySelector('[data-direction="previous"]').disabled=i===0;document.querySelector('[data-direction="next"]').setAttribute('aria-label',i>=4?'Continue to contact':'Next workflow');}}
 function measure(){enabled=!reduced.matches&&!short.matches;document.body.classList.toggle('canvas-enhanced',enabled);width=document.documentElement.clientWidth;height=stage.clientHeight;start=runway.getBoundingClientRect().top+scrollY-nav.offsetHeight;runway.style.height=enabled?(height+4*width+height)+'px':'';if(!enabled){track.style.transform='';slides.forEach(s=>s.inert=false);contact.inert=false;stage.classList.remove('is-contact');active=-1;updateAtmosphere();}else{active=-1;update();}}
 function move(i){if(enabled)scrollTo({top:start+(i===5?4*width+height:i*width),behavior:reduced.matches?'instant':'smooth'});else(i===5?contact:slides[i]).scrollIntoView({behavior:'smooth',block:'start'});}
 document.querySelectorAll('[data-direction]').forEach(b=>b.addEventListener('click',()=>move(Math.max(0,Math.min(5,active+(b.dataset.direction==='next'?1:-1))))));
 document.querySelectorAll('a[href="#work"],a[href="#contact"],a[href="#top"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();if(a.hash==='#top')scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});else move(a.hash==='#contact'?5:0);}));
 addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update)}},{passive:true});addEventListener('resize',measure);reduced.addEventListener('change',measure);short.addEventListener('change',measure);measure();document.fonts.ready.then(measure);
 if(location.hash==='#contact')move(5);else if(location.hash==='#work')move(0);
})();
