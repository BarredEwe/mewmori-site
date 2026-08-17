// Метка канала из адреса страницы (`mewmori.com/?src=tg-prefire`) переезжает на
// все внутренние страницы сайта и, в итоге, на ссылку «Скачать». Без неё путь
// «ролик → главная → цены → zip с GitHub» теряет источник до того, как Worker
// успевает его посчитать.
//
// Считает не этот файл, а редирект `/go` в воркере: блокировщик рекламы его не
// вырежет, cookie он не ставит, и посетителя не запоминает — записываются
// только канал и дата. Здесь метка просто передаётся дальше по сайту.
//
// Ничего не ломается без JS: ссылки остаются прежними, скачивание работает,
// незасчитанным остаётся только клик.
(function () {
  var src = new URLSearchParams(window.location.search).get('src');
  if (!src || !/^[a-z][a-z0-9-]{0,31}$/.test(src)) return;

  var links = document.querySelectorAll('a[href]');
  for (var index = 0; index < links.length; index += 1) {
    var href = links[index].getAttribute('href');
    // A fragment stays on this document. Adding a query string to it would turn
    // an in-page navigation into a reload, so it deliberately keeps no rewrite.
    if (!href || href.charAt(0) === '#') continue;

    var url = new URL(href, window.location.href);
    // Never decorate a checkout, a social link, mail, or any other external
    // destination: `src` is only the site's own anonymous attribution tag.
    if (url.origin !== window.location.origin) continue;

    url.searchParams.set('src', src);
    links[index].setAttribute('href', url.pathname + url.search + url.hash);
  }
})();
