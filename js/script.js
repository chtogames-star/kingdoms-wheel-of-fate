// mobile nav
var toggle = document.getElementById('navToggle');
var nav = document.getElementById('primary-nav');
toggle.addEventListener('click', function(){
  var open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});
nav.querySelectorAll('a').forEach(function(a){
  a.addEventListener('click', function(){ nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); });
});

// scroll offset for fixed header
document.querySelectorAll('section[id]').forEach(function(s){ s.style.scrollMarginTop = '84px'; });

// item dex tabs (weapon / armor)
document.querySelectorAll('.dex-tab-btn').forEach(function(btn){
  btn.addEventListener('click', function(){
    var tabs = btn.closest('.item-cat-block');
    tabs.querySelectorAll('.dex-tab-btn').forEach(function(b){
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    var target = btn.getAttribute('data-dex-tab');
    tabs.querySelectorAll('.dex-panel').forEach(function(p){
      p.classList.toggle('active', p.getAttribute('data-dex-panel') === target);
    });
  });
});

// reveal on scroll
var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var revealEls = document.querySelectorAll('.reveal');
if(reduceMotion || !('IntersectionObserver' in window)){
  revealEls.forEach(function(el){ el.classList.add('in-view'); });
} else {
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){ entry.target.classList.add('in-view'); io.unobserve(entry.target); }
    });
  }, { threshold:.12, rootMargin:'0px 0px -40px 0px' });
  revealEls.forEach(function(el){ io.observe(el); });
}

// ember particles across the whole page
(function(){
  var canvas = document.getElementById('embers');
  var ctx = canvas.getContext('2d');
  var particles = [];
  var COUNT = reduceMotion ? 0 : 46;

  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  function makeParticle(randomY){
    var goldSide = Math.random() < 0.5;
    return {
      x: Math.random() * canvas.width,
      y: randomY ? Math.random() * canvas.height : canvas.height + 20,
      r: Math.random() * 1.6 + .6,
      speed: Math.random() * .35 + .12,
      drift: (Math.random() - .5) * .3,
      alpha: Math.random() * .5 + .2,
      color: goldSide ? '201,162,75' : '156,59,73'
    };
  }
  function init(){
    resize();
    particles = [];
    for(var i=0;i<COUNT;i++){ particles.push(makeParticle(true)); }
  }
  function tick(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(function(p){
      p.y -= p.speed; p.x += p.drift;
      if(p.y < -10){ Object.assign(p, makeParticle(false)); }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(' + p.color + ',' + p.alpha + ')';
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }
  init();
  window.addEventListener('resize', resize);
  if(COUNT > 0){ requestAnimationFrame(tick); }
})();
