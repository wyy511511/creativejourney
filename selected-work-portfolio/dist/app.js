'use strict';

const dialog = document.querySelector('#project-dialog');
const dialogContent = document.querySelector('#dialog-content');
const closeButton = document.querySelector('#dialog-close');
let previousFocus = null;
const videoLaunchers = new WeakMap();

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function video(id, title, poster = '') {
  const safeTitle = escapeHtml(title);
  return `<div class="video-block"><button class="video-launch" data-load-video="${id}" data-video-title="${safeTitle}" aria-label="Play ${safeTitle}"><img src="${poster || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`}" alt="" loading="lazy"><span class="video-play" aria-hidden="true">▷</span><span class="video-name">${safeTitle}</span></button><div class="video-fallback"><span>Click to load the YouTube player.</span><a href="https://youtu.be/${id}" target="_blank" rel="noopener">Open on YouTube ↗</a></div></div>`;
}

function detailColumns(items) {
  return `<details class="case-disclosure"><summary><span>Project notes</span><span class="disclosure-toggle" aria-hidden="true"></span></summary><div class="detail-columns">${items.map((item, i) => `<div><span class="detail-number">0${i + 1}</span><h3>${item[0]}</h3><p>${item[1]}</p></div>`).join('')}</div></details>`;
}

function takeaway(text) {
  return `<div class="dialog-takeaway"><span>THE TAKEAWAY</span><p>${text}</p></div>`;
}

function shell(category, title, deck, content) {
  return `<article class="dialog-body"><p class="eyebrow">${category}</p><h2 id="dialog-title">${title}</h2><p class="dialog-deck">${deck}</p>${content}</article>`;
}

