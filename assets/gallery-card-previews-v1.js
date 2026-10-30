/* In-place previews: the card keeps its size and its primary actions. */
(()=>{
 const copy={
  'project-social':['Social comments → Smart DMs','Turn comments into AI replies, with private follow-up when someone shows interest.'],
  'project-voice':['Voice AI appointment calls','Start an AI call from a contact tag, with answers and booking actions.'],
  'project-source':['Booking source & reminders','Record which AI agent booked the demo, then send shared reminders.'],
  'project-demo':['Demo lifecycle & follow-up','Connect booking, attendance and recovery to the demo pipeline.'],
  'project-discovery':['Discovery email & engagement','Track clicks, replies and bookings so interested contacts can qualify for follow-up.'],
  'project-payments':['Payments & subscriptions','Connect purchases and billing changes to customer updates and CRM records.']
 };
 const fine=matchMedia('(hover:hover) and (pointer:fine)'),states=[];
 document.querySelectorAll('#workflow-grid .g-card').forEach(card=>{
  const content=card.querySelector('.g-card-content'),original=card.querySelector('.g-overview-button');
  if(!content||!original)return;
  const title=content.querySelector('h3'),description=content.querySelector('p'),flow=content.querySelector('.g-flow');
  const fullTitle=title.textContent;
  if(copy[card.id]){title.textContent=copy[card.id][0];description.textContent=copy[card.id][1];}
  // Keep the complete project name searchable and available to the breakdown.
  title.setAttribute('title',fullTitle);
  const searchText=document.createElement('span');searchText.className='g-preview-search';searchText.setAttribute('aria-hidden','true');searchText.textContent=fullTitle;content.append(searchText);
  const stage=document.createElement('div');stage.className='g-preview-stage';stage.id=card.id+'-preview';
  const summary=document.createElement('div');summary.className='g-preview-summary';summary.append(description,flow);
  const preview=document.createElement('button');preview.type='button';preview.className='g-preview-capture';preview.inert=true;preview.setAttribute('aria-hidden','true');preview.setAttribute('aria-label','Enlarge overview: '+fullTitle);preview.setAttribute('aria-haspopup','dialog');
  const img=document.createElement('img');img.alt=original.dataset.imageAlt;img.decoding='async';img.loading='lazy';img.src=original.dataset.image;
  const hint=document.createElement('span');hint.className='g-preview-zoom';hint.textContent='Enlarge ↗';preview.append(img,hint);stage.append(summary,preview);content.append(stage);
  // Replacing the control removes its former direct-to-modal click listener.
  const toggle=original.cloneNode(true);toggle.classList.remove('g-image-preview');toggle.removeAttribute('aria-haspopup');toggle.removeAttribute('data-image');toggle.removeAttribute('data-image-alt');toggle.setAttribute('aria-controls',stage.id);toggle.setAttribute('aria-expanded','false');original.replaceWith(toggle);
  const label=document.createElement('span');label.textContent='Preview';toggle.replaceChildren(original.querySelector('svg').cloneNode(true),label);
  let active=false,ready=false,wanted=false;
  function show(value){
   wanted=value;active=value&&ready;
   if(active)states.forEach(other=>{if(other.card!==card)other.show(false);});
   card.classList.toggle('is-previewing',active);toggle.setAttribute('aria-expanded',String(active));toggle.setAttribute('aria-label',(active?'Show summary: ':'Preview overview: ')+fullTitle);label.textContent=active?'Summary':'Preview';preview.inert=!active;preview.setAttribute('aria-hidden',String(!active));
  }
  img.addEventListener('load',()=>{ready=true;show(wanted);});
  img.addEventListener('error',()=>{wanted=false;show(false);toggle.disabled=true;label.textContent='Preview unavailable';});
  if(img.complete&&img.naturalWidth)ready=true;
  toggle.addEventListener('click',()=>show(!active));
  card.addEventListener('pointerenter',e=>{if(fine.matches&&e.pointerType!=='touch')show(true);});
  card.addEventListener('pointerleave',()=>{if(fine.matches&&!card.contains(document.activeElement))show(false);});
  toggle.addEventListener('focus',()=>{if(toggle.matches(':focus-visible'))show(true);});
  card.addEventListener('focusout',()=>queueMicrotask(()=>{if(!card.contains(document.activeElement)&&!card.matches(':hover'))show(false);}));
  card.addEventListener('keydown',e=>{if(e.key==='Escape'&&active){e.preventDefault();show(false);toggle.focus({preventScroll:true});show(false);}});
  preview.addEventListener('click',()=>openImage(img.src,img.alt,toggle));
  states.push({card,show});show(false);
 });
 addEventListener('hashchange',()=>states.forEach(s=>s.show(false)));
 document.querySelector('#project-search')?.addEventListener('input',()=>states.forEach(s=>s.show(false)));
})();
