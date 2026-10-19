(()=>{
 const page=document.body,sidebar=document.querySelector('.g-sidebar'),shell=document.querySelector('.g-shell');
 const menu=document.querySelector('.g-menu'),closeMenu=document.querySelector('.g-close-nav'),shade=document.querySelector('.g-shade');
 const categoryToggle=document.querySelector('.g-category-toggle'),categories=document.querySelector('.g-subnav');
 const search=document.querySelector('#project-search'),clearSearch=document.querySelector('.g-clear-search'),count=document.querySelector('#workflow-count');
 const cards=[...document.querySelectorAll('#workflow-grid .g-card')],views=[...document.querySelectorAll('.g-view')];
 const narrow=matchMedia('(max-width:800px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const routes={
  workflows:{view:'workflows',name:'Workflows',tone:'blue',kicker:'Workflow library',title:'Connected systems.',accent:'Purposeful work.',intro:'Explore the systems I’ve built in GoHighLevel—from the first conversation to the work happening behind it.'},
  ai:{view:'workflows',name:'AI & conversations',tone:'blue',kicker:'AI & conversations',title:'Start a conversation.',accent:'Keep it connected.',intro:'Social replies, private messages and outbound calls—connected to knowledge, routing and appointment actions.'},
  appointments:{view:'workflows',name:'Appointments & follow-up',tone:'yellow',kicker:'Appointments & follow-up',title:'Every appointment.',accent:'A clear next step.',intro:'From the source of a booking to reminders, attendance and recovery, each step carries context forward.'},
  email:{view:'workflows',name:'Email & lead nurturing',tone:'black',kicker:'Email & lead nurturing',title:'Follow the signal.',accent:'Understand the interest.',intro:'Discovery outreach and engagement tracking, connected through custom contact fields and event-driven workflows.'},
  payments:{view:'workflows',name:'Payments & subscriptions',tone:'red',kicker:'Payments & subscriptions',title:'Behind the purchase.',accent:'A connected system.',intro:'Purchase processing, subscription states and CRM opportunity records, connected through conditions, tags and notifications.'},
  websites:{view:'websites',name:'Websites',tone:'blue'},
  experience:{view:'experience',name:'Experience',tone:'blue'},
  stack:{view:'stack',name:'Stack',tone:'black'},
  certifications:{view:'certifications',name:'Certifications',tone:'black'}
 };
 let current='workflows';
 const selected=()=>routes[location.hash.slice(1)]?location.hash.slice(1):'workflows';
 function expandCategories(open){categories.hidden=!open;categoryToggle.setAttribute('aria-expanded',String(open));}
 function setMenu(open,returnFocus=true){
  open=open&&narrow.matches;sidebar.classList.toggle('is-open',open);page.classList.toggle('nav-open',open);shade.hidden=!open;shell.inert=open;menu.setAttribute('aria-expanded',String(open));
  if(open){sidebar.setAttribute('role','dialog');sidebar.setAttribute('aria-modal','true');closeMenu.focus();}
  else{sidebar.removeAttribute('role');sidebar.removeAttribute('aria-modal');if(returnFocus)menu.focus({preventScroll:true});}
 }
 menu.addEventListener('click',()=>setMenu(!sidebar.classList.contains('is-open')));
 closeMenu.addEventListener('click',()=>setMenu(false));shade.addEventListener('click',()=>setMenu(false));
 narrow.addEventListener('change',()=>setMenu(false,false));
 sidebar.addEventListener('keydown',event=>{
  if(!narrow.matches||!sidebar.classList.contains('is-open'))return;
  if(event.key==='Escape'){event.preventDefault();setMenu(false);return;}
  if(event.key==='Tab'){
   const targets=[...sidebar.querySelectorAll('a,button')].filter(el=>el.getClientRects().length),first=targets[0],last=targets.at(-1);
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
 });
 categoryToggle.addEventListener('click',()=>expandCategories(categories.hidden));
 function filter(){
  const query=search.value.trim().toLocaleLowerCase();let total=0;
  for(const card of cards){card.hidden=!(current==='workflows'||card.dataset.kind===current)||!card.textContent.toLocaleLowerCase().includes(query);if(!card.hidden)total++;}
  count.textContent=total+' workflow project'+(total===1?'':'s');clearSearch.hidden=!search.value;document.querySelector('.g-search-empty').hidden=total>0;
 }
 function render(reset=true){
  current=selected();const route=routes[current],mobileWasOpen=sidebar.classList.contains('is-open');
  if(reset)search.value='';
  views.forEach(view=>{const visible=view.id==='view-'+route.view;view.hidden=!visible;view.classList.remove('is-entering');if(visible&&!reduced.matches){void view.offsetWidth;view.classList.add('is-entering');}});
  page.dataset.tone=route.tone;document.querySelector('#g-breadcrumb-current').textContent=route.name;document.title=route.name+' · Work Library — Jan Anthony Corral';
  document.querySelectorAll('[data-route]').forEach(link=>{if(link.dataset.route===current)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
  document.querySelector('.g-parent').classList.toggle('is-active',route.view==='workflows');
  if(route.view==='workflows'){
   expandCategories(true);document.querySelector('#workflow-kicker').textContent=route.kicker;
   const title=document.querySelector('#workflow-heading');title.replaceChildren(document.createTextNode(route.title),document.createElement('br'));
   const accent=document.createElement('em');accent.textContent=route.accent;title.append(accent);document.querySelector('#workflow-intro').textContent=route.intro;
  }
  if(route.view!=='workflows')expandCategories(false);
  filter();if(mobileWasOpen)setMenu(false,false);
  if(reset){scrollTo({top:0,behavior:'instant'});if(mobileWasOpen)document.querySelector('#view-'+route.view+' h1').focus({preventScroll:true});}
  syncVideos();
 }
 document.querySelectorAll('a[href^="#"]').forEach(link=>{
  if(!routes[link.hash.slice(1)])return;
  link.addEventListener('click',event=>{if(location.hash===link.hash){event.preventDefault();render();}});
 });
 document.querySelector('.g-skip').addEventListener('click',event=>{event.preventDefault();document.querySelector('#view-'+routes[current].view+' h1').focus();});
 addEventListener('hashchange',()=>render());search.addEventListener('input',filter);
 const resetSearch=()=>{search.value='';filter();search.focus();};clearSearch.addEventListener('click',resetSearch);document.querySelector('#reset-search').addEventListener('click',resetSearch);
 document.querySelectorAll('.g-image-preview').forEach(button=>button.addEventListener('click',()=>openImage(button.dataset.image,button.querySelector('img').alt,button)));
 document.querySelectorAll('#aura-details,#namaos-details').forEach(panel=>{
  const kicker=panel.querySelector('.board-kicker'),help=panel.querySelector('.board-intro p');
  if(kicker)kicker.textContent='WEBSITE PROJECT';if(help)help.textContent='Watch the website preview, then explore the live experience.';
 });
 const videos=[...document.querySelectorAll('video')],visibleVideos=new Set();
 function syncVideos(){
  for(const video of videos){
   const modal=document.querySelector('#breakdown-dialog').open,insideModal=!!video.closest('#breakdown-dialog');
   if(!reduced.matches&&!document.hidden&&visibleVideos.has(video)&&(!modal||insideModal))video.play().catch(()=>{});else video.pause();
  }
 }
 const videoObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting&&entry.intersectionRatio>=.4)visibleVideos.add(entry.target);else visibleVideos.delete(entry.target);}syncVideos();},{threshold:[0,.4]});
 videos.forEach(video=>videoObserver.observe(video));document.addEventListener('visibilitychange',syncVideos);reduced.addEventListener('change',syncVideos);
 document.querySelector('#breakdown-dialog').addEventListener('close',syncVideos);
 new MutationObserver(syncVideos).observe(document.querySelector('#breakdown-dialog'),{attributes:true,attributeFilter:['open']});
 render(false);
})();
