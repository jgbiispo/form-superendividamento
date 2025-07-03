document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('credores-container');
  const addBtn = document.getElementById('add-credor');

  function criarBlocoCredor() {
    const wrapper = document.createElement('div');
    wrapper.className = 'credor-wrapper';

    wrapper.innerHTML = `
      <div class="credor-header">
        <button type="button" class="toggle-btn">▼ Credor</button>
        <button type="button" class="remove-btn" title="Remover credor">✖</button>
      </div>
      <fieldset class="credor-body">
        ${[
          {
            label: 'Nome do Credor:',
            name: 'credor_nome[]',
            type: 'text',
            required: true,
          },
          { label: 'CNPJ:', name: 'credor_cnpj[]', type: 'text' },
          {
            label: 'Valor original da dívida:',
            name: 'credor_valor[]',
            type: 'text',
          },
          {
            label: 'Valor das parcelas:',
            name: 'credor_valor_parcela[]',
            type: 'text',
          },
          {
            label: 'Parcelas pagas:',
            name: 'credor_parcelas_pagas[]',
            type: 'number',
          },
          {
            label: 'Parcelas restantes:',
            name: 'credor_parcelas_restantes[]',
            type: 'number',
          },
        ]
          .map(
            (campo) => `
          <div class="inline-label-input">
            <label>${campo.label}</label>
            <input type="${campo.type}" name="${campo.name}" ${
              campo.required ? 'required' : ''
            } />
          </div>`
          )
          .join('')}
      </fieldset>
    `;

    const toggleBtn = wrapper.querySelector('.toggle-btn');
    const fieldset = wrapper.querySelector('.credor-body');
    toggleBtn.addEventListener('click', () => {
      const isHidden = fieldset.style.display === 'none';
      fieldset.style.display = isHidden ? 'block' : 'none';
      toggleBtn.textContent = `${isHidden ? '▼' : '▲'} Credor`;
    });

    const removeBtn = wrapper.querySelector('.remove-btn');
    removeBtn.addEventListener('click', () => {
      container.removeChild(wrapper);
    });

    return wrapper;
  }

  addBtn.addEventListener('click', () => {
    const novoBloco = criarBlocoCredor();
    container.appendChild(novoBloco);
  });

  container.appendChild(criarBlocoCredor());
});
