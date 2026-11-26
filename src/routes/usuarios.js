
const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuarioController");
const { autenticarToken } = require("../middleware/autenticacao");

// Rotas públicas
router.post("/cadastrar", usuarioController.cadastrar);
router.post("/autenticar", usuarioController.autenticar);

// Rotas privadas: somente o usuário autenticado
router.get(
    "/minha-conta",
    autenticarToken,
    usuarioController.buscarMinhaConta
);

router.put(
    "/minha-conta",
    autenticarToken,
    usuarioController.atualizarMinhaConta
);

router.patch(
    "/minha-conta/senha",
    autenticarToken,
    usuarioController.alterarMinhaSenha
);

router.delete(
    "/minha-conta",
    autenticarToken,
    usuarioController.excluirMinhaConta
);

module.exports = router;
