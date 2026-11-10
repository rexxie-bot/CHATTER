/* CHATTER – shared behaviour. Header/footer are injected so every page stays in sync. */
(() => {
  const page = location.pathname.split("/").pop() || "index.html";

  /* ---- Header & footer components ---- */
  const links = [
    ["index.html", "Home"],
    ["index.html#about", "About us"],
    ["index.html#contact", "Contact"],
    ["index.html#blogs", "Blogs"],
  ];
  const header = `
  <header class="site-header"><div class="container nav">
    <a href="index.html" class="logo" aria-label="Chatter home">CHATTER</a>
    <button class="menu-toggle" aria-label="Toggle menu" aria-expanded="false">&#9776;</button>
    <nav class="nav-links" aria-label="Main">
      ${links.map(([h, t]) => `<a href="${h}" ${h === page ? 'class="active"' : ""}>${t}</a>`).join("")}
    </nav>
    <div class="nav-actions">
      <a href="login.html" class="btn btn-outline">Log in</a>
      <a href="signup.html" class="btn btn-primary">Sign up</a>
    </div>
  </div></header>`;

  const footer = `
  <footer class="site-footer" id="contact"><div class="container footer-inner">
    <a href="index.html" class="logo">CHATTER</a>
    <div><h4>Explore</h4><ul>
      <li><a href="#">Community</a></li><li><a href="index.html#blogs">Trending blogs</a></li><li><a href="#">Chatter for teams</a></li></ul></div>
    <div><h4>Support</h4><ul>
      <li><a href="#">Support docs</a></li><li><a href="#">Join Slack</a></li><li><a href="#contact">Contact</a></li></ul></div>
    <div><h4>Official blog</h4><ul>
      <li><a href="#">Official blog</a></li><li><a href="#">Engineering blog</a></li></ul></div>
  </div></footer>`;

  document.getElementById("site-header")?.insertAdjacentHTML("afterbegin", header);
  document.getElementById("site-footer")?.insertAdjacentHTML("afterbegin", footer);

  /* ---- Mobile menu ---- */
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".menu-toggle");
  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });

  /* ---- Password show/hide ---- */
  document.querySelectorAll(".pw-wrap button").forEach((btn) =>
    btn.addEventListener("click", () => {
      const input = btn.previousElementSibling;
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.textContent = show ? "Hide" : "Show";
    })
  );

  /* ---- Form validation (demo only: swap the fake submit for your API call) ---- */
  const rules = {
    name: (v) => v.trim().length >= 2 || "Enter your full name.",
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email address.",
    password: (v) => v.length >= 8 || "Use at least 8 characters.",
    confirm: (v, f) => v === f.password.value || "Passwords do not match.",
  };

  document.querySelectorAll("form[data-form]").forEach((form) => {
    const msg = form.querySelector(".form-msg");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      form.querySelectorAll(".field input[name]").forEach((input) => {
        const rule = rules[input.name];
        const field = input.closest(".field");
        const result = rule ? rule(input.value, form) : true;
        field.classList.toggle("invalid", result !== true);
        if (result !== true) { field.querySelector(".error").textContent = result; ok = false; }
      });
      if (!ok) return;

      const type = form.dataset.form;
      if (type === "join" && !form.querySelector(".chip.selected")) { msg.textContent = "Pick at least one interest."; return; }

      msg.textContent = type === "login" ? "Logging you in…" : "Creating your account…";
      // TODO: replace with fetch("/api/...", { method: "POST", body: ... })
      setTimeout(() => (location.href = type === "login" ? "index.html" : "get-started.html"), 900);
    });
  });

  /* ---- Interest chips ---- */
  document.querySelectorAll(".chip").forEach((chip) =>
    chip.addEventListener("click", () => {
      chip.classList.toggle("selected");
      chip.setAttribute("aria-pressed", chip.classList.contains("selected"));
    })
  );
})();
