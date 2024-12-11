
async function initDefaults() {
  if (!('aiOriginTrial' in chrome)) {
    showError('Technical Error: chrome.aiOriginTrial not supported in this browser');
    return;

  }
  buttonPrompt.addEventListener('click', async () => {
    return getHandledResponseTypeForContribution(discussionText);
  });

  elementLogoBlock.addEventListener('click', () => {
    chrome.runtime.reload();
    // chrome.sidebarAction.reload();
  });
  elementBannerBlock.addEventListener('click', () => {
    resetDisplayResponses();
    show(elementVideoBlock);
  });
  elementError.addEventListener('click', () => {
    hide(elementError);
  });
  const defaults = await chrome.aiOriginTrial.languageModel.capabilities();
  // console.log('Model default:', defaults);
  if (defaults.available !== 'readily') {
    showError(
      `Technical Error:  Model not yet available (current state: "${defaults.available}")`
    );
    return;
  }

}

initDefaults();
