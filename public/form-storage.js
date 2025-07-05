document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formulario');
  const STORAGE_KEY = 'formulario-superendividamento';

  // Restaura os dados salvos no localStorage
  restaurarFormulario();

  // Salva rascunho a cada alteração nos campos
  form?.addEventListener('input', () => {
    salvarFormulario();
  });

  // Limpa rascunho somente após envio
  form?.addEventListener('submit', () => {
    localStorage.removeItem(STORAGE_KEY);
  });

  /** Salva todos os campos no localStorage */
  function salvarFormulario() {
    const dados = {};
    const elementos = form.querySelectorAll('input, select, textarea');

    elementos.forEach((el) => {
      if (el.name) {
        if (el.type === 'checkbox') {
          if (!dados[el.name]) dados[el.name] = [];
          if (el.checked) dados[el.name].push(el.value);
        } else if (el.type === 'radio') {
          if (el.checked) dados[el.name] = el.value;
        } else {
          dados[el.name] = el.value;
        }
      }
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
  }

  /** Preenche o formulário com os dados salvos */
  function restaurarFormulario() {
    const dadosSalvos = localStorage.getItem(STORAGE_KEY);
    if (!dadosSalvos) return;

    const dados = JSON.parse(dadosSalvos);
    const elementos = form.querySelectorAll('input, select, textarea');

    elementos.forEach((el) => {
      if (!el.name || !(el.name in dados)) return;

      if (el.type === 'checkbox') {
        el.checked =
          Array.isArray(dados[el.name]) && dados[el.name].includes(el.value);
      } else if (el.type === 'radio') {
        el.checked = dados[el.name] === el.value;
      } else {
        el.value = dados[el.name];
      }
    });
  }
});
