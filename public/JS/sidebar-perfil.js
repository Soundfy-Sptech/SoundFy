document.addEventListener("DOMContentLoaded", function () {
    const secoesArtista = document.querySelectorAll(
        '[data-role-section="artist"]'
    );

    const secoesProdutor = document.querySelectorAll(
        '[data-role-section="producer"]'
    );

    // Valor temporário até a integração com o cadastro.
    const tipoPerfil = localStorage.getItem("soundfy-role") || "producer";

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