# WebXSensei

Introducing Web X Sensei, a revolutionary open soure Chrome extension that transforms your browsing experience with the power of Chrome Gemini Nano's offline AI capabilities. Our extension offers three standout features:

#### Browsing Mentor:
Web X Sensei analyzes your current and past browsing habits to provide personalized advice, helping you navigate the web more efficiently and effectively.

#### Enlighten Feature: 
Highlight any text on the web to receive instant summaries, definitions, synonyms, thesaurus entries, and even modern language insights from sources like Urban Dictionary.

####  Contribution/Reply/Comments Suggestion:
Highlight any conversation in your browser to get three auto-suggested replies, which you can fine-tune to match your style.

###### Key Benefits:

No Sign-Up Required: Enjoy a seamless experience without the need for any sign-ups.

Data Security: Your data remains secure as the AI operates offline, ensuring privacy and functionality even without an internet connection.

Web X Sensei is designed to enhance productivity, learning, and communication, making it an indispensable tool for anyone looking to optimize their web interactions.



# Browser On-device AI with Gemini Nano

This sample demonstrates how to use the experimental Gemini Nano API available in the context of an origin trial in Chrome with Chrome Extensions. To learn more about the API and how to sign-up for the origin trial, head over to [Built-in AI on developer.chrome.com](https://developer.chrome.com/docs/extensions/ai/prompt-api).
 

## Installling & Running this extension

1. Clone this repository.
1. Run `npm install` in the project directory.
1. Run `npm run build` in the project directory to build the extension.
1. Load the newly created `dist` directory in Chrome as an [unpacked extension](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).
1. Click the extension icon.
1. Interact with the Prompt API in the sidebar.

## Creating your own extension

If you use this sample as the foundation for your own extension, be sure to update the `"trial_tokens"` field [with your own origin trial token](https://developer.chrome.com/docs/web-platform/origin-trials#extensions) and to remove the `"key"` field in `manifest.json`.
