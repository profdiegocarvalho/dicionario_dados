document.addEventListener("DOMContentLoaded", function () {
    // 1. ALTERNÂNCIA DE TEMA LIGHT/DARK MODE
    const btnThemeToggle = document.getElementById("btnThemeToggle");
    const themeIcon = document.getElementById("themeIcon");
    const htmlElement = document.documentElement;
  
    btnThemeToggle.addEventListener("click", function () {
      const currentTheme = htmlElement.getAttribute("data-bs-theme");
      const newTheme = currentTheme === "light" ? "dark" : "light";
      
      htmlElement.setAttribute("data-bs-theme", newTheme);
  
      if (newTheme === "dark") {
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
      } else {
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
      }
    });
  
    // 2. SISTEMA DE PESQUISA EM TEMPO REAL (FILTRO DE TABELAS E LINHAS)
    const searchInput = document.getElementById("searchInput");
    const sections = document.querySelectorAll(".dictionary-section");
    const sidebarLinks = document.querySelectorAll("#sidebarMenuList .nav-link");
  
    searchInput.addEventListener("input", function () {
      const query = searchInput.value.toLowerCase().trim();
  
      sections.forEach(function (section) {
        const tableName = section.id.replace("tabela_", "").toLowerCase();
        const rows = section.querySelectorAll("tbody tr");
        let sectionHasMatch = false;
  
        // Verifica correspondência no título da tabela
        if (tableName.includes(query)) {
          sectionHasMatch = true;
          rows.forEach(row => row.style.display = "");
        } else {
          // Verifica correspondência nas colunas da tabela
          rows.forEach(function (row) {
            const rowText = row.textContent.toLowerCase();
            if (rowText.includes(query)) {
              row.style.display = "";
              sectionHasMatch = true;
            } else {
              row.style.display = "none";
            }
          });
        }
  
        // Exibe ou oculta a seção com base no resultado da busca
        if (sectionHasMatch) {
          section.style.display = "";
        } else {
          section.style.display = "none";
        }
      });
  
      // Atualiza destaque da sidebar
      sidebarLinks.forEach(function (link) {
        const targetId = link.getAttribute("href").substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection && targetSection.style.display !== "none") {
          link.style.opacity = "1";
        } else {
          link.style.opacity = "0.3";
        }
      });
    });
  
    // 3. INTEGRAÇÃO DO PANZOOM NO MODAL DO DER
    const panzoomContainer = document.getElementById("panzoomTarget");
    const modalDER = document.getElementById("modalDER");
    let panzoomInstance = null;
  
    if (panzoomContainer) {
      panzoomInstance = Panzoom(panzoomContainer, {
        maxScale: 5,
        minScale: 0.5,
        contain: "outside",
        startTransform: "scale(1)"
      });
  
      // Permite zoom com o scroll do mouse na área do modal
      const parentContainer = document.getElementById("modalPanzoomContainer");
      parentContainer.addEventListener("wheel", panzoomInstance.zoomWithWheel);
  
      // Conecta botões de controle de Zoom
      document.getElementById("btnZoomIn").addEventListener("click", panzoomInstance.zoomIn);
      document.getElementById("btnZoomOut").addEventListener("click", panzoomInstance.zoomOut);
      document.getElementById("btnZoomReset").addEventListener("click", panzoomInstance.reset);
    }
  
    // Reseta o Panzoom quando o modal é aberto
    modalDER.addEventListener("shown.bs.modal", function () {
      if (panzoomInstance) {
        panzoomInstance.reset();
      }
    });
  
    // 4. ATUALIZAÇÃO ATIVA DA SIDEBAR CONFORME O SCROLL (SCROLLSPY BÁSICO)
    window.addEventListener("scroll", function () {
      let currentSectionId = "";
      sections.forEach(function (section) {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
          currentSectionId = section.getAttribute("id");
        }
      });
  
      sidebarLinks.forEach(function (link) {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + currentSectionId) {
          link.classList.add("active");
        }
      });
    });
  });