// Aerial views built from open-licence aerial photos (Wikimedia Commons), replacing the 360° aerial
// panoramas. Each photo is stored as a partial panorama (assets/aerial/*.webp) so Pannellum shows it
// with true perspective; several aerial views share one photo and open on a different spot.
// Load this right after tour-data.js and before images.js.
(function () {
  const PHOTOS = {
    // haov / vaov: how many degrees of the view the photo covers (horizontal / vertical)
    'badshahi-east': {
      file: 'assets/aerial/badshahi-east.webp', haov: 72, vaov: 51.69,
      credit: 'Photo: Mhtoori, Wikimedia Commons, CC BY-SA 4.0',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Aerial_View_of_Badhshahi_Mosque.jpg',
      links: [
        { to: 'node2', yaw: 0.66, pitch: 0 },         // prayer hall
        { to: 'node31', yaw: 0.87, pitch: -6.9 },     // ablution pool
        { to: 'node1', yaw: 12.38, pitch: -5.91 },    // courtyard
        { to: 'node30', yaw: 0.87, pitch: -15.64 },   // entrance gate
        { to: 'node3', yaw: -14.51, pitch: -18.07 },  // Allama Iqbal's tomb, beside the steps
        { to: 'node57', yaw: 16.44, pitch: -18.46 },  // Hazuri Bagh aerial (in front of the gate)
        { to: 'node63', yaw: 32.45, pitch: 1.46 },    // towards Minar-e-Pakistan (north)
      ],
    },
    'minar-park': {
      file: 'assets/aerial/minar-park.webp', haov: 55, vaov: 54.25,
      credit: 'Photo: Idaudpota, Wikimedia Commons, CC BY-SA 4.0',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Minar_e_Pakistan,_Lahore._Aerial_view.jpg',
      links: [
        { to: 'node28', yaw: -4.62, pitch: 8.67 },    // Minar-e-Pakistan
        { to: 'node64', yaw: 0, pitch: -23.01 },      // towards Badshahi Mosque (south)
      ],
    },
    'hazuri-fort': {
      file: 'assets/aerial/hazuri-fort.webp', haov: 50, vaov: 60.13,
      credit: 'Photos: Idaudpota, Wikimedia Commons, CC BY-SA 4.0',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Badshahi_and_Lahore_in_the_Evening._Aerial_View.jpg',
      links: [
        { to: 'node1', yaw: 4.94, pitch: -8.03 },     // Badshahi Mosque courtyard
        { to: 'node6', yaw: 2.25, pitch: -3.88 },     // Hazuri Bagh
        { to: 'node13', yaw: 1.74, pitch: -1.08 },    // Alamgiri Gate
        { to: 'node46', yaw: 5.1, pitch: 5.05 },      // Deewan-e-Aam hall, facing its big lawn
        { to: 'node45', yaw: 0.61, pitch: 4.66 },     // Jahangir's Quadrangle (the court with the large pool)
        { to: 'node61', yaw: -22.84, pitch: -14.92 }, // towards Iqbal Park (north)
      ],
    },
  };

  // Which photo each aerial scene uses, and where it opens
  const VIEWS = {
    node64: { photo: 'badshahi-east', yaw: 0, pitch: 0, hfov: 62, thumb: 'badshahi.webp' },
    node63: { photo: 'minar-park', yaw: -4.6, pitch: 7, hfov: 30, thumb: 'minar.webp' },
    node61: { photo: 'minar-park', yaw: 0, pitch: 0, hfov: 52, thumb: 'iqbal-park.webp' },
    node57: { photo: 'hazuri-fort', yaw: 2.3, pitch: -3.5, hfov: 30, thumb: 'hazuri-bagh.webp' },
    node65: { photo: 'hazuri-fort', yaw: 5.1, pitch: 5, hfov: 28, thumb: 'deewan-e-aam.webp' },
    node60: { photo: 'hazuri-fort', yaw: 0.6, pitch: 4.7, hfov: 25, thumb: 'deewan-e-khas.webp' },
  };

  for (const [id, v] of Object.entries(VIEWS)) {
    const s = TOUR.scenes[id];
    if (!s) continue;
    const p = PHOTOS[v.photo];
    Object.assign(s, {
      file: p.file,
      thumb: 'assets/aerial/thumbs/' + v.thumb,
      yaw: v.yaw, pitch: v.pitch,
      links: p.links,
      local: true, // served from this repo, not Cloudinary (see images.js)
      flat: { haov: p.haov, vaov: p.vaov, hfov: v.hfov, credit: p.credit, creditUrl: p.creditUrl },
    });
  }
})();
