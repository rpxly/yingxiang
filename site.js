/* 印象 · 官网交互 */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ---------------- nav ---------------- */
  var nav = document.getElementById("siteNav");
  function onScroll() {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 10);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------- reveal ---------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  document.querySelectorAll(".hero-copy [data-reveal]").forEach(function (el, i) {
    el.style.transitionDelay = (i * 0.08) + "s";
  });

  /* ---------------- layout filter ---------------- */
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
  var layoutCards = Array.prototype.slice.call(document.querySelectorAll("#layoutGrid .layout-card"));

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filter = btn.dataset.filter;
      filterButtons.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle("is-on", active);
        b.setAttribute("aria-pressed", active ? "true" : "false");
      });
      layoutCards.forEach(function (card) {
        card.hidden = !(filter === "all" || card.dataset.family === filter);
      });
    });
  });

  /* ---------------- live demo ---------------- */
  var photos = {
    mist: {
      src: "assets/img/photo-01-mist.jpg",
      alt: "雾中山景与孤松",
      focus: "50% 44%",
      title: "雾中来客",
      brand: "HASSELBLAD",
      model: "503CXI",
      lens: "CF 80MM",
      aperture: "f/2.8",
      shutter: "1/250s",
      iso: "ISO 100",
      script: "Rolleiflex 2.8F"
    },
    dunes: {
      src: "assets/img/photo-04-dunes.jpg",
      alt: "黄昏时的连绵沙丘",
      focus: "50% 52%",
      title: "沙丘来信",
      brand: "ROLLEI",
      model: "2.8F",
      lens: "PLANAR 80MM",
      aperture: "f/4",
      shutter: "1/500s",
      iso: "ISO 200",
      script: "Rolleiflex 2.8F"
    },
    portrait: {
      src: "assets/img/photo-03-portrait.jpg",
      alt: "午后逆光下的人像",
      focus: "50% 30%",
      title: "午后",
      brand: "LEICA",
      model: "M6",
      lens: "SUMMICRON 35MM",
      aperture: "f/2",
      shutter: "1/125s",
      iso: "ISO 400",
      script: "Leica M6"
    },
    camera: {
      src: "assets/img/photo-05-camera.jpg",
      alt: "窗边的胶片相机与干花",
      focus: "50% 48%",
      title: "窗边静物",
      brand: "HASSELBLAD",
      model: "503CXI",
      lens: "CF 80MM",
      aperture: "f/2.8",
      shutter: "1/125s",
      iso: "ISO 400",
      script: "Leica M6"
    }
  };

  var layouts = {
    mat: "MAT WARM · 1240 × 1550",
    mag: "EDITORIAL NO · 1240 × 1550",
    polaroid: "POLAROID · 1240 × 1550",
    dark: "DARKROOM · 1240 × 1550"
  };

  var demoFrame = document.getElementById("demoFrame");
  var demoPhoto = document.getElementById("demoPhoto");
  var demoMagHead = document.getElementById("demoMagHead");
  var demoMagNum = document.getElementById("demoMagNum");
  var demoScript = document.getElementById("demoScript");
  var dTitle = document.getElementById("dTitle");
  var dGear = document.getElementById("dGear");
  var dExif = document.getElementById("dExif");
  var demoSpec = document.getElementById("demoSpec");
  var captionInput = document.getElementById("captionInput");
  var captionCount = document.getElementById("captionCount");

  var state = {
    photo: "mist",
    layout: "mat",
    fields: { model: true, lens: true, aperture: true, shutter: true, iso: true }
  };
  var titleEdited = false;

  function countChars(value) {
    return Array.prototype.slice.call(value).length;
  }

  function setCaption(value, edited) {
    if (!captionInput) return;
    captionInput.value = value;
    if (captionCount) captionCount.textContent = countChars(value) + " / 18";
    titleEdited = !!edited;
  }

  function updateCaptionFromInput() {
    var value = captionInput.value;
    var max = 18;
    if (countChars(value) > max) {
      value = Array.prototype.slice.call(value).slice(0, max).join("");
      captionInput.value = value;
    }
    if (captionCount) captionCount.textContent = countChars(value) + " / 18";
    if (dTitle) dTitle.textContent = value || "无题";
    titleEdited = true;
  }

  function renderMeta() {
    var p = photos[state.photo];
    if (!p) return;

    var gearParts = [];
    if (state.fields.model) gearParts.push(p.brand + " " + p.model);
    if (state.fields.lens) gearParts.push(p.lens);

    var exifParts = [];
    if (state.fields.aperture) exifParts.push(p.aperture);
    if (state.fields.shutter) exifParts.push(p.shutter);
    if (state.fields.iso) exifParts.push(p.iso);
    if (exifParts.length) exifParts.push("2026");

    if (dGear) {
      dGear.textContent = gearParts.join(" · ");
      dGear.hidden = gearParts.length === 0;
    }
    if (dExif) {
      dExif.textContent = exifParts.join("　");
      dExif.hidden = exifParts.length === 0;
    }
    if (demoMagHead) {
      demoMagHead.innerHTML = "<span>" + p.brand + "</span><span>VOL.04 / 2026</span>";
    }
    if (demoMagNum) demoMagNum.textContent = state.photo === "dunes" ? "No.05" : "No.04";
    if (demoScript) demoScript.textContent = p.script;
  }

  function renderPhoto() {
    var p = photos[state.photo];
    if (!p) return;
    if (demoPhoto) {
      demoPhoto.src = p.src;
      demoPhoto.alt = p.alt;
      demoPhoto.style.objectPosition = p.focus;
    }
    if (captionInput && !titleEdited) {
      setCaption(p.title, false);
    }
    if (dTitle) dTitle.textContent = captionInput && captionInput.value ? captionInput.value : p.title;
    renderMeta();
  }

  function renderLayout() {
    if (!demoFrame) return;
    demoFrame.classList.remove("is-mat", "is-mag", "is-polaroid", "is-dark");
    demoFrame.classList.add("is-" + state.layout);
    if (demoSpec) demoSpec.textContent = layouts[state.layout] || layouts.mat;
  }

  if (captionInput) {
    captionInput.addEventListener("input", updateCaptionFromInput);
    captionInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        captionInput.blur();
      }
    });
  }

  Array.prototype.slice.call(document.querySelectorAll("#photoThumbs .thumb")).forEach(function (btn) {
    btn.addEventListener("click", function () {
      state.photo = btn.dataset.photo;
      document.querySelectorAll("#photoThumbs .thumb").forEach(function (b) {
        var active = b === btn;
        b.classList.toggle("is-on", active);
        b.setAttribute("aria-pressed", active ? "true" : "false");
      });
      renderPhoto();
    });
  });

  Array.prototype.slice.call(document.querySelectorAll("#layoutSeg .seg")).forEach(function (btn) {
    btn.addEventListener("click", function () {
      state.layout = btn.dataset.layout;
      document.querySelectorAll("#layoutSeg .seg").forEach(function (b) {
        var active = b === btn;
        b.classList.toggle("is-on", active);
        b.setAttribute("aria-pressed", active ? "true" : "false");
      });
      renderLayout();
    });
  });

  Array.prototype.slice.call(document.querySelectorAll("#fieldToggles .toggle")).forEach(function (btn) {
    btn.addEventListener("click", function () {
      var field = btn.dataset.field;
      state.fields[field] = !state.fields[field];
      var on = state.fields[field];
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      renderMeta();
    });
  });

  if (demoFrame) {
    renderPhoto();
    renderLayout();
  }

  /* ---------------- download ---------------- */
  document.querySelectorAll("[data-download]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var a = document.createElement("a");
      a.href = "APK/impression.apk";
      a.download = "impression.apk";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  });
})();
