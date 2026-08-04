// Автоматический выбор языка: русский по умолчанию, английский для всех
// остальных локалей. Ручной выбор в шапке запоминается и всегда сильнее
// автоматики. Скрипт грузится в <head> синхронно, чтобы не мигать чужим языком.
(function () {
  var KEY = 'mewmori-lang';
  var script = document.currentScript;
  if (!script) return;

  // База сайта считается от адреса самого скрипта, поэтому одинаково работает
  // и на mewmori.com, и на barredewe.github.io/mewmori-site/.
  var base = script.src.replace(/assets\/lang\.js.*$/, '');
  var here = location.href.split('#')[0].split('?')[0];
  var rest = here.indexOf(base) === 0 ? here.slice(base.length) : '';
  var isEnglish = rest.indexOf('en/') === 0;
  var page = isEnglish ? rest.slice(3) : rest;

  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (error) { /* приватный режим */ }

  var wanted = stored;
  if (!wanted) {
    var locale = (navigator.language || 'ru').toLowerCase();
    wanted = locale.indexOf('ru') === 0 ? 'ru' : 'en';
  }

  if (wanted === 'en' && !isEnglish) {
    location.replace(base + 'en/' + page + location.hash);
  } else if (wanted === 'ru' && isEnglish) {
    location.replace(base + page + location.hash);
  }

  // Клик по переключателю фиксирует выбор — иначе следующая страница увела бы
  // обратно по языку браузера.
  document.addEventListener('click', function (event) {
    var link = event.target.closest('[data-lang]');
    if (!link) return;
    try { localStorage.setItem(KEY, link.getAttribute('data-lang')); } catch (error) { /* пусто */ }
  });
})();
