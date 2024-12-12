
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

    doScroll(elementResponseExplain)
    let streamData = await summarizerSession.summarizeStreaming(textData);

    let result = '';
    let previousChunk = '';
    for await (const chunk of streamData) {
      const newChunk = chunk.startsWith(previousChunk)
        ? chunk.slice(previousChunk.length) : chunk;
      result += newChunk;
      elementResponseExplain.innerText = title + result;
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
async function getAIResponseForText() {

  await getHandledResponseTypeForEnglightment(
    TYPE_OF_RESPONSE_PROMPT.DICTIONARY, selectedWordText)


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
  hide(typeResponse.ELEMENT);
  const commonTitle = '<h2>' + typeResponse.TITLE + '</h2> '

  typeResponse.ELEMENT.innerHTML = commonTitle
  let chunktext = ''
  try {
    show(elementLoading);
    const params = {
      systemPrompt: DEFAULT_PROMPT,
      temperature: DEFAULT_TEMPERATURE,
      topK: DEFAULT_TOP_K
    };
    const prompt = typeResponse.PROMPT.replace(/<textdata>/g, textData)
    // console.log('getHandledResponseTypeForEnglightment params', params)
    const streamResult = await runPrompt(prompt, params);

    show(typeResponse.ELEMENT);
    doScroll(typeResponse.ELEMENT)
    try {
      typeResponse.ELEMENT.innerHTML = commonTitle
      for await (const chunk of streamResult) {
        chunktext = (chunk);
        typeResponse.ELEMENT.innerText = chunk;
      }
      typeResponse.ELEMENT.innerHTML = commonTitle +
        DOMPurify.sanitize(marked.parse(chunktext))

    } catch (e) {
      typeResponse.ELEMENT.innerHTML = commonTitle +
        COMMON_PROMPT_ERROR_MESSAGE +
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
    // showError('Generation or Connectivity Issue. Please press to retry again.');
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

    doScroll(elementResponseContribution)
    const prompt = `${userPromptStyle}<discussion>${textData}</discussion>`
    const streamResult = await runPrompt(prompt, params);
    // Handle response

    let chunktext = ''
    try {
      show(elementResponseContribution);
      doScroll(elementResponseContribution)
      elementResponseContribution.innerHTML = headerTitle
      for await (const chunk of streamResult) {
        chunktext = (chunk);
        elementResponseContribution.innerText = chunk

      }
      elementResponseContribution.innerHTML = headerTitle +
        DOMPurify.sanitize(marked.parse(chunktext))


    } catch (e) {
      // Handle failed response
      console.warn(e);
      elementResponseContribution.innerHTML = headerTitle + COMMON_PROMPT_ERROR_MESSAGE +
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
            const text = p.innerText;
            const parts = text.split(":");
            const afterColonText = parts.slice(1).join(":").trim();

            copyToClipboard(afterColonText);
          });
        });
      }
    }
  } catch (e) {
    console.warn(e);
    // showError('Generation or Connectivity Issue. Please press to retry again.');
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
      doScroll(elementObservationBrowsingView);
      elementObservationBrowsingView.innerHTML = headerTitle
      for await (const chunk of streamResult) {
        chunktext = (chunk);
        elementObservationBrowsingView.innerText = chunk

      }
      elementObservationBrowsingView.innerHTML = headerTitle +
        DOMPurify.sanitize(marked.parse(chunktext))


    } catch (e) {
      // Handle failed response
      console.warn(e);

      elementObservationBrowsingView.innerHTML = headerTitle + COMMON_PROMPT_ERROR_MESSAGE +
        chunktext
      // showError(elementObservationBrowsingView.innerHTML);
    }
    finally {
      hide(elementLoading);

    }
  } catch (e) {
    console.warn(e);
    // showError('Generation or Connectivity Issue. Please press to retry again.');
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


