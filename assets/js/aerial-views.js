// Aerial views built from open-licence aerial photos (Wikimedia Commons), replacing the 360° aerial
// panoramas. Each photo is stored as a partial panorama (assets/aerial/*.jpg) so Pannellum shows it
// with true perspective; several aerial views share one photo and open on a different spot.
// Load this right after tour-data.js and before images.js.
(function () {
  const PHOTOS = {
    // haov / vaov: how many degrees of the view the photo covers (horizontal / vertical)
    'badshahi-minar': {
      file: 'assets/aerial/badshahi-minar.jpg', haov: 60, vaov: 49.8,
      credit: 'Photo: Idaudpota, Wikimedia Commons, CC BY-SA 4.0',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Badshahi_Mosque_with_Minar_e_Pakistan_in_the_background._Lahore.jpg',
      links: [
        { to: 'node28', yaw: -10.89, pitch: 14.54 },  // Minar-e-Pakistan
        { to: 'node2', yaw: -11.95, pitch: -1.81 },   // Badshahi Mosque prayer hall
        { to: 'node1', yaw: 7.24, pitch: -8.13 },     // Badshahi Mosque courtyard
        { to: 'node30', yaw: 19.7, pitch: -6.7 },     // Entrance gate
        { to: 'node57', yaw: 28.32, pitch: -5.3 },    // towards Hazuri Bagh (east)
      ],
    },
    'hazuri-fort': {
      file: 'assets/aerial/hazuri-fort.jpg', haov: 50, vaov: 60.13,
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
    node64: { photo: 'badshahi-minar', yaw: 2, pitch: -5, hfov: 50, thumb: 'badshahi.jpg' },
    node63: { photo: 'badshahi-minar', yaw: -10.9, pitch: 13, hfov: 35, thumb: 'minar.jpg' },
    node61: { photo: 'badshahi-minar', yaw: 12, pitch: 10, hfov: 45, thumb: 'iqbal-park.jpg' },
    node57: { photo: 'hazuri-fort', yaw: 2.3, pitch: -3.5, hfov: 30, thumb: 'hazuri-bagh.jpg' },
    node65: { photo: 'hazuri-fort', yaw: 5.1, pitch: 5, hfov: 28, thumb: 'deewan-e-aam.jpg' },
    node60: { photo: 'hazuri-fort', yaw: 0.6, pitch: 4.7, hfov: 25, thumb: 'deewan-e-khas.jpg' },
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
