# Atlas CRUD

Aplicacao full stack para gerenciar continentes, paises e cidades.

## Estrutura

- `frontend`: React + Vite + TypeScript
- `backend`: Next.js (Route Handlers) + TypeScript + PostgreSQL (`pg`)
- `database.sql`: tabelas, relacionamentos e indices

## Como executar

1. Crie um banco PostgreSQL e execute `database.sql`.
2. Copie `backend/.env.example` para `backend/.env.local` e ajuste a conexao.
3. Em terminais separados:

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

Abra `http://localhost:5173`. O backend usa `http://localhost:3000`.

O primeiro acesso pode ser criado na tela de cadastro.

## Integracoes externas

- REST Countries: bandeira, populacao, idioma e moeda.
- Nominatim/OpenStreetMap: latitude, longitude e visualizacao no mapa.

