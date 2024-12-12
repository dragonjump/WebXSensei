
/**
 * Retrieves the titles of web pages viewed in the last {@link LAST_HOURS} hours, and
 * returns them as a comma-separated string.
 * @returns {Promise<string>} a string of the titles of web pages viewed in the
 * last {@link LAST_HOURS} hours, separated by commas.
 */
async function getHistoryViewingTitles() {
  const LAST_HOURS = 1;  // 1 hours of history to retrieve

  if (chrome && chrome.history && chrome.history.search) {
    const historyList = await chrome.history.search({
      text: '',
      startTime: Date.now() - LAST_HOURS * 60 * 60 * 1000, // last `n` hours
      endTime: Date.now(),
      maxResults: 100
    }) || []
    const resultHistoryViews = historyList.map(obj => obj && obj.title ? `title: ${obj.title || ''}` : '').join(', ');

    return resultHistoryViews;
  }
  return '';
}


/**
 * Initiate event listener to receive message
 */
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {

  reset()
  sleep(1000) // give gpu some time to destroy

  highlightedMessage = message.text
  resetDisplayResponses()
  // When user highlight word and generate comment
  if (message.action === 'higlightTextForContribution') {
    show(elementContributionBlock)

    elementLogo.src = 'images/th2.jpg'
    discussionText = '<h5>Discussion Context - Highlighted Texts</h5>' + message.text;
    elementDiscussionContext.innerHTML = discussionText;
    elementDiscussionContext.scrollIntoView();
    // let user see awhile then activate , then auto emulate for user
    setTimeout(() => {
      buttonPrompt.click()
    }, 0);
  }



  // When user highlight word and try understand
  if (message.action === 'higlightTextForEnlightment') {
    show(elementEnlighmentBlock)
    // Split sentences into words
    const wordList = message.text.split(' ').filter(word => word !== ' ' && word !== '').filter((value, index, self) => self.indexOf(value) === index);;

    if (wordList.length > 0) {
      elementHighlightedText.innerHTML = '';
      elementLogo.src = 'images/th2.jpg'

      // generate the visual-pill element for each word
      wordList.forEach(async (textData, indexNo) => {
        generatePill(textData, indexNo)
      });

      // Choose first default word to explain 
      const firstSpan = elementHighlightedText.querySelector('span:first-child');
      firstSpan.click();

    }

  }
  // When user want navigation wisdom
  if (message.action === 'navigationWisdom') {
    show(elementNavigationWisdomBlock)

    const getHTMLContent = function () {
      const title = document.title;
      const url = document.URL;
      const body = document.body.innerText.substring(0, 200);

      const metas = Array.from(document.querySelectorAll('meta[name]')).map(meta => {
        return { name: meta.getAttribute('name'), content: meta.getAttribute('content') };
      });
      return "body: " + body + "|url: " + url + " |title: " + title + " |description: " + JSON.stringify(metas);
    }

    // get browsing history
    const historyTextTitles = await getHistoryViewingTitles();

    // get current browsing
    const tabActiveList = []
    chrome.tabs.query({}, function (tabs) {
      const promises = tabs.map(tab => {
        return new Promise(resolve => {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: getHTMLContent
          }, (results) => {
            if (results && results[0] && results[0].result) {
              tabActiveList.push({
                tabId: tab.id,
                htmlContent: results[0].result
              })
              // console.log(`Tab ${tab.id} HTML content: ${results[0].result}`);
            }
            resolve();
          });
        });
      });

      Promise.all(promises).then(() => {
        console.info('All script executions finished:>tabActiveList', tabActiveList);
        console.info('All script executions finished:>historyTextTitles', historyTextTitles);
        getHandledResponseTypeForWisdom(tabActiveList, historyTextTitles)
        elementObservationBrowsingView.innerHTML = tabActiveList
      });
    });

    // prompt api ask to get what you know abouit me

  }
});



