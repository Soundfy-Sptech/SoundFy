document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    var $ = function (id) { return document.getElementById(id); };
    var elementos = {
        tipo: $("filtroTipo"),
        regiao: $("filtroRegiao"),
        limite: $("filtroLimite"),
        busca: $("filtroBusca"),
        cabecalho: $("cabecalhoTabela"),
        corpo: $("corpoTabela"),
        contador: $("contadorLinhas"),
        subtitulo: $("subtituloRelatorio"),
        csv: $("btnExportarCSV"),
        xlsx: $("btnExportarXLSX"),
        pdf: $("btnExportarPDF")
    };

    var colunas = {
        artistas: [
            { titulo: "reports.columnArtist", campo: "artista" },
            { titulo: "reports.columnRegion", campo: "regiao" },
            { titulo: "reports.columnScore", campo: "pontuacao", numero: true },
            { titulo: "reports.columnRanking", campo: "melhorRanking", numero: true },
            { titulo: "reports.columnAppearances", campo: "aparicoes", numero: true },
            { titulo: "reports.columnTracks", campo: "faixas", numero: true },
            { titulo: "reports.columnCities", campo: "cidades", numero: true }
        ],
        generos: [
            { titulo: "reports.columnGenre", campo: "genero" },
            { titulo: "reports.columnRegion", campo: "regiao" },
            { titulo: "reports.columnScore", campo: "pontuacao", numero: true },
            { titulo: "reports.columnRanking", campo: "melhorRanking", numero: true },
            { titulo: "reports.columnArtists", campo: "artistas", numero: true },
            { titulo: "reports.columnTracks", campo: "faixas", numero: true },
            { titulo: "reports.columnCities", campo: "cidades", numero: true }
        ],
        cidades: [
            { titulo: "reports.columnCity", campo: "cidade" },
            { titulo: "reports.columnRegion", campo: "regiao" },
            { titulo: "reports.columnWeeks", campo: "semanas", numero: true },
            { titulo: "reports.columnRecords", campo: "registros", numero: true },
            { titulo: "reports.columnScore", campo: "pontuacao", numero: true }
        ],
        resumo: [
            { titulo: "reports.columnRegion", campo: "regiao" },
            { titulo: "reports.columnCities", campo: "cidades", numero: true },
            { titulo: "reports.columnArtists", campo: "artistas", numero: true },
            { titulo: "reports.columnGenres", campo: "generos", numero: true },
            { titulo: "reports.columnTracks", campo: "faixas", numero: true },
            { titulo: "reports.columnRecords", campo: "registros", numero: true },
            { titulo: "reports.columnScore", campo: "pontuacao", numero: true }
        ]
    };

    var registrosAtuais = [];
    var carregando = false;
    var erroAtual = false;

    function traduzir(chave, padrao) {
        return typeof window.t === "function" ? window.t(chave, padrao || chave) : (padrao || chave);
    }

    function obterLocale() {
        var idioma = document.documentElement.lang || localStorage.getItem("soundfy-language") || "pt";
        if (idioma.indexOf("en") === 0) return "en-US";
        if (idioma.indexOf("es") === 0) return "es-ES";
        return "pt-BR";
    }

    function formatarNumero(valor) {
        var numero = Number(valor);
        return Number.isFinite(numero) ? numero.toLocaleString(obterLocale(), { maximumFractionDigits: 0 }) : "—";
    }

    function cabecalhoAutenticacao() {
        var token = sessionStorage.getItem("TOKEN_USUARIO");
        return token ? { Authorization: "Bearer " + token } : {};
    }

    async function requisitar(url) {
        var resposta = await fetch(url, { headers: cabecalhoAutenticacao() });
        var dados = await resposta.json().catch(function () { return {}; });
        if (!resposta.ok) {
            if (resposta.status === 401) {
                sessionStorage.clear();
                window.location.href = "cadastro.html";
                throw new Error("Sessão expirada. Entre novamente.");
            }
            throw new Error(dados.mensagem || "Não foi possível consultar os dados.");
        }
        return dados;
    }

    function exibirEstadoTabela(mensagem) {
        elementos.corpo.replaceChildren();
        var linha = document.createElement("tr");
        var celula = document.createElement("td");
        celula.colSpan = (colunas[elementos.tipo.value] || colunas.artistas).length;
        celula.className = "estado-tabela-relatorios";
        celula.textContent = mensagem;
        linha.appendChild(celula);
        elementos.corpo.appendChild(linha);
    }

    async function carregarIndicadores() {
        try {
            var dados = await requisitar("/relatorios/indicadores");
            $("kpiPontuacao").textContent = formatarNumero(dados.pontuacaoTotal);
            $("kpiRegistros").textContent = formatarNumero(dados.registrosAnalisados);
            $("kpiCidades").textContent = formatarNumero(dados.cidadesCobertas);
            $("kpiFaixas").textContent = formatarNumero(dados.musicasMapeadas);
        } catch (erro) {
            console.error("Erro ao carregar indicadores dos relatórios:", erro);
            ["kpiPontuacao", "kpiRegistros", "kpiCidades", "kpiFaixas"].forEach(function (id) {
                $(id).textContent = "—";
            });
        }
    }

    async function carregarRegioes() {
        try {
            var regioes = await requisitar("/relatorios/regioes");
            var selecionada = elementos.regiao.value || "todas";
            elementos.regiao.replaceChildren();

            var todas = document.createElement("option");
            todas.value = "todas";
            todas.textContent = traduzir("reports.allRegions", "Todas as regiões");
            elementos.regiao.appendChild(todas);

            regioes.forEach(function (regiao) {
                var opcao = document.createElement("option");
                opcao.value = regiao.nome;
                opcao.textContent = regiao.nome;
                elementos.regiao.appendChild(opcao);
            });

            elementos.regiao.value = Array.from(elementos.regiao.options).some(function (opcao) {
                return opcao.value === selecionada;
            }) ? selecionada : "todas";
        } catch (erro) {
            console.error("Erro ao carregar regiões dos relatórios:", erro);
        }
    }

    function obterColunas() {
        return colunas[elementos.tipo.value] || colunas.artistas;
    }

    function filtrarRegistros() {
        var termo = elementos.busca.value.trim().toLocaleLowerCase(obterLocale());
        var resultado = registrosAtuais.filter(function (registro) {
            return !termo || Object.keys(registro).some(function (chave) {
                return String(registro[chave] == null ? "" : registro[chave])
                    .toLocaleLowerCase(obterLocale()).includes(termo);
            });
        });

        var limite = elementos.limite.value;
        if (limite !== "todos") resultado = resultado.slice(0, Number(limite));
        return resultado;
    }

    function renderizarTabela() {
        var listaColunas = obterColunas();
        var registros = filtrarRegistros();
        elementos.cabecalho.replaceChildren();
        elementos.corpo.replaceChildren();

        var linhaCabecalho = document.createElement("tr");
        listaColunas.forEach(function (coluna) {
            var th = document.createElement("th");
            th.textContent = traduzir(coluna.titulo);
            linhaCabecalho.appendChild(th);
        });
        elementos.cabecalho.appendChild(linhaCabecalho);

        if (carregando) {
            exibirEstadoTabela(traduzir("reports.loading", "Carregando dados do banco..."));
        } else if (erroAtual) {
            exibirEstadoTabela(traduzir("reports.loadError", "Não foi possível carregar os dados. Tente novamente."));
        } else if (!registros.length) {
            exibirEstadoTabela(traduzir("reports.empty", "Nenhum registro encontrado para os filtros selecionados."));
        } else {
            registros.forEach(function (registro) {
                var tr = document.createElement("tr");
                listaColunas.forEach(function (coluna) {
                    var td = document.createElement("td");
                    var valor = registro[coluna.campo];
                    td.textContent = valor == null ? "—" :
                        (coluna.numero ? formatarNumero(valor) : String(valor));
                    tr.appendChild(td);
                });
                elementos.corpo.appendChild(tr);
            });
        }

        elementos.contador.textContent = formatarNumero(registros.length) + " " +
            traduzir("reports.recordsFound", "registros encontrados");
        elementos.subtitulo.textContent = traduzir({
            artistas: "reports.typeArtists",
            generos: "reports.typeGenres",
            cidades: "reports.typeCities",
            resumo: "reports.typeRegions"
        }[elementos.tipo.value] || "reports.detailedReport");
    }

    async function carregarRelatorio() {
        carregando = true;
        erroAtual = false;
        renderizarTabela();

        var parametros = new URLSearchParams({ tipo: elementos.tipo.value });
        if (elementos.regiao.value && elementos.regiao.value !== "todas") {
            parametros.set("regiao", elementos.regiao.value);
        }

        try {
            var resposta = await requisitar("/relatorios?" + parametros.toString());
            registrosAtuais = Array.isArray(resposta.registros) ? resposta.registros : [];
            carregando = false;
            erroAtual = false;
        } catch (erro) {
            console.error("Erro ao carregar relatório:", erro);
            registrosAtuais = [];
            carregando = false;
            erroAtual = true;
        }
        renderizarTabela();
    }

    function escaparCSV(valor) {
        return '"' + String(valor == null ? "" : valor).replace(/"/g, '""') + '"';
    }

    function matrizExportacao() {
        var listaColunas = obterColunas();
        var registros = filtrarRegistros();
        return [
            listaColunas.map(function (coluna) { return traduzir(coluna.titulo); }),
            ...registros.map(function (registro) {
                return listaColunas.map(function (coluna) { return registro[coluna.campo] == null ? "" : registro[coluna.campo]; });
            })
        ];
    }

    function nomeArquivo(extensao) {
        return "soundfy-relatorio-" + elementos.tipo.value + "-" +
            new Date().toISOString().slice(0, 10) + "." + extensao;
    }

    function baixarArquivo(conteudo, mime, nome) {
        var blob = new Blob([conteudo], { type: mime });
        var url = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        link.download = nome;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }

    function validarExportacao() {
        var matriz = matrizExportacao();
        if (matriz.length <= 1) {
            alert(traduzir("reports.noDataToExport", "Não há dados para exportar."));
            return null;
        }
        return matriz;
    }

    function exportarCSV() {
        var matriz = validarExportacao();
        if (!matriz) return;
        var csv = matriz.map(function (linha) {
            return linha.map(escaparCSV).join(";");
        }).join("\r\n");
        baixarArquivo("\uFEFF" + csv, "text/csv;charset=utf-8;", nomeArquivo("csv"));
    }

    function exportarXLSX() {
        var matriz = validarExportacao();
        if (!matriz) return;
        if (typeof XLSX === "undefined") {
            alert(traduzir("reports.xlsxLibraryError", "Biblioteca XLSX indisponível."));
            return;
        }
        var planilha = XLSX.utils.aoa_to_sheet(matriz);
        var livro = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(livro, planilha, elementos.tipo.value.slice(0, 31));
        XLSX.writeFile(livro, nomeArquivo("xlsx"));
    }

    function exportarPDF() {
        var matriz = validarExportacao();
        if (!matriz) return;
        if (!window.jspdf || !window.jspdf.jsPDF) {
            alert(traduzir("reports.pdfLibraryError", "Biblioteca PDF indisponível."));
            return;
        }
        var documento = new window.jspdf.jsPDF({ orientation: "landscape" });
        documento.setFontSize(16);
        documento.text(traduzir("reports.pdfTitle", "Relatório SoundFy"), 14, 16);
        documento.setFontSize(9);
        documento.text(traduzir("reports.pdfGeneratedAt", "Gerado em") + ": " +
            new Date().toLocaleString(obterLocale()), 14, 23);
        if (typeof documento.autoTable !== "function") {
            alert(traduzir("reports.pdfTableError", "Não foi possível montar a tabela do PDF."));
            return;
        }
        documento.autoTable({
            head: [matriz[0]],
            body: matriz.slice(1),
            startY: 30,
            styles: { fontSize: 8, cellPadding: 3 },
            headStyles: { fillColor: [124, 58, 237] },
            alternateRowStyles: { fillColor: [245, 240, 250] }
        });
        documento.save(nomeArquivo("pdf"));
    }

    elementos.tipo.addEventListener("change", carregarRelatorio);
    elementos.regiao.addEventListener("change", carregarRelatorio);
    elementos.limite.addEventListener("change", renderizarTabela);
    elementos.busca.addEventListener("input", renderizarTabela);
    elementos.csv.addEventListener("click", exportarCSV);
    elementos.xlsx.addEventListener("click", exportarXLSX);
    elementos.pdf.addEventListener("click", exportarPDF);

    if (typeof window.onLanguageReady === "function") {
        window.onLanguageReady(function () {
            carregarRegioes();
            renderizarTabela();
        });
    }
    new MutationObserver(renderizarTabela).observe(document.documentElement, {
        attributes: true, attributeFilter: ["lang"]
    });

    Promise.all([carregarIndicadores(), carregarRegioes()]).then(carregarRelatorio);
});
