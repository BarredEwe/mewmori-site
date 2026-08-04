# mewmori-site

Сайт https://mewmori.com — статика, GitHub Pages. Он же витрина, он же комплект
документов, который Robokassa требует при регистрации магазина.

```
index.html      лендинг + витрина скинов + прайс-лист
payment.html    оплата, безопасность платежей, порядок получения ключа
refund.html     возврат
offer.html      публичная оферта (договор)
privacy.html    политика конфиденциальности
contacts.html   контакты и реквизиты продавца
404.html        страница ошибки
assets/         стили, иконка, спрайты котов
CNAME           mewmori.com — Pages читает этот файл
fill.sh         подстановка реквизитов из requisites.env
```

Никакой сборки: файлы отдаются как есть. Локально —
`python3 -m http.server 8000` и открыть http://localhost:8000.

## 1. Реквизиты

```bash
cp requisites.env.example requisites.env
$EDITOR requisites.env
./fill.sh
```

`requisites.env` в `.gitignore`. Скрипт правит HTML на месте, поэтому для смены
значений сначала верни плейсхолдеры: `git checkout -- '*.html'`.

Robokassa не пропускает магазин без ФИО, ИНН, работающей почты и телефона —
плейсхолдеры на живом сайте гарантированно вернут заявку на доработку.

## 2. Публикация

```bash
git init && git add -A && git commit -m "Mewmori site"
gh repo create BarredEwe/mewmori-site --public --source=. --push
```

Репозиторий должен быть публичным: кастомный домен на Pages в приватном репо
требует платного плана.

Settings → Pages → Source: **Deploy from a branch**, ветка `main`, папка `/ (root)`.
Через минуту сайт живёт на `https://barredewe.github.io/mewmori-site/`.

## 3. Домен

Купить `mewmori.com` (Namecheap, Porkbun, Cloudflare Registrar — последний
продаёт по себестоимости, но требует переноса домена к себе). У регистратора
прописать DNS:

```
A     @   185.199.108.153
A     @   185.199.109.153
A     @   185.199.110.153
A     @   185.199.111.153
AAAA  @   2606:50c0:8000::153
AAAA  @   2606:50c0:8001::153
AAAA  @   2606:50c0:8002::153
AAAA  @   2606:50c0:8003::153
CNAME www barredewe.github.io.
```

Затем Settings → Pages → Custom domain: `mewmori.com`, дождаться проверки
и включить **Enforce HTTPS** (сертификат Let's Encrypt выпускается автоматически,
обычно 15 минут — час).

Если домен на Cloudflare: записи должны быть **DNS only** (серое облако), иначе
Pages не сможет выпустить сертификат. После выпуска проксирование можно включить.

## 4. Почта на домене

Robokassa пишет на адрес из заявки, и он же указан в оферте. Бесплатный вариант —
Cloudflare Email Routing (`support@mewmori.com` → личный ящик) или Яндекс 360
для бизнеса.

## 5. Что дальше

Регистрация магазина в Robokassa и связка с воркером — в
`ScreenCat/docs/ROBOKASSA_SETUP.md`.
