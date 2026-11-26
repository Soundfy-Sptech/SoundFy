var express = require("express");
var router = express.Router();
var regiaoController = require("../controllers/regiaoController");

router.get("/", regiaoController.buscarRegioes);
router.get("/:id", regiaoController.buscarDados);

module.exports = router;