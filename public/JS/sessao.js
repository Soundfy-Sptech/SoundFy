
 // ============================================================
 // ARQUIVO: JS/sessao.js
 // Gerenciamento e validação da sessão do usuário
 // ============================================================

 function validarSessao() {
     const email = sessionStorage.getItem("EMAIL_USUARIO");
     const nome = sessionStorage.getItem("NOME_USUARIO");
     const tipoUsuario = (sessionStorage.getItem("TIPO_USUARIO") || "")
         .trim()
         .toLowerCase();

     const b_usuario = document.getElementById("b_usuario");

     // Só permite continuar com uma sessão válida.
     // Não atribui um perfil padrão caso o tipo seja desconhecido.
     if (
         email &&
         nome &&
         nome.trim() !== "" &&
         (tipoUsuario === "artista" || tipoUsuario === "produtor")
     ) {
         if (b_usuario) {
             b_usuario.textContent = nome;
         }

         controlarExibicaoPorTipoUsuario();
     } else {
         limparDadosSessao();
         window.location.href = "cadastro.html";
     }
 }

 // ============================================================
 // CONTROLE DE EXIBIÇÃO DO PERFIL
 // ============================================================

 function controlarExibicaoPorTipoUsuario() {
     const tipoUsuario = (
         sessionStorage.getItem("TIPO_USUARIO") || ""
     ).trim().toLowerCase();

     const perfilValido =
         tipoUsuario === "artista" ||
         tipoUsuario === "produtor";

     if (!perfilValido) {
         document.documentElement.removeAttribute("data-perfil");
         return;
     }

     // A barra lateral é controlada pelo arquivo
     // JS/sidebar-perfil.js e pelo atributo data-perfil.
     if (typeof window.aplicarPerfilSidebar === "function") {
         window.aplicarPerfilSidebar();
     } else {
         document.documentElement.setAttribute(
             "data-perfil",
             tipoUsuario
         );
     }
 }

 // ============================================================
 // LIMPEZA DOS DADOS DA SESSÃO
 // ============================================================

 function limparDadosSessao() {
     sessionStorage.removeItem("EMAIL_USUARIO");
     sessionStorage.removeItem("NOME_USUARIO");
     sessionStorage.removeItem("ID_USUARIO");
     sessionStorage.removeItem("TIPO_USUARIO");
 }

 function limparSessao() {
     limparDadosSessao();

     window.location.href = "cadastro.html";
 }

 // ============================================================
 // ATUALIZAÇÃO DOS DADOS DO PERFIL NA INTERFACE
 // ============================================================

 function atualizarDadosPerfil() {
     const nome = sessionStorage.getItem("NOME_USUARIO");
     const nomeValido = nome && nome.trim() !== "" ? nome.trim() : "";

     const tipoUsuario = (
         sessionStorage.getItem("TIPO_USUARIO") || ""
     ).trim().toLowerCase();

     const perfilValido =
         tipoUsuario === "artista" ||
         tipoUsuario === "produtor";

     // Não exibe "undefined", nem utiliza um nome fictício
     // como se fosse o nome real do usuário autenticado.
     if (!nomeValido || !perfilValido) {
         document.querySelectorAll("[data-user-name]").forEach(
             function (elemento) {
                 elemento.textContent = "";
             }
         );

         document.querySelectorAll("[data-user-initials]").forEach(
             function (elemento) {
                 elemento.textContent = "";
             }
         );

         const saudacao = document.getElementById(
             "nome-usuario-greeting"
         );

         if (saudacao) {
             saudacao.textContent = "";
         }

         document.documentElement.removeAttribute("data-perfil");
         return;
     }

     // Atualiza todos os componentes que exibem o nome.
     document.querySelectorAll("[data-user-name]").forEach(
         function (elemento) {
             elemento.textContent = nomeValido;
         }
     );

     // Calcula as iniciais do nome real.
     const iniciais = nomeValido
         .trim()
         .split(/\s+/)
         .filter(Boolean)
         .slice(0, 2)
         .map(function (parte) {
             return parte.charAt(0);
         })
         .join("")
         .toUpperCase();

     document.querySelectorAll("[data-user-initials]").forEach(
         function (elemento) {
             elemento.textContent = iniciais;
         }
     );

     // Atualiza a saudação da dashboard.
     const saudacao = document.getElementById(
         "nome-usuario-greeting"
     );

     if (saudacao) {
         saudacao.textContent = nomeValido;
     }

     controlarExibicaoPorTipoUsuario();
 }

 // ============================================================
 // INICIALIZAÇÃO
 // ============================================================

 document.addEventListener("DOMContentLoaded", function () {
     atualizarDadosPerfil();
 });
