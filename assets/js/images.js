// Where the site's photos are served from. Load this right after tour-data.js / heritage-data.js.
// cloudName '' = use the local files next to the pages; set it to your Cloudinary cloud name
// to load everything from Cloudinary (uploaded with tools/upload_cloudinary.py).
window.IMAGES = { cloudName: 'dppgxpdue', folder: 'lahore-heritage' };

(function () {
  const { cloudName, folder } = window.IMAGES;
  // `opts` are Cloudinary transformations, e.g. automatic format and quality for small images.
  const url = (path, opts) => (cloudName
    ? `https://res.cloudinary.com/${cloudName}/image/upload/${opts ? opts + '/' : ''}${folder}/${path}`
    : path);
  window.imageUrl = url;

  if (window.TOUR) {
    for (const s of Object.values(TOUR.scenes)) {
      s.file = url(s.file); // panoramas are pre-sized for Cloudinary; served as uploaded
      s.thumb = url(s.thumb, 'f_auto,q_auto');
    }
  }
  if (window.STORIES) for (const st of STORIES) st.image = url(st.image, 'f_auto,q_auto');

  const hero = new URL(url('preview.jpg', 'f_auto,q_auto'), location.href).href;
  document.documentElement.style.setProperty('--hero-image', `url("${hero}")`);
})();
