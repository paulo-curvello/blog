// /public/scripts/lang.js
(function () {
  const SUPPORTED = ["pt", "en"];
  const DEFAULT_LANG = "pt";
  const DEFAULT_PATH_AFTER_LANG = "/blog";
  const STORAGE_KEY = "lang";

  const qsAllToggles = () => {
    const byData = Array.from(
      document.querySelectorAll('input[data-switch="lang"]')
    );
    const legacy = [
      document.getElementById("language-toggle"),
      document.getElementById("language-toggle-header"),
      document.getElementById("language-toggle-footer"),
    ].filter(Boolean);
    return Array.from(new Set([...byData, ...legacy]));
  };

  const getLangFromPath = (path) => {
    const seg = path.split("/").filter(Boolean)[0];
    return SUPPORTED.includes(seg) ? seg : null;
  };

  const getStored = () => localStorage.getItem(STORAGE_KEY);
  const setStored = (lang) => localStorage.setItem(STORAGE_KEY, lang);

  const getBrowserLang = () => {
    const nav =
      navigator.language ||
      (navigator.languages && navigator.languages[0]) ||
      "pt-BR";
    return nav.toLowerCase().startsWith("en") ? "en" : "pt";
  };

  const effectiveLang = (() => {
    // ordem: path > localStorage > navegador > default
    const fromPath = getLangFromPath(location.pathname);
    if (fromPath) return fromPath;
    const stored = getStored();
    if (stored && SUPPORTED.includes(stored)) return stored;
    const browser = getBrowserLang();
    return SUPPORTED.includes(browser) ? browser : DEFAULT_LANG;
  })();

  // Reflete no <html>
  document.documentElement.setAttribute("lang", effectiveLang);

  const setAllLangToggles = (isEN) => {
    qsAllToggles().forEach((el) => (el.checked = isEN));
  };

  const isRootish = (p) => /^\/(?:index\.html?)?$/.test(p);

  const swapLangInPath = (toLang) => {
    const basePath = isRootish(location.pathname)
      ? DEFAULT_PATH_AFTER_LANG
      : location.pathname;

    const segs = basePath.split("/");
    if (SUPPORTED.includes(segs[1])) {
      segs[1] = toLang; // /pt/... -> /en/...
    } else {
      segs.splice(1, 0, toLang); // adiciona prefixo
    }
    const newPath = segs.join("/") || `/${toLang}${DEFAULT_PATH_AFTER_LANG}`;
    const url = newPath + location.search + location.hash;
    history.replaceState(null, "", url);
    location.assign(url); // recarrega
  };

  const ensurePrefixedMenuLinks = () => {
    // Prefixa anchors do menu com a língua atual
    const container = document.querySelector("nav .internal-links");
    if (!container) return;
    const anchors = container.querySelectorAll("a[href^='/']");
    anchors.forEach((a) => {
      const href = a.getAttribute("href");
      const hasLang = getLangFromPath(href);
      if (!hasLang) {
        a.setAttribute(
          "href",
          `/${effectiveLang}${href.startsWith("/") ? "" : "/"}${href}`
        );
      }
    });
  };

  const maybeRedirectFirstVisit = () => {
    // Se a URL atual não tem /pt ou /en, manda para /<lang>/blog
    const onPath = getLangFromPath(location.pathname);
    if (!onPath) {
      const base = isRootish(location.pathname)
        ? DEFAULT_PATH_AFTER_LANG
        : location.pathname;
      const target = `/${effectiveLang}${
        base.startsWith("/") ? "" : "/"
      }${base}`;
      location.replace(target + location.search + location.hash);
    }
  };

  const bind = () => {
    // estado inicial nos toggles
    setAllLangToggles(effectiveLang === "en");

    // listeners dos toggles
    qsAllToggles().forEach((el) => {
      el.addEventListener("change", (e) => {
        const toLang = e.target.checked ? "en" : "pt";
        setStored(toLang);
        document.documentElement.setAttribute("lang", toLang);
        setAllLangToggles(toLang === "en"); // reflete em todos
        swapLangInPath(toLang);
      });
    });

    // sincroniza mudança de língua entre abas
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const toLang = e.newValue;
        document.documentElement.setAttribute("lang", toLang);
        setAllLangToggles(toLang === "en");
        // não forçamos redirect aqui para não "puxar" abas passivas
      }
    });
  };

  // persiste a língua detectada (caso tenha vindo do path)
  setStored(effectiveLang);

  const run = () => {
    ensurePrefixedMenuLinks();
    bind();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  // acesso sem prefixo: / -> /<lang>/blog
  maybeRedirectFirstVisit();
})();
