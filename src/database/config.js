
var mysql = require("mysql2");

var mySqlConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};

function validarAmbiente() {
    if (
        process.env.AMBIENTE_PROCESSO !== "producao" &&
        process.env.AMBIENTE_PROCESSO !== "desenvolvimento"
    ) {
        throw new Error("AMBIENTE NÃO CONFIGURADO EM .env");
    }
}

async function executar(instrucao, valores = []) {
    validarAmbiente();

    const conexao = await mysql.createConnection(mySqlConfig).promise();

    try {
        const [resultados] = await conexao.execute(instrucao, valores);
        return resultados;
    } finally {
        await conexao.end();
    }
}

async function executarTransacao(callback) {
    validarAmbiente();

    const conexao = await mysql.createConnection(mySqlConfig).promise();

    try {
        await conexao.beginTransaction();

        const resultado = await callback(conexao);

        await conexao.commit();

        return resultado;
    } catch (erro) {
        await conexao.rollback();
        throw erro;
    } finally {
        await conexao.end();
    }
}

module.exports = {
    executar,
    executarTransacao
};
