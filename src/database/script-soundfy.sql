-- =====================================================================
--  SOUNDFY | SCRIPT COMPLETO DO BANCO DE DADOS
--  Estrutura + dados carregados da planilha de músicas por região
--
--  Compatibilidade: MySQL 8.0.16 ou superior (utiliza constraints CHECK).
--
--  ATENÇÃO: este script APAGA o banco Soundfy existente e o recria do zero.
--  Execute somente se quiser substituir integralmente os dados atuais.
--  Rode o arquivo inteiro, do início ao fim, em uma única execução.
-- =====================================================================

DROP DATABASE IF EXISTS Soundfy;

CREATE DATABASE Soundfy
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE Soundfy;

SET NAMES utf8mb4;

CREATE TABLE tipoUsuario(
	idTipoUsuario INT PRIMARY KEY,
    tipoUsuario VARCHAR(20) NOT NULL,
    CONSTRAINT chk_tipo_usuario
        CHECK (tipoUsuario IN ('Produtor Musical', 'Produtor Eventos', 'Administrador'))
);

CREATE TABLE Usuario (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(12),
    fkTipoUsuario INT,
    FOREIGN KEY	(fkTipoUsuario) REFERENCES tipoUsuario(idTipoUsuario)
);


-- nome aumentado para 255 (a planilha tem nomes de até 149 caracteres, com featurings)
-- pais_origem agora aceita NULL (a planilha não informa o país dos artistas)
CREATE TABLE Artista (
    idArtista INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL UNIQUE,
    pais_origem VARCHAR(100) NULL
);

SELECT idUsuario, email, CHAR_LENGTH(senha) AS tamanho from usuario;

CREATE TABLE Genero (
    idGenero INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL UNIQUE
);

CREATE TABLE Regiao (
    idRegiao INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL UNIQUE,
    qtd_musicas INT NOT NULL DEFAULT 0,
    CONSTRAINT chk_regiao_musicas
        CHECK (qtd_musicas >= 0)
);

-- NOVA: cidades analisadas (aba "Cidades" da planilha; KPI "Cidades Cobertas" e relatório por cidade)
CREATE TABLE Cidade (
    idCidade INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(60) NOT NULL UNIQUE,
    semanas INT NOT NULL,
    registros INT NOT NULL,
    pontuacao INT NOT NULL,
    idRegiao INT NOT NULL,
    CONSTRAINT chk_cidade_valores
        CHECK (semanas >= 0 AND registros >= 0 AND pontuacao >= 0),
    CONSTRAINT fk_cidade_regiao
        FOREIGN KEY (idRegiao)
        REFERENCES Regiao(idRegiao)
);

CREATE TABLE `Genero dos artistas` (
    idGenero INT NOT NULL,
    idArtista INT NOT NULL,
    PRIMARY KEY (idGenero, idArtista),
    CONSTRAINT fk_genero_artista_genero
        FOREIGN KEY (idGenero)
        REFERENCES Genero(idGenero),
    CONSTRAINT fk_genero_artista_artista
        FOREIGN KEY (idArtista)
        REFERENCES Artista(idArtista)
);

-- qtd_streams guarda a "Pontuação" da planilha (arredondada); ranking = coluna Rank
CREATE TABLE ConsumoGenero (
    idConsumoMusical INT PRIMARY KEY AUTO_INCREMENT,
    qtd_streams INT NOT NULL,
    ranking INT NOT NULL,
    aparicoes INT NOT NULL DEFAULT 0,
    qtd_musicas INT NOT NULL DEFAULT 0,
    qtd_cidades INT NOT NULL DEFAULT 0,
    idGenero INT NOT NULL,
    idRegiao INT NOT NULL,
    CONSTRAINT uq_consumo_genero UNIQUE (idGenero, idRegiao),
    CONSTRAINT chk_consumo_genero_streams
        CHECK (qtd_streams >= 0),
    CONSTRAINT chk_consumo_genero_ranking
        CHECK (ranking > 0),
    CONSTRAINT fk_consumo_genero_genero
        FOREIGN KEY (idGenero)
        REFERENCES Genero(idGenero),
    CONSTRAINT fk_consumo_genero_regiao
        FOREIGN KEY (idRegiao)
        REFERENCES Regiao(idRegiao)
);

CREATE TABLE ConsumoArtista (
    id INT PRIMARY KEY AUTO_INCREMENT,
    qtd_streams INT NOT NULL,
    ranking INT NOT NULL,
    aparicoes INT NOT NULL DEFAULT 0,
    qtd_musicas INT NOT NULL DEFAULT 0,
    qtd_cidades INT NOT NULL DEFAULT 0,
    idArtista INT NOT NULL,
    idRegiao INT NOT NULL,
    CONSTRAINT uq_consumo_artista UNIQUE (idArtista, idRegiao),
    CONSTRAINT chk_consumo_artista_streams
        CHECK (qtd_streams >= 0),
    CONSTRAINT chk_consumo_artista_ranking
        CHECK (ranking > 0),
    CONSTRAINT fk_consumo_artista_artista
        FOREIGN KEY (idArtista)
        REFERENCES Artista(idArtista),
    CONSTRAINT fk_consumo_artista_regiao
        FOREIGN KEY (idRegiao)
        REFERENCES Regiao(idRegiao)
);

CREATE TABLE Notificacao (
    idNotificacao INT PRIMARY KEY AUTO_INCREMENT,
    mensagem VARCHAR(128) NOT NULL,
    data_envio DATETIME NOT NULL,
    lida TINYINT(1) NOT NULL DEFAULT 0,
    ativa TINYINT(1) NOT NULL DEFAULT 1,
    idUsuario INT NOT NULL,
    idConsumoMusical INT NOT NULL,
    CONSTRAINT chk_notificacao_lida
        CHECK (lida IN (0, 1)),
    CONSTRAINT chk_notificacao_ativa
        CHECK (ativa IN (0, 1)),
    CONSTRAINT fk_notificacao_usuario
        FOREIGN KEY (idUsuario)
        REFERENCES Usuario(idUsuario),
    CONSTRAINT fk_notificacao_consumo_genero
        FOREIGN KEY (idConsumoMusical)
        REFERENCES ConsumoGenero(idConsumoMusical)
);

-- =====================================================================
--  DADOS
-- =====================================================================

INSERT INTO tipoUsuario (idTipoUsuario, tipoUsuario) VALUES
(1, 'Produtor Musical'),
(2, 'Produtor Eventos'),
(3, 'Administrador');