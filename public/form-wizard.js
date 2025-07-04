// Controla as etapas do formulário
let etapaAtual = 0;

window.addEventListener('DOMContentLoaded', () => {
  /* -------- ELEMENTOS PRINCIPAIS ------------------------------------ */
  const steps = document.querySelectorAll('.form-step');
  const btnProximo = document.getElementById('btn-proximo');
  const btnVoltar = document.getElementById('btn-voltar');
  const btnEnviar = document.getElementById('btn-enviar');
  const formulario = document.getElementById('formulario');

  /* -------- PROGRESS BAR ------------------------------------- */
  const contador = document.getElementById('contador-etapas');
  const totalEtapas = steps.length;

  /* -------- FUNÇÕES -------------------------------------------------- */
  const mostrarEtapa = (indice) => {
    // mostra/oculta blocos de formulário
    steps.forEach((s, i) => s.classList.toggle('ativo', i === indice));

    // atualiza botões
    btnVoltar.style.display = indice === 0 ? 'none' : 'inline-block';
    btnVoltar.disabled = indice === 0;
    btnProximo.style.display =
      indice === steps.length - 1 ? 'none' : 'inline-block';
    btnEnviar.style.display =
      indice === steps.length - 1 ? 'inline-block' : 'none';

    // ---- PROGRESS BAR ---------------------------------------
    if (contador) {
      contador.textContent = `Etapa ${indice + 1} de ${totalEtapas}`;
    }

    // ---- SCROLL PARA A ETAPA ATUAL -----------------------------
    steps[indice].scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ---- VALIDAÇÃO DE ETAPA -----------------------------------
  const validarEtapa = () => {
    const campos = steps[etapaAtual].querySelectorAll(
      'input, select, textarea'
    );
    for (let campo of campos) {
      if (campo.hasAttribute('required') && !campo.value.trim()) {
        campo.focus({ preventScroll: true });
        campo.scrollIntoView({ behavior: 'smooth', block: 'center' });
        campo.classList.add('erro-campo');
        return false;
      } else {
        campo.classList.remove('erro-campo');
      }
    }
    return true;
  };

  /* -------- HANDLERS ------------------------------------------------- */
  btnProximo?.addEventListener('click', () => {
    if (etapaAtual < steps.length - 1 && validarEtapa()) {
      etapaAtual++;
      mostrarEtapa(etapaAtual);
    }
  });

  btnVoltar?.addEventListener('click', () => {
    if (etapaAtual > 0) {
      etapaAtual--;
      mostrarEtapa(etapaAtual);
    }
  });

  /* -------- INICIALIZAÇÃO ------------------------------------------- */
  mostrarEtapa(etapaAtual);
});
