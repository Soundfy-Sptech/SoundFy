function lerParametros(element) {
    const bruto = element.getAttribute("data-i18n-params");

    if (!bruto) {
        return undefined;
    }

    try {
        return JSON.parse(bruto);
    } catch (erro) {
        console.warn("[i18n] data-i18n-params inválido:", bruto);
        return undefined;
    }
}

function textoComPrimeiraMaiuscula(texto) {
    return texto.charAt(0).toLocaleUpperCase(currentLocale()) + texto.slice(1);
}

function aplicarTraducoes() {
    document.querySelectorAll("[data-i18n]").forEach(function (element) {
        const key = element.getAttribute("data-i18n");

        // Sem tradução disponível: mantém o texto que já está no HTML.
        if (!tExists(key)) {
            console.warn("[i18n] chave ausente:", key);
            return;
        }

        element.textContent = t(key, lerParametros(element));
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (element) {
        const key = element.getAttribute("data-i18n-placeholder");

        if (tExists(key)) {
            element.placeholder = t(key);
        }
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach(function (element) {
        const key = element.getAttribute("data-i18n-aria-label");

        if (tExists(key)) {
            element.setAttribute("aria-label", t(key));
        }
    });

    // Rótulos de <optgroup>
    document.querySelectorAll("[data-i18n-label]").forEach(function (element) {
        const key = element.getAttribute("data-i18n-label");

        if (tExists(key)) {
            element.setAttribute("label", t(key));
        }
    });

    // Valor padrão de campos (só enquanto o usuário não editou o campo)
    document.querySelectorAll("[data-i18n-value]").forEach(function (element) {
        const key = element.getAttribute("data-i18n-value");

        if (!element.dataset.editado) {
            element.addEventListener("input", function () {
                element.dataset.editado = "1";
            }, { once: true });
        }

        if (!element.dataset.editado && tExists(key)) {
            element.value = t(key);
        }
    });

    // Números formatados conforme o idioma (valor original preservado)
    document.querySelectorAll("[data-i18n-number]").forEach(function (element) {
        element.textContent = formatNumber(element.getAttribute("data-i18n-number"));
    });

    // Data de hoje por extenso, no idioma selecionado
    document.querySelectorAll("[data-i18n-date]").forEach(function (element) {
        element.textContent = textoComPrimeiraMaiuscula(
            new Date().toLocaleDateString(currentLocale(), {
                weekday: "long",
                day: "numeric",
                month: "long"
            })
        );
    });

    document.documentElement.lang = currentLocale();
}

async function translatePage(language) {
    await loadLanguage(language || localStorage.getItem("soundfy-language") || "pt");

    aplicarTraducoes();

    document.dispatchEvent(new CustomEvent("soundfy:languagechange", {
        detail: { language: window.currentLanguage() }
    }));
}

async function changeLanguage(language) {
    await translatePage(language);
}

window.translatePage = translatePage;
window.changeLanguage = changeLanguage;

// Ao voltar para a página pelo histórico (cache do navegador), reaplica o idioma salvo.
window.addEventListener("pageshow", function (evento) {
    if (evento.persisted) {
        translatePage();
    }
});

translatePage();
