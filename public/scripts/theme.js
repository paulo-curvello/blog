// /public/scripts/theme.js
(function () {
  const STORAGE_KEY = "theme"; // 'light' | 'dark'
  const DARK_CLASS = "dark-theme";

  const qsAllToggles = () => {
    const byData = Array.from(document.querySelectorAll('input[data-switch="theme"]'));
    const legacy = [
      document.getElementById("theme-toggle"),
      document.getElementById("theme-toggle-header"),
      document.getElementById("theme-toggle-footer"),
    ].filter(Boolean);
    // evita duplicados
    return Array.from(new Set([...byData, ...legacy]));
  };

  const prefersDark = () =>
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const getStored = () => localStorage.getItem(STORAGE_KEY);
  const setStored = (v) => localStorage.setItem(STORAGE_KEY, v);

  const currentDomIsDark = () =>
    document.documentElement.classList.contains(DARK_CLASS) ||
    document.body.classList.contains(DARK_CLASS);

  const applyTheme = (theme) => {
    const makeDark = theme === "dark";
    document.documentElement.classList.toggle(DARK_CLASS, makeDark);
    document.body.classList.toggle(DARK_CLASS, makeDark);
  };

  const getInitial = () => {
    const stored = getStored();
    if (stored === "dark" || stored === "light") return stored;
    // se já tem classe aplicada, respeita
    if (currentDomIsDark()) return "dark";
    // senão, segue preferência do SO
    return prefersDark() ? "dark" : "light";
  };

  const setAllToggles = (checked) => {
    qsAllToggles().forEach((el) => (el.checked = checked));
  };

  const onChange = (checked) => {
    const theme = checked ? "dark" : "light";
    setStored(theme);
    applyTheme(theme);
    setAllToggles(theme === "dark"); // reflete em todos
  };

  const init = () => {
    const initial = getInitial();
    applyTheme(initial);
    setAllToggles(initial === "dark");

    // listeners dos toggles
    qsAllToggles().forEach((el) => {
      el.addEventListener("change", (e) => onChange(e.target.checked));
    });

    // sincroniza entre abas
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        applyTheme(e.newValue);
        setAllToggles(e.newValue === "dark");
      }
    });

    // se o usuário mudar a preferência do SO e não houver escolha salva
    if (window.matchMedia) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const react = () => {
        if (!getStored()) {
          const sys = mq.matches ? "dark" : "light";
          applyTheme(sys);
          setAllToggles(sys === "dark");
        }
      };
      mq.addEventListener?.("change", react);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
