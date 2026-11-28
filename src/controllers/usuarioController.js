
const usuarioModel = require("../models/usuarioModel");
const bcrypt = require("bcrypt");
const { gerarToken } = require("../middleware/autenticacao");

const RODADAS_BCRYPT = 12;

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Substitua a função normalizarTipoUsuario atual por esta:
function resolverTipoUsuario(tipo) {
    const valor = String(tipo || "").trim().toLocaleLowerCase("pt-BR");

    if (["1", "artista", "produtor musical", "produtor_musical"].includes(valor)) {
        return { id: 1, nome: "Produtor Musical" };
    }
    if (["2", "produtor", "produtor de eventos", "produtor eventos", "produtor_de_eventos"].includes(valor)) {
        return { id: 2, nome: "Produtor Eventos" };
    }
    if (["3", "administrador", "admin"].includes(valor)) {
        return { id: 3, nome: "Administrador" };
    }

    return null;
}

async function verificarSenha(senhaInformada, senhaArmazenada) {
    if (
        typeof senhaArmazenada === "string" &&
        senhaArmazenada.startsWith("$2")
    ) {
        return bcrypt.compare(senhaInformada, senhaArmazenada);
    }

    return senhaInformada === senhaArmazenada;
}

// CADASTRO
// DENTRO DE cadastrar(req, res):
async function cadastrar(req, res) {
    try {
        const nome = req.body.nomeServer?.trim();
        const email = req.body.emailServer?.trim().toLowerCase();
        const senha = req.body.senhaServer;
        // Remove caracteres não numéricos se quiser evitar estourar VARCHAR(12)
        const telefone = req.body.telefoneServer?.trim() || null;
        const tipoResolvido = resolverTipoUsuario(req.body.tipoUsuarioServer);

        if (!nome || !email || !senha || !tipoResolvido) {
            return res.status(400).json({
                mensagem: "Preencha todos os campos obrigatórios."
            });
        }

        if (nome.length > 50 || !validarEmail(email) || email.length > 50) {
            return res.status(400).json({
                mensagem: "Nome ou e-mail inválido."
            });
        }

        if (typeof senha !== "string" || senha.length < 8 || senha.length > 72) {
            return res.status(400).json({
                mensagem: "A senha deve possuir entre 8 e 72 caracteres."
            });
        }

        if (telefone && telefone.length > 12) {
            return res.status(400).json({
                mensagem: "Telefone inválido (máximo 12 caracteres)."
            });
        }

        const senhaHash = await bcrypt.hash(senha, RODADAS_BCRYPT);

        const resultado = await usuarioModel.cadastrar(
            nome,
            email,
            senhaHash,
            telefone,
            tipoResolvido.id
        );

        const token = gerarToken(resultado.insertId);

        return res.status(201).json({
            id: resultado.insertId,
            nome,
            email,
            fkTipoUsuario: tipoResolvido.id,
            tipoUsuario: tipoResolvido.nome,
            token
        });

    } catch (erro) {
        console.error("Erro no cadastro:", erro);

        if (erro.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                mensagem: "Este e-mail já está cadastrado."
            });
        }

        if (erro.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(400).json({
                mensagem: "Tipo de usuário inválido no banco de dados."
            });
        }

        return res.status(500).json({
            mensagem: "Erro interno ao cadastrar usuário."
        });
    }
}

// LOGIN
async function autenticar(req, res) {
    try {
        const email = req.body.emailServer?.trim().toLowerCase();
        const senha = req.body.senhaServer;

        if (!email || !senha) {
            return res.status(400).json({
                mensagem: "Informe e-mail e senha."
            });
        }

        const usuarios = await usuarioModel.autenticar(email);

        if (usuarios.length !== 1) {
            return res.status(401).json({
                mensagem: "E-mail ou senha inválidos."
            });
        }

        const usuario = usuarios[0];

        const senhaValida = await verificarSenha(
            senha,
            usuario.senha
        );

        if (!senhaValida) {
            return res.status(401).json({
                mensagem: "E-mail ou senha inválidos."
            });
        }

        // Migra senhas antigas para bcrypt após login válido.
        if (!usuario.senha.startsWith("$2")) {
            const senhaHash = await bcrypt.hash(
                senha,
                RODADAS_BCRYPT
            );

            await usuarioModel.atualizarSenha(
                usuario.idUsuario,
                senhaHash
            );
        }

        const token = gerarToken(usuario.idUsuario);

        return res.status(200).json({
            id: usuario.idUsuario,
            nome: usuario.nome,
            email: usuario.email,
            telefone: usuario.telefone,
            fkTipoUsuario: usuario.fkTipoUsuario,
            tipoUsuario: usuario.tipoUsuario,
            token
        });

    } catch (erro) {
        console.error("Erro no login:", erro);

        return res.status(500).json({
            mensagem: "Erro interno ao realizar login."
        });
    }
}

