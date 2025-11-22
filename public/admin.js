const nextBtn = document.getElementById('nextBtn');
const repeatBtn = document.getElementById('repeatBtn');
const manualInput = document.getElementById('manualInput');
const setBtn = document.getElementById('setBtn');
const resetBtn = document.getElementById('resetBtn');
const statusEl = document.getElementById('status');

function setStatus(msg, ok=true) {
  statusEl.textContent = msg;
  statusEl.style.color = ok ? '#0a7a2f' : '#b00020';
}

async function post(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

nextBtn.addEventListener('click', async () => {
  try {
    const balcao = "1";
    const data = await post('/api/call-next', {});
    setStatus(`Balcão ${data.balcao} → Senha ${data.senhaAtual}`);
  } catch (e) {
    setStatus('Erro ao chamar próxima', false);
  }
});

repeatBtn.addEventListener('click', async () => {
  try {
    const balcao = "1";
    const data = await post('/api/repeat', {});
    setStatus(`Repetir: Balcão ${data.balcao} → Senha ${data.senhaAtual}`);
  } catch (e) {
    setStatus('Erro ao repetir', false);
  }
});

setBtn.addEventListener('click', async () => {
  try {
    const balcao = "1";
    const senha = manualInput.value;
    const data = await post('/api/set', { senha });
    setStatus(`Definido: Balcão ${data.balcao} → Senha ${data.senhaAtual}`);
  } catch (e) {
    setStatus('Erro ao definir senha', false);
  }
});

resetBtn.addEventListener('click', async () => {
  if (!confirm('Tens a certeza que queres fazer reset geral?')) return;
  try {
    await post('/api/reset', {});
    setStatus('Reset efetuado. Todas as senhas a 0.');
  } catch (e) {
    setStatus('Erro ao fazer reset', false);
  }
});
