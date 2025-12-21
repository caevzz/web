(() => {
  const root = document.documentElement;
  const key = "zyroonour_theme";
  const btn = document.getElementById("themeToggle");

  function apply(theme){
    if(theme === "light") root.classList.add("light");
    else root.classList.remove("light");
  }

  const saved = localStorage.getItem(key);
  apply(saved || "dark");

  if(btn){
    btn.addEventListener("click", () => {
      const isLight = root.classList.toggle("light");
      localStorage.setItem(key, isLight ? "light" : "dark");
    });
  }

  const y = document.getElementById("year");
  if(y) y.textContent = new Date().getFullYear();
})();
