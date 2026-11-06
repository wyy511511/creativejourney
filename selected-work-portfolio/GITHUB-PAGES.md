# Publish Yaoyao creative journey on GitHub Pages

This site uses static HTML, CSS and JavaScript. No build step, database or server is required. Relative asset paths work under a project URL such as `/creative-journey/`.

## Publish the prepared package

1. Create a GitHub repository named `creative-journey`. A public repository works with GitHub Free. Initialize it with a README so the `main` branch exists.
2. Unzip `Creative-Journey-GitHub-Pages.zip` from the parent workspace. Upload the extracted **contents** to the repository root: `index.html`, `styles.css`, `story.css`, `app.js`, `assets/` and `.nojekyll`. Do not upload the ZIP itself or nest the files inside another folder. On macOS, press Command–Shift–Period in Finder to show `.nojekyll` if needed.
3. Open the repository's **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, then **main** and **/(root)**. Save.
4. Wait for the deployment to finish, then use the website URL shown in Settings → Pages. If published under `wyy511511/creative-journey` with the default GitHub domain, the expected address is `https://wyy511511.github.io/creative-journey/`.

The address above is a suggested destination; this package has not been published there.

## Make later edits

Edit the local `dist/` files, run `python3 scripts/package_portfolio.py`, and upload the updated deployment package contents to the same branch. Changes to the selected publishing branch trigger an update.

Once published, check the MagicMask medal, mobile navigation, Apple disclosure controls and the AI voice prompt. Open the videos and Google Drive collections to confirm that visitors can access them with their existing sharing settings.

## Official documentation

- [About GitHub Pages and repository plans](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [Configure the publishing branch and folder](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
