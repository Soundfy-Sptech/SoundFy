const database = require("../database/config");

function cadastrar(nome, email, senha, telefone, fkTipoUsuario) {
    const instrucaoSql = `
        INSERT INTO Usuario
        (nome, email, senha, telefone, fkTipoUsuario)
        VALUES (?, ?, ?, ?, ?)
    `;

    return database.executar(instrucaoSql, [
        nome,
        email,
        senha,
        telefone || null,
        fkTipoUsuario
    ]);
}

function autenticar(email) {
    const instrucaoSql = `
        SELECT 
            u.idUsuario, 
            u.nome, 
            u.email, 
            u.senha, 
            u.telefone, 
            u.fkTipoUsuario,
            t.tipoUsuario
        FROM Usuario u
        LEFT JOIN tipoUsuario t ON u.fkTipoUsuario = t.idTipoUsuario
        WHERE u.email = ?
    `;

    return database.executar(instrucaoSql, [email]);
}

function buscarPorId(idUsuario) {
    const instrucaoSql = `
        SELECT 
            u.idUsuario, 
            u.nome, 
            u.email, 
            u.telefone, 
            u.fkTipoUsuario,
            t.tipoUsuario
        FROM Usuario u
        LEFT JOIN tipoUsuario t ON u.fkTipoUsuario = t.idTipoUsuario
        WHERE u.idUsuario = ?
    `;

    return database.executar(instrucaoSql, [idUsuario]);
}

function atualizarDados(idUsuario, nome, email, telefone) {
    const instrucaoSql = `
        UPDATE Usuario
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
        UPDATE Usuario
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
            "DELETE FROM Usuario WHERE idUsuario = ?",
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
        FROM Usuario
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