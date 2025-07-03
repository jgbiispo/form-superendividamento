document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("credores-container");
  const addBtn = document.getElementById("add-credor");

  // Máscaras simples
  const applyMasks = () => {
    const cpf = document.getElementById("cpf");
    const ddd = document.getElementById("telefone_ddd");
    const tel = document.getElementById("telefone_numero");

    cpf?.addEventListener("input", () => {
      cpf.value = cpf.value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    });

    ddd?.addEventListener("input", () => {
      ddd.value = ddd.value.replace(/\D/g, "").slice(0, 2);
    });

    tel?.addEventListener("input", () => {
      tel.value = tel.value
        .replace(/\D/g, "")
        .replace(/(\d{5})(\d{4})$/, "$1-$2")
        .slice(0, 10);
    });
  };

  // Criação dinâmica do bloco de credor
  let contador = 0;
  const criarCredor = () => {
    const id = contador++;

    // Fecha todos os anteriores
    document.querySelectorAll(".credor-body").forEach((body) => {
      body.style.display = "none";
    });
    document.querySelectorAll(".toggle-btn").forEach((btn, index) => {
      btn.textContent = `▲ Credor ${index + 1}`;
    });

    const wrapper = document.createElement("div");
    wrapper.className = "credor-wrapper";
    wrapper.innerHTML = `
      <div class="credor-header">
        <button type="button" class="toggle-btn">▼ Credor ${id + 1}</button>
        <button type="button" class="remove-btn" title="Remover credor">✖</button>
      </div>
      <fieldset class="credor-body">
        <div class="inline-label-input">
          <label>Nome do Credor:</label>
          <input type="text" name="credor_nome[]" required />
        </div>

        <div class="inline-label-input">
          <label>CNPJ:</label>
          <input type="text" name="credor_cnpj[]" />
        </div>

        <div class="inline-duplo">
          <div class="inline-label-input">
            <label>Valor original da dívida (R$):</label>
            <input type="text" name="credor_valor[]" />
          </div>
          <div class="inline-label-input">
            <label>Valor das parcelas (R$):</label>
            <input type="text" name="credor_valor_parcela[]" />
          </div>
        </div>

        <div class="inline-duplo">
          <div class="inline-label-input">
            <label>Parcelas pagas:</label>
            <input type="number" name="credor_parcelas_pagas[]" min="0" />
          </div>
          <div class="inline-label-input">
            <label>Parcelas restantes:</label>
            <input type="number" name="credor_parcelas_restantes[]" min="0" />
          </div>
        </div>

        <div class="inline-label-input">
          <label>Tipo de dívida (marque o que se aplica):</label>
          <div class="radio-group">
            <label><input type="checkbox" name="credor_tipo_${id}[]" value="Fatura Cartão de Crédito" /> Fatura Cartão de Crédito</label>
            <label><input type="checkbox" name="credor_tipo_${id}[]" value="Empréstimo pessoal/Consignado" /> Empréstimo pessoal/Consignado</label>
            <label><input type="checkbox" name="credor_tipo_${id}[]" value="Financiamento Veículo/Imobiliário" /> Financiamento Veículo/Imobiliário</label>
            <label><input type="checkbox" name="credor_tipo_${id}[]" value="Outros" /> Outros:</label>
            <input type="text" name="credor_tipo_outros[]" placeholder="Especifique" />
          </div>
        </div>

        <div class="inline-label-input">
          <label>Com garantia:</label>
          <div class="radio-group">
            <label><input type="radio" name="credor_garantia_${id}" value="Sim" /> Sim</label>
            <label><input type="radio" name="credor_garantia_${id}" value="Não" /> Não</label>
            <label><input type="radio" name="credor_garantia_${id}" value="Não se aplica" /> Não se aplica</label>
          </div>
          <input type="text" name="credor_garantia_qual[]" placeholder="Qual garantia?" />
        </div>

        <div class="inline-label-input">
          <label>Possui processo judicial pendente?</label>
          <div class="radio-group">
            <label><input type="radio" name="credor_processo_${id}" value="Sim" /> Sim</label>
            <label><input type="radio" name="credor_processo_${id}" value="Não" /> Não</label>
          </div>
        </div>

        <div class="inline-label-input">
          <label>Desconto em folha de pagamento ou benefício previdenciário:</label>
          <div class="radio-group">
            <label><input type="radio" name="credor_desconto_${id}" value="Sim" /> Sim</label>
            <label><input type="radio" name="credor_desconto_${id}" value="Não" /> Não</label>
            <label><input type="radio" name="credor_desconto_${id}" value="Não se aplica" /> Não se aplica</label>
          </div>
          <input type="text" name="credor_num_prestacoes[]" placeholder="Nº de prestações (se Sim)" />
        </div>

        <div class="inline-label-input">
          <label>A dívida está vencida?</label>
          <div class="radio-group">
            <label><input type="radio" name="credor_vencida_${id}" value="Sim" /> Sim</label>
            <label><input type="radio" name="credor_vencida_${id}" value="Não" /> Não</label>
          </div>
        </div>

        <div class="inline-label-input">
          <label>Tentou renegociar?</label>
          <div class="radio-group">
            <label><input type="radio" name="credor_renegociacao_${id}" value="Sim" /> Sim</label>
            <label><input type="radio" name="credor_renegociacao_${id}" value="Não" /> Não</label>
          </div>
          <p>Como?</p>
          <div class="radio-group">
            <label><input type="checkbox" name="credor_como_${id}[]" value="Próprio credor" /> Próprio credor</label>
            <label><input type="checkbox" name="credor_como_${id}[]" value="Defensoria Pública" /> Defensoria Pública</label>
            <label><input type="checkbox" name="credor_como_${id}[]" value="Advogado" /> Advogado</label>
            <label><input type="checkbox" name="credor_como_${id}[]" value="Juizado Especial Cível" /> Juizado Especial Cível</label>
          </div>
        </div>

        <div class="inline-label-input">
          <label>Recebeu cópia do contrato?</label>
          <div class="radio-group">
            <label><input type="radio" name="credor_contrato_${id}" value="Sim" /> Sim</label>
            <label><input type="radio" name="credor_contrato_${id}" value="Não" /> Não</label>
          </div>
          <p>Se sim:</p>
          <div class="radio-group">
            <label><input type="radio" name="credor_contrato_quando_${id}" value="Antes" /> Antes de assinar</label>
            <label><input type="radio" name="credor_contrato_quando_${id}" value="Depois" /> Depois de assinar</label>
            <label><input type="radio" name="credor_contrato_quando_${id}" value="Não se aplica" /> Não se aplica</label>
          </div>
        </div>

        <div class="inline-label-input">
          <label>Quando contratou, estava em cadastro de inadimplentes?</label>
          <div class="radio-group">
            <label><input type="radio" name="credor_inadimplente_${id}" value="Sim" /> Sim</label>
            <label><input type="radio" name="credor_inadimplente_${id}" value="Não" /> Não</label>
          </div>
        </div>
      </fieldset> 

    `;

    // Expandir/colapsar
    const toggleBtn = wrapper.querySelector(".toggle-btn");
    const fieldset = wrapper.querySelector(".credor-body");
    toggleBtn.addEventListener("click", () => {
      const hidden = fieldset.style.display === "none";
      fieldset.style.display = hidden ? "block" : "none";
      toggleBtn.textContent = `${hidden ? "▼" : "▲"} Credor ${id + 1}`;
    });

    // Remover bloco
    const removeBtn = wrapper.querySelector(".remove-btn");
    removeBtn.addEventListener("click", () => container.removeChild(wrapper));

    container.appendChild(wrapper);
    wrapper.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  addBtn?.addEventListener("click", criarCredor);

  // Inicia com um credor visível
  if (container.children.length === 0) criarCredor();

  applyMasks();
});
