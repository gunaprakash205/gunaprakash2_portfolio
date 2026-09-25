let projects = [];

const grid = document.getElementById('grid');
const emptyState = document.getElementById('empty');
const workCount = document.getElementById('work-count');

function placeholderSVG(){
  return '<div class="ph"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>';
}

function renderGrid(){
  workCount.textContent = projects.length + (projects.length === 1 ? ' project' : ' projects');
  if(projects.length === 0){
    grid.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }
  grid.style.display = 'grid';
  emptyState.style.display = 'none';
  grid.innerHTML = projects.map((p, i) => `
    <article class="card" tabindex="0" role="button" data-index="${i}" aria-label="Open ${p.title}">
      <div class="card-thumb">
        ${p.images && p.images[0] ? `<img src="${p.images[0]}" alt="${p.title} thumbnail">` : placeholderSVG()}
        ${p.tag ? `<span class="card-tag">${p.tag}</span>` : ''}
      </div>
      <div class="card-body">
        <h3>${p.title}</h3>
        <p>${p.summary || ''}</p>
        <span class="card-more">View project
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </span>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => openModal(parseInt(card.dataset.index)));
    card.addEventListener('keydown', e => {
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openModal(parseInt(card.dataset.index)); }
    });
  });
}

// ---------- Modal / slider ----------
const overlay = document.getElementById('overlay');
const sliderTrack = document.getElementById('sliderTrack');
const sliderDots = document.getElementById('sliderDots');
const modalTag = document.getElementById('modalTag');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
let currentSlide = 0;
let currentImages = [];

function openModal(index){
  const p = projects[index];
  currentImages = (p.images && p.images.length) ? p.images : [null];
  currentSlide = 0;
  modalTag.textContent = p.tag || '';
  modalTitle.textContent = p.title;
  modalDesc.textContent = p.description || p.summary || '';
  sliderTrack.innerHTML = currentImages.map(src => `
    <div class="slide">${src ? `<img src="${src}" alt="${p.title}">` : placeholderSVG()}</div>
  `).join('');
  sliderDots.innerHTML = currentImages.map((_, i) => `<span data-i="${i}"></span>`).join('');
  updateSlide();
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(){
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function updateSlide(){
  sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  sliderDots.querySelectorAll('span').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  const multi = currentImages.length > 1;
  document.getElementById('prevBtn').style.display = multi ? 'flex' : 'none';
  document.getElementById('nextBtn').style.display = multi ? 'flex' : 'none';
  sliderDots.style.display = multi ? 'flex' : 'none';
}

document.getElementById('prevBtn').addEventListener('click', () => {
  currentSlide = (currentSlide - 1 + currentImages.length) % currentImages.length;
  updateSlide();
});
document.getElementById('nextBtn').addEventListener('click', () => {
  currentSlide = (currentSlide + 1) % currentImages.length;
  updateSlide();
});
document.getElementById('modalClose').addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if(e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => {
  if(!overlay.classList.contains('open')) return;
  if(e.key === 'Escape') closeModal();
  if(e.key === 'ArrowLeft') document.getElementById('prevBtn').click();
  if(e.key === 'ArrowRight') document.getElementById('nextBtn').click();
});

// ---------- Load data ----------
fetch('data/projects.json')
  .then(res => res.json())
  .then(data => { projects = data; renderGrid(); })
  .catch(() => { projects = []; renderGrid(); });
