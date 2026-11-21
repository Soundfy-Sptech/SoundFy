
document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("form-conta");
    const formularioSenha = document.getElementById("form-senha");
    const formularioExcluir = document.getElementById("form-excluir-conta");

    if (!formulario || !formularioSenha || !formularioExcluir) {
        return;
    }

    const token = sessionStorage.getItem("TOKEN_USUARIO");

    if (!token) {
        window.location.href = "cadastro.html";
        return;
    }

    const nome = document.getElementById("conta-nome");
    const email = document.getElementById("conta-email");
    const telefone = document.getElementById("conta-telefone");
    const tipo = document.getElementById("conta-tipo");

    const statusConta = document.getElementById("conta-status");
    const statusSenha = document.getElementById("senha-status");
    const statusExcluir = document.getElementById("excluir-status");

    async function requisicao(url, metodo = "GET", corpo = null) {
        const opcoes = {
            method: metodo,
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("TOKEN_USUARIO")}`,
                "Content-Type": "application/json"
            }
        };

        if (corpo !== null) {
            opcoes.body = JSON.stringify(corpo);
        }

        const resposta = await fetch(url, opcoes);
        const dados = await resposta.json().catch(() => ({}));

        if (resposta.status === 401) {
            sessionStorage.clear();
            window.location.href = "cadastro.html";

            throw new Error("Sua sessão expirou. Entre novamente.");
        }

        if (!resposta.ok) {
            throw new Error(dados.mensagem || "Erro ao realizar operação.");
        }

        return dados;
    }

    function mostrarStatus(elemento, mensagem, sucesso) {
        elemento.textContent = mensagem;
        elemento.style.color = sucesso ? "#16a34a" : "#dc2626";
    }

    async function carregarConta() {
        try {
            const conta = await requisicao("/usuarios/minha-conta");

            nome.value = conta.nome || "";
            email.value = conta.email || "";
            telefone.value = conta.telefone || "";
            tipo.value = conta.tipo_usuario || conta.tipoUsuario || "";

            sessionStorage.setItem("NOME_USUARIO", conta.nome);
            sessionStorage.setItem("EMAIL_USUARIO", conta.email);

            document.querySelectorAll("[data-user-name]").forEach(elemento => {
                elemento.textContent = conta.nome;
            });

            document.querySelectorAll("[data-user-initials]").forEach(elemento => {
                elemento.textContent = conta.nome
                    .trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map(parte => parte.charAt(0))
                    .join("")
                    .toUpperCase();
            });

        } catch (erro) {
            mostrarStatus(statusConta, erro.message, false);
        }
    }

    // UPDATE: dados pessoais
    formulario.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        try {
            await requisicao(
                "/usuarios/minha-conta",
                "PUT",
                {
                    nome: nome.value,
                    email: email.value,
                    telefone: telefone.value
                }
            );

            sessionStorage.setItem("NOME_USUARIO", nome.value);
            sessionStorage.setItem("EMAIL_USUARIO", email.value);

            document.querySelectorAll("[data-user-name]").forEach(elemento => {
                elemento.textContent = nome.value;
            });

            document.querySelectorAll("[data-user-initials]").forEach(elemento => {
                elemento.textContent = nome.value
                    .trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map(parte => parte.charAt(0))
                    .join("")
                    .toUpperCase();
            });

            mostrarStatus(
                statusConta,
                "Dados atualizados com sucesso!",
                true
            );

        } catch (erro) {
            mostrarStatus(statusConta, erro.message, false);
        }
    });

    // UPDATE: senha
    formularioSenha.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        const senhaAtual = document.getElementById("senha-atual");
        const senhaNova = document.getElementById("senha-nova");

        try {
            const dados = await requisicao(
                "/usuarios/minha-conta/senha",
                "PATCH",
                {
                    senhaAtual: senhaAtual.value,
                    novaSenha: senhaNova.value
                }
            );

            formularioSenha.reset();

            mostrarStatus(statusSenha, dados.mensagem, true);

        } catch (erro) {
            mostrarStatus(statusSenha, erro.message, false);
        }
    });

    // DELETE: própria conta
    formularioExcluir.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        const senha = document.getElementById("excluir-senha");

        const confirmado = window.confirm(
            "Tem certeza de que deseja excluir sua conta permanentemente?"
        );

        if (!confirmado) {
            return;
        }

        try {
            const dados = await requisicao(
                "/usuarios/minha-conta",
                "DELETE",
                {
                    senha: senha.value
                }
            );

            window.alert(dados.mensagem);

            sessionStorage.clear();

            window.location.href = "cadastro.html";

        } catch (erro) {
            mostrarStatus(statusExcluir, erro.message, false);
        }
    });

    carregarConta();
});
