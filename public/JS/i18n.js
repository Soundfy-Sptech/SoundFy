let translations = {};

let currentLanguage = localStorage.getItem("soundfy-language") || "pt";

let languageReady = false;
const languageReadyCallbacks = [];

async function loadLanguage(language) {
    const idiomasPermitidos = ["pt", "en", "es"];

    if (!idiomasPermitidos.includes(language)) {
        language = "pt";
    }

    const response = await fetch(`/locales/${language}.json`);

    if (!response.ok) {
        throw new Error(`Não foi possível carregar o idioma: ${language}`);
    }

    translations = await response.json();
    currentLanguage = language;

    localStorage.setItem("soundfy-language", language);
}

// Busca a tradução pela chave (ex.: "index.kpiStreams").
// Se a chave não existir, devolve o texto de reserva (quando informado) ou a própria chave.
function t(key, fallback) {
    let keys = key.split(".");
    let value = translations;

    keys.forEach(function (item) {
        value = value?.[item];
    });

    if (typeof value === "string") {
        return value;
    }

    return fallback !== undefined ? fallback : key;
}

// Registra uma função para rodar sempre que o idioma terminar de carregar
// (na abertura da página e a cada troca de idioma).
function onLanguageReady(callback) {
    if (typeof callback !== "function") {
        return;
    }

    languageReadyCallbacks.push(callback);

    if (languageReady) {
        callback();
    }
}

function notifyLanguageReady() {
    languageReady = true;

    languageReadyCallbacks.forEach(function (callback) {
        try {
            callback();
        } catch (erro) {
            console.error("Erro ao atualizar a página após carregar o idioma:", erro);
        }
    });
}

window.t = t;
window.loadLanguage = loadLanguage;
window.currentLanguage = () => currentLanguage;
window.onLanguageReady = onLanguageReady;
window.notifyLanguageReady = notifyLanguageReady;