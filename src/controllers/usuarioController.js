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
    const email = req.body.emailServer;
    const senha = req.body.senhaServer;

    if (!email) {
        return res.status(400).send("Seu email não foi encontrado");
    }

    if (!senha) {
        return res.status(400).send("Sua senha não foi definida");
    }

    usuarioModel.autenticar(email, senha)
        .then(function (resultadoAutenticar) {
            if (resultadoAutenticar.length === 0) {
                return res.status(403).send("Email e/ou senha inválido(s)");
            }

            if (resultadoAutenticar.length !== 1) {
                return res.status(403).send(
                    "Mais de um usuário com o mesmo login e senha!"
                );
            }

            const usuario = resultadoAutenticar[0];

            // Confirme se o nome desta coluna corresponde ao seu banco.
            const tipoUsuario = usuario.tipoUsuario;

            if (
                usuario.idUsuario == null ||
                !usuario.email ||
                !usuario.nome ||
                !tipoUsuario
            ) {
                console.error(
                    "Dados obrigatórios ausentes no resultado da autenticação."
                );

                return res.status(500).json({
                    mensagem: "Não foi possível recuperar os dados do perfil."
                });
            }

            const tipoNormalizado = String(tipoUsuario)
                .trim()
                .toLowerCase();

            if (!["artista", "produtor"].includes(tipoNormalizado)) {
                return res.status(500).json({
                    mensagem: "O tipo de usuário cadastrado é inválido."
                });
            }

            return res.status(200).json({
                id: usuario.idUsuario,
                email: usuario.email,
                nome: usuario.nome,
                tipoUsuario: tipoNormalizado
            });
        })
        .catch(function (erro) {
            console.error("Erro ao autenticar usuário:", erro.message);

            return res.status(500).json({
                mensagem: "Erro interno ao realizar o login."
            });
        });
}


module.exports = {
    cadastrar,
    autenticar
}