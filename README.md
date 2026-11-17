<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/4754d6fd-dfcd-4b9b-b71e-ac56383f8461

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

The development command starts both the website and its built-in API. Open the
`Local` URL printed in the terminal. It uses port `3000` by default and
automatically tries the next port if `3000` is already in use. Set `PORT` to
choose a specific port.