// CONSULTAR A PRÓPRIA CONTA
async function buscarMinhaConta(req, res) {
    try {
        const usuarios = await usuarioModel.buscarPorId(
            req.usuarioId
        );

        if (usuarios.length === 0) {
            return res.status(404).json({
                mensagem: "Conta não encontrada."
            });
        }

        return res.status(200).json(usuarios[0]);

    } catch (erro) {
        console.error("Erro ao consultar conta:", erro);

        return res.status(500).json({
            mensagem: "Erro ao consultar conta."
        });
    }
}

// ATUALIZAR DADOS PESSOAIS
async function atualizarMinhaConta(req, res) {
    try {
        const nome = req.body.nome?.trim();
        const email = req.body.email?.trim().toLowerCase();
        const telefone = req.body.telefone?.trim() || null;

        if (!nome || !email) {
            return res.status(400).json({
                mensagem: "Nome e e-mail são obrigatórios."
            });
        }

        if (nome.length > 50 || email.length > 50 || !validarEmail(email)) {
            return res.status(400).json({
                mensagem: "Nome ou e-mail inválido."
            });
        }

        if (telefone && telefone.length > 12) {
            return res.status(400).json({
                mensagem: "Telefone inválido."
            });
        }

        await usuarioModel.atualizarDados(
            req.usuarioId,
            nome,
            email,
            telefone
        );

        return res.status(200).json({
            mensagem: "Dados atualizados com sucesso."
        });

    } catch (erro) {
        console.error("Erro ao atualizar conta:", erro);

        if (erro.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                mensagem: "Este e-mail já está sendo utilizado."
            });
        }

        return res.status(500).json({
            mensagem: "Erro ao atualizar dados da conta."
        });
    }
}

// ALTERAR SENHA
async function alterarMinhaSenha(req, res) {
    try {
        const senhaAtual = req.body.senhaAtual;
        const novaSenha = req.body.novaSenha;

        if (!senhaAtual || !novaSenha) {
            return res.status(400).json({
                mensagem: "Informe a senha atual e a nova senha."
            });
        }

        if (
            typeof novaSenha !== "string" ||
            novaSenha.length < 8 ||
            novaSenha.length > 72
        ) {
            return res.status(400).json({
                mensagem: "A nova senha deve possuir entre 8 e 72 caracteres."
            });
        }

        const credenciais = await usuarioModel.buscarCredenciaisPorId(
            req.usuarioId
        );

        if (credenciais.length !== 1) {
            return res.status(404).json({
                mensagem: "Conta não encontrada."
            });
        }

        const senhaValida = await verificarSenha(
            senhaAtual,
            credenciais[0].senha
        );

        if (!senhaValida) {
            return res.status(401).json({
                mensagem: "A senha atual está incorreta."
            });
        }

        const senhaHash = await bcrypt.hash(
            novaSenha,
            RODADAS_BCRYPT
        );

        await usuarioModel.atualizarSenha(
            req.usuarioId,
            senhaHash
        );

        return res.status(200).json({
            mensagem: "Senha alterada com sucesso."
        });

    } catch (erro) {
        console.error("Erro ao alterar senha:", erro);

        return res.status(500).json({
            mensagem: "Erro ao alterar senha."
        });
    }
}

// EXCLUIR A PRÓPRIA CONTA
async function excluirMinhaConta(req, res) {
    try {
        const senha = req.body.senha;

        if (!senha) {
            return res.status(400).json({
                mensagem: "Informe sua senha para confirmar a exclusão."
            });
        }

        const credenciais = await usuarioModel.buscarCredenciaisPorId(
            req.usuarioId
        );

        if (credenciais.length !== 1) {
            return res.status(404).json({
                mensagem: "Conta não encontrada."
            });
        }

        const senhaValida = await verificarSenha(
            senha,
            credenciais[0].senha
        );

        if (!senhaValida) {
            return res.status(401).json({
                mensagem: "Senha incorreta. A conta não foi excluída."
            });
        }

        await usuarioModel.excluirConta(req.usuarioId);

        return res.status(200).json({
            mensagem: "Conta excluída com sucesso."
        });

    } catch (erro) {
        console.error("Erro ao excluir conta:", erro);

        return res.status(500).json({
            mensagem: "Não foi possível excluir a conta."
        });
    }
}

module.exports = {
    cadastrar,
    autenticar,
    buscarMinhaConta,
    atualizarMinhaConta,
    alterarMinhaSenha,
    excluirMinhaConta
};
