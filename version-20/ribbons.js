(() => {
 function enhance(){document.querySelectorAll('.mjFilterGroup:not([data-ribbon])').forEach(old=>{
  const group=document.createElement('section');group.className=old.className;group.dataset.ribbon='true';
  const title=document.createElement('div');title.className='mjRibbonTitle';
  const heading=old.querySelector('h3');if(heading)title.appendChild(heading);
  const track=document.createElement('div');track.className='mjRibbonTrack';track.setAttribute('role','group');track.setAttribute('aria-label',heading?.textContent||'الفلاتر');
  [...old.children].filter(n=>n.tagName!=='SUMMARY').forEach(n=>track.appendChild(n));
  group.append(title,track);old.replaceWith(group);
 });}
 new MutationObserver(enhance).observe(document.getElementById('main'),{childList:true,subtree:true});enhance();
})();
