
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




  inputPrompt.addEventListener('click', () => {
   inputPrompt.classList.toggle('inactive');
  });
  // DICTIONARY 
  elementEnlighmentMenu.querySelector('span[data-target="dictionary"]').addEventListener('click', async () => {
    await getHandledResponseTypeForEnglightment(
      TYPE_OF_RESPONSE_PROMPT.DICTIONARY, selectedWordText)
  });  

  // THESAURUS
  elementEnlighmentMenu.querySelector('span[data-target="thesaurus"]').addEventListener('click', async () => {
    await getHandledResponseTypeForEnglightment(
      TYPE_OF_RESPONSE_PROMPT.THESAURUS, selectedWordText)
  });

 

  // MODERN
  elementEnlighmentMenu.querySelector('span[data-target="modern"]').addEventListener('click', async () => {
    await getHandledResponseTypeForEnglightment(
      TYPE_OF_RESPONSE_PROMPT.MODERN, selectedWordText)
  });
 
  // SUMMARY
  elementEnlighmentMenu.querySelector('span[data-target="Summary"]').addEventListener('click', async () => {

    getSummarizeContext(highlightedMessage);
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
