let projects = [];
const grid = document.getElementById('grid');
const emptyState = document.getElementById('empty');
const workCount = document.getElementById('work-count');
const overlay = document.getElementById('overlay');
const sliderTrack = document.getElementById('sliderTrack');
const sliderDots = document.getElementById('sliderDots');
const modalTag = document.getElementById('modalTag');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalDetails = document.getElementById('modalDetails');
let currentSlide = 0;
let currentImages = [];
let touchStartX = 0;

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function placeholderSVG(){
  return '<div class="ph"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>';
}
function getImages(project) {
  const images = Array.isArray(project.gallery) ? project.gallery : (Array.isArray(project.images) ? project.images : []);
  if (images.length) return images;
  return project.image ? [project.image] : [];
}
function renderGrid(){
  workCount.textContent = projects.length + (projects.length === 1 ? ' project' : ' projects');
  if(!projects.length){ grid.style.display='none'; emptyState.style.display='block'; return; }
  grid.style.display='grid'; emptyState.style.display='none';
  grid.innerHTML = projects.map((p,i) => {
    const images = getImages(p);
    const thumb = images[0] || p.image;
    return `<article class="card" tabindex="0" role="button" data-index="${i}" aria-label="Open ${escapeHTML(p.title)}">
      <div class="card-thumb">${thumb ? `<img src="${escapeHTML(thumb)}" alt="${escapeHTML(p.title)} thumbnail" loading="lazy">` : placeholderSVG()}
      ${p.tag ? `<span class="card-tag">${escapeHTML(p.tag)}</span>` : ''}</div>
      <div class="card-body"><h3>${escapeHTML(p.title || 'Untitled project')}</h3><p>${escapeHTML(p.summary || p.description || '')}</p>
      <span class="card-more">Explore project <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span></div></article>`;
  }).join('');
  grid.querySelectorAll('.card').forEach(card => {
    const open = () => openModal(Number(card.dataset.index));
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){e.preventDefault();open();} });
  });
}
function openModal(index){
  const p = projects[index]; if(!p) return;
  currentImages = getImages(p); if(!currentImages.length) currentImages=[null]; currentSlide=0;
  modalTag.textContent = p.tag || 'Project';
  modalTitle.textContent = p.title || 'Untitled project';
  modalDesc.textContent = p.summary || p.description || '';
  sliderTrack.innerHTML = currentImages.map((src,i)=>`<div class="slide">${src ? `<img src="${escapeHTML(src)}" alt="${escapeHTML((p.galleryCaptions||[])[i] || p.title || 'Project image')}" draggable="false">` : placeholderSVG()}</div>`).join('');
  sliderDots.innerHTML = currentImages.map((_,i)=>`<button type="button" data-i="${i}" aria-label="Show image ${i+1}" class="${i===0?'active':''}"></button>`).join('');
  sliderDots.querySelectorAll('button').forEach(dot=>dot.addEventListener('click',()=>{currentSlide=Number(dot.dataset.i);updateSlide();}));
  const metrics = Array.isArray(p.metrics) ? p.metrics : [];
  const stack = Array.isArray(p.stack) ? p.stack : (Array.isArray(p.technologies) ? p.technologies : []);
  const points = Array.isArray(p.points) ? p.points : (Array.isArray(p.features) ? p.features : []);
  const links = [['Live demo',p.demo],['GitHub',p.git],['LinkedIn',p.li]].filter(item=>item[1]);
  modalDetails.innerHTML = `${metrics.length ? `<section class="project-detail-section"><h3>Results</h3><div class="project-metrics">${metrics.map(m=>`<div class="project-metric"><span>${escapeHTML(m[0])}</span><strong>${escapeHTML(m[1])}</strong></div>`).join('')}</div></section>`:''}
    ${stack.length ? `<section class="project-detail-section"><h3>Built with</h3><div class="project-stack">${stack.map(x=>`<span>${escapeHTML(x)}</span>`).join('')}</div></section>`:''}
    ${points.length ? `<section class="project-detail-section"><h3>What I did</h3><ul class="project-points">${points.map(x=>`<li>${escapeHTML(x)}</li>`).join('')}</ul></section>`:''}
    ${links.length ? `<div class="project-links">${links.map(([label,url])=>`<a class="btn btn-ghost" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)} ↗</a>`).join('')}</div>`:''}`;
  updateSlide(); overlay.classList.add('open'); document.body.style.overflow='hidden';
  document.getElementById('modalClose').focus();
}
function closeModal(){ overlay.classList.remove('open'); document.body.style.overflow=''; }
function updateSlide(){
  sliderTrack.style.transform=`translateX(-${currentSlide*100}%)`;
  sliderDots.querySelectorAll('button').forEach((d,i)=>d.classList.toggle('active',i===currentSlide));
  const multi=currentImages.length>1;
  document.getElementById('prevBtn').style.display=multi?'flex':'none';
  document.getElementById('nextBtn').style.display=multi?'flex':'none';
  sliderDots.style.display=multi?'flex':'none';
  const captions=projects.find(p=>p.title===modalTitle.textContent)?.galleryCaptions;
  const caption=captions && captions[currentSlide];
  let el=document.getElementById('slideCaption');
  if(!el){el=document.createElement('div');el.id='slideCaption';el.className='slide-caption';document.getElementById('slider').appendChild(el);}
  el.textContent=caption||''; el.style.display=caption?'block':'none';
}
function previousSlide(){currentSlide=(currentSlide-1+currentImages.length)%currentImages.length;updateSlide();}
function nextSlide(){currentSlide=(currentSlide+1)%currentImages.length;updateSlide();}
document.getElementById('prevBtn').addEventListener('click',previousSlide);
document.getElementById('nextBtn').addEventListener('click',nextSlide);
document.getElementById('modalClose').addEventListener('click',closeModal);
overlay.addEventListener('click',e=>{if(e.target===overlay)closeModal();});
document.addEventListener('keydown',e=>{if(!overlay.classList.contains('open'))return;if(e.key==='Escape')closeModal();if(e.key==='ArrowLeft')previousSlide();if(e.key==='ArrowRight')nextSlide();});
const slider=document.getElementById('slider');
slider.addEventListener('touchstart',e=>{touchStartX=e.changedTouches[0].screenX;},{passive:true});
slider.addEventListener('touchend',e=>{const delta=e.changedTouches[0].screenX-touchStartX;if(Math.abs(delta)>45){delta<0?nextSlide():previousSlide();}},{passive:true});
fetch('./data/projects.json').then(res=>{if(!res.ok)throw new Error('Could not load data/projects.json');return res.json();}).then(data=>{if(!Array.isArray(data))throw new Error('projects.json must contain an array');projects=data;renderGrid();}).catch(error=>{console.error(error);projects=[];renderGrid();emptyState.style.display='block';emptyState.querySelector('p').textContent='Could not load projects. Check data/projects.json and run this site through a local web server.';});


