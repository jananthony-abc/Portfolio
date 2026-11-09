/* Shared project discovery, accessible shortcuts and visitor preferences. */
(()=>{
 const projects=[
  ['social-ai-details','ai','Social comments → Smart DMs','Comments · AI replies · Private follow-up','#2162ed','social'],
  ['voice-ai-details','ai','Voice AI appointment calls','Contact tag · AI call · Booking actions','#008555','voice'],
  ['workflow-details','appointments','Booking source & reminders','AI booking · Source tracking · Shared reminders','#926e00','source'],
  ['lifecycle-details','appointments','Demo lifecycle & follow-up','Booking · Attendance · Pipeline updates','#926e00','demo'],
  ['discovery-email-details','email','Discovery email & engagement','Email · Interest signals · Contact status','#181b20','discovery'],
  ['payments-details','payments','Payments & subscriptions','Purchase · Billing state · CRM updates','#d52f3b','payments'],
  ['aura-details','websites','Aura Assistant website','Website revamp · Clearer services · Demo journey','#d52f3b','aura'],
  ['namaos-details','websites','NAMAOS website','HTML reference · Expanded content · Service website','#181b20','namaos'],
  ['portfolio-details','websites','This portfolio','Scroll journey · Project library · Visual breakdowns','#2162ed','portfolio']
 ];
 const gallery=document.body.classList.contains('gallery-studio');
 const icon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>';
 const finder=document.createElement('dialog');finder.className='pf-dialog';finder.setAttribute('aria-labelledby','pf-title');
 finder.innerHTML='<div class="pf-heading"><div><span class="pf-eyebrow">THE PROJECT INDEX</span><h2 id="pf-title">Find the work behind the idea.</h2></div><button class="pf-close" aria-label="Close project finder">×</button></div><label class="pf-search">'+icon+'<input type="search" placeholder="Try reminders, email or a website" aria-label="Find a project" autocomplete="off"></label><p class="pf-count" role="status" aria-live="polite"></p><div class="pf-results"></div><div class="pf-help"><span>Real projects. Open any breakdown.</span><span>↑ ↓ to move · Esc to close</span></div>';
 document.body.append(finder);
 const input=finder.querySelector('input'),results=finder.querySelector('.pf-results');let finderOpener;
 function render(){
  const terms=input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const matches=projects.filter(p=>terms.every(q=>p.join(' ').toLowerCase().includes(q)));
  results.replaceChildren();
  matches.forEach(p=>{const a=document.createElement('a');a.href='gallery.html?project='+p[0]+'#'+p[1];a.className='pf-result';a.style.setProperty('--pf-color',p[4]);a.innerHTML='<span class="pf-signal" aria-hidden="true"></span><span><strong>'+p[2]+'</strong><small>'+p[3]+'</small></span><span class="pf-arrow" aria-hidden="true">↗</span>';results.append(a);});
  finder.querySelector('.pf-count').textContent=matches.length?matches.length+' project'+(matches.length===1?'':'s')+' to explore':'No match yet. Try “booking”, “email” or “website”.';
 }
 function openFinder(trigger){if(document.querySelector('dialog[open]')||document.body.classList.contains('nav-open'))return;finderOpener=trigger;input.value='';render();finder.showModal();input.focus();}
 function addFinder(parent,cls=''){if(!parent)return;const b=document.createElement('button');b.className='pf-trigger '+cls;b.type='button';b.setAttribute('aria-label','Find a project');b.setAttribute('aria-haspopup','dialog');b.innerHTML=icon+'<span>Find a project</span><kbd>⌘ / Ctrl K</kbd>';b.addEventListener('click',()=>openFinder(b));parent.append(b);}
 addFinder(gallery?document.querySelector('.g-topbar'):document.querySelector('.canvas-nav-links'));
 if(!gallery)addFinder(document.body,'pf-mobile-trigger');
 finder.querySelector('.pf-close').addEventListener('click',()=>finder.close());
 finder.addEventListener('click',e=>{if(e.target===finder)finder.close();});
 finder.addEventListener('close',()=>finderOpener?.focus({preventScroll:true}));input.addEventListener('input',render);
 finder.addEventListener('keydown',e=>{if(!['ArrowDown','ArrowUp'].includes(e.key))return;e.preventDefault();const links=[...results.querySelectorAll('a')];if(!links.length)return;const i=links.indexOf(document.activeElement);links[(i+(e.key==='ArrowDown'?1:-1)+links.length)%links.length].focus();});
 document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(finder.open)finder.close();else openFinder(document.activeElement);}});
 // Keep the Gallery's category choices in reach without opening a mobile drawer.
 if(gallery){
  const rail=document.createElement('nav');rail.className='pf-filters';rail.setAttribute('aria-label','Workflow categories');
  [['workflows','All systems','#2162ed'],['ai','Conversations','#2162ed'],['appointments','Appointments','#926e00'],['email','Email','#181b20'],['payments','Billing','#d52f3b']].forEach(([route,label,color])=>{const a=document.createElement('a');a.href='#'+route;a.dataset.route=route;a.style.setProperty('--pf-color',color);a.innerHTML='<i aria-hidden="true"></i>'+label;rail.append(a);});
  document.querySelector('#view-workflows .g-tools').before(rail);
  function mark(){const route=location.hash.slice(1)||'workflows';rail.querySelectorAll('a').forEach(a=>{if(a.dataset.route===route)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});}mark();addEventListener('hashchange',mark);
  const requested=new URLSearchParams(location.search).get('project');
  const project=projects.find(p=>p[0]===requested);
  if(project){if(location.hash!=='#'+project[1])location.hash=project[1];requestAnimationFrame(()=>requestAnimationFrame(()=>document.querySelector('.project-toggle[aria-controls="'+project[0]+'"]')?.click()));}
 }
 const dialog=document.querySelector('#breakdown-dialog');
 const share=document.createElement('button');share.type='button';share.className='pf-share';share.textContent='Copy project link';dialog.querySelector('.dialog-heading').insertBefore(share,dialog.querySelector('.dialog-x'));
 async function copy(value,button,label){try{await navigator.clipboard.writeText(value);button.textContent='Copied ✓';}catch{button.textContent='Copy unavailable';}setTimeout(()=>button.textContent=label,2000);}
 share.addEventListener('click',()=>{const panel=dialog.querySelector('.project-panel'),p=projects.find(p=>p[0]===panel?.id);if(!p)return;const url=new URL('gallery.html',location.href);url.searchParams.set('project',p[0]);url.hash=p[1];copy(url.href,share,'Copy project link');});
 dialog.addEventListener('close',()=>{if(gallery&&new URLSearchParams(location.search).has('project')){const u=new URL(location.href);u.searchParams.delete('project');history.replaceState(null,'',u);}});
 // Pause only ambient decoration; the visitor can still use the scroll journey.
 let paused=false;try{paused=localStorage.getItem('portfolio-background-paused')==='true';}catch{}
 const motion=document.createElement('button');motion.type='button';motion.className='pf-motion';
 function sync(){document.documentElement.classList.toggle('pf-background-paused',paused);motion.textContent=paused?'▶ Resume background':'Ⅱ Pause background';motion.setAttribute('aria-pressed',String(paused));dispatchEvent(new Event('portfolio:motion'));}
 motion.addEventListener('click',()=>{paused=!paused;try{localStorage.setItem('portfolio-background-paused',String(paused));}catch{}sync();});
 document.querySelector(gallery?'.g-sidebar-bottom':'.h-sidebar-bottom')?.append(motion);sync();
 if(!gallery){const email=document.querySelector('.canvas-email');if(email){const b=document.createElement('button');b.className='pf-copy-email';b.type='button';b.textContent='Copy email';b.addEventListener('click',()=>copy('corralanthonyjan@gmail.com',b,'Copy email'));email.after(b);}}
})();
