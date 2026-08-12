// Метка канала из адреса страницы (`mewmori.com/?src=tg-prefire`) переезжает на
// ссылки «Скачать». Без неё скачивание невозможно сосчитать по каналам: путь
// «ролик → сайт → zip с GitHub» не открывает `mewmori://`, и приложение узнаёт
// об источнике ровно ничего.
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

  var links = document.querySelectorAll('a[href*="download.html"]');
  for (var index = 0; index < links.length; index += 1) {
    var url = new URL(links[index].getAttribute('href'), window.location.href);
    url.searchParams.set('src', src);
    links[index].setAttribute('href', url.pathname + url.search);
  }
})();
