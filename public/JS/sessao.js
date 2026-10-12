// ============================================================
// ARQUIVO COMENTADO: public/js/sessao.js
// Comentários adicionados para explicar a função de cada parte do código.
// ============================================================
// sessão
// Cria uma função. Essa função agrupa comandos para serem executados quando for chamada.
function validarSessao() {
// Define ou altera um valor usado pelo programa.
    var email = sessionStorage.EMAIL_USUARIO;
// Define ou altera um valor usado pelo programa.
    var nome = sessionStorage.NOME_USUARIO;

// Define ou altera um valor usado pelo programa.
    var b_usuario = document.getElementById("b_usuario");

// Inicia uma condição. O código dentro do bloco só executa se a condição for verdadeira.
    if (email != null && nome != null) {
// Define ou altera um valor usado pelo programa.
        b_usuario.innerHTML = nome;
// Executa este bloco quando as condições anteriores não foram atendidas.
    } else {
// Define ou altera um valor usado pelo programa.
        window.location = "../login.html";
// Fecha o bloco de código iniciado anteriormente.
    }
// Fecha o bloco de código iniciado anteriormente.
}

// Cria uma função. Essa função agrupa comandos para serem executados quando for chamada.
function limparSessao() {
// Usa o sessionStorage, que guarda dados temporários enquanto a aba/navegador está aberto.
    sessionStorage.clear();
// Define ou altera um valor usado pelo programa.
    window.location = "../login.html";
// Fecha o bloco de código iniciado anteriormente.
}

// carregamento (loading)
// Cria uma função. Essa função agrupa comandos para serem executados quando for chamada.
function aguardar() {
// Define ou altera um valor usado pelo programa.
    var divAguardar = document.getElementById("div_aguardar");
// Define ou altera um valor usado pelo programa.
    divAguardar.style.display = "flex";
// Fecha o bloco de código iniciado anteriormente.
}

// Cria uma função. Essa função agrupa comandos para serem executados quando for chamada.
function finalizarAguardar(texto) {
// Define ou altera um valor usado pelo programa.
    var divAguardar = document.getElementById("div_aguardar");
// Define ou altera um valor usado pelo programa.
    divAguardar.style.display = "none";

// Define ou altera um valor usado pelo programa.
    var divErrosLogin = document.getElementById("div_erros_login");
// Inicia uma condição. O código dentro do bloco só executa se a condição for verdadeira.
    if (texto) {
// Define ou altera um valor usado pelo programa.
        divErrosLogin.style.display = "flex";
// Define ou altera um valor usado pelo programa.
        divErrosLogin.innerHTML = texto;
// Fecha o bloco de código iniciado anteriormente.
    }
// Fecha o bloco de código iniciado anteriormente.
}

