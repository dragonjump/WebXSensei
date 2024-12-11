  
// WARNING: THIS IS AUTOGENERATED FILE!
// WARNING: Modify instead /sidepanel/lib/*.js files 
// Do not modify this file


 import DOMPurify from 'dompurify';
import { marked } from 'marked';
  
const DEFAULT_PROMPT = `` +
  `Your name is 'WebXSensei', a word expert who can answer questions about words.` +
  `Your tagline is show me the word and i will show you the ways!` +
  ` You are also a funny, professional helpful and friendly assistant. `


const inputPrompt = document.body.querySelector('#inputPrompt');
// const elementResponse = document.body.querySelector('#response');
const buttonPrompt = document.body.querySelector('#buttonPrompt');
// const buttonReset = document.body.querySelector('#buttonReset');
const elementDiscussionContext = document.body.querySelector('#discussionContext');

const elementLoading = document.body.querySelector('#loading');
const elementContributionBlock = document.body.querySelector('#contributionBlock');
const elementEnlighmentBlock = document.body.querySelector('#enlighmentBlock');
const elementBannerBlock = document.body.querySelector('#bannerBlock');
const elementVideoBlock = document.body.querySelector('#videoBlock');
const elementLogoBlock = document.body.querySelector('#logoBlockIcon');


const elementNavigationWisdomBlock = document.body.querySelector('#navigationWisdomBlock');
const elementObservationBrowsingView = document.body.querySelector('#observationBrowsing');

const elementError = document.body.querySelector('#error');
const elementHighlightedText = document.body.querySelector('#highlightedText');

const elementResponseContribution = document.body.querySelector('#responseContribution');
const elementResponseExplain = document.body.querySelector('#responseExplain');
const elementResponseDictionary = document.body.querySelector('#responseDictionary');
const elementResponseThesaurus = document.body.querySelector('#responseThesaurus');
const elementResponseModern = document.body.querySelector('#responseModern');
const elementLogo = document.body.querySelector('#logoBlock');

const DEFAULT_TEMPERATURE = 0.33;
const DEFAULT_TOP_K = 3;
const PILL_CLASS_NAMES = ['pill-label-blue', 'pill-label-orange', 'pill-label-green',]

const TYPE_OF_RESPONSE_PROMPT = {
  SUMMARY: {
    TITLE: 'Possible Explaination '
  },
  DICTIONARY: {
    TITLE: 'Dictionary',
    PROMPT: `Tell me what is the word definition and meaning  for '<textdata>' .Give one short sentence example. `,
    ELEMENT: elementResponseDictionary
  },
  THESAURUS: {
    TITLE: 'Thesaurus & Synonyms',
    PROMPT: `Tell me what is the thesaurus and Synonyms  for  '<textdata>'`,
    ELEMENT: elementResponseThesaurus
  },
  MODERN: {

    TITLE: 'Modern Slang & Urban',
    PROMPT: `Gimme the urban dictionary or genZ or modern slang equivalent meaning for this word  '<textdata>'.`,
    ELEMENT: elementResponseModern
  }

}

let session;
let summarizerSession;
let discussionText;

let highlightedMessage = ''
 

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function reset() {
  if (session) {
    session.destroy();
  }
  session = null;
}
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      insertText(text);
    })
    .catch((error) => {
      console.warn('Failed to copy text to clipboard:', error);
    });
}

function showLoading() {
  hide(elementError);
  show(elementLoading);
}


function showError(error) {
  show(elementError);
  hide(elementLoading);
  elementError.innerHTML = error;
}

function show(element) {
  element.removeAttribute('hidden');
}

function hide(element) {
  element.setAttribute('hidden', '');
}


function insertText(text) {
  const textBox = document.activeElement;
  if (textBox.tagName === 'TEXTAREA' || textBox.tagName === 'INPUT') {
    textBox.value += text;
  }
}

