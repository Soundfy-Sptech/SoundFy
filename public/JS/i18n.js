let translations = {};

let currentLanguage = localStorage.getItem("soundfy-language") || "pt";

const idiomasPermitidos = ["pt", "en", "es"];

const localesPorIdioma = {
    pt: "pt-BR",
    en: "en-US",
    es: "es-ES"
};

window.i18nLoaded = false;

async function loadLanguage(language) {
    if (!idiomasPermitidos.includes(language)) {
        language = "pt";
    }

    const response = await fetch(`../locales/${language}.json`);

    if (!response.ok) {
        throw new Error(`Não foi possível carregar o idioma: ${language}`);
    }

    translations = await response.json();
    currentLanguage = language;
    window.i18nLoaded = true;

    localStorage.setItem("soundfy-language", language);
}

function buscarTraducao(key) {
    let value = translations;

    key.split(".").forEach(function (item) {
        value = value?.[item];
    });

    return value;
}

// Idioma e locale (pt-BR, en-US, es-ES) atualmente aplicados.
function currentLocale() {
    return localesPorIdioma[currentLanguage] || "pt-BR";
}

// Formata números conforme o idioma. O valor é preservado; só muda a pontuação.
function formatNumber(valor, opcoes) {
    return Number(valor).toLocaleString(currentLocale(), Object.assign({
        maximumFractionDigits: 2,
        useGrouping: "always"
    }, opcoes || {}));
}

function aplicarParametros(texto, params) {
    return texto.replace(/\{(\w+)\}/g, function (trecho, nome) {
        if (!(nome in params)) {
            return trecho;
        }

        const valor = params[nome];

        return typeof valor === "number" ? formatNumber(valor) : String(valor);
    });
}

function tExists(key) {
    return typeof buscarTraducao(key) === "string";
}

// t("chave") ou t("chave", { n: 10 }) para textos com {n}.
function t(key, params) {
    const value = buscarTraducao(key);

    if (typeof value !== "string" || value === "") {
        return key;
    }

    return params ? aplicarParametros(value, params) : value;
}

// Executa a função quando o idioma estiver carregado e a cada nova troca de idioma.
function onLanguageReady(callback) {
    document.addEventListener("soundfy:languagechange", callback);

    if (window.i18nLoaded) {
        callback();
    }
}

window.t = t;
window.tExists = tExists;
window.loadLanguage = loadLanguage;
window.currentLanguage = () => currentLanguage;
window.currentLocale = currentLocale;
window.formatNumber = formatNumber;
window.onLanguageReady = onLanguageReady;
