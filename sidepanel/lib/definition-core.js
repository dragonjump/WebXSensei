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
const elementEnlighmentMenu = document.body.querySelector('#enlighmentMenu');
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


const COMMON_PROMPT_ERROR_MESSAGE= '[Formatting or Connectivity Issue. Please press to retry again]'
const DEFAULT_TEMPERATURE = 0.33;
const DEFAULT_TOP_K = 3;
const PILL_CLASS_NAMES = ['pill-label-blue', 'pill-label-orange', 'pill-label-green',]

const TYPE_OF_RESPONSE_PROMPT = {
  SUMMARY: {
    TITLE: 'Possible Explaination Summarized'
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
let selectedWordText=''
let highlightedMessage = ''