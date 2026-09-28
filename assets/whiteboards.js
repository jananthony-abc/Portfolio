/* Visual maps explain relationships; editor captures remain the source evidence. */
(()=>{
const configs={
 'workflow-details':{goal:'Two booking sources. One shared reminder journey.',lanes:[
 ['Booking sources',['Website widget AI','Appointment booked','widget-agent-settings.png'],['Record widget source','Update contact field','widget-source-workflow.png'],['Shared reminders','Join the same workflow','shared-ai-reminders.png']],
 ['Parallel source',['Social DM AI','Appointment booked','social-agent-settings.png'],['Record social source','Update contact field','social-source-workflow.png'],['Shared reminders','Same destination','shared-ai-reminders.png']]],note:'Both source paths converge on the shared reminder workflow.'},
 'social-ai-details':{goal:'A comment becomes a relevant reply—and, when appropriate, a private conversation.',lanes:[
 ['Facebook + Instagram',['New post comment','Platform trigger','social-facebook-workflow.png'],['AI + knowledge base','Analyze context','social-smart-dm-agent.png'],['Reply decision','If should_reply is true','social-instagram-workflow.png'],['Public reply','Respond on the comment']],
 ['Conditional continuation',['DM decision','If should_dm is true'],['Private conversation','Continue in messages'],['Agent actions','Booking or human handover','social-smart-dm-agent.png']]],note:'An unmatched reply or DM condition ends that path. Moving to messages is conditional.'},
 'voice-ai-details':{goal:'A contact tag starts an outbound call handled by the configured AI agent.',lanes:[
 ['Call journey',['Contact tag','Workflow trigger','voice-outbound-workflow.png'],['Outbound call','Voice AI action','voice-outbound-workflow.png'],['AI conversation','Instructions + knowledge','voice-outbound-agent.png'],['Booking action','Available during the call','voice-outbound-agent.png']]],note:'Booking is an available action, not a guaranteed result. The shown workflow does not include after-call automation.',feature:['Deployment','voice-deployment-private.png','Deployment capture with the phone number obscured.','private']},
 'discovery-email-details':{goal:'Send discovery outreach. Track engagement. Identify contacts for follow-up.',lanes:[
 ['Start',['Manual enrollment','Selected contacts'],['Drip + initial email','Send discovery message','discovery-initial.png'],['Campaign field','Record contact status']],
 ['Click signal',['Trigger link clicked','Engagement detected','discovery-clicked.png'],['Status condition','Check existing campaign state'],['Field update','On the unmatched branch']],
 ['Reply signal',['Customer replied','Reply received','discovery-replied.png'],['Already demo booked?','Yes → end this path'],['Otherwise update','Record reply status']],
 ['Booking signal',['Appointment booked','Booking event','discovery-booked.png'],['Wait + condition','Check campaign state'],['Matching branch','Update contact field']]],note:'Clicks, replies and bookings are separate event paths. The broader nurture email sequence is not shown in these captures.'},
 'lifecycle-details':{goal:'Track the demo journey from booking interest to attendance and recovery.',lanes:[
 ['Nurture',['Five nurture emails','Tracked booking links','aura-lifecycle-nurture.png'],['Booking interest','Contact + pipeline updates'],['Booking check','Follow up if pending']],
 ['Booked',['Appointment booked','Mark booked; clear pending','aura-lifecycle-confirmed.png'],['Update opportunity','Update, reactivate or create'],['Confirm + remind','Email and team notifications']],
 ['Attended',['Demo showed','Record attendance','aura-lifecycle-showed.png'],['Pipeline update','Move to follow-up'],['Post-demo follow-up','Notify team + email']],
 ['Recovery',['No-show / cancellation','Separate recovery paths','aura-lifecycle-no-show.png'],['Recovery emails','Check for rebooking','aura-lifecycle-cancelled.png'],['Rebook or close','Clear state or abandon']]],note:'Rescheduled appointments exit the cancellation path. Won is a pipeline stage; an automatic move to Won is not shown.',feature:['Aura Demo Conversion pipeline','demo-pipeline-example.png','Illustrative stage distribution with sample contacts—not live outcomes.']},
 'payments-details':{goal:'Connect purchases, billing status and CRM opportunity records.',lanes:[
 ['Purchase',['Order submitted','Five plan-specific checks','purchase-frontdesk-annual.png'],['Processed-tag check','Already processed → end'],['New purchase','Tag → email → notify']],
 ['Subscription',['Subscription event','Three product triggers','subscription-lifecycle-full.png'],['Billing-state routing','Active or non-active states'],['Update tags','Non-active: email + notify']],
 ['Pipeline',['Status-tag trigger','Six status categories','subscription-pipeline-full.png'],['Find opportunity','Look for existing record'],['Found / missing','Update / create opportunity']]],note:'Subscription workflows update tags; pipeline workflows respond to those tags.'},
 'aura-details':{goal:'A clearer website for an AI receptionist service.',lanes:[['Website revamp',['Existing website','Review structure + messaging'],['Revamp','AI-assisted coding'],['Service presentation','Clearer visuals and content'],['Live website','Explore the finished experience']]],site:'https://auraassistant.com/'},
 'namaos-details':{goal:'Turn a short HTML reference into a complete service website.',lanes:[['Website build',['Supplied reference','Theme, logo + key points'],['Page structure','Expand the service story'],['Supporting visuals','Build with AI-assisted coding'],['Live website','Explore the finished experience']]],site:'https://www.namaos.com'}
};
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e};
for(const [id,c] of Object.entries(configs)){
 const panel=document.getElementById(id);if(!panel)continue;
 const details=el('details','board-evidence');details.append(el('summary','','Open editor captures & detailed notes'));
 while(panel.firstChild)details.append(panel.firstChild);
 const board=el('section','visual-board');board.setAttribute('aria-label','Visual project breakdown');
 const intro=el('div','board-intro');intro.append(el('span','board-kicker','AT A GLANCE'),el('h3','',c.goal),el('p','','Follow the arrows. Select a capture to inspect the actual editor.'));board.append(intro);
 for(const [label,...nodes] of c.lanes){
  const lane=el('div','board-lane');lane.append(el('h4','',label));const flow=el('ol','board-flow');
  nodes.forEach((n,i)=>{const node=el('li','board-node');node.append(el('span','node-order',String(i+1).padStart(2,'0')),el('h5','',n[0]),el('p','',n[1]));
   if(n[2]){const a=el('a','flow-image board-capture');a.href='assets/'+n[2];const img=el('img');img.setAttribute('data-src',a.href);img.alt=n[0]+' — GHL capture';img.loading='lazy';a.append(img,el('span','','Inspect editor ↗'));node.append(a)}
   flow.append(node);
  });lane.append(flow);board.append(lane);
 }
 if(c.note)board.append(el('p','board-note',c.note));
 if(c.feature){const [title,file,caption,kind]=c.feature;const f=el('figure','board-feature'+(kind?' '+kind:''));f.append(el('h4','',title));const a=el('a','flow-image');a.href='assets/'+file;const img=el('img');img.setAttribute('data-src',a.href);img.alt=caption;img.loading='lazy';a.append(img);f.append(a,el('figcaption','',caption));board.append(f)}
 if(c.site){const a=el('a','board-site','Visit live website ↗');a.href=c.site;a.target='_blank';a.rel='noopener noreferrer';board.append(a)}
 panel.append(board,details);
}
})();
