function formatarDataTopo(language) {
    const locales = { pt: "pt-BR", en: "en-US", es: "es-ES" };
    const locale = locales[language] || "pt-BR";

    const partes = new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric"
    }).formatToParts(new Date());

    const pegar = function (tipo) {
        const parte = partes.find(function (item) {
            return item.type === tipo;
        });

        return parte ? parte.value : "";
    };

    const semana = pegar("weekday");
    const dia = pegar("day");
    const mes = pegar("month").replace(".", "");
    const ano = pegar("year");

    const texto = language === "en"
        ? `${semana}, ${mes} ${dia} ${ano}`
        : `${semana}, ${dia} ${mes} ${ano}`;

    return texto.toLocaleUpperCase(locale);
}

async function translatePage() {
    let language = localStorage.getItem("soundfy-language") || "pt";

    try {
        await loadLanguage(language);
    } catch (erro) {
        console.error(erro);
        return;
    }

    language = window.currentLanguage();

    let elements = document.querySelectorAll("[data-i18n]");

    elements.forEach(function (element) {
        let key = element.getAttribute("data-i18n");
        element.textContent = t(key, element.textContent);
    });

    let placeholders = document.querySelectorAll("[data-i18n-placeholder]");

    placeholders.forEach(function (element) {
        let key = element.getAttribute("data-i18n-placeholder");
        element.placeholder = t(key, element.placeholder);
    });

    const ariaLabels = document.querySelectorAll("[data-i18n-aria-label]");

    ariaLabels.forEach(function (element) {
        const key = element.getAttribute("data-i18n-aria-label");
        element.setAttribute("aria-label", t(key, element.getAttribute("aria-label") || ""));
    });

    document.querySelectorAll("[data-i18n-date]").forEach(function (element) {
        element.textContent = formatarDataTopo(language);
    });

    document.documentElement.lang = language === "pt"
        ? "pt-BR"
        : language === "en"
            ? "en-US"
            : "es-ES";

    window.notifyLanguageReady();
}

async function changeLanguage(language) {
    await loadLanguage(language);
    await translatePage();
}

translatePage();