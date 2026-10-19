(()=>{
 const runway=document.querySelector('.canvas-runway'),stage=document.querySelector('.canvas-stage'),track=document.querySelector('.canvas-track'),slides=[...document.querySelectorAll('.canvas-slide')],contact=document.querySelector('.canvas-contact');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),short=matchMedia('(max-height: 620px)');
 let width=0,height=0,start=0,step=0,enabled=false,queued=false;
 const intro=document.querySelector('.canvas-work-intro'),introDistance=intro?190:0;
 const nav=document.querySelector('.canvas-nav');
 // Website breakdowns use the existing visual boards with website-specific guidance.
 document.querySelectorAll('#aura-details,#namaos-details').forEach(panel=>{
  const kicker=panel.querySelector('.board-kicker'),help=panel.querySelector('.board-intro p');
  if(kicker)kicker.textContent='WEBSITE PROJECT';
  if(help)help.textContent='Watch the website preview, then explore the live experience.';
 });
 const atmosphere=document.querySelector('.canvas-atmosphere'),themes=slides.map(slide=>slide.id.replace('work-',''));
 const workflowCount=slides.filter(slide=>!slide.classList.contains('canvas-website')).length;
 const columns=slides.length-1;
 track.style.setProperty('--canvas-columns',columns);
 slides.forEach((slide,i)=>slide.style.setProperty('--column',i<workflowCount?i:i-1));

 // The drawer is available throughout the journey, even while the top bar is hidden.
 const drawer=document.querySelector('.home-drawer'),menuToggle=document.querySelector('.home-menu-toggle');
 const categoryToggle=drawer.querySelector('.h-category-toggle'),categories=drawer.querySelector('.h-subnav');
 let drawerAfterClose=null,drawerTimer;
 function closeDrawer(after){
  if(!drawer.open){after?.();return;}
  if(drawer.classList.contains('is-closing'))return;
  drawerAfterClose=after;
  if(reduced.matches){drawer.close();return;}
  drawer.classList.add('is-closing');drawerTimer=setTimeout(()=>drawer.close(),180);
 }
 menuToggle.addEventListener('click',()=>{
  categories.hidden=true;categoryToggle.setAttribute('aria-expanded','false');
  drawer.showModal();document.body.classList.add('home-menu-open');menuToggle.setAttribute('aria-expanded','true');
  drawer.querySelector('.h-close').focus();
 });
 drawer.querySelector('.h-close').addEventListener('click',()=>closeDrawer());
 drawer.addEventListener('cancel',event=>{event.preventDefault();closeDrawer();});
 drawer.addEventListener('close',()=>{
  clearTimeout(drawerTimer);drawer.classList.remove('is-closing');document.body.classList.remove('home-menu-open');menuToggle.setAttribute('aria-expanded','false');
  menuToggle.focus({preventScroll:true});const after=drawerAfterClose;drawerAfterClose=null;after?.();
 });
 drawer.addEventListener('click',event=>{if(event.target===drawer){const r=drawer.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDrawer();}});
 categoryToggle.addEventListener('click',()=>{categories.hidden=!categories.hidden;categoryToggle.setAttribute('aria-expanded',String(!categories.hidden));});

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

 // The page follows a continuous right / down / right / down path.
 function route(){
  const points=slides.map((slide,i)=>i<workflowCount?{at:i*step,x:i*width,y:0}:{at:(i-1)*step+height,x:(i-1)*width,y:height});
  const last=points.at(-1);points.push({at:last.at+height,x:last.x,y:2*height});return points;
 }
 function position(){
  const raw=scrollY-start,travel=Math.max(0,raw-introDistance),points=route();
  let n=0;while(n<points.length-2&&travel>points[n+1].at)n++;
  const a=points[n],b=points[n+1],fraction=Math.max(0,Math.min(1,(travel-a.at)/Math.max(1,b.at-a.at)));
  return {raw,x:a.x+(b.x-a.x)*fraction,y:a.y+(b.y-a.y)*fraction,index:fraction<.5?n:n+1};
 }
 function updateAtmosphere(){
  if(!atmosphere)return;
  const {raw,x:travelX,y:travelY,index}=position();
  let theme='neutral';
  if(enabled){if(raw>=introDistance-40&&index<slides.length)theme=themes[index];}
  else {const middle=innerHeight*.5;const visible=slides.find(s=>{const r=s.getBoundingClientRect();return r.top<=middle&&r.bottom>middle});if(visible)theme=themes[slides.indexOf(visible)];}
  if(atmosphere.dataset.theme!==theme)atmosphere.dataset.theme=theme;
  stage.dataset.theme=theme;
  document.querySelector('.canvas-work-caption').textContent=['aura','namaos'].includes(theme)?'Websites, built to connect.':'Connected systems, in action.';
  if(reduced.matches)return;
  const x=enabled?travelX:0;
  const y=enabled?Math.min(scrollY,start)+travelY:scrollY;
  atmosphere.style.setProperty('--grid-x',(-x*.12%768)+'px');
  atmosphere.style.setProperty('--grid-y',(-y*.09%768)+'px');
  iconParallaxX=-Math.sin(x/Math.max(width,1)*Math.PI)*17;
  iconParallaxY=-Math.sin(y/Math.max(height,1))*22;
 }

 function updateNavigation(){
  const pos=position(),contactEntering=enabled?pos.raw-introDistance>=route().at(-1).at-height*.24:contact.getBoundingClientRect().top<=nav.offsetHeight;
  const inWork=enabled?pos.raw>=introDistance-60:slides[0].getBoundingClientRect().top<=nav.offsetHeight;
  const hide=inWork&&!contactEntering;
  nav.classList.toggle('is-away',hide);nav.inert=hide;
  const section=contactEntering?'contact':inWork?'work':'top';
  drawer.querySelectorAll('[data-home-section]').forEach(link=>{if(link.dataset.homeSection===section)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
 }
 function update(){
  queued=false;updateAtmosphere();updateNavigation();if(!enabled)return;
  const {raw,x,y,index:i}=position();
  const enter=Math.max(0,Math.min(1,raw/35)),dissolve=Math.max(0,Math.min(1,(raw-75)/100));
  const reveal=intro?Math.max(0,Math.min(1,(raw-125)/65)):1;
  if(intro){intro.style.opacity=enter*(1-dissolve);intro.style.filter=`blur(${dissolve*12}px)`;intro.style.transform=`translateY(${-dissolve*24}px) scale(${1+dissolve*.035})`;
  intro.style.visibility=raw>=0&&raw<175?'visible':'hidden';}
  track.style.opacity=reveal;stage.classList.toggle('is-intro',raw<introDistance);
  track.style.transform=`translate3d(${-x}px,${-y}px,0)`;
  stage.classList.toggle('is-contact',y>height*1.2);
  slides.forEach((slide,n)=>{slide.inert=n!==i||reveal<1});contact.inert=i!==slides.length;
 }
 function measure(){
  enabled=!reduced.matches&&!short.matches;document.body.classList.toggle('canvas-enhanced',enabled);
  width=document.documentElement.clientWidth;height=stage.clientHeight;step=width*.65;
  start=runway.getBoundingClientRect().top+scrollY;
  runway.style.height=enabled?(height+introDistance+route().at(-1).at)+'px':'';
  if(!enabled){track.style.transform='';track.style.opacity='';intro?.removeAttribute('style');slides.forEach(s=>s.inert=false);contact.inert=false;stage.classList.remove('is-contact','is-intro');}
  update();
 }
 function move(i,showIntro=false,instant=false){
  if(enabled)scrollTo({top:start+(showIntro?55:introDistance+route()[i].at),behavior:reduced.matches||instant?'instant':'smooth'});
  else(showIntro?intro:i===slides.length?contact:slides[i]).scrollIntoView({behavior:reduced.matches||instant?'instant':'smooth',block:'start'});
 }
 const destinations={...Object.fromEntries(slides.map((slide,i)=>['#'+slide.id,i])),'#work':0,'#contact':slides.length};
 document.querySelectorAll('a[href^="#"]').forEach(a=>{
  if(!(a.hash in destinations)&&a.hash!=='#top')return;
  a.addEventListener('click',e=>{
   e.preventDefault();const navigate=()=>{if(a.hash==='#top')scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});else move(destinations[a.hash],a.hash==='#work');};
   if(drawer.contains(a))closeDrawer(navigate);else navigate();
  });
 });
 addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update)}},{passive:true});addEventListener('resize',measure);reduced.addEventListener('change',measure);short.addEventListener('change',measure);measure();document.fonts.ready.then(measure);
 // Resolve deep links after browser anchor positioning and font layout have settled.
 const initialHash=location.hash;
 if(initialHash in destinations||initialHash==='#top')history.scrollRestoration='manual';
 let userNavigated=false;
 ['wheel','touchstart','pointerdown','keydown'].forEach(event=>addEventListener(event,()=>{userNavigated=true},{once:true,passive:true}));
 const finishInitial=()=>document.fonts.ready.then(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{measure();if(!userNavigated){if(initialHash==='#top')scrollTo({top:0,behavior:'instant'});else if(initialHash in destinations)move(destinations[initialHash],initialHash==='#work',true);}})));
 if(document.readyState==='complete')finishInitial();else addEventListener('load',finishInitial,{once:true});
})();
