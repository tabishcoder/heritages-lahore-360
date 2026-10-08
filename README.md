# Lahore Heritage 360° Virtual Tour

A gamified static website about Lahore's heritage: Badshahi Mosque, Lahore Fort, Hazuri Bagh,
Allama Iqbal's Tomb and Minar-e-Pakistan. Visitors can

- **Explore** 58 places as interactive 360° panoramas,
- **Learn** from short, friendly stories (facts checked against published sources),
- **Quiz** themselves, with an explanation for every answer,
- play **memory games** ("Where am I?" and Memory Match),

earning XP, levels, badges and a passport stamp per site. First-time visitors get a guided tour of
the sections (replay it with the **?** button). Progress is saved in the browser (localStorage).
The layout is mobile-first: on phones the sections move to a bottom tab bar.

Viewer: [Pannellum](https://pannellum.org).

## Run it

The panorama viewer uses WebGL, which browsers block on `file://` pages, so serve the folder:

```sh
python -m http.server 8000
```

Then open http://localhost:8000. VS Code's "Live Server" extension works too.

## Structure

| Path | What it is |
| --- | --- |
| `index.html` | Home: journey/progress card, the four sections, and the five heritage sites |
| `tour.html` | Full-screen 360° tour: drag to look around, click the arrows to move between locations |
| `learn.html` | Heritage stories (`learn.html#badshahi`, `#fort`, `#hazuri`, `#iqbal`, `#minar`) |
| `quiz.html` | Knowledge quiz per site or mixed (`quiz.html#minar`, `quiz.html#mixed`) |
| `memory.html` | Memory games (`memory.html#where`, `memory.html#match`) |
| `assets/js/heritage-data.js` | Story content: facts, sections, timelines, highlights. Edit text here |
| `assets/js/quiz-data.js` | Quiz questions with explanations |
| `assets/js/game.js` | XP, levels, badges, passport, toasts, navigation and the guided tour |
| `assets/js/tour.js` | Builds the Pannellum multi-scene tour, location drawer and controls |
| `assets/js/learn.js`, `quiz.js`, `memory.js` | Page logic for each section |
| `assets/js/tour-data.js` | Generated scene list: titles, groups, start views and navigation hotspots |
| `assets/css/style.css`, `site.css` | Styles (`site.css` holds the learning and game sections) |
| `assets/vendor/pannellum/` | Pannellum 2.5.6 |

## Images

Photos are **not included** in this repository. To run the site, add these files:

| Path | What |
| --- | --- |
| `360-panoramas/<file>` | One equirectangular 360° JPG per scene (2:1, e.g. 7680×3840). File names are listed as `file` in `assets/js/tour-data.js` |
| `assets/thumbs/<sceneId>.jpg` | 640×400 card thumbnail per scene |
| `assets/stories/<storyId>.jpg` | 1600×800 header image per story (`badshahi`, `fort`, `hazuri`, `iqbal`, `minar`) |
| `preview.jpg` | Home page background |

Use only photos you own or have a licence for, e.g. your own 360° camera shots or
Creative Commons panoramas from Wikimedia Commons (credit the author as the licence requires).
