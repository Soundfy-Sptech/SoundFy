
const database = require("../database/config");

function cadastrar(nome, email, senha, telefone, tipoUsuario) {
    const instrucaoSql = `
        INSERT INTO usuario
        (nome, email, senha, telefone, tipo_usuario)
        VALUES (?, ?, ?, ?, ?)
    `;

    return database.executar(instrucaoSql, [
        nome,
        email,
        senha,
        telefone || null,
        tipoUsuario
    ]);
}

function autenticar(email) {
    const instrucaoSql = `
        SELECT idUsuario, nome, email, senha, telefone, tipo_usuario
        FROM usuario
        WHERE email = ?
    `;

    return database.executar(instrucaoSql, [email]);
}

function buscarPorId(idUsuario) {
    const instrucaoSql = `
        SELECT idUsuario, nome, email, telefone, tipo_usuario
        FROM usuario
        WHERE idUsuario = ?
    `;

    return database.executar(instrucaoSql, [idUsuario]);
}

function atualizarDados(idUsuario, nome, email, telefone) {
    const instrucaoSql = `
        UPDATE usuario
        SET nome = ?, email = ?, telefone = ?
        WHERE idUsuario = ?
    `;

    return database.executar(instrucaoSql, [
        nome,
        email,
        telefone || null,
        idUsuario
    ]);
}

function atualizarSenha(idUsuario, senha) {
    const instrucaoSql = `
        UPDATE usuario
        SET senha = ?
        WHERE idUsuario = ?
    `;

    return database.executar(instrucaoSql, [senha, idUsuario]);
}

async function excluirConta(idUsuario) {
    return database.executarTransacao(async (conexao) => {
        await conexao.execute(
            "DELETE FROM notificacao WHERE idUsuario = ?",
            [idUsuario]
        );

        const [resultado] = await conexao.execute(
            "DELETE FROM usuario WHERE idUsuario = ?",
            [idUsuario]
        );

        if (resultado.affectedRows !== 1) {
            throw new Error("Não foi possível excluir a conta.");
        }

        return resultado;
    });
}

function buscarCredenciaisPorId(idUsuario) {
    const instrucaoSql = `
        SELECT idUsuario, senha
        FROM usuario
        WHERE idUsuario = ?
    `;

    return database.executar(instrucaoSql, [idUsuario]);
}

module.exports = {
    cadastrar,
    autenticar,
    buscarPorId,
    atualizarDados,
    atualizarSenha,
    excluirConta,
    buscarCredenciaisPorId
};
