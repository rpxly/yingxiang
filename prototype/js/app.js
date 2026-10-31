/* ==========================================================================
   app.js — 原型交互逻辑
   ========================================================================== */

(() => {
  'use strict';

  // ------------------------------------------------------------------------
  // 素材 / 数据
  // ------------------------------------------------------------------------

  const PHOTOS = [
    'assets/photo-01-mist.jpg',
    'assets/photo-02-rain.jpg',
    'assets/photo-03-portrait.jpg',
    'assets/photo-04-dunes.jpg',
    'assets/photo-05-camera.jpg'
  ];

  const TEMPLATES = [
    { id: 'mat_warm',        no: '01', name: '米白装裱', family: '装裱', filter: 'mat',  style: 'mat',       photo: 0 },
    { id: 'frame_gallery',   no: '02', name: '画廊双框', family: '画廊', filter: 'mat',  style: 'frame',     photo: 1 },
    { id: 'editorial_no',    no: '03', name: '杂志大刊', family: '杂志', filter: 'mag',  style: 'editorial', photo: 0 },
    { id: 'editorial_sidebar', no: '04', name: '竖栏杂志', family: '杂志', filter: 'mag', style: 'editorial', photo: 2 },
    { id: 'polaroid',        no: '05', name: '拍立得留白', family: '留白', filter: 'dark', style: 'polaroid', photo: 2 },
    { id: 'darkroom',        no: '06', name: '暗房黑底', family: '暗房', filter: 'dark', style: 'dark',      photo: 1 },
    { id: 'museum_label',    no: '07', name: '展签卡',   family: '展签', filter: 'mat',  style: 'label',     photo: 4 },
    { id: 'split_column',    no: '08', name: '对开分栏', family: '分栏', filter: 'mag',  style: 'split',     photo: 3 }
  ];

  const META = {
    model: 'HASSELBLAD 503CXI',
    lens: 'CF 80mm',
    shutter: '1/250s',
    iso: 'ISO 100',
    film: 'PORTRA 400',
    title: '雾中来客'
  };

  const FIELDS = [
    { key: 'model',    label: '机型', short: '503CXI' },
    { key: 'lens',     label: '镜头', short: 'CF 80mm' },
    { key: 'aperture', label: '光圈', short: 'f/2.8', dial: true },
    { key: 'shutter',  label: '快门', short: '1/250s' },
    { key: 'iso',      label: 'ISO',  short: 'ISO 100' },
    { key: 'film',     label: '胶卷', short: 'PORTRA 400' }
  ];

  const APERTURES = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];

  // 文案字体 / 字号档位
  const CAP_FONTS = {
    serif: 'var(--serif)',
    sans: 'var(--sans)',
    script: 'var(--script)',
    mono: 'var(--mono)'
  };
  const CAP_SCALE_MIN = 0.7;
  const CAP_SCALE_MAX = 1.6;

  // 导出格式
  const EXPORT_FORMATS = {
    jpg: { label: 'JPG' },
    png: { label: 'PNG' },
    heic: { label: 'HEIC' },
    pdf: { label: 'PDF' }
  };

  const state = {
    view: 'home',
    template: TEMPLATES[0].id,
    params: { model: true, lens: true, aperture: true, shutter: false, iso: true, film: false },
    apertureIndex: 2,
    step: 2,
    filter: 'all',
    dialPos: 2,
    capFont: 'serif',
    capScale: 1,
    customPhoto: null,
    photoSize: '4032 × 3024',
    photoOrient: '竖版',
    photoAR: null,
    photoFormat: null,
    exportFormat: 'jpg'
  };

  // ------------------------------------------------------------------------
  // DOM
  // ------------------------------------------------------------------------

  const phone = document.getElementById('phone');
  const phoneShell = document.querySelector('.phone-shell');
  const viewEls = Array.from(document.querySelectorAll('.view'));

  const stack = document.getElementById('stack');
  const stackCards = document.getElementById('stackCards');
  const homeGrid = document.getElementById('homeGrid');
  const templatesGrid = document.getElementById('templatesGrid');
  const filterRow = document.getElementById('filterRow');
  const previewPrint = document.getElementById('previewPrint');
  const previewPhoto = document.getElementById('previewPhoto');
  const previewWm = document.getElementById('previewWm');
  const editorTplName = document.getElementById('editorTplName');
  const exportBtn = document.getElementById('exportBtn');
  const photoBtn = document.getElementById('photoBtn');
  const photoInput = document.getElementById('photoInput');
  const globalSettingsBtn = document.getElementById('globalSettingsBtn');
  const gsBackdrop = document.getElementById('gsBackdrop');
  const gsPanel = document.getElementById('gsPanel');
  const gsClose = document.getElementById('gsClose');
  const themeSeg = document.getElementById('themeSeg');
  const themeNote = document.getElementById('themeNote');
  const settingsFollow = document.getElementById('settingsFollow');
  const fmtGrid = document.getElementById('fmtGrid');
  const burstLayer = document.getElementById('burstLayer');
  const flash = document.getElementById('flash');
  const toast = document.getElementById('toast');
  const toastTxt = document.getElementById('toastTxt');
  const rail = document.getElementById('rail');
  const railTrack = document.getElementById('railTrack');
  const railUnderline = document.getElementById('railUnderline');
  const stepsEl = document.getElementById('steps');
  const stepFill = document.getElementById('stepFill');
  const dockSeg = document.getElementById('dockSeg');
  const segPill = document.getElementById('segPill');
  const panelLayout = document.getElementById('panelLayout');
  const panelParams = document.getElementById('panelParams');
  const panelCaption = document.getElementById('panelCaption');
  const capField = document.getElementById('capField');
  const capInput = document.getElementById('capInput');
  const capClear = document.getElementById('capClear');
  const capCount = document.getElementById('capCount');
  const capChips = document.getElementById('capChips');
  const capFonts = document.getElementById('capFonts');
  const capSizeInput = document.getElementById('capSize');
  const capSliderWrap = document.getElementById('capSliderWrap');
  const capBubble = document.getElementById('capBubble');
  const capScale = document.getElementById('capScale');
  const capSizeRow = capSizeInput.closest('.cap-row');
  const ringBar = document.getElementById('ringBar');
  const odoStrip = document.getElementById('odoStrip');
  const paramRows = document.getElementById('paramRows');
  const apertureChip = document.getElementById('apertureChip');
  const dock = document.querySelector('.editor-dock');
  const dial = document.getElementById('dial');
  const dialScrim = document.getElementById('dialScrim');
  const dialTicks = document.getElementById('dialTicks');
  const dialValue = document.getElementById('dialValue');
  const dialStage = document.querySelector('.dial-stage');
  const dialClose = document.getElementById('dialClose');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ------------------------------------------------------------------------
  // 水印渲染
  // ------------------------------------------------------------------------

  function apertureLabel() {
    return 'f/' + APERTURES[state.apertureIndex];
  }

  function fieldValue(key) {
    if (key === 'aperture') return apertureLabel();
    return META[key] || '';
  }

  function wmHTML() {
    const p = state.params;
    const gear = [];
    if (p.model) gear.push(META.model);
    if (p.lens) gear.push(META.lens);

    const exif = [];
    if (p.aperture) exif.push(apertureLabel());
    if (p.shutter) exif.push(META.shutter);
    if (p.iso) exif.push(META.iso);

    const titleStyle = `font-family:${CAP_FONTS[state.capFont]};--wm-scale:${state.capScale}`;
    let html = `<div class="wm-title" style="${titleStyle}">${META.title}</div>`;
    if (gear.length) html += `<div class="wm-gear">${gear.join(' · ')}</div>`;
    if (exif.length) html += `<div class="wm-exif">${exif.join(' · ')}</div>`;
    if (p.film) html += `<div class="wm-film">${META.film}</div>`;
    return html;
  }

  function photoSrc(t) {
    return state.customPhoto || PHOTOS[t.photo];
  }

  function miniPrint(t, extraClass = '') {
    const cls = `print mini style-${t.style} ${extraClass}`.trim();
    return `
      <div class="${cls}">
        <div class="print-photo"><img src="${photoSrc(t)}" alt="" loading="lazy" /></div>
        <div class="wm-block">${wmHTML()}</div>
      </div>`;
  }

  function cardHTML(t) {
    return `
      <button class="card" data-tpl="${t.id}" data-filter="${t.filter}">
        <span class="card-print">${miniPrint(t)}</span>
        <span class="card-meta"><b>${t.name}</b><span>${t.no} / ${t.family}</span></span>
      </button>`;
  }

  function tplById(id) {
    return TEMPLATES.find(t => t.id === id) || TEMPLATES[0];
  }

  // ------------------------------------------------------------------------
  // 初始渲染
  // ------------------------------------------------------------------------

  const featured = ['darkroom', 'editorial_no', 'polaroid'];
  stackCards.innerHTML = featured.map((id, i) => {
    const t = tplById(id);
    return `<button class="stack-card" data-tpl="${t.id}" style="--i:${i}">${miniPrint(t)}</button>`;
  }).join('');

  const homePicks = ['mat_warm', 'editorial_no', 'polaroid', 'darkroom'];
  homeGrid.innerHTML = homePicks.map(id => cardHTML(tplById(id))).join('');

  function renderTemplatesGrid() {
    const list = TEMPLATES.filter(t => state.filter === 'all' || t.filter === state.filter);
    templatesGrid.innerHTML = list.map(cardHTML).join('');
  }
  renderTemplatesGrid();

  railTrack.innerHTML = TEMPLATES.map((t, i) => `
    <button class="rail-card" data-index="${i}" aria-label="${t.name}">${miniPrint(t)}</button>
  `).join('');

  odoStrip.innerHTML = Array.from({ length: 7 }, (_, i) => `<span>${i}</span>`).join('');
  odoStrip.style.transform = `translateY(-${countParams() * 11}px)`;

  // 玻璃后面的真实照片（折射需要内容）
  const p1 = document.querySelector('.phone-photo.p1');
  const p2 = document.querySelector('.phone-photo.p2');
  if (p1) p1.style.backgroundImage = `url("${PHOTOS[0]}")`;
  if (p2) p2.style.backgroundImage = `url("${PHOTOS[2]}")`;

  updatePreview();

  // ------------------------------------------------------------------------
  // 视图切换 · 横向推进
  // ------------------------------------------------------------------------

  const VIEW_ORDER = { home: 0, templates: 1, editor: 2 };

  let currentView = 'home';
  let revealing = false;

  const VIEW_MS = 520;
  const VIEW_EASE = 'cubic-bezier(.32,.72,0,1)';

  function switchView(name) {
    if (name === currentView || revealing) return;

    const target = document.querySelector(`.view[data-view="${name}"]`);
    const prev = document.querySelector(`.view[data-view="${currentView}"]`);
    if (!target) return;

    if (reduceMotion) {
      target.classList.add('is-active');
      if (prev) prev.classList.remove('is-active');
      currentView = name;
      afterViewEnter(name);
      return;
    }

    revealing = true;

    // 前进：新页从右推入；返回：方向对调
    const dir = (VIEW_ORDER[name] ?? 0) >= (VIEW_ORDER[currentView] ?? 0) ? 1 : -1;

    // 页签高亮跟着手指立即走，不等动画结束
    document.querySelectorAll('.tab[data-goto]').forEach(tab => {
      tab.classList.toggle('is-on', tab.dataset.goto === name);
    });

    target.classList.add('is-active');
    target.style.transform = '';
    target.style.opacity = '';
    target.style.zIndex = '6';
    if (prev) prev.style.zIndex = '5';

    const enter = target.animate(
      [
        { transform: `translate3d(${dir * 100}%, 0, 0)`, opacity: 0.4 },
        { transform: 'translate3d(0, 0, 0)', opacity: 1 }
      ],
      { duration: VIEW_MS, easing: VIEW_EASE, fill: 'both' }
    );

    const exit = prev
      ? prev.animate(
          [
            { transform: 'translate3d(0, 0, 0)', opacity: 1 },
            { transform: `translate3d(${-dir * 34}%, 0, 0)`, opacity: 0.18 }
          ],
          { duration: VIEW_MS, easing: VIEW_EASE, fill: 'both' }
        )
      : null;

    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;

      enter.cancel();
      if (exit) exit.cancel();

      target.style.transform = '';
      target.style.opacity = '';
      target.style.zIndex = '';

      if (prev) {
        prev.classList.remove('is-active');
        prev.style.transform = '';
        prev.style.opacity = '';
        prev.style.zIndex = '';
      }

      currentView = name;
      revealing = false;
      afterViewEnter(name);
    };

    enter.onfinish = settle;
    setTimeout(settle, VIEW_MS + 100);
  }

  function afterViewEnter(name) {
    document.querySelectorAll('.tab[data-goto]').forEach(tab => {
      tab.classList.toggle('is-on', tab.dataset.goto === name);
    });
    if (name === 'editor') {
      closeDial();
      state.step = 2;
      renderSteps();
      switchPanel('layout');
      requestAnimationFrame(() => {
        selectRailByTemplate(state.template, { scroll: true, animate: false, silent: true });
      });
    }
  }

  // ------------------------------------------------------------------------
  // 编辑器预览 / 模板选择
  // ------------------------------------------------------------------------

  function updatePreview() {
    const t = tplById(state.template);
    previewPrint.className = `print editor style-${t.style}`;
    if (state.photoAR) previewPrint.style.setProperty('--photo-ar', state.photoAR);
    else previewPrint.style.removeProperty('--photo-ar');
    previewPhoto.src = photoSrc(t);
    previewWm.innerHTML = wmHTML();
    editorTplName.textContent = t.name;
  }

  function openEditor(id, originEl) {
    state.template = id;
    updatePreview();
    if (currentView === 'editor') {
      selectRailByTemplate(id, { scroll: true, animate: true });
      return;
    }
    switchView('editor', originEl);
  }

  // ------------------------------------------------------------------------
  // 叠卡展开
  // ------------------------------------------------------------------------

  function toggleStack(force) {
    const next = typeof force === 'boolean' ? force : stack.dataset.open !== 'true';
    stack.dataset.open = next ? 'true' : 'false';
  }

  stack.addEventListener('click', (e) => {
    const card = e.target.closest('.stack-card');
    const isOpen = stack.dataset.open === 'true';
    if (card && isOpen) {
      openEditor(card.dataset.tpl, card);
      return;
    }
    toggleStack();
  });

  // ------------------------------------------------------------------------
  // 卡片点击（首页 / 模板墙）
  // ------------------------------------------------------------------------

  function bindCards(container) {
    container.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      if (card) openEditor(card.dataset.tpl, card);
    });
  }
  bindCards(homeGrid);
  bindCards(templatesGrid);

  // ------------------------------------------------------------------------
  // 04 · 吸附卡 + 画线
  // ------------------------------------------------------------------------

  let activeIndex = 0;
  let programmaticScroll = false;
  let scrollTimer = 0;

  function countParams() {
    return Object.values(state.params).filter(Boolean).length;
  }

  function railCenterOffset(el) {
    return el.offsetLeft + el.offsetWidth / 2;
  }

  function updateUnderline(el, draw) {
    const left = el.offsetLeft - rail.scrollLeft;
    railUnderline.style.left = left + 'px';
    railUnderline.style.width = el.offsetWidth + 'px';
    railUnderline.style.opacity = '1';
    if (draw) {
      railUnderline.classList.remove('draw');
      void railUnderline.offsetWidth;
      railUnderline.classList.add('draw');
    }
  }

  function selectRailByTemplate(id, opts = {}) {
    const index = Math.max(0, TEMPLATES.findIndex(t => t.id === id));
    const el = railTrack.children[index];
    if (!el) return;
    activeIndex = index;
    applyActiveRail(index, opts.draw !== false);
    if (opts.scroll) {
      programmaticScroll = true;
      const left = railCenterOffset(el) - rail.clientWidth / 2;
      rail.scrollTo({ left, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }

  function applyActiveRail(index, draw) {
    Array.from(railTrack.children).forEach((el, i) => {
      el.classList.toggle('is-active', i === index);
    });
    const el = railTrack.children[index];
    if (el) updateUnderline(el, draw);
    const t = TEMPLATES[index];
    if (t) {
      state.template = t.id;
      updatePreview();
      if (currentView === 'editor') setField(FIELD_BY_STYLE[t.style]);
    }
    state.step = Math.max(state.step, 2);
    renderSteps();
  }

  function nearestRailIndex() {
    const railRect = rail.getBoundingClientRect();
    const railCenter = railRect.left + railRect.width / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(railTrack.children).forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const dist = Math.abs(r.left + r.width / 2 - railCenter);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    return best;
  }

  rail.addEventListener('scroll', () => {
    railUnderline.style.opacity = '0';
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      if (programmaticScroll) {
        programmaticScroll = false;
        const el = railTrack.children[activeIndex];
        if (el) updateUnderline(el, true);
        return;
      }
      const idx = nearestRailIndex();
      if (idx !== activeIndex) {
        activeIndex = idx;
        applyActiveRail(idx, true);
        mgTouch();
      } else {
        const el = railTrack.children[activeIndex];
        if (el) updateUnderline(el, true);
      }
    }, 140);
  }, { passive: true });

  railTrack.addEventListener('click', (e) => {
    const card = e.target.closest('.rail-card');
    if (!card) return;
    const index = Number(card.dataset.index);
    selectRailByTemplate(TEMPLATES[index].id, { scroll: true, draw: true });
  });

  function mgTouch() {
    if (navigator.vibrate) { try { navigator.vibrate(6); } catch (_) {} }
  }

  // ------------------------------------------------------------------------
  // 背景渐变场 · 版式联动
  // ------------------------------------------------------------------------

  const FIELD_BY_STYLE = {
    mat: 'sand',
    frame: 'sand',
    editorial: 'indigo',
    polaroid: 'sand',
    dark: 'pine',
    label: 'sand',
    split: 'indigo'
  };

  const gradientLab = document.getElementById('gradientLab');

  function syncFieldLab() {
    const field = phone.dataset.field;
    gradientLab.querySelectorAll('.g-swatch').forEach(swatch => {
      swatch.classList.toggle('is-on', swatch.dataset.field === field);
    });
  }

  function setField(name) {
    if (!name || phone.dataset.field === name) return;
    phone.dataset.field = name;
    syncFieldLab();
  }

  gradientLab.addEventListener('click', (e) => {
    const swatch = e.target.closest('.g-swatch');
    if (!swatch) return;
    setField(swatch.dataset.field);
    mgTouch();
  });

  syncFieldLab();

  // ------------------------------------------------------------------------
  // 步骤线
  // ------------------------------------------------------------------------

  const stepEls = Array.from(stepsEl.querySelectorAll('.step'));

  function renderSteps() {
    stepFill.style.width = ((state.step - 1) / 3) * 100 + '%';
    stepEls.forEach((el, i) => el.classList.toggle('is-done', i + 1 <= state.step));
  }

  function setStep(n) {
    if (state.step >= n) return;
    state.step = Math.min(4, n);
    renderSteps();
  }

  // ------------------------------------------------------------------------
  // 02 · 参数勾选联动
  // ------------------------------------------------------------------------

  function renderParams() {
    paramRows.innerHTML = FIELDS.map(f => {
      const on = state.params[f.key];
      const val = f.key === 'aperture' ? apertureLabel() : f.short;
      return `
        <div class="row ${on ? 'is-on' : ''} ${f.dial ? 'is-dial' : ''}" data-field="${f.key}">
          <span class="row-label">${f.label}</span>
          <span class="row-value">${val}</span>
          <span class="switch"></span>
        </div>`;
    }).join('');
  }

  function updateParamVisuals() {
    const count = countParams();
    const ratio = count / FIELDS.length;

    ringBar.style.strokeDashoffset = String(113.1 * (1 - ratio));
    // 颜色：雾青 → 暖沙
    const from = [93, 202, 165];
    const to = [231, 178, 124];
    const rgb = from.map((v, i) => Math.round(v + (to[i] - v) * ratio));
    ringBar.style.stroke = `rgb(${rgb.join(',')})`;
    odoStrip.style.transform = `translateY(-${count * 11}px)`;
    dock.style.setProperty('--warm', String(ratio * 0.85));

    Array.from(paramRows.children).forEach(row => {
      const key = row.dataset.field;
      row.classList.toggle('is-on', state.params[key]);
      if (key === 'aperture') row.querySelector('.row-value').textContent = apertureLabel();
    });
    apertureChip.innerHTML = `${apertureLabel()}<span>拨轮 ↗</span>`;
  }

  function swapWatermark() {
    previewWm.classList.add('swapping');
    setTimeout(() => {
      previewWm.innerHTML = wmHTML();
      previewWm.classList.remove('swapping');
    }, 150);
  }

  function toggleField(key) {
    state.params[key] = !state.params[key];
    updateParamVisuals();
    swapWatermark();
    setStep(3);
    mgTouch();
  }

  paramRows.addEventListener('click', (e) => {
    const row = e.target.closest('.row');
    if (!row) return;
    if (e.target.closest('.row-value') && row.classList.contains('is-dial')) {
      openDial();
      return;
    }
    toggleField(row.dataset.field);
  });

  apertureChip.addEventListener('click', openDial);
  renderParams();
  updateParamVisuals();

  // ------------------------------------------------------------------------
  // 面板切换
  // ------------------------------------------------------------------------

  const PANEL_ORDER = ['layout', 'params', 'caption'];

  function switchPanel(name) {
    const idx = PANEL_ORDER.indexOf(name);
    if (idx < 0) return;
    segPill.classList.toggle('pos-1', idx === 1);
    segPill.classList.toggle('pos-2', idx === 2);
    panelLayout.classList.toggle('is-on', name === 'layout');
    panelParams.classList.toggle('is-on', name === 'params');
    panelCaption.classList.toggle('is-on', name === 'caption');
    dockSeg.querySelectorAll('.seg-btn').forEach(btn => {
      btn.classList.toggle('is-on', btn.dataset.panel === name);
    });
    if (name !== 'layout') setStep(3);
    if (name === 'caption') requestAnimationFrame(syncCapScale);
  }

  dockSeg.addEventListener('click', (e) => {
    const btn = e.target.closest('.seg-btn');
    if (btn) switchPanel(btn.dataset.panel);
  });

  // ------------------------------------------------------------------------
  // 文案编辑
  // ------------------------------------------------------------------------

  function syncCaption() {
    const raw = capInput.value;
    META.title = raw.trim() || '无题';
    capCount.textContent = `${Array.from(raw).length} / 18`;
    capField.classList.toggle('has-text', raw.length > 0);
    previewWm.innerHTML = wmHTML();
  }

  capInput.addEventListener('input', () => {
    syncCaption();
    setStep(3);
    mgTouch();
  });
  capInput.addEventListener('focus', () => capField.classList.add('is-focus'));
  capInput.addEventListener('blur', () => capField.classList.remove('is-focus'));

  capClear.addEventListener('click', () => {
    capInput.value = '';
    capInput.focus();
    syncCaption();
    mgTouch();
  });

  capChips.addEventListener('click', (e) => {
    const chip = e.target.closest('.cap-chip');
    if (!chip) return;
    capInput.value = chip.dataset.text || '';
    capInput.focus();
    syncCaption();
    mgTouch();
  });

  function syncCapChips() {
    capFonts.querySelectorAll('.cap-chip').forEach(chip => {
      chip.classList.toggle('is-on', chip.dataset.font === state.capFont);
    });
  }

  const CAP_THUMB_W = 15;

  function syncCapScale() {
    const pct = Math.round(state.capScale * 100);
    capScale.textContent = `${pct}%`;
    capBubble.textContent = `${pct}%`;

    const ratio = (state.capScale - CAP_SCALE_MIN) / (CAP_SCALE_MAX - CAP_SCALE_MIN);
    capSizeInput.style.setProperty('--p', `${ratio * 100}%`);

    // 光晕与数值气泡跟随滑块中心；面板展开前宽度为 0，跳过
    const w = capSizeInput.offsetWidth;
    if (!w) return;
    const x = CAP_THUMB_W / 2 + (w - CAP_THUMB_W) * ratio;
    capSliderWrap.style.setProperty('--tx', `${x}px`);
    capBubble.style.left = `${Math.min(Math.max(x, 22), w - 22)}px`;
  }

  capFonts.addEventListener('click', (e) => {
    const chip = e.target.closest('.cap-chip');
    if (!chip) return;
    state.capFont = chip.dataset.font;
    syncCapChips();
    syncCaption();
    mgTouch();
  });

  capSizeInput.addEventListener('input', () => {
    state.capScale = Number(capSizeInput.value) / 100;
    syncCapScale();
    syncCaption();
    mgTouch();
  });

  // 拖动反馈：放大滑块 / 光晕脉冲 / 数值气泡 / 整行高亮
  const setSliderDrag = (on) => {
    capSliderWrap.classList.toggle('is-drag', on);
    capSizeRow.classList.toggle('is-drag', on);
  };
  capSizeInput.addEventListener('pointerdown', () => setSliderDrag(true));
  window.addEventListener('pointerup', () => setSliderDrag(false));
  window.addEventListener('pointercancel', () => setSliderDrag(false));
  window.addEventListener('resize', syncCapScale);

  syncCapScale();
  syncCaption();

  // ------------------------------------------------------------------------
  // 05 · 惯性光圈拨轮
  // ------------------------------------------------------------------------

  let draggingDial = false;
  let dragLastY = 0;
  let dragLastT = 0;
  let dialVelocity = 0;
  let dialRaf = 0;

  function buildDial() {
    dialTicks.innerHTML = APERTURES.map((v, i) => `
      <span class="tick" style="transform: rotate(${i * 24}deg) translateY(-74px)">
        <i></i><b>${v}</b>
      </span>`).join('');
    applyDial(true);
  }

  function clampIndex(i) {
    return Math.max(0, Math.min(APERTURES.length - 1, i));
  }

  function applyDial(force) {
    dialTicks.style.transform = `rotate(${-state.dialPos * 24}deg)`;
    const idx = clampIndex(Math.round(state.dialPos));
    if (force || idx !== state.apertureIndex) {
      state.apertureIndex = idx;
      dialValue.textContent = apertureLabel();
      Array.from(dialTicks.children).forEach((t, i) => {
        t.classList.toggle('is-active', i === idx);
      });
      updateParamVisuals();
      previewWm.innerHTML = wmHTML();
    }
  }

  function pulseDial() {
    dial.classList.add('is-snapped');
    setTimeout(() => dial.classList.remove('is-snapped'), 320);
    mgTouch();
  }

  function startSpring() {
    cancelAnimationFrame(dialRaf);
    const target = clampIndex(Math.round(state.dialPos));
    let v = dialVelocity;
    let last = performance.now();

    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now;

      const stiffness = 150;
      const damping = 17;
      v += (target - state.dialPos) * stiffness * dt - v * damping * dt;
      state.dialPos += v * dt;

      applyDial(false);

      if (Math.abs(target - state.dialPos) < 0.004 && Math.abs(v) < 0.05) {
        state.dialPos = target;
        applyDial(false);
        pulseDial();
        return;
      }
      dialRaf = requestAnimationFrame(frame);
    };
    dialRaf = requestAnimationFrame(frame);
  }

  function openDial() {
    if (dial.classList.contains('is-on')) return;
    state.dialPos = state.apertureIndex;
    dialVelocity = 0;
    applyDial(true);
    dialScrim.classList.add('is-on');
    dial.classList.add('is-on');
    dial.setAttribute('aria-hidden', 'false');
    setStep(3);
  }

  function closeDial() {
    dial.classList.remove('is-on', 'is-snapped');
    dialScrim.classList.remove('is-on');
    dial.setAttribute('aria-hidden', 'true');
    cancelAnimationFrame(dialRaf);
    draggingDial = false;
  }

  dialScrim.addEventListener('click', closeDial);
  dialClose.addEventListener('click', closeDial);

  dialStage.addEventListener('pointerdown', (e) => {
    draggingDial = true;
    dragLastY = e.clientY;
    dragLastT = performance.now();
    dialVelocity = 0;
    cancelAnimationFrame(dialRaf);
    dialStage.setPointerCapture(e.pointerId);
  });

  dialStage.addEventListener('pointermove', (e) => {
    if (!draggingDial) return;
    const now = performance.now();
    const dy = e.clientY - dragLastY;
    const dt = Math.max((now - dragLastT) / 1000, 0.001);
    const delta = dy / 26;
    state.dialPos += delta;
    dialVelocity = delta / dt;
    dragLastY = e.clientY;
    dragLastT = now;
    applyDial(false);
  });

  function endDialDrag(e) {
    if (!draggingDial) return;
    draggingDial = false;
    try { dialStage.releasePointerCapture(e.pointerId); } catch (_) {}
    dialVelocity = Math.max(-80, Math.min(80, dialVelocity));
    startSpring();
  }
  dialStage.addEventListener('pointerup', endDialDrag);
  dialStage.addEventListener('pointercancel', endDialDrag);

  buildDial();

  // ------------------------------------------------------------------------
  // 01 · 导出完成反馈
  // ------------------------------------------------------------------------

  let exporting = false;

  function spawnBurst() {
    const pRect = phone.getBoundingClientRect();
    const bRect = exportBtn.getBoundingClientRect();
    const cx = bRect.left - pRect.left + bRect.width / 2;
    const cy = bRect.top - pRect.top + bRect.height / 2;
    const colors = ['#a8e9d4', '#5dcaa5', '#f3f0e9', '#e7b27c'];
    const n = 14;

    for (let i = 0; i < n; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      const angle = (Math.PI * 2 * i) / n + Math.random() * 0.5;
      const dist = 26 + Math.random() * 30;
      const size = 2 + Math.random() * 3.5;
      p.style.left = cx + 'px';
      p.style.top = cy + 'px';
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.background = colors[i % colors.length];
      p.style.boxShadow = `0 0 8px ${colors[i % colors.length]}`;
      burstLayer.appendChild(p);

      p.animate(
        [
          { transform: 'translate(-50%, -50%) scale(.4)', opacity: 1 },
          {
            transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px)) scale(1)`,
            opacity: 0
          }
        ],
        { duration: 560 + Math.random() * 260, easing: 'cubic-bezier(.2,.7,.3,1)' }
      ).onfinish = () => p.remove();
    }

    // 一圈扩散波纹
    const wave = document.createElement('span');
    wave.className = 'particle';
    wave.style.left = cx + 'px';
    wave.style.top = cy + 'px';
    wave.style.width = '14px';
    wave.style.height = '14px';
    wave.style.background = 'transparent';
    wave.style.boxShadow = 'inset 0 0 0 1px rgba(168,233,212,.8)';
    wave.style.borderRadius = '50%';
    burstLayer.appendChild(wave);
    wave.animate(
      [
        { transform: 'translate(-50%, -50%) scale(.3)', opacity: .9 },
        { transform: 'translate(-50%, -50%) scale(4.2)', opacity: 0 }
      ],
      { duration: 680, easing: 'cubic-bezier(.16,.84,.44,1)' }
    ).onfinish = () => wave.remove();
  }

  let toastTimer = 0;

  function showToast(text, ms = 2600) {
    toastTxt.textContent = text;
    toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-on'), ms);
  }

  function runExport() {
    if (exporting) return;
    exporting = true;
    exportBtn.classList.add('is-done');

    setTimeout(() => { if (!reduceMotion) spawnBurst(); }, 240);
    setTimeout(() => {
      if (!reduceMotion) {
        flash.animate(
          [{ opacity: 0 }, { opacity: .5, offset: .2 }, { opacity: 0 }],
          { duration: 720, easing: 'ease-out' }
        );
      }
    }, 340);
    setTimeout(() => {
      showToast(`已保存到相册 · ${state.photoSize} · ${EXPORT_FORMATS[state.exportFormat].label}`);
      setStep(4);
    }, 640);

    setTimeout(() => {
      exportBtn.classList.remove('is-done');
      exporting = false;
    }, 1900);
  }

  // 全局设置 · 默认导出格式
  function syncFormatCards() {
    fmtGrid.querySelectorAll('.fmt-card').forEach(card => {
      card.classList.toggle('is-on', card.dataset.fmt === state.exportFormat);
    });
    const label = EXPORT_FORMATS[state.exportFormat].label;
    if (!state.photoFormat) {
      settingsFollow.textContent = `尚未上传照片 · 默认 ${label}`;
    } else if (state.exportFormat === state.photoFormat) {
      settingsFollow.textContent = `已跟随原图格式 · ${label}`;
    } else {
      settingsFollow.textContent = `手动覆盖 · ${label}（重新上传会自动跟随）`;
    }
  }

  function openGlobalSettings() {
    gsPanel.classList.add('is-on');
    gsBackdrop.classList.add('is-on');
    gsPanel.setAttribute('aria-hidden', 'false');
    globalSettingsBtn.setAttribute('aria-expanded', 'true');
    globalSettingsBtn.classList.add('is-on');
    syncFormatCards();
  }

  function closeGlobalSettings() {
    gsPanel.classList.remove('is-on');
    gsBackdrop.classList.remove('is-on');
    gsPanel.setAttribute('aria-hidden', 'true');
    globalSettingsBtn.setAttribute('aria-expanded', 'false');
    globalSettingsBtn.classList.remove('is-on');
  }

  fmtGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.fmt-card');
    if (!card) return;
    state.exportFormat = card.dataset.fmt;
    syncFormatCards();
    mgTouch();
  });

  globalSettingsBtn.addEventListener('click', () => {
    if (gsPanel.classList.contains('is-on')) closeGlobalSettings();
    else openGlobalSettings();
  });
  gsClose.addEventListener('click', closeGlobalSettings);
  gsBackdrop.addEventListener('click', closeGlobalSettings);
  exportBtn.addEventListener('click', runExport);

  // ------------------------------------------------------------------------
  // 主题：白天 / 晚上 / 跟随系统
  // ------------------------------------------------------------------------

  const THEME_KEY = 'impression-theme-mode';
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

  function readThemeMode() {
    try {
      return localStorage.getItem(THEME_KEY) || 'auto';
    } catch {
      return 'auto';
    }
  }

  let themeMode = readThemeMode();

  function applyTheme() {
    const resolved = themeMode === 'auto' ? (systemTheme.matches ? 'dark' : 'light') : themeMode;
    phone.setAttribute('data-theme', resolved);
    themeSeg.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('is-on', btn.dataset.themeMode === themeMode);
    });
    themeNote.textContent = `App 当前${themeMode === 'auto' ? '跟随系统' : '手动选择'} · ${resolved === 'dark' ? '深色' : '浅色'}`;
  }

  themeSeg.addEventListener('click', (e) => {
    const btn = e.target.closest('.theme-btn');
    if (!btn) return;
    themeMode = btn.dataset.themeMode;
    try { localStorage.setItem(THEME_KEY, themeMode); } catch {}
    applyTheme();
    mgTouch();
  });

  const onSystemThemeChange = () => { if (themeMode === 'auto') applyTheme(); };
  if (systemTheme.addEventListener) systemTheme.addEventListener('change', onSystemThemeChange);
  else if (systemTheme.addListener) systemTheme.addListener(onSystemThemeChange);

  applyTheme();

  // ------------------------------------------------------------------------
  // 上传本地照片
  // ------------------------------------------------------------------------

  function detectFormat(file) {
    const type = (file.type || '').toLowerCase();
    if (type === 'image/png') return 'png';
    if (type === 'image/heic' || type === 'image/heif') return 'heic';
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    if (ext === 'png') return 'png';
    if (ext === 'heic' || ext === 'heif') return 'heic';
    return 'jpg';
  }

  function applyCustomPhoto() {
    if (!state.customPhoto) return;
    document.querySelectorAll('.print-photo img').forEach(img => {
      img.src = state.customPhoto;
    });
    const p1 = document.querySelector('.phone-photo.p1');
    const p2 = document.querySelector('.phone-photo.p2');
    if (p1) p1.style.backgroundImage = `url("${state.customPhoto}")`;
    if (p2) p2.style.backgroundImage = `url("${state.customPhoto}")`;
    photoBtn.classList.add('has-photo');
    syncFormatCards();
  }

  photoBtn.addEventListener('click', () => photoInput.click());
  previewPrint.addEventListener('click', () => photoInput.click());

  photoInput.addEventListener('change', () => {
    const file = photoInput.files && photoInput.files[0];
    photoInput.value = '';
    if (!file) return;
    const isImage = (file.type || '').startsWith('image/') ||
      /\.(png|jpg|jpeg|heic|heif|webp|gif)$/i.test(file.name || '');
    if (!isImage) {
      showToast('请选择图片文件');
      return;
    }

    const url = URL.createObjectURL(file);
    const probe = new Image();
    probe.onload = () => {
      if (state.customPhoto && state.customPhoto.startsWith('blob:')) {
        URL.revokeObjectURL(state.customPhoto);
      }
      const w = probe.naturalWidth;
      const h = probe.naturalHeight;
      const ratio = w / h;
      state.customPhoto = url;
      state.photoSize = `${w} × ${h}`;
      state.photoOrient = ratio > 1.05 ? '横版' : ratio < 0.95 ? '竖版' : '方形';
      state.photoAR = Math.min(1.9, Math.max(0.72, ratio)).toFixed(3);
      state.photoFormat = detectFormat(file);
      state.exportFormat = state.photoFormat;
      applyCustomPhoto();
      updatePreview();
      showToast(
        `已导入 · ${state.photoOrient} ${state.photoSize} · 导出 ${EXPORT_FORMATS[state.exportFormat].label}`,
        2600
      );
    };
    probe.onerror = () => {
      URL.revokeObjectURL(url);
      showToast('图片读取失败，换一张试试', 2400);
    };
    probe.src = url;
  });

  // ------------------------------------------------------------------------
  // 模板墙筛选
  // ------------------------------------------------------------------------

  filterRow.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter');
    if (!btn) return;
    state.filter = btn.dataset.filter;
    filterRow.querySelectorAll('.filter').forEach(b => b.classList.toggle('is-on', b === btn));
    renderTemplatesGrid();
  });

  // ------------------------------------------------------------------------
  // 通用跳转
  // ------------------------------------------------------------------------

  document.addEventListener('click', (e) => {
    const goto = e.target.closest('[data-goto]');
    if (!goto) return;
    e.preventDefault();
    switchView(goto.dataset.goto, goto);
  });

  // 首页叠卡 → 模板墙的快捷入口
  document.querySelectorAll('.sec-link[data-goto]').forEach(el => {
    el.addEventListener('click', (ev) => {
      ev.stopPropagation();
      switchView(el.dataset.goto, el);
    });
  });

  // ------------------------------------------------------------------------
  // 方案卡片 → 触发对应交互
  // ------------------------------------------------------------------------

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-try]');
    if (!btn) return;
    const kind = btn.dataset.try;
    const scrollPhone = () => {
      if (window.innerWidth <= 1180) {
        phoneShell.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
    scrollPhone();

    switch (kind) {
      case 'stack':
        if (currentView !== 'home') switchView('home', btn);
        setTimeout(() => toggleStack(true), currentView === 'home' ? 0 : 700);
        break;
      case 'params':
        openEditor(state.template, btn);
        setTimeout(() => {
          switchPanel('params');
          if (!state.params.film) toggleField('film');
        }, currentView === 'editor' ? 0 : 720);
        break;
      case 'rail':
        openEditor(state.template, btn);
        setTimeout(() => {
          switchPanel('layout');
          const next = (activeIndex + 1) % TEMPLATES.length;
          selectRailByTemplate(TEMPLATES[next].id, { scroll: true, draw: true });
        }, currentView === 'editor' ? 100 : 760);
        break;
      case 'dial':
        openEditor(state.template, btn);
        setTimeout(() => { switchPanel('params'); openDial(); }, currentView === 'editor' ? 100 : 760);
        break;
      case 'export':
        openEditor(state.template, btn);
        setTimeout(() => { switchPanel('layout'); runExport(); }, currentView === 'editor' ? 100 : 820);
        break;
      case 'tabs':
        switchView(currentView === 'templates' ? 'home' : 'templates', btn);
        break;
    }
  });

  // ------------------------------------------------------------------------
  // 键盘：Esc 关闭拨轮
  // ------------------------------------------------------------------------

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeGlobalSettings();
    closeDial();
  });

  // 首次进入：让版式条居中并画线
  window.addEventListener('load', () => {
    selectRailByTemplate(state.template, { scroll: false, draw: true });
    renderSteps();
  });

  // 图片兜底：失败时给照片一个渐变底
  document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
      e.target.style.display = 'none';
      if (e.target.parentElement) {
        e.target.parentElement.style.background =
          'linear-gradient(135deg, #2a3d36, #141a1a 55%, #3a2c22)';
      }
    }
  }, true);
})();
