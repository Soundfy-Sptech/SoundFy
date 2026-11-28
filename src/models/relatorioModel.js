var database = require("../database/config");

function buscarIndicadores() {
    return database.executar(`
        SELECT
            (SELECT COALESCE(SUM(qtd_streams), 0) FROM ConsumoGenero) AS pontuacaoTotal,
            (SELECT COUNT(*) FROM ConsumoGenero) +
            (SELECT COUNT(*) FROM ConsumoArtista) AS registrosAnalisados,
            (SELECT COUNT(*) FROM Cidade) AS cidadesCobertas,
            (SELECT COALESCE(SUM(qtd_musicas), 0) FROM ConsumoGenero) AS musicasMapeadas
    `);
}

function buscarRegioes() {
    return database.executar(`
        SELECT idRegiao, nome
        FROM Regiao
        ORDER BY nome
    `);
}

function buscarArtistas(regiao) {
    var filtro = regiao ? "WHERE r.nome = ?" : "";
    return database.executar(`
        SELECT
            a.nome AS artista,
            r.nome AS regiao,
            SUM(ca.qtd_streams) AS pontuacao,
            MIN(ca.ranking) AS melhorRanking,
            SUM(ca.aparicoes) AS aparicoes,
            SUM(ca.qtd_musicas) AS faixas,
            SUM(ca.qtd_cidades) AS cidades
        FROM ConsumoArtista ca
        INNER JOIN Artista a ON a.idArtista = ca.idArtista
        INNER JOIN Regiao r ON r.idRegiao = ca.idRegiao
        ${filtro}
        GROUP BY a.idArtista, a.nome, r.idRegiao, r.nome
        ORDER BY pontuacao DESC, a.nome
    `, regiao ? [regiao] : []);
}

function buscarGeneros(regiao) {
    var filtro = regiao ? "WHERE r.nome = ?" : "";
    return database.executar(`
        SELECT
            g.nome AS genero,
            r.nome AS regiao,
            SUM(cg.qtd_streams) AS pontuacao,
            MIN(cg.ranking) AS melhorRanking,
            SUM(cg.aparicoes) AS aparicoes,
            SUM(cg.qtd_musicas) AS faixas,
            SUM(cg.qtd_cidades) AS cidades,
            COALESCE(ga.artistas, 0) AS artistas
        FROM ConsumoGenero cg
        INNER JOIN Genero g ON g.idGenero = cg.idGenero
        INNER JOIN Regiao r ON r.idRegiao = cg.idRegiao
        LEFT JOIN (
            SELECT idGenero, COUNT(DISTINCT idArtista) AS artistas
            FROM \`Genero dos artistas\`
            GROUP BY idGenero
        ) ga ON ga.idGenero = g.idGenero
        ${filtro}
        GROUP BY g.idGenero, g.nome, r.idRegiao, r.nome, ga.artistas
        ORDER BY pontuacao DESC, g.nome
    `, regiao ? [regiao] : []);
}

function buscarCidades(regiao) {
    var filtro = regiao ? "WHERE r.nome = ?" : "";
    return database.executar(`
        SELECT
            c.nome AS cidade,
            r.nome AS regiao,
            c.semanas,
            c.registros,
            c.pontuacao
        FROM Cidade c
        INNER JOIN Regiao r ON r.idRegiao = c.idRegiao
        ${filtro}
        ORDER BY c.pontuacao DESC, c.nome
    `, regiao ? [regiao] : []);
}

function buscarResumoRegioes(regiao) {
    var filtroCidade = regiao ? "WHERE r.nome = ?" : "";
    var filtroConsumo = regiao ? "WHERE r.nome = ?" : "";
    return database.executar(`
        SELECT
            r.nome AS regiao,
            COALESCE(c.cidades, 0) AS cidades,
            COALESCE(a.artistas, 0) AS artistas,
            COALESCE(g.generos, 0) AS generos,
            COALESCE(g.faixas, 0) AS faixas,
            COALESCE(g.registros, 0) AS registros,
            COALESCE(g.pontuacao, 0) AS pontuacao
        FROM Regiao r
        LEFT JOIN (
            SELECT c.idRegiao, COUNT(*) AS cidades
            FROM Cidade c
            INNER JOIN Regiao r ON r.idRegiao = c.idRegiao
            ${filtroCidade}
            GROUP BY c.idRegiao
        ) c ON c.idRegiao = r.idRegiao
        LEFT JOIN (
            SELECT ca.idRegiao, COUNT(DISTINCT ca.idArtista) AS artistas
            FROM ConsumoArtista ca
            INNER JOIN Regiao r ON r.idRegiao = ca.idRegiao
            ${filtroConsumo}
            GROUP BY ca.idRegiao
        ) a ON a.idRegiao = r.idRegiao
        LEFT JOIN (
            SELECT cg.idRegiao,
                   COUNT(DISTINCT cg.idGenero) AS generos,
                   SUM(cg.qtd_musicas) AS faixas,
                   COUNT(*) AS registros,
                   SUM(cg.qtd_streams) AS pontuacao
            FROM ConsumoGenero cg
            INNER JOIN Regiao r ON r.idRegiao = cg.idRegiao
            ${filtroConsumo}
            GROUP BY cg.idRegiao
        ) g ON g.idRegiao = r.idRegiao
        ${regiao ? "WHERE r.nome = ?" : ""}
        ORDER BY pontuacao DESC, r.nome
    `, regiao ? [regiao, regiao, regiao, regiao] : []);
}

module.exports = {
    buscarIndicadores,
    buscarRegioes,
    buscarArtistas,
    buscarGeneros,
    buscarCidades,
    buscarResumoRegioes
};