/* ---------- CERTIFICATES: managed through data/certificates.json ---------- */
const certificateGrid = document.getElementById('certificate-grid');
const certificateCount = document.getElementById('certificate-count');
const certificateEmpty = document.getElementById('certificate-empty');
function renderCertificates(items) {
  const certificates = Array.isArray(items) ? items : [];
  certificateCount.textContent = `${certificates.length} ${certificates.length === 1 ? 'certificate' : 'certificates'}`;
  if (!certificates.length) { certificateGrid.style.display = 'none'; certificateEmpty.style.display = 'block'; return; }
  certificateGrid.style.display = 'grid'; certificateEmpty.style.display = 'none';
  certificateGrid.innerHTML = certificates.map((c, i) => {
    const image = c.image ? `<img src="${escapeHTML(c.image)}" alt="${escapeHTML(c.title || 'Certificate')}" loading="lazy">` : `<div class="certificate-placeholder">Certificate image</div>`;
    const issuer = c.issuer ? `<span>${escapeHTML(c.issuer)}</span>` : '';
    const date = c.date ? `<span>${escapeHTML(c.date)}</span>` : '';
    const credential = c.credentialUrl ? `<a class="certificate-link" href="${escapeHTML(c.credentialUrl)}" target="_blank" rel="noopener noreferrer">Verify credential ↗</a>` : '';
    const description = c.description ? `<p>${escapeHTML(c.description)}</p>` : '';
    return `<article class="certificate-card"><a class="certificate-image-link" href="${escapeHTML(c.image || '#')}" ${c.image ? 'target="_blank" rel="noopener noreferrer"' : ''} aria-label="View ${escapeHTML(c.title || 'certificate image')}">${image}</a><div class="certificate-card-body"><p class="certificate-kicker">CERTIFICATE ${String(i+1).padStart(2,'0')}</p><h3>${escapeHTML(c.title || 'Untitled certificate')}</h3><div class="certificate-meta">${issuer}${date}</div>${description}${credential}</div></article>`;
  }).join('');
}
fetch('./data/certificates.json').then(res => { if (!res.ok) throw new Error('Could not load data/certificates.json'); return res.json(); }).then(renderCertificates).catch(error => { console.error(error); renderCertificates([]); });
