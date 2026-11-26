document.addEventListener("DOMContentLoaded", function () {
    const secoesArtista = document.querySelectorAll(
        '[data-role-section="artist"]'
    );

    const secoesProdutor = document.querySelectorAll(
        '[data-role-section="producer"]'
    );

    const tipo = String(sessionStorage.getItem("TIPO_USUARIO") || "").toLowerCase();
    const tipoPerfil = tipo === "artista" ? "artist" : "producer";

    function atualizarSidebar(tipo) {
        const ehArtista = tipo === "artist";

        secoesArtista.forEach(function (secao) {
            secao.hidden = !ehArtista;
        });

        secoesProdutor.forEach(function (secao) {
            secao.hidden = ehArtista;
        });
    }

    atualizarSidebar(tipoPerfil);
});