const usuarioModel = require("../models/usuarioModel");

function normalizarTipo(tipo) {
    return String(tipo || "").trim().toLocaleLowerCase("pt-BR");
}

function autorizarPerfis(...perfisPermitidos) {
    const permitidos = perfisPermitidos.map(normalizarTipo);

    return async function (req, res, next) {
        try {
            const usuarios = await usuarioModel.buscarPorId(req.usuarioId);
            const usuario = Array.isArray(usuarios) ? usuarios[0] : null;

            if (!usuario) {
                return res.status(401).json({ mensagem: "Usuário não encontrado." });
            }

            const tipoUsuario = normalizarTipo(usuario.tipoUsuario);
            if (!permitidos.includes(tipoUsuario)) {
                return res.status(403).json({
                    mensagem: "Seu perfil não tem permissão para acessar esta análise."
                });
            }

            req.usuario = usuario;
            next();
        } catch (erro) {
            console.error("Erro ao validar permissão do usuário:", erro);
            res.status(500).json({ mensagem: "Não foi possível validar suas permissões." });
        }
    };
}

module.exports = { autorizarPerfis };