const projects = {
  apple: () => shell('Apple / Selected scope', 'AI workflows for sales training.', 'AI education · Enterprise production workflows · Creative collaboration',
    `<ol class="apple-scope-headings">
      <li><span>01</span><h3>Enterprise rollout & approval workflows</h3></li>
      <li><span>02</span><h3>Evolving AI system evaluation & model validation</h3></li>
      <li><span>03</span><h3>AI video workflow prototyping & production standardization</h3></li>
      <li><span>04</span><h3>Sales AI & Data Academy / Enterprise training operations</h3></li>
    </ol>
    <div class="disclosure-controls"><span>Selected supporting material</span><button type="button" data-collapse-details>Collapse all <span aria-hidden="true">−</span></button></div>
    <div class="case-disclosures">
      <details class="case-disclosure artifact-disclosure" data-detail="voice-prompt"><summary><span>AI voice prompt · production reality</span><span class="disclosure-toggle" aria-hidden="true"></span></summary><div class="disclosure-body"><p>Model capabilities, training-data coverage and production constraints inform the validation and fallback choices in this working example.</p><figure class="artifact"><a href="assets/voice-design.png" target="_blank" rel="noopener" aria-label="Open the full-resolution AI voice prompt"><img src="assets/voice-design.png" alt="AI voice prompt: creative brief, revised direction, fallback choices and validation" loading="lazy"></a><figcaption>Original working artifact · Click to view the AI voice prompt at full resolution.</figcaption></figure></div></details>
      <details class="case-disclosure evidence-disclosure"><summary><span>Project video</span><span class="disclosure-toggle" aria-hidden="true"></span></summary><div class="disclosure-body">` + video('w_JaP11RRt8', 'Apple project — video') + `</div></details>
      <details class="case-disclosure"><summary><span>Job description · scope & roadmap</span><span class="disclosure-toggle" aria-hidden="true"></span></summary><div class="disclosure-body"><a class="context-source" href="https://jobs.apple.com/en-us/details/200691417-0836/head-of-content-strategy-sales-coach" target="_blank" rel="noopener">Open Apple’s job description ↗</a><div class="jd-rationale"><span>why I include this</span><p>This JD shows the broader scope and roadmap around the work. It also makes clear why I’m not a complete fit for the role: I’m a builder guided by curiosity across technology and design.</p></div></div></details>
    </div>`),

  nature: () => shell('PHOTOGRAPHY & FILM / PERSONAL OBSERVATION', 'Katmai / In the current', 'A personal interest in wildlife: watching closely, following a moment and preserving what made it beautiful.',
    takeaway('Photography begins with curiosity and the patience to notice what is already happening.') +
    video('QPa-0_rZCNk', 'Katmai — bears fishing', 'assets/katmai.jpg') +
    detailColumns([
      ['Subject', 'Bears fishing in Katmai. A wildlife story built around behavior, water and a sense of place.'],
      ['Viewing lens', 'Follow the relationship between the animal and its environment: scale, movement and the small moments between action.'],
      ['The collection', 'Watch the film, then explore the field photograph below for a closer look at the same world.']
    ]) + `<figure class="photo-strip"><a href="assets/katmai.jpg" target="_blank" rel="noopener"><img src="assets/katmai.jpg" alt="Brown bear surrounded by blue river water and white rapids in Katmai" loading="lazy"></a></figure>`),

  events: () => shell('AfterLight / Free pilots', 'Final photo & video deliverables.', 'Free pilot work shaped by friends’ real event needs: documenting the people, ideas and atmosphere, then delivering useful collections.',
    `<div class="pilot-modal-intro"><span class="pilot-badge">Free pilot deliverables</span><a class="context-source" href="https://wyy511511.github.io/AfterLight/" target="_blank" rel="noopener">View the frontend prototype ↗</a></div>` +
    `<div class="event-list">
      <div class="event-row"><span>01</span><div><h3>Tencent Demo Day</h3><p>Event photography · Founder and demo-day coverage</p></div><a href="https://drive.google.com/drive/folders/1hIBXf2nHbUfiiR4NerwqqzomQjPfgTXM?usp=drive_link" target="_blank" rel="noopener">View collection ↗</a></div>
      <div class="event-row"><span>02</span><div><h3>fig studio / Physical AI</h3><p>Event photography · Ideas and people in physical AI</p></div><a href="https://drive.google.com/drive/folders/1Sm5V7x2RZii9gf2eacb15Du4Og3m7PQ-?usp=drive_link" target="_blank" rel="noopener">View collection ↗</a></div>
      <div class="event-row"><span>03</span><div><h3>Wells Fargo / Security Forum</h3><p>October 28, 2026 · Event photography</p></div><a href="https://drive.google.com/drive/folders/1VGRLPpJXTieq8FanUB3IzVm4zlGbQRAx?usp=drive_link" target="_blank" rel="noopener">View collection ↗</a></div>
      <div class="event-row"><span>04</span><div><h3>WeShine</h3><p>Event films and photography · Community in motion</p></div><a href="https://drive.google.com/drive/folders/1Y-WlnTVcHRDJCBXDaRclfxiANSW_IdAa?usp=drive_link" target="_blank" rel="noopener">Films & photos ↗</a></div>
    </div><h3 class="detail-subtitle">From the security forum</h3><div class="event-gallery"><a href="assets/event-panel.jpg" target="_blank" rel="noopener"><img src="assets/event-panel.jpg" alt="Panel conversation at the Wells Fargo security forum" loading="lazy"></a><a href="assets/event-room.jpg" target="_blank" rel="noopener"><img src="assets/event-room.jpg" alt="A moment from the security forum photo collection" loading="lazy"></a><a href="assets/event-moment.jpg" target="_blank" rel="noopener"><img src="assets/event-moment.jpg" alt="Security forum event coverage" loading="lazy"></a></div><p class="lab-footnote">The complete collections open in Google Drive with their existing sharing settings.</p>`),

  b2b: () => shell('APPLIED STORYTELLING / AI & B2B STARTUPS', 'Complex product. Clear story.', 'Three short-form pieces, including a Google Meet source and a stacked-view presentation.',
    takeaway('Give the viewer a clear way into an unfamiliar product through focused, accessible short-form storytelling.') +
    `<div class="shorts-list"><section class="short-item">${video('mfgv4kmBKiY', '01 / From Google Meet')}<h3>From Google Meet</h3><p>A short-form piece sourced from a Google Meet conversation.</p></section><section class="short-item">${video('9t0wMni30Sc', '02 / Stacked view')}<h3>Stacked view</h3><p>A second layout for presenting a startup story in a vertical format.</p></section><section class="short-item">${video('xhDJG8uf0bo', '03 / Startup short')}<h3>Startup short</h3><p>A third piece in the AI B2B short-form collection.</p></section></div>` +
    detailColumns([
      ['A clear entry point', 'Start with the idea a viewer needs in order to understand why the product matters.'],
      ['A format for the feed', 'Use the compact frame to organize attention and keep the central explanation readable.'],
      ['A useful comparison', 'Watch the three pieces together to compare presentation formats and storytelling choices.']
    ])),

  realestate: () => shell('RAPID AI EXPERIMENT / REAL ESTATE', 'Test the investment story.', 'A minimum video deliverable for a quick feasibility check of a real estate project introduction.',
    takeaway('Make a first version quickly enough to decide whether the storytelling approach is worth developing.') +
    `<div class="prototype-frame"><strong>&lt;10 min</strong><strong>$0 spend</strong><span>Rapid feasibility study<br>Minimum deliverable</span></div>` +
    video('B72W2hRmc74', 'Real estate — investment project introduction') +
    detailColumns([
      ['The category', 'Real estate investment project communication.'],
      ['The test', 'Can a small AI workflow produce a coherent first version of the project introduction?'],
      ['What it demonstrates', 'A quick feasibility check. The time and spend describe this experiment; the first version provides something concrete to review.']
    ])),

  narrative: () => shell('RAPID AI EXPERIMENT / NARRATIVE FILM', 'STILL LIVE', 'He was dead before he went live. A narrative premise explored as a quick AI video experiment.',
    takeaway('Use a minimum deliverable to test whether the premise creates an immediate sense of intrigue.') +
    `<div class="prototype-frame"><strong>&lt;10 min</strong><strong>$0 spend</strong><span>Rapid feasibility study<br>Minimum deliverable</span></div>` +
    video('cK1XSgYf4uM', 'STILL LIVE — watch the film') +
    detailColumns([
      ['The premise', 'A story introduced through the tension between being dead and appearing live.'],
      ['The viewing lens', 'Watch how information, atmosphere and timing shape your understanding of the premise.'],
      ['What it demonstrates', 'A small, time-boxed feasibility experiment that turns a narrative idea into something that can be watched and discussed.']
    ]))
};

