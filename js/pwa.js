let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  const button = document.getElementById('installButton');
  if (button) button.hidden = false;
});
window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  const button = document.getElementById('installButton');
  if (button) button.hidden = true;
  showToast('بازی به صفحهٔ اصلی اضافه شد.');
});
async function installGame() {
  if (!deferredInstallPrompt) {
    showToast('از منوی مرورگر، «افزودن به صفحهٔ اصلی» را انتخاب کن.');
    return;
  }
  deferredInstallPrompt.prompt();
  const promptEvent = deferredInstallPrompt;
  deferredInstallPrompt = null;
  const button = document.getElementById('installButton');
  if (button) button.hidden = true;
  await promptEvent.userChoice;
}