function resetDisplayResponses() {
  // for contribution
  hide(elementContributionBlock);

  // for englightment 
  hide(elementEnlighmentBlock)

  // for wisdom
  hide(elementNavigationWisdomBlock);

  hide(elementVideoBlock);
}
 


/**
 * ✨Generates a pill element and appends it to the elementHighlightedText element.
 * Each pill element is assigned a classList of 'pill-label' and a class from
 * the PILL_CLASS_NAMES array (in a round-robin manner). The pill element's text is
 * set to the wordtext parameter. Additionally, an onclick event is attached to
 * the pill element, which removes all active classes from all pill elements,
 * and adds the active class to the clicked pill element.
 * @param {string} wordtext - the text to be displayed in the pill element
 * @param {number} indexNo - the index of the pill element (used to determine
 * the class to use from the PILL_CLASS_NAMES array)
 */
function generatePill(wordtext, indexNo) {

  const pillElement = document.createElement('span');
  pillElement.classList.add('pill-label')
  pillElement.classList.add(PILL_CLASS_NAMES[indexNo % PILL_CLASS_NAMES.length])
  pillElement.innerText = wordtext;
  pillElement.onclick = () => {
    // remove all active
    const allPills = elementHighlightedText.querySelectorAll('span');
    allPills.forEach(pill => pill.classList.remove('active'));

    // Add active class to the clicked pill element
    pillElement.classList.add('active');

    getAIResponseForText(wordtext)

  }
  elementHighlightedText.appendChild(pillElement);

}

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
    discussionText = '<h5>Discussion</h5>' + message.text;
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


async function getSummarizeContext(textData) {
  const options = {
    sharedContext: 'This can be any type of article or text or statement. The goal is to explain easily so that any muggle or begineer can understand.',
    type: 'key-points',
    format: 'markdown',
    length: 'medium',
  };
  const handleSummary = async () => {
    show(elementResponseExplain)
    const title = '<h2>' + TYPE_OF_RESPONSE_PROMPT.SUMMARY.TITLE + '</h2>'
    elementResponseExplain.innerHTML = title
    summarizerSession = await self.ai.summarizer.create(options);
    let streamData = await summarizerSession.summarizeStreaming(textData);

    let result = '';
    let previousChunk = '';
    for await (const chunk of streamData) {
      const newChunk = chunk.startsWith(previousChunk)
        ? chunk.slice(previousChunk.length) : chunk;
      result += newChunk;
      elementResponseExplain.innerHTML = title + result;
      previousChunk = chunk;
    }


    elementResponseExplain.innerHTML = title +
      DOMPurify.sanitize(marked.parse(result));
    summarizerSession.destroy();
  }

  const available = (await self.ai.summarizer.capabilities()).available;

  if (available === 'no') {
    // The Summarizer API isn't usable.
    return;
  }
  if (available === 'readily') {
    // The Summarizer API can be used immediately .
    handleSummary()

  } else {
    // The Summarizer API can be used after the model is downloaded.
    handleSummary()
    summarizerSession.addEventListener('downloadprogress', (e) => {
      // console.log(e.loaded, e.total);
    });
    await summarizerSession.ready;
  }
}
 
/**
 * ✨getAIResponseForText is a function that takes a string of text
 * and gets the AI response for that text.
 * @param {string} textData - the text to get the AI response for
 * @returns {Promise<void>}
 */
async function getAIResponseForText(textData) {

  // console.log('getAIResponseForText textData', textData)

  hide(TYPE_OF_RESPONSE_PROMPT.DICTIONARY.ELEMENT);
  const res1 = await getHandledResponseTypeForEnglightment(
    TYPE_OF_RESPONSE_PROMPT.DICTIONARY, textData)
  await sleep(5000); // force sleep reduce processor usage


  hide(TYPE_OF_RESPONSE_PROMPT.THESAURUS.ELEMENT);
  const res2 = await getHandledResponseTypeForEnglightment(
    TYPE_OF_RESPONSE_PROMPT.THESAURUS, textData)
  await sleep(5000); // force sleep reduce processor usage



  hide(TYPE_OF_RESPONSE_PROMPT.MODERN.ELEMENT);
  const res3 = await getHandledResponseTypeForEnglightment(
    TYPE_OF_RESPONSE_PROMPT.MODERN, textData)
  await sleep(4000); // force sleep reduce processor usage

  // Explain context of highlighted sentences
  getSummarizeContext(highlightedMessage);
  // reset() 

}



