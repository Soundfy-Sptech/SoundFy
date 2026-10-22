// ============================================================
// ARQUIVO: JS/sessao.js
// ============================================================

function validarSessao() {
    var email = sessionStorage.EMAIL_USUARIO;
    var nome = sessionStorage.NOME_USUARIO;

    var b_usuario = document.getElementById("b_usuario");

    if (email != null && nome != null) {
        if (b_usuario) {
            b_usuario.innerHTML = nome;
        }
        controlarExibicaoPorTipoUsuario();
    } else {
        window.location.href = "cadastro.html";
    }
}

function controlarExibicaoPorTipoUsuario() {
    // Recupera o tipo de usuário salvo na sessão
    var tipoUsuario = sessionStorage.TIPO_USUARIO;

    var secaoArtista = document.querySelector('[data-role-section="artist"]');
    var secaoProdutor = document.querySelector('[data-role-section="producer"]');

    if (!secaoArtista || !secaoProdutor) {
        return;
    }

    if (tipoUsuario) {
        var tipoNormalizado = String(tipoUsuario).trim().toLowerCase();

        if (tipoNormalizado === "artista") {
            // Exibe a aba do artista e oculta a do produtor
            secaoArtista.style.setProperty("display", "block", "important");
            secaoProdutor.style.setProperty("display", "none", "important");
        } else if (tipoNormalizado === "produtor") {
            // Exibe a aba do produtor e oculta a do artista
            secaoArtista.style.setProperty("display", "none", "important");
            secaoProdutor.style.setProperty("display", "block", "important");
        } else {
            secaoArtista.style.setProperty("display", "none", "important");
            secaoProdutor.style.setProperty("display", "none", "important");
        }
    }
}

function limparSessao() {
    sessionStorage.clear();
    window.location.href = "cadastro.html";
}

// Executa assim que o DOM estiver pronto e também ao finalizar o carregamento total
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", controlarExibicaoPorTipoUsuario);
} else {
    controlarExibicaoPorTipoUsuario();
}

window.addEventListener("load", controlarExibicaoPorTipoUsuario);