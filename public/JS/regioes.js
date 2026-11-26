document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    var seletor = document.getElementById("regiao-select");
    var botaoBuscar = document.getElementById("botaoBuscarRegiao");
    var mensagem = document.getElementById("mensagemRegiao");
    var resultado = document.getElementById("resultadoRegiao");
    var estadoGrafico = document.getElementById("estado-grafico");
    var paginaAtual = { generos: 1, artistas: 1 };
    var dadosAtuais = { generos: [], artistas: [] };
    var graficoGeneros = null;
    var requisicaoAtual = 0;
    var ITENS_POR_PAGINA = 10;
    var MAX_GENEROS_GRAFICO = 10;

    var elementos = {
        streams: document.getElementById("total-streams"),
        registros: document.getElementById("total-registros"),
        artistas: document.getElementById("total-artistas"),
        generos: document.getElementById("total-generos"),
        media: document.getElementById("media-streams"),
        tabelaGeneros: document.getElementById("tabela-generos"),
        tabelaArtistas: document.getElementById("tabela-artistas"),
        paginacaoGeneros: document.getElementById("paginacao-generos"),
        paginacaoArtistas: document.getElementById("paginacao-artistas")
    };

    function traducao(chave, fallback) {
        var valor = typeof window.t === "function" ? window.t(chave) : chave;
        return valor && valor !== chave ? valor : fallback;
    }

    function localeAtual() {
        var idioma = window.currentLanguage ? window.currentLanguage() : "pt";
        return { pt: "pt-BR", en: "en-US", es: "es-ES" }[idioma] || "pt-BR";
    }

    function formatar(valor) {
        return Number(valor || 0).toLocaleString(localeAtual());
    }

    function mostrarMensagem(texto, erro) {
        mensagem.textContent = texto;
        mensagem.hidden = !texto;
        mensagem.classList.toggle("mensagem-regiao-erro", Boolean(erro));
    }

    function estadoTabela(elemento, texto, colspan) {
        elemento.replaceChildren();
        var linha = document.createElement("tr");
        var celula = document.createElement("td");
        celula.colSpan = colspan || 4;
        celula.className = "celula-estado";
        celula.textContent = texto;
        linha.appendChild(celula);
        elemento.appendChild(linha);
    }

    function criarCelula(linha, valor, classe) {
        var celula = document.createElement("td");
        celula.textContent = valor === null || valor === undefined || valor === "" ? "—" : valor;
        if (classe) celula.className = classe;
        linha.appendChild(celula);
    }

    function renderizarTabela(tipo) {
        var ehGenero = tipo === "generos";
        var registros = dadosAtuais[tipo] || [];
        var tbody = ehGenero ? elementos.tabelaGeneros : elementos.tabelaArtistas;
        var paginacao = ehGenero ? elementos.paginacaoGeneros : elementos.paginacaoArtistas;
        var pagina = paginaAtual[tipo];
        var totalPaginas = Math.max(1, Math.ceil(registros.length / ITENS_POR_PAGINA));
        paginaAtual[tipo] = Math.min(pagina, totalPaginas);

        if (!registros.length) {
            estadoTabela(tbody, traducao("regionsDynamic.noData", "Não há dados cadastrados para esta região."), 4);
            paginacao.replaceChildren();
            return;
        }

        var inicio = (paginaAtual[tipo] - 1) * ITENS_POR_PAGINA;
        var visiveis = registros.slice(inicio, inicio + ITENS_POR_PAGINA);
        tbody.replaceChildren();

        visiveis.forEach(function (registro, indice) {
            var linha = document.createElement("tr");
            criarCelula(linha, inicio + indice + 1, "coluna-posicao");
            criarCelula(linha, ehGenero ? registro.genero : registro.artista, "coluna-nome");
            criarCelula(linha, formatar(registro.totalStreams), "coluna-numero");
            criarCelula(linha, registro.melhorRanking ?? "—", "coluna-numero");
            tbody.appendChild(linha);
        });

        renderizarPaginacao(paginacao, tipo, registros.length, totalPaginas);
    }

    function renderizarPaginacao(container, tipo, total, totalPaginas) {
        container.replaceChildren();
        if (totalPaginas <= 1) return;

        var inicio = (paginaAtual[tipo] - 1) * ITENS_POR_PAGINA + 1;
        var fim = Math.min(paginaAtual[tipo] * ITENS_POR_PAGINA, total);
        var resumo = document.createElement("span");
        resumo.className = "paginacao-resumo";
        resumo.textContent = formatar(inicio) + "–" + formatar(fim) + " " +
            traducao("regionsDynamic.of", "de") + " " + formatar(total);
        container.appendChild(resumo);

        var controles = document.createElement("div");
        controles.className = "paginacao-controles";

        function botao(texto, destino, desabilitado, rotulo) {
            var el = document.createElement("button");
            el.type = "button";
            el.textContent = texto;
            el.disabled = desabilitado;
            el.setAttribute("aria-label", rotulo);
            el.addEventListener("click", function () {
                paginaAtual[tipo] = destino;
                renderizarTabela(tipo);
            });
            controles.appendChild(el);
        }

        botao("‹", paginaAtual[tipo] - 1, paginaAtual[tipo] === 1,
            traducao("regionsDynamic.previous", "Página anterior"));
        var pagina = document.createElement("span");
        pagina.className = "pagina-atual";
        pagina.textContent = paginaAtual[tipo] + " / " + totalPaginas;
        controles.appendChild(pagina);
        botao("›", paginaAtual[tipo] + 1, paginaAtual[tipo] === totalPaginas,
            traducao("regionsDynamic.next", "Próxima página"));
        container.appendChild(controles);
    }

    function renderizarGrafico(registros) {
        var canvas = document.getElementById("grafico-generos");
        if (!canvas || typeof Chart === "undefined") {
            estadoGrafico.hidden = false;
            estadoGrafico.textContent = traducao("regionsDynamic.chartUnavailable", "Não foi possível carregar o gráfico.");
            return;
        }

        if (graficoGeneros) {
            graficoGeneros.destroy();
            graficoGeneros = null;
        }

        var top = registros.slice(0, MAX_GENEROS_GRAFICO);
        if (!top.length) {
            canvas.hidden = true;
            estadoGrafico.hidden = false;
            estadoGrafico.textContent = traducao("regionsDynamic.noData", "Não há dados cadastrados para esta região.");
            return;
        }

        canvas.hidden = false;
        estadoGrafico.hidden = true;
        var estiloClaro = document.documentElement.getAttribute("data-theme") === "light";
        var corTexto = estiloClaro ? "#554b63" : "#b9aec9";
        var corGrade = estiloClaro ? "rgba(85,75,99,.12)" : "rgba(185,174,201,.13)";

        graficoGeneros = new Chart(canvas, {
            type: "bar",
            data: {
                labels: top.map(function (item) { return item.genero; }),
                datasets: [{
                    label: traducao("regionsDynamic.streams", "Streams"),
                    data: top.map(function (item) { return Number(item.totalStreams) || 0; }),
                    backgroundColor: top.map(function (_, i) {
                        return i === 0 ? "#a78bfa" : "rgba(167,139,250,.62)";
                    }),
                    borderRadius: 6,
                    borderSkipped: false,
                    barThickness: "flex",
                    maxBarThickness: 24
                }]
            },
            options: {
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 250 },
                layout: { padding: { right: 12, left: 2 } },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return formatar(context.raw) + " " + traducao("regionsDynamic.streams", "streams");
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: { color: corGrade, drawBorder: false },
                        ticks: {
                            color: corTexto,
                            maxTicksLimit: 5,
                            callback: function (value) { return Number(value).toLocaleString(localeAtual()); }
                        },
                        border: { display: false }
                    },
                    y: {
                        grid: { display: false },
                        ticks: {
                            color: corTexto,
                            autoSkip: false,
                            font: { size: 11 }
                        },
                        border: { display: false }
                    }
                }
            }
        });
    }

    function atualizarResumo(resumo) {
        elementos.streams.textContent = formatar(resumo.totalStreams);
        elementos.registros.textContent = formatar(resumo.quantidadeRegistros);
        elementos.artistas.textContent = formatar(resumo.totalArtistas);
        elementos.generos.textContent = formatar(resumo.totalGeneros);
        elementos.media.textContent = formatar(resumo.mediaStreams);
    }

    function carregarRegioes() {
        fetch("/regioes")
            .then(function (resposta) {
                if (!resposta.ok) throw new Error("regions");
                return resposta.json();
            })
            .then(function (regioes) {
                seletor.replaceChildren();
                if (!Array.isArray(regioes) || !regioes.length) {
                    var opcaoVazia = document.createElement("option");
                    opcaoVazia.value = "";
                    opcaoVazia.textContent = traducao("regionsDynamic.noRegions", "Nenhuma região cadastrada no banco de dados.");
                    seletor.appendChild(opcaoVazia);
                    seletor.disabled = true;
                    mostrarMensagem(opcaoVazia.textContent, true);
                    resultado.hidden = true;
                    return;
                }

                seletor.disabled = false;
                regioes.forEach(function (regiao) {
                    var opcao = document.createElement("option");
                    opcao.value = regiao.idRegiao;
                    opcao.textContent = regiao.nome;
                    seletor.appendChild(opcao);
                });
                carregarDados(regioes[0].idRegiao);
            })
            .catch(function (erro) {
                console.error("Erro ao carregar regiões:", erro);
                mostrarMensagem(traducao("regionsDynamic.loadError", "Não foi possível carregar os dados da região."), true);
                resultado.hidden = true;
            });
    }

    function carregarDados(idRegiao) {
        if (!idRegiao) return;
        var identificador = ++requisicaoAtual;
        mostrarMensagem("", false);
        resultado.hidden = false;

        fetch("/regioes/" + encodeURIComponent(idRegiao))
            .then(function (resposta) {
                if (!resposta.ok) throw new Error("region-data");
                return resposta.json();
            })
            .then(function (dados) {
                if (identificador !== requisicaoAtual) return;
                atualizarResumo(dados.resumo || {});
                dadosAtuais.generos = Array.isArray(dados.generos) ? dados.generos : [];
                dadosAtuais.artistas = Array.isArray(dados.artistas) ? dados.artistas : [];
                paginaAtual.generos = 1;
                paginaAtual.artistas = 1;
                renderizarTabela("generos");
                renderizarTabela("artistas");
                renderizarGrafico(dadosAtuais.generos);
            })
            .catch(function (erro) {
                if (identificador !== requisicaoAtual) return;
                console.error("Erro ao carregar dados da região:", erro);
                mostrarMensagem(traducao("regionsDynamic.loadError", "Não foi possível carregar os dados da região."), true);
            });
    }

    function atualizarIdiomaETema() {
        if (dadosAtuais.generos.length || dadosAtuais.artistas.length) {
            renderizarTabela("generos");
            renderizarTabela("artistas");
            renderizarGrafico(dadosAtuais.generos);
        }
    }

    seletor.addEventListener("change", function () {
        carregarDados(this.value);
    });
    botaoBuscar.addEventListener("click", function () {
        carregarDados(seletor.value);
    });

    var observador = new MutationObserver(atualizarIdiomaETema);
    observador.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["lang", "data-theme"]
    });

    carregarRegioes();
});
