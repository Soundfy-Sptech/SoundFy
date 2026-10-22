var usuarioModel = require("../models/usuarioModel")

function cadastrar(req, res) {
    let nome = req.body.nomeServer
    let email = req.body.emailServer
    let senha = req.body.senhaServer
    let telefone = req.body.telefoneServer;
    let tipo_usuario = req.body.tipoUsuarioServer;

    if (nome == undefined) {
        res.status(400).send("Seu nome não foi encontrado")
    }
    else if (email == undefined) {
        res.status(400).send("Seu email não foi encontrado")
    }
    else if (senha == undefined) {
        res.status(400).send("Sua senha não foi definida")
    }
    else {
        usuarioModel.cadastrar(nome, email, senha, telefone, tipo_usuario)
            .then(
                function (resultado) {
                    res.json(resultado)
                }
            ).catch(function (erro) {
                console.log(erro)
                console.log(
                    "\nHouve um erro ao realizar o cadastro!: Erro:",
                    erro.sqlMessage
                )
                res.status(500).json(erro.sqlMessage)
            })
    }
}

function autenticar(req, res) {
    let email = req.body.emailServer
    let senha = req.body.senhaServer
    if (email == undefined) {
        res.status(400).send("Seu email não foi encontrado")
    }
    else if (senha == undefined) {
        res.status(400).send("Sua senha não foi definida")
    }
    else {
        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`)
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`)
                    if (resultadoAutenticar.length == 1) {
                         res.json({
                            id: resultadoAutenticar[0].idUsuario,
                            email: resultadoAutenticar[0].email,
                            nome: resultadoAutenticar[0].nomeCompleto,
                            senha: resultadoAutenticar[0].senha})
                    }
                    else if(resultadoAutenticar.length == 0){
                        res.status(403).send("Email e/ou senha inválido(s)")
                    }
                    else{
                        res.status(403).send("mais de um usuário com o mesmo login e senha!")
                    }
                }
            ).catch(
                function(erro){
                    console.log(erro)
                    console.log("\nHouve um erro ao realizar o login! Erro:", erro.sqlMessage)
                    res.status(500).json(erro.sqlMessage)
                }
            )
    }

}
module.exports = {
    cadastrar,
    autenticar
}