/**
 * Call the Gemini language model with a prompt for a response based on {@link typeResponse}
 * and {@link textData}. Then render the output
 *
 * @param {string} typeResponse
 *     The type of response to get from the language model.
 *     Should be one of:
 *     {@link TYPE_OF_RESPONSE_PROMPT.DICTIONARY}
 *     {@link TYPE_OF_RESPONSE_PROMPT.MODERN}
 *     {@link TYPE_OF_RESPONSE_PROMPT.THESAURUS}
 * @param {string} textData
 *     The word to get the response for.
 * @returns {Promise<string>}
 *     The response from the language model.
 */
async function getHandledResponseTypeForEnglightment(typeResponse, textData) {

  let chunktext = ''
  try {
    const commonTitle = '<h2>' + typeResponse.TITLE + '</h2>'
    showLoading();
    const params = {
      systemPrompt: DEFAULT_PROMPT,
      temperature: DEFAULT_TEMPERATURE,
      topK: DEFAULT_TOP_K
    };
    const prompt = typeResponse.PROMPT.replace(/<textdata>/g, textData)
    // console.log('getHandledResponseTypeForEnglightment params', params)
    const streamResult = await runPrompt(prompt, params);

    show(typeResponse.ELEMENT);
    typeResponse.ELEMENT.scrollIntoView();
    try {
      typeResponse.ELEMENT.innerHTML = commonTitle
      for await (const chunk of streamResult) {
        chunktext = (chunk);
        typeResponse.ELEMENT.innerHTML = chunk;
      }
      typeResponse.ELEMENT.innerHTML = commonTitle +
        DOMPurify.sanitize(marked.parse(chunktext))

    } catch (e) {
      typeResponse.ELEMENT.innerHTML = '[Formatting or Connectivity Issue. Please retry again]' +
        chunktext
      // showError(typeResponse.ELEMENT.innerHTML);
      console.warn(e)

    }
    finally {
      hide(elementLoading);
      // reset();
    }
  } catch (e) {
    console.warn(e);
    // showError('Generation or Connectivity Issue. Please retry again.');
  }
}
async function getHandledResponseTypeForContribution(textData) {


  const userPromptStyle = inputPrompt.value.trim();
  if (!userPromptStyle) {
    return
  }
  const headerTitle = '<h2> Suggested Comment / Replies</h2>'
  try {

    show(elementLoading);
    hide(elementResponseContribution);

    // Construct prompt plus customization
    const CONTIRBUTION_PROMPT = `.You must generate 3 short possible responses ` +
      `for the discussion below in the block <discussion></discussion>. `
      + userPromptStyle
      + ' Format the output to clearly show the 3 options. For example . Option 1: Reply... Option 2: Second Comment generated... Option 3: Third comment generated'
    const params = {
      systemPrompt: DEFAULT_PROMPT + CONTIRBUTION_PROMPT,
      temperature: DEFAULT_TEMPERATURE,
      topK: DEFAULT_TOP_K
    };
    const prompt = `${userPromptStyle}<discussion>${textData}</discussion>`
    const streamResult = await runPrompt(prompt, params);
    // Handle response

    let chunktext = ''
    try {
      show(elementResponseContribution);
      elementResponseContribution.scrollIntoView();

      elementResponseContribution.innerHTML = headerTitle
      for await (const chunk of streamResult) {
        chunktext = (chunk);
        elementResponseContribution.innerHTML = chunk

      }
      elementResponseContribution.innerHTML = headerTitle +
        DOMPurify.sanitize(marked.parse(chunktext))


    } catch (e) {
      // Handle failed response
      console.warn(e);
      elementResponseContribution.innerHTML = '[Formatting or Connectivity Issue. Please retry again]' +
        chunktext
      // showError(elementResponseContribution.innerHTML);
      console.warn(elementResponseContribution.innerHTML);
    }
    finally {
      hide(elementLoading);
      // Handle formatting visually nice pill response
      if (elementResponseContribution.querySelectorAll('p').length === 3) {
        elementResponseContribution.querySelectorAll('p').forEach((p, indexNo) => {
          p.classList.add('pill-label')
          p.classList.add(PILL_CLASS_NAMES[indexNo % PILL_CLASS_NAMES.length])

          p.addEventListener('click', () => {
            copyToClipboard(p.innerText)
          });
        });
      }
    }
  } catch (e) {
    console.warn(e);
    // showError('Generation or Connectivity Issue. Please retry again.');
  }
}

