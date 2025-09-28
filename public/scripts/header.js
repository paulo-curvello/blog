document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("theme-toggle");
  const isDark = document.documentElement.classList.contains("dark-theme");
  toggle.checked = isDark;

  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      document.documentElement.classList.add("dark-theme");
      document.body.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark-theme");
      document.body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
  });
});
