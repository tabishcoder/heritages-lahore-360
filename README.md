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

Full list of image sources and licences: [`credits/`](credits/README.md).

360° photography by [HD360.pk](https://hd360.pk), used with permission. The photos are not covered
by any open licence: do not reuse them outside this project without HD360's permission.

Photos are **not stored in this repository**. They are hosted on [Cloudinary](https://cloudinary.com),
and `assets/js/images.js` decides where they load from:

- `cloudName: 'dppgxpdue'` (current) loads them from Cloudinary, under the folder `lahore-heritage/`
  with the same paths, e.g. `lahore-heritage/360-panoramas/node1_Badshahi_Mosque.jpg`.
- `cloudName: ''` loads local files next to the pages (`360-panoramas/`, `assets/thumbs/`,
  `assets/stories/`, `preview.jpg`), handy for offline development.

Panoramas on Cloudinary are 6144×3072, because the free plan limits images to 25 megapixels and 10 MB.

### Aerial views

Six of the aerial views (Badshahi Mosque, Minar-e-Pakistan, Allama Iqbal Park, Hazuri Bagh,
Deewan-e-Aam, Deewan-e-Khas) use two open-licence aerial photos instead of 360° panoramas. They are
stored in this repository under `assets/aerial/` and set up in `assets/js/aerial-views.js`: each
photo is saved as a partial panorama, so Pannellum shows it with true perspective, and several views
open the same photo on a different spot. The viewer shows the credit in its info box.

| File | Source | Licence |
| --- | --- | --- |
| `assets/aerial/badshahi-minar.webp` | [Badshahi Mosque with Minar e Pakistan in the background](https://commons.wikimedia.org/wiki/File:Badshahi_Mosque_with_Minar_e_Pakistan_in_the_background._Lahore.jpg) with Minar-e-Pakistan from [Aerial view of Minar e Pakistan](https://commons.wikimedia.org/wiki/File:Aerial_view_of_Minar_e_Pakistan.jpg), both by Idaudpota | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `assets/aerial/hazuri-fort.webp` | [Badshahi and Lahore in the Evening](https://commons.wikimedia.org/wiki/File:Badshahi_and_Lahore_in_the_Evening._Aerial_View.jpg) combined with [Mughal Art in an Ocean of Concrete](https://commons.wikimedia.org/wiki/File:Badshahi_Mosqu_-_Mughal_Art_in_an_Ocean_of_Concrete.jpg), both by Idaudpota | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |

The photos were colour-corrected, cleaned up and (for `hazuri-fort.webp`) stitched together; the
edited versions are shared under the same CC BY-SA 4.0 licence.
