var express = require("express");
var router = express.Router();
var regiaoController = require("../controllers/regiaoController");
var { autenticarToken } = require("../middleware/autenticacao");
var { autorizarPerfis } = require("../middleware/autorizacao");

// A análise regional é exclusiva do Produtor de Eventos e do Administrador.
router.use(
    autenticarToken,
    autorizarPerfis("Produtor Eventos", "Administrador")
);

router.get("/", regiaoController.buscarRegioes);
router.get("/:id", regiaoController.buscarDados);

module.exports = router;
