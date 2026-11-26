var dadosDashboardAtual = null;
var erroDashboard = false;

var CHAVES_REGIAO = {
    "norte": "index.north",
    "nordeste": "index.northeast",
    "centrooeste": "index.centralWest",
    "sudeste": "index.southeast",
    "sul": "index.south"
};

function traduzirDashboard(chave, padrao) {
    return typeof window.t === "function" ? window.t(chave, padrao) : padrao;
}

function localeDashboard() {
    var idioma = typeof window.currentLanguage === "function" ? window.currentLanguage() : "pt";
    return { pt: "pt-BR", en: "en-US", es: "es-ES" }[idioma] || "pt-BR";
}

function traduzirRegiao(nome) {
    var normalizado = String(nome == null ? "" : nome)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[\s-]/g, "");

    var chave = CHAVES_REGIAO[normalizado];
    return chave ? traduzirDashboard(chave, nome) : nome;
}

function escaparHTML(valor) {
    return String(valor == null ? "" : valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatarNumeroDashboard(valor) {
    var numero = Number(valor || 0);
    return numero.toLocaleString(localeDashboard(), { maximumFractionDigits: 0 });
}

function exibirMensagemDashboard(id, mensagem) {
    var elemento = document.getElementById(id);
    if (elemento) {
        elemento.innerHTML = '<p class="mensagem-dashboard">' + escaparHTML(mensagem) + '</p>';
    }
}

function exibirErroDashboard() {
    ["grafico-generos-regiao", "ranking-generos", "ranking-artistas-regiao"].forEach(function (id) {
        exibirMensagemDashboard(id, traduzirDashboard("index.dashboardLoadError", "Não foi possível carregar os dados. Verifique a conexão com o servidor e o banco de dados."));
    });
}

function aplicarTextosIniciaisDashboard() {
    if (dadosDashboardAtual) return;

    var genero = document.getElementById("insight-genero");
    var descricao = document.getElementById("insight-descricao");

    if (genero) genero.textContent = traduzirDashboard("index.waitingData", "Aguardando dados");
    if (descricao) descricao.textContent = traduzirDashboard("index.insightPlaceholder", "O gênero com maior volume de streams será exibido aqui após o carregamento dos dados.");
}

function renderizarGenerosPorRegiao(registros) {
    var elemento = document.getElementById("grafico-generos-regiao");
    if (!elemento) return;

    if (!registros.length) {
        exibirMensagemDashboard("grafico-generos-regiao", traduzirDashboard("index.noGenreData", "Ainda não existem registros de consumo por gênero."));
        return;
    }

    var textoStreams = traduzirDashboard("index.streamsUnit", "streams");

    var porRegiao = {};
    registros.forEach(function (registro) {
        if (!porRegiao[registro.regiao]) porRegiao[registro.regiao] = [];
        porRegiao[registro.regiao].push(registro);
    });

    elemento.innerHTML = Object.keys(porRegiao).map(function (regiao) {
        var generos = porRegiao[regiao].slice(0, 3);
        var maiorValor = Number(generos[0].totalStreams) || 1;

        return '<div class="item-regiao">' +
            '<div class="regiao-info"><span>' + escaparHTML(traduzirRegiao(regiao)) + '</span>' +
            '<strong>' + escaparHTML(generos[0].genero) + ' · ' + formatarNumeroDashboard(generos[0].totalStreams) + ' ' + escaparHTML(textoStreams) + '</strong></div>' +
            '<div class="barra-fundo"><div class="barra-progresso" style="width:' + Math.max(2, (Number(generos[0].totalStreams) / maiorValor) * 100) + '%"></div></div>' +
            '<small class="texto-secundario">' + generos.map(function (genero) {
                return escaparHTML(genero.genero) + ': ' + formatarNumeroDashboard(genero.totalStreams);
            }).join(' · ') + '</small>' +
            '</div>';
    }).join("");
}

function renderizarRankingGeneros(registros) {
    var elemento = document.getElementById("ranking-generos");
    if (!elemento) return;

    if (!registros.length) {
        exibirMensagemDashboard("ranking-generos", traduzirDashboard("index.noRankingData", "Ainda não existem dados para montar o ranking de gêneros."));
        return;
    }

    var textoStreams = traduzirDashboard("index.streamsUnit", "streams");
    var textoRegistros = traduzirDashboard("index.consumptionRecords", "registros de consumo");

    elemento.innerHTML = registros.map(function (registro, indice) {
        return '<div class="item-rank">' +
            '<span class="posicao">' + String(indice + 1).padStart(2, "0") + '</span>' +
            '<div class="info"><strong>' + escaparHTML(registro.genero) + '</strong>' +
            '<small>' + formatarNumeroDashboard(registro.quantidadeRegistros) + ' ' + escaparHTML(textoRegistros) + '</small></div>' +
            '<span class="variacao positivo">' + formatarNumeroDashboard(registro.totalStreams) + ' ' + escaparHTML(textoStreams) + '</span>' +
            '</div>';
    }).join("");
}

function renderizarArtistasPorRegiao(registros) {
    var elemento = document.getElementById("ranking-artistas-regiao");
    if (!elemento) return;

    if (!registros.length) {
        exibirMensagemDashboard("ranking-artistas-regiao", traduzirDashboard("index.noArtistData", "Ainda não existem dados de consumo por artista."));
        return;
    }

    var textoStreams = traduzirDashboard("index.streamsUnit", "streams");

    var maiorValor = Math.max.apply(null, registros.map(function (registro) {
        return Number(registro.totalStreams) || 0;
    })) || 1;

    elemento.innerHTML = registros.map(function (registro) {
        var largura = (Number(registro.totalStreams) / maiorValor) * 100;
        return '<div class="item-regiao">' +
            '<div class="regiao-info"><span>' + escaparHTML(traduzirRegiao(registro.regiao)) + '</span>' +
            '<strong>' + escaparHTML(registro.artista) + ' · ' + formatarNumeroDashboard(registro.totalStreams) + ' ' + escaparHTML(textoStreams) + '</strong></div>' +
            '<div class="barra-fundo"><div class="barra-progresso" style="width:' + Math.max(2, largura) + '%"></div></div>' +
            '</div>';
    }).join("");
}

function atualizarDashboard(dados) {
    dadosDashboardAtual = dados;
    erroDashboard = false;
    var indicadores = dados.indicadores || {};

    document.getElementById("kpi-total-streams").textContent = formatarNumeroDashboard(indicadores.totalStreams);
    document.getElementById("kpi-total-generos").textContent = formatarNumeroDashboard(indicadores.totalGeneros);
    document.getElementById("kpi-total-regioes").textContent = formatarNumeroDashboard(indicadores.totalRegioes);
    document.getElementById("kpi-total-artistas").textContent = formatarNumeroDashboard(indicadores.totalArtistas);

    document.getElementById("insight-qtd-generos").textContent = formatarNumeroDashboard(indicadores.totalGeneros);
    document.getElementById("insight-qtd-regioes").textContent = formatarNumeroDashboard(indicadores.totalRegioes);

    if (dados.generoLider) {
        document.getElementById("insight-genero").textContent = dados.generoLider.genero;
        document.getElementById("insight-streams").textContent = formatarNumeroDashboard(dados.generoLider.totalStreams);
        document.getElementById("insight-descricao").textContent = traduzirDashboard("index.topGenreDescription", "É o gênero com maior volume de streams entre os registros disponíveis no banco de dados.");
    } else {
        document.getElementById("insight-genero").textContent = traduzirDashboard("index.noConsumptionData", "Sem dados de consumo");
        document.getElementById("insight-streams").textContent = "0";
        document.getElementById("insight-descricao").textContent = traduzirDashboard("index.noGenreLeader", "Assim que forem cadastrados registros de consumo musical, o gênero líder será identificado aqui.");
    }

    renderizarGenerosPorRegiao(dados.consumoPorRegiao || []);
    renderizarRankingGeneros(dados.rankingGeneros || []);
    renderizarArtistasPorRegiao(dados.artistasLideresPorRegiao || []);
}

window.addEventListener("DOMContentLoaded", function () {
    // Sempre que o idioma terminar de carregar (ou for trocado), redesenha os textos dinâmicos.
    if (typeof window.onLanguageReady === "function") {
        window.onLanguageReady(function () {
            if (dadosDashboardAtual) {
                atualizarDashboard(dadosDashboardAtual);
            } else if (erroDashboard) {
                exibirErroDashboard();
            } else {
                aplicarTextosIniciaisDashboard();
            }
        });
    } else {
        aplicarTextosIniciaisDashboard();
    }

    fetch("/dashboard")
        .then(function (resposta) {
            if (!resposta.ok) throw new Error("Falha ao consultar os dados do painel.");
            return resposta.json();
        })
        .then(atualizarDashboard)
        .catch(function (erro) {
            console.error("Erro ao carregar a dashboard:", erro);
            erroDashboard = true;
            exibirErroDashboard();
        });
});
