// ============================================================
// ARQUIVO: JS/sidebar-perfil.js
// Carregado no <head> de TODAS as páginas da dashboard, de forma
// síncrona, ANTES de o <body> ser desenhado.
//
// Lê o perfil em sessionStorage.TIPO_USUARIO (mesma chave gravada
// no login/cadastro) e registra em <html data-perfil="...">.
// O CSS (style.css) mantém as abas específicas ocultas por padrão e
// só mostra as do perfil identificado. Sem sessão válida, nenhuma
// aba específica aparece (não existe perfil padrão).
// ============================================================
(function () {
    function identificarPerfil() {
        var tipo = "";

        try {
            tipo = String(sessionStorage.getItem("TIPO_USUARIO") || "")
                .trim()
                .toLowerCase();
        } catch (erro) {
            tipo = "";
        }

        return tipo === "artista" || tipo === "produtor" ? tipo : "";
    }

    function aplicarPerfilSidebar() {
        var perfil = identificarPerfil();
        var raiz = document.documentElement;

        if (perfil) {
            raiz.setAttribute("data-perfil", perfil);
        } else {
            raiz.removeAttribute("data-perfil");
        }

        return perfil;
    }

    window.aplicarPerfilSidebar = aplicarPerfilSidebar;
    aplicarPerfilSidebar();
})();
