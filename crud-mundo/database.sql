CREATE TABLE IF NOT EXISTS usuario (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS continente (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT NOT NULL,
  usuario_id INTEGER NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (nome, usuario_id)
);

CREATE TABLE IF NOT EXISTS pais (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  populacao BIGINT NOT NULL CHECK (populacao >= 0),
  idioma_oficial VARCHAR(100) NOT NULL,
  moeda VARCHAR(100) NOT NULL,
  continente_id INTEGER NOT NULL REFERENCES continente(id) ON DELETE CASCADE,
  bandeira TEXT,
  usuario_id INTEGER NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (nome, usuario_id)
);

CREATE TABLE IF NOT EXISTS cidade (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  populacao BIGINT NOT NULL CHECK (populacao >= 0),
  latitude NUMERIC(10, 7) NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude NUMERIC(10, 7) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  pais_id INTEGER NOT NULL REFERENCES pais(id) ON DELETE CASCADE,
  usuario_id INTEGER NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (nome, pais_id, usuario_id)
);

CREATE INDEX IF NOT EXISTS idx_continente_usuario ON continente(usuario_id);
CREATE INDEX IF NOT EXISTS idx_pais_usuario_continente ON pais(usuario_id, continente_id);
CREATE INDEX IF NOT EXISTS idx_cidade_usuario_pais ON cidade(usuario_id, pais_id);

