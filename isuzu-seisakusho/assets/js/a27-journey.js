/* A27 keeps searches in existing accessible popup and prevents accidental
   direct-to-form from contextual decision routes. No network requests. */
(()=>{
  // Highlight the current page's type using its existing global discovery dialog.
  const path=(location.pathname.split('/').pop()||'index.html').replace('.html','');
  document.body.dataset.a27Page=path;
  // The global search is the only site-wide search service. Contextual product
  // and manual searches on their pages remain available as the same dataset.
})();
