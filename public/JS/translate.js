async function translatePage() {
    let language = localStorage.getItem("soundfy-language") || "pt";

    await loadLanguage(language);

    let elements = document.querySelectorAll("[data-i18n]");

    elements.forEach(function (element) {
        let key = element.getAttribute("data-i18n");
        element.textContent = t(key);
    });

    let placeholders = document.querySelectorAll("[data-i18n-placeholder]");

    placeholders.forEach(function (element) {
        let key = element.getAttribute("data-i18n-placeholder");
        element.placeholder = t(key);
    });

    document.documentElement.lang = language === "pt"
        ? "pt-BR"
        : language === "en"
            ? "en-US"
            : "es-ES";
}

async function changeLanguage(language) {
    await loadLanguage(language);
    await translatePage();
}

translatePage();