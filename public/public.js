const senhaEl = document.getElementById('senhaUnica');
const updatedAtEl = document.getElementById('updatedAt');

function render(state) {
  const senha = (state.balcoes && state.balcoes["1"]) != null ? state.balcoes["1"] : 0;

  updatedAtEl.textContent = state.updatedAt
    ? `Atualizado: ${new Date(state.updatedAt).toLocaleTimeString()}`
    : '';

  senhaEl.textContent = senha;
}

async function fetchState() {
  try {
    const res = await fetch('/api/state');
    const state = await res.json();
    render(state);
  } catch (e) {
    console.error('Erro a ler estado', e);
  }
}

fetchState();
setInterval(fetchState, 2000);