async function getHandledResponseTypeForWisdom(textData, historyListText) {



  const headerTitle = '<h2>What I know about you</h2>'
  try {

    show(elementLoading);
    hide(elementObservationBrowsingView);

    // Construct prompt plus customization
    const CONTIRBUTION_PROMPT = `` +
      `I will give you my active web browsing content tab information that i am currently browsing. You can find the technical info inside <browsingcontent></browsingcontent> <browsinghistory></browsinghistory>. `
      + 'Answer concisely about my web browsing pattern. Show you have wisdom. Guide me if you see i am not productive or unhealthy and should focus on other things. '
      + ' If you found any sites that i should avoid, please list them and ask me close myself rather than doing for me. '
      + ' Give short wisdom advice quote to advocate self initiative.'
    const params = {
      systemPrompt: DEFAULT_PROMPT + CONTIRBUTION_PROMPT,
      temperature: DEFAULT_TEMPERATURE,
      topK: DEFAULT_TOP_K
    };
    if (historyListText.length > 2000) {
      historyListText = historyListText.substring(0, 2000);
    }
    let prompt = `No yapping. What is my browsing pattern like? ` +
      `<browsingcontent>${JSON.stringify(textData)} </browsingcontent>` +
      `<browsinghistory>` + historyListText + `</browsinghistory>`

    if (prompt.length > 4000) {
      prompt = prompt.substring(0, 4000);
    }
    const streamResult = await runPrompt(prompt, params);
    let chunktext = ''
    // Handle response
    try {
      show(elementObservationBrowsingView);
      elementObservationBrowsingView.scrollIntoView();

      elementObservationBrowsingView.innerHTML = headerTitle
      for await (const chunk of streamResult) {
        chunktext = (chunk);
        elementObservationBrowsingView.innerHTML = chunk

      }
      elementObservationBrowsingView.innerHTML = headerTitle +
        DOMPurify.sanitize(marked.parse(chunktext))


    } catch (e) {
      // Handle failed response
      console.warn(e);

      elementObservationBrowsingView.innerHTML = '[Formatting or Connectivity Issue. Please retry again]' +
        chunktext
      // showError(elementObservationBrowsingView.innerHTML);
    }
    finally {
      hide(elementLoading);

    }
  } catch (e) {
    console.warn(e);
    // showError('Generation or Connectivity Issue. Please retry again.');
  }
}
async function runPrompt(prompt, params) {
  try {
    if (!session) {
      session = await chrome.aiOriginTrial.languageModel.create(params);
    }

    // Prompt the model and stream the result:
    const stream = session.promptStreaming(prompt);
    return stream;

  } catch (e) {
    showError("Technical Error: " + e);
    console.warn(e);
    console.warn('Prompt failed:', prompt);
    throw e;
  }
}


