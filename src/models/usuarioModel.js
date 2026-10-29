let database = require("../database/config")

function cadastrar(nome, email, senha, telefone, tipoUsuario) {
    let telefoneSql = (telefone != undefined && telefone != '') ? `'${telefone}'` : 'NULL'

    let instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, telefone, tipo_usuario ) VALUES
        ('${nome}', '${email}', '${senha}', ${telefoneSql}, '${tipoUsuario}')
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executar(instrucaoSql)
}

function autenticar(email, senha) {
    let instrucaoSql = `
        SELECT  
            idUsuario,
            email,
            nome,
            tipo_usuario AS tipoUsuario 
            FROM usuario WHERE email = '${email}' AND senha = '${senha}'
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executar(instrucaoSql)
}

module.exports = {
    cadastrar,
    autenticar
}