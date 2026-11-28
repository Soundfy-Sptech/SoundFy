// Barra lateral única do SoundFy.
//
// Este script deve ser carregado logo após <aside class="barra-lateral"></aside>,
// sem defer. Ele monta o menu de forma síncrona, antes da primeira pintura, usando
// apenas o perfil salvo na sessão. Assim, a navegação:
//   - aparece completa em todas as páginas autenticadas (Dashboard, Análise, Relatórios);
//   - não depende de outra página nem de outro script para ser exibida;
//   - não "pisca" quando o idioma ou o perfil são aplicados.
(function () {
    "use strict";

    var barra = document.querySelector("aside.barra-lateral");
    if (!barra) return;

    // ---------- Perfil ----------
    function normalizarTipo(tipo) {
        var valor = String(tipo || "").trim().toLocaleLowerCase("pt-BR");
        if (["1", "artista", "produtor musical", "produtor_musical"].includes(valor)) return "musical-producer";
        if (["2", "produtor", "produtor eventos", "produtor de eventos", "produtor_de_eventos"].includes(valor)) return "event-producer";
        if (["3", "administrador", "admin"].includes(valor)) return "administrator";
        return "";
    }

    var perfil = normalizarTipo(sessionStorage.getItem("TIPO_USUARIO"));

    // ---------- Textos ----------
    // Fonte única dos textos: public/locales/*.json. O i18n.js guarda o trecho usado
    // pela barra em localStorage, o que permite exibir o idioma certo já na primeira pintura.
    // Sem cache (primeiro acesso), usa o português e o translate.js ajusta em seguida.
    var PADRAO = {
        navigation: {
            overview: "VISÃO GERAL", dashboard: "Dashboard", analysisItem: "Análise",
            reports: "Relatórios", settings: "Configurações",
            musicalProducerProfile: "Análise de artistas", eventProduction: "Inteligência regional"
        },
        sidebar: { tagline: "Inteligência musical", motto: "Dados para decisões melhores", mainNavigation: "Navegação principal", panelTitle: "SoundFy Insights", panelDescription: "3 áreas para explorar" },
        profile: { name: "Usuário", musicalProducer: "Produtor musical", eventProducer: "Produtor de eventos", administrator: "Administrador" }
    };

    var cache = {};
    try {
        var salvo = JSON.parse(localStorage.getItem("soundfy-sidebar-i18n") || "null");
        if (salvo && salvo.language === (localStorage.getItem("soundfy-language") || "pt")) cache = salvo;
    } catch (erro) { cache = {}; }

    function txt(grupo, chave) {
        var valor = cache[grupo] && cache[grupo][chave];
        return typeof valor === "string" && valor ? valor : PADRAO[grupo][chave];
    }

    function escapar(texto) {
        return String(texto).replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    }

    // ---------- Itens por perfil ----------
    var ICONES = {
        dashboard: '<path d="M3 13h8V3H3zM13 21h8V11h-8zM13 3v6h8V3zM3 21h8v-6H3z"/>',
        analise: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
        relatorios: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
        configuracoes: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'
    };

    var itens = [{ href: "index.html", chave: "dashboard", icone: "dashboard" }];

    // A aba "Análise" fica sempre presente; o destino depende do perfil.
    if (perfil === "musical-producer") {
        itens.push({ href: "artista.html", chave: "analysisItem", icone: "analise" });
    } else if (perfil === "event-producer") {
        itens.push({ href: "produtor.html", chave: "analysisItem", icone: "analise" });
    } else if (perfil === "administrator") {
        // O administrador já tinha acesso às duas análises; mantém as duas entradas.
        itens.push({ href: "produtor.html", chave: "eventProduction", icone: "analise" });
        itens.push({ href: "artista.html", chave: "musicalProducerProfile", icone: "analise" });
    }

    itens.push({ href: "relatorios.html", chave: "reports", icone: "relatorios" });

    var paginaAtual = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();

    function linkNavegacao(item) {
        var ativo = item.href === paginaAtual;
        return '<a href="' + item.href + '"' + (ativo ? ' class="ativo" aria-current="page"' : "") + ">" +
            '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONES[item.icone] + "</svg>" +
            '<span data-i18n="navigation.' + item.chave + '">' + escapar(txt("navigation", item.chave)) + "</span></a>";
    }

    // ---------- Usuário ----------
    var nomeUsuario = sessionStorage.getItem("NOME_USUARIO") || txt("profile", "name");
    var iniciais = nomeUsuario.trim().split(/\s+/).slice(0, 2)
        .map(function (parte) { return parte.charAt(0); }).join("").toUpperCase();

    var chavePerfil = perfil === "musical-producer" ? "musicalProducer" :
        perfil === "event-producer" ? "eventProducer" :
        perfil === "administrator" ? "administrator" : "name";

    var ativoConfig = paginaAtual === "configuracoes.html";

    barra.setAttribute("aria-label", txt("sidebar", "mainNavigation"));
    barra.innerHTML =
        '<a class="logo" href="index.html" aria-label="SoundFy">' +
            "<b>S</b>" +
            "<span>Sound<span>Fy</span>" +
                '<small data-i18n="sidebar.tagline">' + escapar(txt("sidebar", "tagline")) + "</small>" +
            "</span>" +
        "</a>" +
        '<div class="marca-lema">' +
            '<i class="marca-eq" aria-hidden="true"><s></s><s></s><s></s><s></s></i>' +
            '<span data-i18n="sidebar.motto">' + escapar(txt("sidebar", "motto")) + "</span>" +
        "</div>" +
        "<nav>" +
            '<label data-i18n="navigation.overview">' + escapar(txt("navigation", "overview")) + "</label>" +
            '<div class="nav-itens">' + itens.map(linkNavegacao).join("") + "</div>" +
        "</nav>" +
        '<div class="rodape-lateral">' +
            '<a href="configuracoes.html"' + (ativoConfig ? ' class="ativo" aria-current="page"' : "") + ">" +
                '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONES.configuracoes + "</svg>" +
                '<span data-i18n="navigation.settings">' + escapar(txt("navigation", "settings")) + "</span></a>" +
            '<div class="perfil">' +
                "<b data-user-initials>" + escapar(iniciais || "U") + "</b>" +
                "<div>" +
                    "<strong data-user-name>" + escapar(nomeUsuario) + "</strong>" +
                    '<small data-i18n="profile.' + chavePerfil + '">' + escapar(txt("profile", chavePerfil)) + "</small>" +
                "</div>" +
            "</div>" +
        "</div>" +
        '<div class="sidebar-resumo">' +
            '<span class="sidebar-resumo-icone" aria-hidden="true">♫</span>' +
            '<div><strong data-i18n="sidebar.panelTitle">' + escapar(txt("sidebar", "panelTitle")) + '</strong><small data-i18n="sidebar.panelDescription">' + escapar(txt("sidebar", "panelDescription")) + '</small></div>' +
            '<span class="sidebar-resumo-ponto" aria-hidden="true"></span>' +
        "</div>";
})();
