document.addEventListener('DOMContentLoaded', () => {
  const nav = document.createElement('nav');
  nav.innerHTML = `
    <div class="topnav">
      <a href="/" class="nav-logo">
        <span class="title-los">LOS</span><span class="title-denso">DENSO</span><span class="title-dot">.XYZ</span>
      </a>
      <div class="nav-links">
        <a href="/"      class="nav-link">HOME</a>
        <a href="/shop"  class="nav-link">SHOP</a>
        <a href="/music" class="nav-link">MUSIC</a>
      </div>
      <div class="nav-cursor blink">▮</div>
    </div>
  `;
  document.body.prepend(nav);

  // highlight current page
  const path = window.location.pathname;
  nav.querySelectorAll('.nav-link').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('nav-active');
  });
});
