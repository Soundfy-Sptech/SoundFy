let translations = {};

let currentLanguage = localStorage.getItem("soundfy-language") || "pt";

async function loadLanguage(language) {
    let response = await fetch(`../Locales/${language}.json`);

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