document.addEventListener("DOMContentLoaded", function () {
    const API_ARTISTAS = "/artistas";
    const estado = { artistas: [], principal: null, comparado: null };

    const el = {
        buscaPrincipal: document.getElementById("busca-artista"),
        resultadosPrincipal: document.getElementById("resultados-busca-artista"),
        mensagemPrincipal: document.getElementById("mensagem-busca-artista"),
        limparPrincipal: document.getElementById("limpar-busca-artista"),
        buscaComparacao: document.getElementById("busca-artista-comparacao"),
        resultadosComparacao: document.getElementById("resultados-busca-comparacao"),
        mensagemComparacao: document.getElementById("mensagem-busca-comparacao"),
        limparComparacao: document.getElementById("limpar-busca-comparacao"),
        perfil: document.getElementById("perfil-artista"),
        vazio: document.getElementById("estado-inicial-artista"),
        comparacao: document.getElementById("resultado-comparacao"),
        comparacaoAjuda: document.getElementById("comparacao-ajuda")
    };

    function t(chave, fallback) {
        return typeof window.t === "function" ? (window.t(chave) || fallback || chave) : (fallback || chave);
    }

    function normalizar(texto) {
        return String(texto || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLocaleLowerCase("pt-BR")
            .replace(/[^a-z0-9\s&]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function formatarNumero(valor) {
        const numero = Number(valor || 0);
        return numero.toLocaleString(document.documentElement.lang || "pt-BR");
    }

    function iniciais(nome) {
        return String(nome || "?").trim().split(/\s+/).slice(0, 2).map(p => p.charAt(0)).join("").toUpperCase();
    }

    async function carregarArtistas() {
        try {
            const resposta = await fetch(API_ARTISTAS);
            if (!resposta.ok) throw new Error("Falha ao consultar artistas.");
            estado.artistas = await resposta.json();
            if (!Array.isArray(estado.artistas)) estado.artistas = [];
            if (!estado.artistas.length) {
                el.mensagemPrincipal.textContent = t("musicalProducer.noArtists", "Nenhum artista foi encontrado no banco de dados.");
            }
        } catch (erro) {
            console.error("Erro ao carregar lista de artistas:", erro);
            el.mensagemPrincipal.textContent = t("musicalProducer.loadArtistsError", "Não foi possível carregar a lista de artistas.");
        }
    }

    function pontuarCorrespondencia(artista, consulta) {
        const nome = normalizar(artista.nome);
        if (nome === consulta) return 100;
        if (nome.startsWith(consulta)) return 90;
        const palavras = nome.split(" ");
        if (palavras.some(palavra => palavra.startsWith(consulta))) return 80;
        if (nome.includes(consulta)) return 70;
        const termos = consulta.split(" ").filter(Boolean);
        if (termos.length && termos.every(termo => palavras.some(p => p.startsWith(termo) || p.includes(termo)))) return 60;
        return 0;
    }

    function encontrarCorrespondencias(consulta, idIgnorado) {
        const termo = normalizar(consulta);
        if (!termo) return [];
        return estado.artistas
            .filter(artista => Number(artista.idArtista) !== Number(idIgnorado))
            .map(artista => ({ artista, pontos: pontuarCorrespondencia(artista, termo) }))
            .filter(item => item.pontos > 0)
            .sort((a, b) => b.pontos - a.pontos || String(a.artista.nome).localeCompare(String(b.artista.nome), "pt-BR"))
            .slice(0, 8)
            .map(item => item.artista);
    }

    function fecharResultados(container, input) {
        container.hidden = true;
        input.setAttribute("aria-expanded", "false");
    }

    function mostrarResultados(consulta, tipo) {
        const principal = tipo === "principal";
        const input = principal ? el.buscaPrincipal : el.buscaComparacao;
        const container = principal ? el.resultadosPrincipal : el.resultadosComparacao;
        const mensagem = principal ? el.mensagemPrincipal : el.mensagemComparacao;
        const ignorar = principal ? null : (estado.principal && estado.principal.idArtista);
        const resultados = encontrarCorrespondencias(consulta, ignorar);
        container.replaceChildren();
        mensagem.textContent = "";
        if (!normalizar(consulta)) {
            fecharResultados(container, input);
            return;
        }
        if (!resultados.length) {
            fecharResultados(container, input);
            mensagem.textContent = t("musicalProducer.noMatch", "Nenhum artista encontrado com esse termo.");
            return;
        }
        resultados.forEach(artista => {
            const botao = document.createElement("button");
            botao.type = "button";
            botao.className = "resultado-artista-item";
            botao.setAttribute("role", "option");
            const nome = document.createElement("strong");
            nome.textContent = artista.nome;
            const pais = document.createElement("small");
            pais.textContent = artista.pais_origem || t("musicalProducer.countryNotInformed", "País não informado");
            botao.append(nome, pais);
            botao.addEventListener("click", function () {
                if (principal) selecionarPrincipal(artista);
                else selecionarComparado(artista);
                fecharResultados(container, input);
            });
            container.appendChild(botao);
        });
        container.hidden = false;
        input.setAttribute("aria-expanded", "true");
    }

    async function buscarPerfil(idArtista) {
        const resposta = await fetch(`${API_ARTISTAS}/${encodeURIComponent(idArtista)}`);
        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.mensagem || "Não foi possível carregar o perfil.");
        return dados;
    }

    async function selecionarPrincipal(artista) {
        estado.principal = artista;
        estado.comparado = null;
        el.buscaPrincipal.value = artista.nome;
        el.limparPrincipal.hidden = false;
        el.buscaComparacao.value = "";
        el.limparComparacao.hidden = true;
        el.comparacao.hidden = true;
        el.comparacaoAjuda.hidden = false;
        el.mensagemPrincipal.textContent = t("musicalProducer.loadingProfile", "Carregando dados do artista...");
        try {
            const dados = await buscarPerfil(artista.idArtista);
            renderizarPerfil(dados);
            el.mensagemPrincipal.textContent = "";
            el.comparacaoAjuda.textContent = t("musicalProducer.comparisonHelp", "Agora escolha outro artista para comparar os indicadores.");
        } catch (erro) {
            console.error("Erro ao carregar perfil:", erro);
            el.mensagemPrincipal.textContent = erro.message;
            el.perfil.hidden = true;
            el.perfil.style.display = "none";
            el.vazio.hidden = false;
            el.vazio.style.display = "flex";
        }
    }

    function renderizarPerfil(dados) {
        const artista = dados.artista || {};
        const generos = Array.isArray(dados.generos) ? dados.generos : [];
        el.vazio.hidden = true;
        el.vazio.style.display = "none";

        el.perfil.hidden = false;
        el.perfil.style.display = "grid";
        document.getElementById("artista-avatar").textContent = iniciais(artista.nome);
        document.getElementById("artista-nome").textContent = artista.nome || "—";
        document.getElementById("artista-pais").textContent = artista.paisOrigem || t("musicalProducer.countryNotInformed", "País não informado");
        document.getElementById("artista-streams").textContent = formatarNumero(artista.totalStreams);
        document.getElementById("artista-generos-total").textContent = formatarNumero(artista.totalGeneros ?? generos.length);
        document.getElementById("artista-ranking").textContent = artista.melhorRanking == null ? "—" : `#${formatarNumero(artista.melhorRanking)}`;
        const lista = document.getElementById("artista-generos-lista");
        lista.replaceChildren();
        if (!generos.length) {
            const vazio = document.createElement("p");
            vazio.className = "generos-sem-dados";
            vazio.textContent = t("musicalProducer.noGenres", "Não há gêneros associados a este artista.");
            lista.appendChild(vazio);
        } else {
            generos.forEach(item => {
                const tag = document.createElement("span");
                tag.className = "genero-artista-tag";
                tag.textContent = item.genero;
                lista.appendChild(tag);
            });
        }
    }

    async function selecionarComparado(artista) {
        if (!estado.principal) {
            el.mensagemComparacao.textContent = t("musicalProducer.selectMainFirst", "Pesquise e selecione primeiro um artista na busca principal.");
            return;
        }
        if (Number(estado.principal.idArtista) === Number(artista.idArtista)) {
            el.mensagemComparacao.textContent = t("musicalProducer.sameArtistError", "Escolha um artista diferente do perfil principal.");
            return;
        }
        estado.comparado = artista;
        el.buscaComparacao.value = artista.nome;
        el.limparComparacao.hidden = false;
        el.mensagemComparacao.textContent = t("musicalProducer.loadingComparison", "Carregando comparação...");
        try {
            const url = `${API_ARTISTAS}/comparar?artistaA=${encodeURIComponent(estado.principal.idArtista)}&artistaB=${encodeURIComponent(artista.idArtista)}`;
            const resposta = await fetch(url);
            const dados = await resposta.json();
            if (!resposta.ok) throw new Error(dados.mensagem || "Não foi possível comparar os artistas.");
            renderizarComparacao(dados);
            el.mensagemComparacao.textContent = "";
        } catch (erro) {
            console.error("Erro ao comparar artistas:", erro);
            el.mensagemComparacao.textContent = erro.message;
        }
    }

    function renderizarComparacao(dados) {
        const a = dados.artistaA || {};
        const b = dados.artistaB || {};
        document.getElementById("comparacao-nome-a").textContent = a.nome || estado.principal.nome;
        document.getElementById("comparacao-nome-b").textContent = b.nome || estado.comparado.nome;
        const container = document.getElementById("comparacao-indicadores");
        container.replaceChildren();
        const metricas = [
            { chave: "totalStreams", titulo: t("musicalProducer.totalStreams", "Streams registrados"), formato: formatarNumero },
            { chave: "totalGeneros", titulo: t("musicalProducer.genresCount", "Gêneros associados"), formato: formatarNumero },
            { chave: "melhorRanking", titulo: t("musicalProducer.bestRanking", "Melhor posição"), formato: valor => valor == null ? "—" : `#${formatarNumero(valor)}`, menorMelhor: true }
        ];
        metricas.forEach(metrica => {
            const valorA = a[metrica.chave];
            const valorB = b[metrica.chave];
            const card = document.createElement("article");
            card.className = "comparacao-metrica";
            const titulo = document.createElement("h3");
            titulo.textContent = metrica.titulo;
            const valores = document.createElement("div");
            valores.className = "comparacao-valores";
            const itemA = document.createElement("strong");
            const itemB = document.createElement("strong");
            itemA.textContent = metrica.formato(valorA);
            itemB.textContent = metrica.formato(valorB);
            if (valorA != null && valorB != null && Number(valorA) !== Number(valorB)) {
                const aMelhor = metrica.menorMelhor ? Number(valorA) < Number(valorB) : Number(valorA) > Number(valorB);
                (aMelhor ? itemA : itemB).classList.add("comparacao-vencedor");
            }
            valores.append(itemA, itemB);
            card.append(titulo, valores);
            container.appendChild(card);
        });
        el.comparacao.hidden = false;
        el.comparacaoAjuda.hidden = true;
    }

    function configurarBusca(input, tipo, limpar) {
        input.addEventListener("input", function () {
            limpar.hidden = !input.value;
            mostrarResultados(input.value, tipo);
            if (tipo === "principal" && estado.principal && normalizar(input.value) !== normalizar(estado.principal.nome)) {
                estado.principal = null;
                estado.comparado = null;
                el.perfil.hidden = true;
                el.vazio.hidden = false;
                el.comparacao.hidden = true;
                el.comparacaoAjuda.hidden = false;
            }
            if (tipo === "comparacao" && estado.comparado && normalizar(input.value) !== normalizar(estado.comparado.nome)) {
                estado.comparado = null;
                el.comparacao.hidden = true;
                el.comparacaoAjuda.hidden = false;
            }
        });
        limpar.addEventListener("click", function () {
            input.value = "";
            limpar.hidden = true;
            const container = tipo === "principal" ? el.resultadosPrincipal : el.resultadosComparacao;
            const mensagem = tipo === "principal" ? el.mensagemPrincipal : el.mensagemComparacao;
            fecharResultados(container, input);
            mensagem.textContent = "";
            if (tipo === "principal") {
                estado.principal = null;
                estado.comparado = null;
                el.perfil.hidden = true;
                el.vazio.hidden = false;
                el.comparacao.hidden = true;
                el.buscaComparacao.value = "";
                el.limparComparacao.hidden = true;
                el.comparacaoAjuda.hidden = false;
            } else {
                estado.comparado = null;
                el.comparacao.hidden = true;
                el.comparacaoAjuda.hidden = false;
            }
            input.focus();
        });
        input.addEventListener("keydown", function (evento) {
            if (evento.key === "Escape") fecharResultados(tipo === "principal" ? el.resultadosPrincipal : el.resultadosComparacao, input);
            if (evento.key === "Enter") {
                const opcoes = (tipo === "principal" ? el.resultadosPrincipal : el.resultadosComparacao).querySelectorAll("button");
                if (opcoes.length === 1) opcoes[0].click();
            }
        });
    }

    document.addEventListener("click", function (evento) {
        document.querySelectorAll("[data-search-container]").forEach(bloco => {
            if (!bloco.contains(evento.target)) {
                const principal = bloco.dataset.searchContainer === "principal";
                fecharResultados(principal ? el.resultadosPrincipal : el.resultadosComparacao, principal ? el.buscaPrincipal : el.buscaComparacao);
            }
        });
    });

    configurarBusca(el.buscaPrincipal, "principal", el.limparPrincipal);
    configurarBusca(el.buscaComparacao, "comparacao", el.limparComparacao);
    carregarArtistas();
});
