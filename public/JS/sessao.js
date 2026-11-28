// Controle centralizado de acesso e identificação do perfil.
(function () {
    "use strict";

    function normalizarTipo(tipo) {
        var valor = String(tipo || "").trim().toLocaleLowerCase("pt-BR");
        if (["1", "artista", "produtor musical", "produtor_musical"].includes(valor)) return "musical-producer";
        if (["2", "produtor", "produtor eventos", "produtor de eventos", "produtor_de_eventos"].includes(valor)) return "event-producer";
        if (["3", "administrador", "admin"].includes(valor)) return "administrator";
        return "";
    }

    function paginaPorPerfil(perfil) {
        if (perfil === "musical-producer") return "artista.html";
        return "produtor.html";
    }

    function controlarExibicaoPorTipoUsuario() {
        var perfil = normalizarTipo(sessionStorage.getItem("TIPO_USUARIO"));
        var ehAdmin = perfil === "administrator";

        var paginaLegadaRegioes = document.body && document.body.dataset.legacyRegions === "true";
        var perfilPermitido = document.body && document.body.dataset.allowedRole;

        if (paginaLegadaRegioes) {
            if (!perfil) {
                window.location.replace("cadastro.html");
                return;
            }
            window.location.replace(paginaPorPerfil(perfil));
            return;
        }

        if (perfilPermitido && perfil && perfil !== perfilPermitido && !ehAdmin) {
            window.location.replace(paginaPorPerfil(perfil));
        } else if (perfilPermitido && !perfil) {
            window.location.replace("cadastro.html");
        }
    }

    function limparSessao() {
        sessionStorage.clear();
        window.location.href = "cadastro.html";
    }

    function atualizarDadosPerfil() {
        var nomeUsuario = sessionStorage.getItem("NOME_USUARIO") || "Usuário";
        var perfil = normalizarTipo(sessionStorage.getItem("TIPO_USUARIO"));
        var nomePerfil = perfil === "musical-producer" ? "Produtor musical" :
            perfil === "event-producer" ? "Produtor de eventos" :
            perfil === "administrator" ? "Administrador" : "Usuário";

        document.querySelectorAll("[data-user-name]").forEach(function (el) { el.textContent = nomeUsuario; });
        document.querySelectorAll("[data-user-initials]").forEach(function (el) {
            el.textContent = nomeUsuario.trim().split(/\s+/).slice(0, 2)
                .map(function (parte) { return parte.charAt(0); }).join("").toUpperCase();
        });
        document.querySelectorAll("[data-user-role]").forEach(function (el) { el.textContent = nomePerfil; });
        var saudacao = document.getElementById("nome-usuario-greeting");
        if (saudacao) saudacao.textContent = nomeUsuario;
    }

    window.controlarExibicaoPorTipoUsuario = controlarExibicaoPorTipoUsuario;
    window.limparSessao = limparSessao;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            controlarExibicaoPorTipoUsuario();
            atualizarDadosPerfil();
        });
    } else {
        controlarExibicaoPorTipoUsuario();
        atualizarDadosPerfil();
    }
})();
