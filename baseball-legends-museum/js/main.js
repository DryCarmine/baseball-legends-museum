document.addEventListener("DOMContentLoaded", () => {
    const savedLogo = localStorage.getItem("selectedTeamLogo");

    // 1. Cargar el logo guardado en index.html si el elemento existe
    const mainLogoImg = document.getElementById("main-team-logo");
    if (mainLogoImg && savedLogo) {
        mainLogoImg.src = savedLogo;
    }

    // 2. Gestionar la selección de logos en views/config.html
    const logoButtons = document.querySelectorAll(".logo-option");
    if (logoButtons.length > 0) {
        logoButtons.forEach(button => {
            const logoSrc = button.getAttribute("data-logo");
            
            // Marcar visualmente el botón si ya está seleccionado
            if (savedLogo === logoSrc) {
                button.classList.add("selected");
            }

            button.addEventListener("click", () => {
                // Guardar la ruta del logo en localStorage
                localStorage.setItem("selectedTeamLogo", logoSrc);
                
                // Actualizar clases visuales
                logoButtons.forEach(btn => btn.classList.remove("selected"));
                button.classList.add("selected");
            });
        });
    }
});