function setFilter(category) {
  const valid = ['all', 'b2b', 'events', 'nature'];
  if (!valid.includes(category)) return;
  document.querySelectorAll('[data-filter]').forEach(button => {
    const selected = button.dataset.filter === category;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  let count = 0;
  document.querySelectorAll('[data-group]').forEach(card => {
    card.hidden = category !== 'all' && card.dataset.group !== category;
    if (!card.hidden) count++;
  });
  document.querySelector('#filter-status').textContent = category === 'all' ? 'Showing all 3 project collections.' : `Showing ${count} project collection for ${document.querySelector(`[data-filter="${category}"]`).textContent}.`;
}

function openDialog(content) {
  if (!dialog.open) previousFocus = document.activeElement;
  dialogContent.innerHTML = content;
  document.body.classList.add('modal-open');
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
  wireImageFallbacks(dialogContent);
  closeButton.focus({preventScroll: true});
}

function closeDialog() {
  dialog.close();
}

dialog.addEventListener('close', () => {
  dialogContent.innerHTML = '';
  document.body.classList.remove('modal-open');
  if (previousFocus && previousFocus.isConnected) previousFocus.focus({preventScroll: true});
});
closeButton.addEventListener('click', closeDialog);
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog();
});

document.addEventListener('click', event => {
  const collapse = event.target.closest('[data-collapse-details]');
  if (collapse) {
    stopPlayers(dialogContent);
    dialogContent.querySelectorAll('details[open]').forEach(detail => { detail.open = false; });
  }
  const filter = event.target.closest('[data-filter]');
  if (filter) setFilter(filter.dataset.filter);
  const category = event.target.closest('[data-category]');
  if (category) setFilter(category.dataset.category);
  const project = event.target.closest('[data-project]');
  if (project && projects[project.dataset.project]) {
    openDialog(projects[project.dataset.project]());
    if (project.dataset.openDetail === 'voice-prompt') {
      const detail = dialogContent.querySelector(`details[data-detail="${project.dataset.openDetail}"]`);
      if (detail) {
        detail.open = true;
        detail.scrollIntoView({block: 'nearest', behavior: 'auto'});
        detail.querySelector('summary').focus({preventScroll: true});
      }
    }
  }
  const standaloneVideo = event.target.closest('[data-video]');
  if (standaloneVideo) openDialog(shell('SELECTED FILM', escapeHtml(standaloneVideo.dataset.title), '', video(standaloneVideo.dataset.video, standaloneVideo.dataset.title)));
  const loadButton = event.target.closest('[data-load-video]');
  if (loadButton) {
    const id = loadButton.dataset.loadVideo;
    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return;
    const player = document.createElement('div');
    player.className = 'video-embed';
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    iframe.title = loadButton.dataset.videoTitle;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    player.append(iframe);
    videoLaunchers.set(player, loadButton);
    loadButton.replaceWith(player);
    iframe.focus();
    const hint = player.parentElement.querySelector('.video-fallback>span');
    if (hint) hint.textContent = 'If the player is unavailable, open the video on YouTube.';
  }
});

function wireImageFallbacks(root = document) {
  root.querySelectorAll('img[src^="https://i.ytimg.com/"]').forEach(img => {
    function handleError() {
      if (img.src.includes('maxresdefault')) {
        img.src = img.src.replace('maxresdefault', 'hqdefault');
      } else {
        img.classList.add('failed');
        img.style.visibility = 'hidden';
      }
    }
    img.addEventListener('error', handleError);
    if (img.complete && !img.naturalWidth) handleError();
  });
}
wireImageFallbacks();

function stopPlayers(root) {
  root.querySelectorAll('.video-embed').forEach(player => {
    const launcher = videoLaunchers.get(player);
    if (!launcher) return;
    const hint = player.parentElement.querySelector('.video-fallback>span');
    player.replaceWith(launcher);
    if (hint) hint.textContent = 'Click to load the YouTube player.';
  });
}

dialogContent.addEventListener('toggle', event => {
  if (event.target.matches('details') && !event.target.open) stopPlayers(event.target);
}, true);
