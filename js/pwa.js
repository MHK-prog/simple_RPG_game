let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  document.getElementById('installButton')?.classList.add('install-ready');
});
window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  showToast('بازی به صفحهٔ اصلی اضافه شد.');
});
async function installGame() {
  if (!deferredInstallPrompt) {
    showToast('از منوی مرورگر، «افزودن به صفحهٔ اصلی» را انتخاب کن.');
    return;
  }
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
}
