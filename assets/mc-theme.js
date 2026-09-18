/* ============================================================
   MAJU CodeCraft — mc-theme.js
   Shared behavior: wooden door intro, biome background engine,
   navbar toggle + day/night switch, nether-portal navigation,
   toast helper. Include after the page DOM (before </body>).
   ============================================================ */
(function(){
  "use strict";

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     DOOR INTRO
     Runs once per browser tab (sessionStorage), unless the
     page opts out with <body data-door="skip">.
  --------------------------------------------------------- */
  function initDoorIntro(){
    var body = document.body;
    if(body.dataset.door === 'skip') return;

    var seen = false;
    try{ seen = sessionStorage.getItem('mcc_door_seen') === '1'; }catch(e){}

    var wrap = document.getElementById('door-intro');
    if(!wrap) return;

    if(seen || reducedMotion){
      wrap.classList.add('hide');
      return;
    }

    wrap.classList.add('active');
    var skip = document.getElementById('door-skip');

    function finish(){
      wrap.classList.add('hide');
      try{ sessionStorage.setItem('mcc_door_seen', '1'); }catch(e){}
    }

    function runSequence(){
      setTimeout(function(){ wrap.classList.add('reveal'); }, 250);
      setTimeout(function(){ wrap.classList.add('open'); }, 1400);
      setTimeout(finish, 2600);
    }
    runSequence();

    if(skip){
      skip.addEventListener('click', function(){
        wrap.classList.add('open', 'reveal');
        setTimeout(finish, 300);
      });
    }
    wrap.addEventListener('click', function(e){
      if(e.target === wrap){ finish(); }
    });
  }

  /* ---------------------------------------------------------
     BIOME BACKGROUND ENGINE
     <body data-biomes="obsidian,nether,end"> declares the
     ordered biome list for this page. Sections with
     [data-biome-trigger="name"] switch the active biome when
     scrolled into view. Falls back to a single default biome
     if no triggers are present (still sets CSS vars once).
  --------------------------------------------------------- */
  var BIOMES = {
    obsidian: {
      night:{ top:'#1A1A1E', bottom:'#302426', fog:'rgba(48,36,38,0.0)',   accent:'#FFB238' },
      day:  { top:'#7FB8E0', bottom:'#E8B27A', fog:'rgba(255,220,170,0.10)', accent:'#FF8A3D' }
    },
    nether: {
      night:{ top:'#2B0A0A', bottom:'#4A1200', fog:'rgba(160,40,10,0.12)',  accent:'#FF5C2E' },
      day:  { top:'#E67B4E', bottom:'#F4A24A', fog:'rgba(255,150,60,0.14)',  accent:'#FF5C2E' }
    },
    end: {
      night:{ top:'#120B23', bottom:'#241640', fog:'rgba(120,70,200,0.14)', accent:'#B983FF' },
      day:  { top:'#9FB8E8', bottom:'#C9A8E8', fog:'rgba(180,150,230,0.14)', accent:'#8A5FD0' }
    },
    cave: {
      night:{ top:'#0B0E10', bottom:'#05070A', fog:'rgba(30,60,50,0.15)',   accent:'#39FF9A' },
      day:  { top:'#4A5A52', bottom:'#22302A', fog:'rgba(90,140,110,0.18)',  accent:'#39FF9A' }
    },
    ember: {
      night:{ top:'#241412', bottom:'#3A1810', fog:'rgba(232,68,44,0.10)',  accent:'#E8442C' },
      day:  { top:'#F0A878', bottom:'#E86B3E', fog:'rgba(232,68,44,0.12)',  accent:'#E8442C' }
    }
  };

  var currentBiomeName = null;

  function applyBiome(name){
    var b = BIOMES[name];
    if(!b) return;
    currentBiomeName = name;
    var mode = document.documentElement.getAttribute('data-mode') === 'day' ? 'day' : 'night';
    var v = b[mode];
    var root = document.documentElement.style;
    root.setProperty('--biome-top', v.top);
    root.setProperty('--biome-bottom', v.bottom);
    root.setProperty('--biome-fog', v.fog);
    root.setProperty('--biome-accent', v.accent);
    document.body.setAttribute('data-biome', name);
    skinTerrain(name);
  }

  /* re-applies the current biome's day/night variant — called by the toggle */
  window.mccRefreshBiome = function(){
    if(currentBiomeName) applyBiome(currentBiomeName);
  };

  function initBiomeEngine(){
    var body = document.body;
    var list = (body.dataset.biomes || 'obsidian').split(',').map(function(s){ return s.trim(); });
    buildTerrain();
    buildClouds();
    buildLandmarks();
    applyBiome(list[0]);

    var triggers = document.querySelectorAll('[data-biome-trigger]');
    if(!triggers.length) return;

    if('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            applyBiome(entry.target.getAttribute('data-biome-trigger'));
          }
        });
      }, { rootMargin:'-40% 0px -40% 0px', threshold:0 });
      triggers.forEach(function(t){ io.observe(t); });
    }
  }

  /* ---------------------------------------------------------
     TERRAIN STRIP — accurate 3-layer textures per biome,
     built once and re-skinned (not rebuilt) when the biome
     changes, so scroll transitions stay cheap.
  --------------------------------------------------------- */
  var TERRAIN_LAYERS = {
    obsidian: ['tex-grass',   'tex-dirt',        'tex-cobble'],
    nether:   ['tex-nylium',  'tex-netherbrick', 'tex-netherbrick'],
    end:      ['tex-purpur',  'tex-endstone',    'tex-endstone'],
    cave:     ['tex-cobble',  'tex-netherbrick', 'tex-cobble'],
    ember:    ['tex-magma',   'tex-basalt',      'tex-blackstone']
  };

  function buildTerrain(){
    var terrain = document.getElementById('biome-terrain');
    if(!terrain) return;
    var colCount = Math.ceil(window.innerWidth / 56) + 2;
    terrain.innerHTML = '';
    for(var i=0;i<colCount;i++){
      var col = document.createElement('div');
      col.className = 'biome-col';
      col.innerHTML =
        '<div class="biome-block terrain-l1"></div>' +
        '<div class="biome-block terrain-l2"></div>' +
        '<div class="biome-block terrain-l3"></div>';
      terrain.appendChild(col);
    }
  }

  function skinTerrain(biomeName){
    var layers = TERRAIN_LAYERS[biomeName] || TERRAIN_LAYERS.obsidian;
    document.querySelectorAll('.terrain-l1').forEach(function(el){ el.className = 'biome-block terrain-l1 ' + layers[0]; });
    document.querySelectorAll('.terrain-l2').forEach(function(el){ el.className = 'biome-block terrain-l2 ' + layers[1]; });
    document.querySelectorAll('.terrain-l3').forEach(function(el){ el.className = 'biome-block terrain-l3 ' + layers[2]; });
  }

  /* ---------------------------------------------------------
     CLOUDS — a handful drifting left to right, all biomes
  --------------------------------------------------------- */
  function buildClouds(){
    var layer = document.getElementById('biome-parallax');
    if(!layer || document.getElementById('mc-clouds')) return;
    var wrap = document.createElement('div');
    wrap.id = 'mc-clouds';
    wrap.style.cssText = 'position:absolute; inset:0; overflow:hidden;';
    var count = window.innerWidth < 700 ? 3 : 5;
    for(var i=0;i<count;i++){
      var c = document.createElement('div');
      c.className = 'mc-cloud';
      var w = 90 + Math.random()*70;
      var h = w*0.42;
      c.style.width = w+'px';
      c.style.height = h+'px';
      c.style.top = (5 + Math.random()*30) + '%';
      var dur = 45 + Math.random()*40;
      c.style.animationDuration = dur+'s';
      c.style.animationDelay = (-Math.random()*dur)+'s';
      c.innerHTML = '<svg viewBox="0 0 100 42" xmlns="http://www.w3.org/2000/svg">' +
        '<g fill="#EDEDF2" opacity="0.85"><rect x="10" y="18" width="70" height="18"/><rect x="20" y="8" width="40" height="14"/><rect x="0" y="24" width="14" height="10"/><rect x="82" y="22" width="14" height="10"/></g></svg>';
      wrap.appendChild(c);
    }
    layer.appendChild(wrap);
  }

  /* ---------------------------------------------------------
     BIOME LANDMARKS — library/enchant table (overworld),
     nether castle with mirrored MAJU mark (nether),
     end portal frame (end). Built once, CSS shows/hides them
     based on body[data-biome].
  --------------------------------------------------------- */
  function buildLandmarks(){
    var layer = document.getElementById('biome-parallax');
    if(!layer || document.getElementById('mc-landmarks')) return;
    var wrap = document.createElement('div');
    wrap.id = 'mc-landmarks';

    var library = document.createElement('div');
    library.className = 'biome-landmark landmark-library';
    library.innerHTML =
      '<div class="lib-shelf"></div>' +
      '<div class="lib-table"></div>' +
      '<div class="lib-book"></div>';

    // --- Three MAJU Block castles side-by-side in nether biome ---
    var castlesWrap = document.createElement('div');
    castlesWrap.className = 'biome-landmark landmark-castles';

    // Castle 1: MAJU BLOCK A&B  — tallest/widest on the left
    var castleAB = document.createElement('div');
    castleAB.className = 'mc-castle mc-castle--ab';
    castleAB.innerHTML =
      '<div class="castle-tower t1"></div>' +
      '<div class="castle-tower t2"></div>' +
      '<div class="castle-wall"></div>' +
      '<div class="castle-sign"><span><em>MAJU BLOCK</em>A &amp; B</span></div>' +
      '<div class="castle-glow" style="animation-delay:-1.2s"></div>';
    castlesWrap.appendChild(castleAB);

    // Castle 2: MAJU BLOCK C — medium, center
    var castleC = document.createElement('div');
    castleC.className = 'mc-castle mc-castle--c';
    castleC.innerHTML =
      '<div class="castle-tower t1"></div>' +
      '<div class="castle-tower t2"></div>' +
      '<div class="castle-wall"></div>' +
      '<div class="castle-sign"><span><em>MAJU BLOCK</em>C</span></div>' +
      '<div class="castle-glow" style="animation-delay:-2.5s"></div>';
    castlesWrap.appendChild(castleC);

    // Castle 3: MAJU BLOCK D — original style, right
    var castleD = document.createElement('div');
    castleD.className = 'mc-castle mc-castle--d';
    castleD.innerHTML =
      '<div class="castle-tower t1"></div>' +
      '<div class="castle-tower t2"></div>' +
      '<div class="castle-wall"></div>' +
      '<div class="castle-sign"><span><em>MAJU BLOCK</em>D</span></div>' +
      '<div class="castle-glow" style="animation-delay:0s"></div>';
    castlesWrap.appendChild(castleD);

    var endportal = document.createElement('div');
    endportal.className = 'biome-landmark landmark-endportal';
    endportal.innerHTML =
      '<div class="endportal-frame"><div class="endportal-inner tex-endportal"></div></div>';

    var forge = document.createElement('div');
    forge.className = 'biome-landmark landmark-forge';
    forge.innerHTML =
      '<div class="forge-chain"></div>' +
      '<div class="forge-furnace"></div>' +
      '<div class="forge-mouth"></div>' +
      '<div class="forge-chimney-glow"></div>' +
      '<div class="forge-anvil">' +
        '<div class="forge-anvil-top"></div>' +
        '<div class="forge-anvil-base"></div>' +
        '<div class="forge-anvil-spark"></div>' +
      '</div>' +
      '<div class="forge-trough"></div>';

    wrap.appendChild(library);
    wrap.appendChild(castlesWrap);
    wrap.appendChild(endportal);
    wrap.appendChild(forge);
    layer.appendChild(wrap);
  }

  /* ---------------------------------------------------------
     MOUSE PARALLAX for #biome-parallax (subtle, desktop only)
  --------------------------------------------------------- */
  function initParallax(){
    var layer = document.getElementById('biome-parallax');
    if(!layer || reducedMotion) return;
    document.addEventListener('mousemove', function(e){
      var x = (e.clientX / window.innerWidth - 0.5);
      var y = (e.clientY / window.innerHeight - 0.5);
      layer.style.transform = 'translate(' + (x*-14) + 'px,' + (y*-8) + 'px)';
    });
  }

  /* ---------------------------------------------------------
     NAVBAR: mobile toggle + day/night switch
  --------------------------------------------------------- */
  function initNavbar(){
    var toggle = document.querySelector('.mc-nav-toggle');
    var links = document.querySelector('.mc-nav-links');
    if(toggle && links){
      toggle.addEventListener('click', function(){
        links.classList.toggle('open');
      });
    }

    var daynight = document.querySelector('.mc-daynight');
    if(daynight){
      daynight.addEventListener('click', function(){
        var isDay = document.documentElement.getAttribute('data-mode') === 'day';
        document.documentElement.setAttribute('data-mode', isDay ? 'night' : 'day');
        try{ localStorage.setItem('mcc_mode', isDay ? 'night' : 'day'); }catch(e){}
        if(window.mccRefreshBiome) window.mccRefreshBiome();
      });
    }
  }

  /* ---------------------------------------------------------
     TOAST helper — exposed as window.mccToast
  --------------------------------------------------------- */
  function ensureToast(){
    var t = document.getElementById('mcc-toast');
    if(!t){
      t = document.createElement('div');
      t.id = 'mcc-toast';
      t.className = 'mc-toast';
      document.body.appendChild(t);
    }
    return t;
  }
  var toastTimer;
  window.mccToast = function(msg){
    var t = ensureToast();
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ t.classList.remove('show'); }, 1800);
  };

  /* ---------------------------------------------------------
     NETHER PORTAL NAVIGATION
     Any element with [data-portal-nav="url.html"] triggers the
     purple screen-wipe, then navigates.
  --------------------------------------------------------- */
  function ensurePortalOverlay(){
    var el = document.getElementById('portal-transition');
    if(!el){
      el = document.createElement('div');
      el.id = 'portal-transition';
      document.body.appendChild(el);
    }
    return el;
  }
  function initPortalNav(){
    var triggers = document.querySelectorAll('[data-portal-nav]');
    if(!triggers.length) return;
    var overlay = ensurePortalOverlay();
    triggers.forEach(function(el){
      el.addEventListener('click', function(e){
        var href = el.getAttribute('data-portal-nav');
        if(!href) return;
        e.preventDefault();
        overlay.classList.add('active');
        setTimeout(function(){ window.location.href = href; }, reducedMotion ? 50 : 650);
      });
    });
  }

  /* ---------------------------------------------------------
     BREAKABLE FLOATING BLOCKS (ambient, reusable)
     Any element with [data-breakable] cracks on click, pops
     on the 3rd hit, then respawns nearby.
  --------------------------------------------------------- */
  function initBreakables(){
    document.querySelectorAll('[data-breakable]').forEach(function(b){
      var hits = 0;
      var crack = document.createElement('div');
      crack.className = 'crack';
      crack.style.cssText = 'position:absolute;inset:0;pointer-events:none;opacity:0;background-image:repeating-linear-gradient(45deg, rgba(0,0,0,0.5) 0 2px, transparent 2px 6px);';
      b.style.position = b.style.position || 'absolute';
      b.appendChild(crack);
      b.addEventListener('click', function(){
        hits++;
        if(hits < 3){
          crack.style.opacity = '1';
          setTimeout(function(){ crack.style.opacity = '0'; }, 150);
        } else {
          b.style.transition = 'transform 0.35s, opacity 0.35s';
          b.style.transform = 'scale(0) rotate(20deg)';
          b.style.opacity = '0';
          if(window.mccToast) window.mccToast('Block broken!');
          setTimeout(function(){
            b.style.transition = '';
            b.style.transform = '';
            b.style.opacity = '';
            hits = 0;
          }, 400);
        }
      });
    });
  }

  /* Apply saved day/night preference before first paint of biome colors,
     so we don't flash night colors then immediately switch to day. */
  (function initModeEarly(){
    try{
      if(localStorage.getItem('mcc_mode') === 'day'){
        document.documentElement.setAttribute('data-mode','day');
      }
    }catch(e){}
  })();

  document.addEventListener('DOMContentLoaded', function(){
    initDoorIntro();
    initBiomeEngine();
    initParallax();
    initNavbar();
    initPortalNav();
    initBreakables();
  });
})();
