

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

function doScroll(element) {
  if(!element)return;

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest'
  });
  window.scrollBy(0, 120)

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

  // auto close error modeal
  if (element.id === 'error') {
    setTimeout(() => {
      hide(element)
    }, 3200)
  }
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

function resetResponses() {
  elementResponseDictionary.innerHTML = ''
  elementResponseThesaurus.innerHTML = ''
  elementResponseModern.innerHTML = ''
  elementResponseExplain.innerHTML = ''


  elementResponseContribution.innerHTML = ''
  elementObservationBrowsingView.innerHTML = ''
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
    selectedWordText = wordtext
    getAIResponseForText()

  }
  elementHighlightedText.appendChild(pillElement);

}