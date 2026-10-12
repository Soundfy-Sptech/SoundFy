let database = require("../database/config")

function cadastrar(nome, email, senha, telefone) {
    let telefoneSql = (telefone != undefined && telefone != '') ? `'${telefone}'` : 'NULL'

    let instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, telefone) VALUES
        ('${nome}', '${email}', '${senha}', ${telefoneSql})
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executar(instrucaoSql)
}

function autenticar(email, senha) {
    let instrucaoSql = `
        SELECT * FROM usuario WHERE email = '${email}' AND senha = '${senha}'
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executar(instrucaoSql)
}

module.exports = {
    cadastrar,
    autenticar
}