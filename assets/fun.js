// Маленькие радости лендинга: кот говорит по клику, блоки появляются при
// прокрутке, а долиставшему до конца выдаётся ачивка — как в приложении.
// Всё необязательное: без JS страница остаётся полностью читаемой.
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isEnglish = document.documentElement.lang === 'en';

  // Реплики взяты из сценариев приложения, а не выдуманы.
  var LINES = isEnglish ? [
    'Mrrp.',
    'Oh, a dust speck! This is urgent.',
    "I'm feral! ⚡",
    "Just kidding! 😹 Everything's fine.",
    'I want to know you better! 😸',
    'Ready for a chase? Try to dodge! 🐾',
    "Let's play hide-and-seek! 🙈",
    'Found myself something important to do.'
  ] : [
    'Мур.',
    'О, пылинка! Это срочно.',
    'Я бешеный! ⚡',
    'Шутка! 😹 Всё под контролем.',
    'Хочу узнать тебя получше! 😸',
    'Готов к догонялкам? Попробуй увернуться! 🐾',
    'Давай сыграем в прятки! 🙈',
    'Кажется, я нашёл себе важное занятие.'
  ];

  // --- кот говорит по клику ---
  var cat = document.querySelector('.cat-hero');
  if (cat) {
    var bubble = document.createElement('div');
    bubble.className = 'cat-say panel';
    bubble.setAttribute('role', 'status');
    cat.parentNode.insertBefore(bubble, cat);

    var previous = -1;
    var hideTimer;
    cat.addEventListener('click', function () {
      var index = Math.floor(Math.random() * LINES.length);
      if (index === previous) index = (index + 1) % LINES.length;
      previous = index;

      bubble.textContent = LINES[index];
      bubble.classList.add('visible');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () { bubble.classList.remove('visible'); }, 3200);

      if (!reduced) {
        cat.animate(
          [{ transform: 'translateY(0)' }, { transform: 'translateY(-10px)' }, { transform: 'translateY(0)' }],
          { duration: 260, easing: 'steps(3, end)' }
        );
      }
      unlock();
    });
  }

  // --- появление блоков при прокрутке ---
  if (!reduced && 'IntersectionObserver' in window) {
    var blocks = document.querySelectorAll('.card, .reaction, .split > div, .faq details');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('shown');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px' });

    blocks.forEach(function (block, index) {
      block.classList.add('reveal');
      block.style.transitionDelay = Math.min(index % 4, 3) * 60 + 'ms';
      observer.observe(block);
    });
  }

  // --- ачивка за долистанный лендинг ---
  var unlocked = false;
  function unlock() {
    if (unlocked) return;
    try { if (sessionStorage.getItem('mewmori-achievement')) return; } catch (error) { /* пусто */ }
    unlocked = true;
    try { sessionStorage.setItem('mewmori-achievement', '1'); } catch (error) { /* пусто */ }

    var toast = document.createElement('div');
    toast.className = 'achievement panel';
    toast.setAttribute('role', 'status');
    toast.innerHTML = '<span class="emoji">🐾</span><span>' +
      '<span class="title">' + (isEnglish ? 'Achievement unlocked' : 'Достижение получено') + '</span><br>' +
      '<span class="desc">' + (isEnglish ? 'You poked the cat. It noticed.' : 'Ты ткнул кота. Он заметил.') + '</span></span>';
    document.body.appendChild(toast);

    requestAnimationFrame(function () { toast.classList.add('shown'); });
    setTimeout(function () {
      toast.classList.remove('shown');
      setTimeout(function () { toast.remove(); }, 400);
    }, 4200);
  }
})();
