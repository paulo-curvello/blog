// public/scripts/lang.js
(function () {
  const SUPPORTED = ["pt", "en"];
  const DEFAULT_LANG = "pt";

  const getLangFromPath = (path) => {
    // path ex.: "/pt/blog/post-x"
    const seg = path.split("/").filter(Boolean)[0];
    return SUPPORTED.includes(seg) ? seg : null;
  };

  const getStoredLang = () => localStorage.getItem("lang");
  const setStoredLang = (lang) => localStorage.setItem("lang", lang);

  const getBrowserLang = () => {
    const nav = navigator.language || (navigator.languages && navigator.languages[0]) || "pt-BR";
    return nav.toLowerCase().startsWith("pt") ? "pt" : "en";
  };

  const effectiveLang = (() => {
    // ordem: path > localStorage > navegador > default
    const fromPath = getLangFromPath(location.pathname);
    if (fromPath) return fromPath;
    const stored = getStoredLang();
    if (stored && SUPPORTED.includes(stored)) return stored;
    const browser = getBrowserLang();
    return SUPPORTED.includes(browser) ? browser : DEFAULT_LANG;
  })();

  // Define <html lang="...">
  document.documentElement.setAttribute("lang", effectiveLang);

  // Pré-seleciona o toggle sem esperar DOMContentLoaded (evita flicker)
  const markToggleEarly = () => {
    const input = document.getElementById("language-toggle");
    if (input) input.checked = effectiveLang === "en";
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", markToggleEarly);
  } else {
    markToggleEarly();
  }

  const swapLangInPath = (toLang) => {
    const segs = location.pathname.split("/");
    // segs[0] == "" sempre
    if (SUPPORTED.includes(segs[1])) {
      segs[1] = toLang; // /pt/... -> /en/...
    } else {
      // Sem prefixo: adiciona
      segs.splice(1, 0, toLang);
    }
    const newPath = segs.join("/") || `/${toLang}/`;
    const url = newPath + location.search + location.hash;
    history.replaceState(null, "", url); // troca no histórico
    // força recarregar conteúdo estático correto (se necessário):
    location.assign(url);
  };

  const ensurePrefixedMenuLinks = () => {
    // Prefixa anchors do menu com a língua atual, p/ evitar sair do namespace /pt ou /en
    const container = document.querySelector("nav .internal-links");
    if (!container) return;
    const anchors = container.querySelectorAll("a[href^='/']");
    anchors.forEach((a) => {
      const href = a.getAttribute("href");
      const hasLang = getLangFromPath(href);
      if (!hasLang) {
        // torna /blog -> /pt/blog (ou /en/blog)
        a.setAttribute("href", `/${effectiveLang}${href.startsWith("/") ? "" : "/"}${href}`);
      }
    });
  };

  const maybeRedirectFirstVisit = () => {
    // Se a URL atual não tem /pt ou /en, redireciona para a preferida
    const onPath = getLangFromPath(location.pathname);
    if (!onPath) {
      const target = `/${effectiveLang}${location.pathname.startsWith("/") ? "" : "/"}${location.pathname}`;
      location.replace(target + location.search + location.hash);
    }
  };

  const bindToggle = () => {
    const input = document.getElementById("language-toggle");
    if (!input) return;
    input.checked = effectiveLang === "en";

    input.addEventListener("change", (e) => {
      const toLang = e.target.checked ? "en" : "pt";
      setStoredLang(toLang);
      swapLangInPath(toLang);
    });
  };

  // Persistência da escolha atual (caso tenha vindo do path)
  setStoredLang(effectiveLang);

  // Executa quando o DOM estiver pronto
  const run = () => {
    ensurePrefixedMenuLinks();
    bindToggle();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  // Se o usuário acessou sem prefixo de idioma, direcione para o correto
  maybeRedirectFirstVisit();
})();
