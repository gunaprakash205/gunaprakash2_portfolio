# Guna's Project Portfolio

A static site — no backend, no login. You edit it, Netlify hosts it, anyone with the link can view it.

## Folder structure

```
index.html          the page itself — you shouldn't need to touch this
style.css            colors, fonts, layout
script.js            loads data/projects.json and builds the page
data/projects.json   YOUR PROJECT LIST — this is the only file you edit regularly
images/              put your screenshots/photos here
```

## Adding a new project

1. Drop your images into the `images/` folder (jpg/png/webp all work). Keep filenames simple, e.g. `weather-app-1.jpg`.
2. Open `data/projects.json` in any text editor and add a new entry to the list:

```json
{
  "title": "Weather Forecast App",
  "tag": "Python",
  "summary": "A CLI tool that pulls live weather data and predicts rain in your area.",
  "description": "Built to practice API integration and data cleaning. Pulls from OpenWeather's API, caches results locally, and outputs a 5-day forecast with a simple accuracy score against historical data.\n\nStack: Python, requests, pandas.",
  "images": [
    "images/weather-app-1.jpg",
    "images/weather-app-2.jpg"
  ]
}
```

- `title` — project name
- `tag` — short category label shown as a small badge (e.g. "Python", "Machine Learning", "Web App")
- `summary` — one line, shown on the card in the grid
- `description` — the longer write-up shown when someone clicks the project. Use `\n\n` for a paragraph break.
- `images` — list as many as you want; the first one is used as the card thumbnail, and clicking the card opens all of them in a slider

3. Remove the "Example Project" entry once you've added your first real one.
4. Save, then redeploy (see below).

## Before you launch

Open `index.html` and replace the placeholder contact details near the bottom (`your.email@example.com`, your LinkedIn, your GitHub) with your real ones.

## Deploying to Netlify

**Fastest way (no account setup beyond signing in):**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag this whole folder onto the page
3. Netlify gives you a live URL right away

Every time you add a project, edit `data/projects.json`, then drag the folder onto Netlify Drop again (or onto your existing site's "Deploys" tab) to update it.

**Better for the long run (auto-deploys on every change):**
1. Push this folder to a GitHub repository
2. In Netlify: "Add new site" → "Import an existing project" → connect the GitHub repo
3. Leave the build command blank and set the publish directory to `/` (this is a static site, no build step needed)
4. From then on, any time you edit `data/projects.json` and push to GitHub, Netlify rebuilds automatically — no manual re-upload
