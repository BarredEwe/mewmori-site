#!/usr/bin/env bash
# Подставляет реквизиты из requisites.env в HTML-страницы, на месте.
#
# Заменяет {{FULL_NAME}}, {{INN}} и остальные плейсхолдеры. После прогона
# плейсхолдеров в файлах не остаётся, поэтому повторный запуск с новыми
# значениями ничего не найдёт — сначала верни исходники: git checkout -- '*.html'
set -euo pipefail
cd "$(dirname "$0")"

[ -f requisites.env ] || { echo "Нет requisites.env — скопируй requisites.env.example"; exit 1; }
# shellcheck disable=SC1091
source ./requisites.env

for key in FULL_NAME SELLER_SHORT INN ADDRESS EMAIL DATE; do
  [ -n "${!key:-}" ] || { echo "Не заполнено: $key"; exit 1; }
done

for file in *.html; do
  for key in FULL_NAME SELLER_SHORT INN ADDRESS EMAIL DATE; do
    value="${!key}"
    # | не встречается в реквизитах, поэтому годится как разделитель sed
    sed -i '' "s|{{$key}}|${value//|/\\|}|g" "$file"
  done
done

remaining=$(grep -l '{{' ./*.html || true)
if [ -n "$remaining" ]; then
  echo "Остались незаполненные плейсхолдеры в: $remaining"
  exit 1
fi

echo "Готово. Проверь подвал и страницу contacts.html."
