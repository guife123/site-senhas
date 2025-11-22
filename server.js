const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const STATE_FILE = path.join(__dirname, 'state.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readState() {
  try {
    const raw = fs.readFileSync(STATE_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    // Estado inicial
    return { balcoes: { "1": 0 }, updatedAt: new Date().toISOString() };
  }
}

function writeState(state) {
  state.updatedAt = new Date().toISOString();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// GET estado atual
app.get('/api/state', (req, res) => {
  res.json(readState());
});

// POST chamar próxima senha de um balcão
app.post('/api/call-next', (req, res) => {
  const { balcao } = req.body;
  if (!balcao) return res.status(400).json({ error: 'balcao obrigatório' });

  const state = readState();
  const key = String(balcao);
  if (!(key in state.balcoes)) state.balcoes[key] = 0;

  state.balcoes[key] += 1;
  writeState(state);

  res.json({ balcao: key, senhaAtual: state.balcoes[key] });
});

// POST repetir (não altera; só devolve)
app.post('/api/repeat', (req, res) => {
  const { balcao } = req.body;
  if (!balcao) return res.status(400).json({ error: 'balcao obrigatório' });

  const state = readState();
  const key = String(balcao);
  const senhaAtual = state.balcoes[key] ?? 0;

  res.json({ balcao: key, senhaAtual });
});

// POST definir senha manualmente
app.post('/api/set', (req, res) => {
  const { balcao, senha } = req.body;
  if (!balcao || senha == null) return res.status(400).json({ error: 'balcao e senha obrigatórios' });

  const state = readState();
  const key = String(balcao);
  state.balcoes[key] = Number(senha) || 0;
  writeState(state);

  res.json({ balcao: key, senhaAtual: state.balcoes[key] });
});

// POST reset geral (ex.: início do dia)
app.post('/api/reset', (req, res) => {
  const state = readState();
  Object.keys(state.balcoes).forEach(k => state.balcoes[k] = 0);
  writeState(state);
  res.json(state);
});

app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});
