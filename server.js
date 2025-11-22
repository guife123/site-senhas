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
    // Estado inicial sem balcões
    return { senhaAtual: 0, updatedAt: new Date().toISOString() };
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
  const state = readState();
  state.senhaAtual = (state.senhaAtual || 0) + 1;
  writeState(state);
  res.json({ senhaAtual: state.senhaAtual });
});

// POST repetir (não altera; só devolve)
app.post('/api/repeat', (req, res) => {
  const state = readState();
  res.json({ senhaAtual: state.senhaAtual || 0 });
});

// POST definir senha manualmente
app.post('/api/set', (req, res) => {
  const { senha } = req.body;
  if (senha == null) return res.status(400).json({ error: 'senha obrigatória' });

  const state = readState();
  state.senhaAtual = Number(senha) || 0;
  writeState(state);

  res.json({ senhaAtual: state.senhaAtual });
});

// POST reset geral (ex.: início do dia)
app.post('/api/reset', (req, res) => {
  const state = readState();
  state.senhaAtual = 0;
  writeState(state);
  res.json(state);
});
app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});
