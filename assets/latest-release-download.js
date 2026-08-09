const latestReleaseAPI = 'https://api.github.com/repos/Mewmori-App/Mewmori-Updates/releases/latest';
const archiveName = /^Mewmori-\d+(?:\.\d+)*\.zip$/;
const status = document.querySelector('#download-status');

try {
  const response = await fetch(latestReleaseAPI, {
    headers: { Accept: 'application/vnd.github+json' },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`GitHub returned ${response.status}`);

  const release = await response.json();
  const archive = release.assets?.find(({ name }) => archiveName.test(name));
  if (!archive?.browser_download_url) throw new Error('Latest release archive is missing');

  const version = typeof release.tag_name === 'string' ? release.tag_name.replace(/^v/, '') : null;
  status.textContent = version
    ? `Нашёл Mewmori ${version}. Начинаю загрузку…`
    : 'Нашёл свежую версию. Начинаю загрузку…';
  window.location.replace(archive.browser_download_url);
} catch (error) {
  document.querySelector('.download-panel')?.setAttribute('data-state', 'error');
  status.textContent = 'Не удалось начать загрузку. Попробуй ещё раз чуть позже.';
  console.error('Mewmori download redirect failed', error);
}
