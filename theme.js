(function () {
  var KEY = "SARVA_THEME";
  var MODES = ["system", "light", "dark"];
  var LABELS = {
    system: { short: "Auto", icon: "◐", title: "Theme: Auto (matches system). Click to switch to Light" },
    light: { short: "Light", icon: "☀", title: "Theme: Light. Click to switch to Dark" },
    dark: { short: "Dark", icon: "☾", title: "Theme: Dark. Click to switch to Auto (System)" }
  };

  function getPref() {
    try {
      var saved = localStorage.getItem(KEY);
      return MODES.indexOf(saved) !== -1 ? saved : "system";
    } catch (e) {
      return "system";
    }
  }

  function resolve(pref) {
    if (pref === "light" || pref === "dark") return pref;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function apply(pref) {
    var safe = MODES.indexOf(pref) !== -1 ? pref : "system";
    var resolved = resolve(safe);
    var root = document.documentElement;
    root.dataset.theme = resolved;
    root.dataset.themePreference = safe;
    root.style.colorScheme = resolved;

    var btn = document.getElementById("btn-theme-toggle");
    if (btn) {
      var meta = LABELS[safe];
      btn.title = meta.title;
      btn.setAttribute("aria-label", meta.title);
      btn.dataset.mode = safe;
      var iconEl = btn.querySelector(".theme-icon");
      var textEl = btn.querySelector(".theme-label");
      if (iconEl) iconEl.textContent = meta.icon;
      if (textEl) textEl.textContent = meta.short;
    }
  }

  function cycle() {
    var cur = getPref();
    var next = MODES[(MODES.indexOf(cur) + 1) % MODES.length];
    try {
      localStorage.setItem(KEY, next);
    } catch (e) {}
    apply(next);
  }

  document.addEventListener("DOMContentLoaded", function () {
    apply(getPref());
    var btn = document.getElementById("btn-theme-toggle");
    if (btn) btn.addEventListener("click", cycle);

    if (window.matchMedia) {
      var mq = window.matchMedia("(prefers-color-scheme: dark)");
      var onChange = function () {
        if (getPref() === "system") apply("system");
      };
      if (mq.addEventListener) mq.addEventListener("change", onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  });
})();
