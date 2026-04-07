/* ── Theme toggle ── */
(function () {
  var STORAGE_KEY = 'cv-theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === 'light' ? '☀ Light' : '☾ Dark';
  }

  window.toggleTheme = function () {
    var current = document.documentElement.getAttribute('data-theme') || 'dark';
    var next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  };

  var saved = localStorage.getItem(STORAGE_KEY);
  var preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  applyTheme(saved || preferred);
})();

/* ── selectNode — shared interactive detail panel logic ──
   nodeData must be defined in the page's own <script> block.
   Each entry requires: { dotClass, title, cards: [{title, body}] }
── */
var activeNode = null;

function selectNode(id) {
  if (activeNode) {
    var prev = document.getElementById('box-' + activeNode);
    if (prev) prev.classList.remove('active');
  }
  activeNode = id;
  var box = document.getElementById('box-' + id);
  if (box) box.classList.add('active');

  var data = nodeData[id];
  if (!data) return;

  document.getElementById('detail-hint').style.display = 'none';
  var content = document.getElementById('detail-content');
  content.style.display = 'grid';

  var panel = document.getElementById('detail-panel');
  var existing = panel.querySelector('h3');
  if (existing) existing.remove();

  var h3 = document.createElement('h3');
  h3.innerHTML = '<div class="dot ' + data.dotClass + '"></div>' + data.title;
  panel.insertBefore(h3, content);

  content.innerHTML = data.cards.map(function (c) {
    return '<div class="detail-card"><div class="detail-card-title">' + c.title + '</div><div class="detail-card-body">' + c.body + '</div></div>';
  }).join('');
}
