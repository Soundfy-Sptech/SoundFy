document.addEventListener("DOMContentLoaded", function () {
    const botao = document.getElementById("perfil-menu-botao");
    const menu = document.getElementById("perfil-menu");
    const botaoSair = document.getElementById("perfil-sair");

    if (!botao || !menu) return;

    function fecharMenu() {
        menu.hidden = true;
        botao.setAttribute("aria-expanded", "false");
    }

    botao.addEventListener("click", function (evento) {
        evento.stopPropagation();

        menu.hidden = !menu.hidden;

        botao.setAttribute(
            "aria-expanded",
            String(!menu.hidden)
        );
    });

    document.addEventListener("click", function (evento) {
        if (!menu.contains(evento.target)) {
            fecharMenu();
        }
    });

    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape") {
            fecharMenu();
            botao.focus();
        }
    });

    if (botaoSair) {
        botaoSair.addEventListener("click", function () {
            alert("A funcionalidade de sair será implementada com a autenticação.");
            fecharMenu();
        });
    }
});