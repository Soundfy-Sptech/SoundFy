var express = require("express");
var router = express.Router();

var relatorioController = require("../controllers/relatorioController");
var { autenticarToken } = require("../middleware/autenticacao");
var { autorizarPerfis } = require("../middleware/autorizacao");

router.use(
    autenticarToken,
    autorizarPerfis("Produtor Musical", "Produtor Eventos", "Administrador")
);

router.get("/indicadores", relatorioController.buscarIndicadores);
router.get("/regioes", relatorioController.buscarRegioes);
router.get("/", relatorioController.buscarDados);

module.exports = router;
