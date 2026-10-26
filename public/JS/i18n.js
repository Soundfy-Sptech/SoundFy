let translations = {};

let currentLanguage = localStorage.getItem("soundfy-language") || "pt";

async function loadLanguage(language) {
    const idiomasPermitidos = ["pt", "en", "es"];

    if (!idiomasPermitidos.includes(language)) {
        language = "pt";
    }

    const response = await fetch(`../locales/${language}.json`);

    if (!response.ok) {
        throw new Error(`Não foi possível carregar o idioma: ${language}`);
    }

    translations = await response.json();
    currentLanguage = language;

    localStorage.setItem("soundfy-language", language);
}

function t(key) {
    let keys = key.split(".");
    let value = translations;

    keys.forEach(function (item) {
        value = value?.[item];
    });

    return value || key;
}

window.t = t;
window.loadLanguage = loadLanguage;
window.currentLanguage = () => currentLanguage;