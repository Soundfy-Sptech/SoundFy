
const crypto = require("crypto");

const TEMPO_EXPIRACAO = 8 * 60 * 60;

function obterSegredo() {
    const segredo = process.env.ACCOUNT_TOKEN_SECRET;

    if (!segredo || segredo.length < 32) {
        throw new Error(
            "ACCOUNT_TOKEN_SECRET não configurado ou muito curto."
        );
    }

    return segredo;
}

function gerarAssinatura(conteudo) {
    return crypto
        .createHmac("sha256", obterSegredo())
        .update(conteudo)
        .digest("base64url");
}

function gerarToken(idUsuario) {
    const agora = Math.floor(Date.now() / 1000);

    const payload = {
        sub: String(idUsuario),
        iat: agora,
        exp: agora + TEMPO_EXPIRACAO
    };

    const conteudo = Buffer
        .from(JSON.stringify(payload))
        .toString("base64url");

    const assinatura = gerarAssinatura(conteudo);

    return `${conteudo}.${assinatura}`;
}

function autenticarToken(req, res, next) {
    const autorizacao = req.headers.authorization;

    if (!autorizacao || !autorizacao.startsWith("Bearer ")) {
        return res.status(401).json({
            mensagem: "Autenticação necessária."
        });
    }

    try {
        const token = autorizacao.substring(7);
        const partes = token.split(".");

        if (partes.length !== 2) {
            return res.status(401).json({
                mensagem: "Token inválido."
            });
        }

        const [conteudo, assinaturaRecebida] = partes;

        const assinaturaEsperada = gerarAssinatura(conteudo);

        const assinaturaBuffer = Buffer.from(assinaturaRecebida);
        const esperadaBuffer = Buffer.from(assinaturaEsperada);

        if (
            assinaturaBuffer.length !== esperadaBuffer.length ||
            !crypto.timingSafeEqual(
                assinaturaBuffer,
                esperadaBuffer
            )
        ) {
            return res.status(401).json({
                mensagem: "Token inválido."
            });
        }

        const payload = JSON.parse(
            Buffer.from(conteudo, "base64url").toString("utf8")
        );

        const agora = Math.floor(Date.now() / 1000);

        if (
            !payload.sub ||
            !/^\d+$/.test(payload.sub) ||
            !Number.isSafeInteger(payload.exp) ||
            payload.exp <= agora
        ) {
            return res.status(401).json({
                mensagem: "Token expirado ou inválido."
            });
        }

        req.usuarioId = Number(payload.sub);

        next();

    } catch (erro) {
        if (erro.message.includes("ACCOUNT_TOKEN_SECRET")) {
            console.error(erro.message);

            return res.status(500).json({
                mensagem: "Configuração de autenticação inválida."
            });
        }

        return res.status(401).json({
            mensagem: "Não foi possível autenticar a sessão."
        });
    }
}

module.exports = {
    gerarToken,
    autenticarToken
};
