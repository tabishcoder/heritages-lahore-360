# Image credits

Where every photo on this website comes from, and under which terms it is used.

## 360° panoramas (HD360.pk)

All 360° panoramas in the tour (except the aerial views listed below), their thumbnails, the story
images and `preview.jpg` are by [HD360.pk](https://hd360.pk), used with permission. They are hosted
on Cloudinary, not in this repository. They are not under an open licence: do not reuse them
outside this project without HD360's permission.

## Aerial views (Wikimedia Commons)

These aerial views use photos from Wikimedia Commons by **Idaudpota** and **Mhtoori**, under
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). The photos were colour-corrected
and cleaned up, and two of them were stitched into one. The edited versions are shared under the
same CC BY-SA 4.0 licence.

| File on this site | Used for | Original photo | Author | Licence |
| --- | --- | --- | --- | --- |
| `assets/aerial/badshahi-east.webp` | Aerial View of Badshahi Mosque | [Aerial View of Badhshahi Mosque.jpg](https://commons.wikimedia.org/wiki/File:Aerial_View_of_Badhshahi_Mosque.jpg) | Mhtoori | CC BY-SA 4.0 |
| `assets/aerial/minar-park.webp` | Minar-e-Pakistan Aerial View, Allama Iqbal Park Aerial View | [Minar e Pakistan, Lahore. Aerial view.jpg](https://commons.wikimedia.org/wiki/File:Minar_e_Pakistan,_Lahore._Aerial_view.jpg) | Idaudpota | CC BY-SA 4.0 |
| `assets/aerial/hazuri-fort.webp` | Hazuri Bagh Aerial View, Deewan-e-Aam Aerial View, Deewan-e-Khas Aerial View | [Badshahi and Lahore in the Evening. Aerial View.jpg](https://commons.wikimedia.org/wiki/File:Badshahi_and_Lahore_in_the_Evening._Aerial_View.jpg) (base) + [Badshahi Mosqu - Mughal Art in an Ocean of Concrete.jpg](https://commons.wikimedia.org/wiki/File:Badshahi_Mosqu_-_Mughal_Art_in_an_Ocean_of_Concrete.jpg) (sharper middle part, stitched in) | Idaudpota | CC BY-SA 4.0 |
| `assets/aerial/thumbs/*.webp` | Thumbnails of the views above | Cropped from the files above | Idaudpota, Mhtoori | CC BY-SA 4.0 |

### What was changed

- **badshahi-east.webp**: regraded to a clear daytime look, the overcast sky replaced with a
  computer-generated blue sky with the sun, 1.5× upscale and sharpening. The photographer's
  "©mhtoori" mark is kept.
- **minar-park.webp**: light noise reduction, lifted shadows, slightly less colour cast, 1.5×
  upscale and sharpening.
- **hazuri-fort.webp**: the second photo was aligned onto the first and blended in, then the same
  colour, noise and sharpening clean-up.
- **Daylight look (hazuri-fort.webp)**: the original photos were taken at sunset. They were regraded to a
  clear daytime look: neutral white balance, brighter exposure with lifted shadows, pink sunset
  tones on the stone turned back to sandstone, livelier greens.
- **Sky and sun (hazuri-fort.webp, badshahi-east.webp)**: the hazy evening sky was replaced with a computer-generated
  blue sky with a few clouds and the sun. It is not from a photo.
- All are stored as partial panoramas so the 360° viewer shows them with correct perspective.

## How to credit them

Each aerial view shows its credit in the viewer's info box (top left). If you use these images
anywhere else, credit them as:

> Photo: Idaudpota (or Mhtoori for badshahi-east) / Wikimedia Commons, CC BY-SA 4.0

## Map

The satellite map on the home page uses imagery from Esri World Imagery (© Esri, Maxar, Earthstar
Geographics) with Esri's place-name labels, shown through [Leaflet](https://leafletjs.com)
(BSD-2-Clause, in `assets/vendor/leaflet/`). Place positions are from OpenStreetMap.
