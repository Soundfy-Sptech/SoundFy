var express = require("express");
var router = express.Router();
var artistaController = require("../controllers/artistaController");

router.get("/", artistaController.buscarTodos);
router.get("/:id", artistaController.buscarDados);

module.exports = router;