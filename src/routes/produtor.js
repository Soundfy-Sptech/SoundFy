var express = require("express");
var router = express.Router();
var produtorController = require("../controllers/produtorController");

router.get("/", produtorController.buscarDados);
router.get("/comparar", produtorController.compararArtistas);

module.exports = router;