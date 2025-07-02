document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("credores-container");
  const addBtn = document.getElementById("add-credor");
  let id = 0;

  function createCredorBlock() {
    const div = document.createElement("fieldset");
    div.className = "credor-item";

    const idSuffix = Date.now() + "-" + id; // para evitar conflito e ter id único

    div.innerHTML = `
      <legend class="toggle-legend" style="cursor:pointer;">Credor (clique para expandir/recolher)</legend>

      <div class="credor-content">
        <div class="inline-label-input">
          <label>Nome do Credor:<span class="asterisco">*</span></label>
          <input type="text" name="credor_nome[]" required>
        </div>

        <div class="inline-duplo">
          <div class="inline-label-input">
            <label>CNPJ:</label>
            <input type="text" name="credor_cnpj[]" required>
          </div>
          <div class="inline-label-input">
            <label>Valor original da dívida (R$):<span class="asterisco">*</span></label>
            <input type="text" name="credor_valor[]" required placeholder="R$ 0,00">
          </div>
        </div>

        <div class="inline-duplo">
          <div class="inline-label-input">
            <label>Valor das parcelas (R$):<span class="asterisco">*</span></label>
            <input type="text" name="credor_valor_parcela[]" required placeholder="R$ 0,00">
          </div>
          <div class="inline-label-input">
            <label>Parcelas pagas:<span class="asterisco">*</span></label>
            <input type="number" name="credor_parcelas_pagas[]" min="0">
          </div>
          <div class="inline-label-input">
            <label>Parcelas restantes:<span class="asterisco">*</span></label>
            <input type="number" name="credor_parcelas_restantes[]" min="0">
          </div>
        </div>

        <div class="inline-label-input">
          <label>Tipo de dívida:<span class="asterisco">*</span></label>
          <div class="checkbox-group">
            <label><input type="checkbox" name="credor_tipo_${idSuffix}[]" value="Cartão de Crédito"> Fatura Cartão de Crédito</label>
            <label><input type="checkbox" name="credor_tipo_${idSuffix}[]" value="Empréstimo"> Empréstimo pessoal/Consignado</label>
            <label><input type="checkbox" name="credor_tipo_${idSuffix}[]" value="Financiamento"> Financiamento Veículo/Imobiliário</label>
            <label><input type="checkbox" name="credor_tipo_${idSuffix}[]" value="Outros"> Outros:</label>
            <input type="text" name="credor_tipo_outros[]" placeholder="Especifique">
          </div>
        </div>

        <div class="inline-label-input">
          <label>Com garantia:</label>
          <label><input type="radio" name="credor_garantia_${idSuffix}" value="Sim"> Sim</label>
          <label><input type="radio" name="credor_garantia_${idSuffix}" value="Não"> Não</label>
          <label><input type="radio" name="credor_garantia_${idSuffix}" value="Não se aplica"> Não se aplica</label>
          <input type="text" name="credor_garantia_qual[]" placeholder="Qual?">
        </div>

        <div class="inline-label-input">
          <label>Possui processo judicial pendente? <span class="asterisco">*</span></label>
          <label><input type="radio" name="credor_processo_${idSuffix}" value="Sim"> Sim</label>
          <label><input type="radio" name="credor_processo_${idSuffix}" value="Não"> Não</label>
        </div>

        <div class="inline-label-input">
          <label>Desconto em folha ou benefício: <span class="asterisco">*</span></label>
          <label><input type="radio" name="credor_desconto_${idSuffix}" value="Sim"> Sim</label>
          <input type="number" name="credor_num_prestacoes[]" placeholder="nº prestações">
          <label><input type="radio" name="credor_desconto_${idSuffix}" value="Não"> Não</label>
          <label><input type="radio" name="credor_desconto_${idSuffix}" value="Não se aplica"> Não se aplica</label>
        </div>

        <div class="inline-label-input">
          <label>A dívida está vencida? <span class="asterisco">*</span></label>
          <label><input type="radio" name="credor_vencida_${idSuffix}" value="Sim"> Sim</label>
          <label><input type="radio" name="credor_vencida_${idSuffix}" value="Não"> Não</label>
        </div>

        <div class="inline-label-input">
          <label>Tentou renegociar? <span class="asterisco">*</span></label>
          <label><input type="radio" name="credor_renegociacao_${idSuffix}" value="Sim"> Sim</label>
          <label><input type="radio" name="credor_renegociacao_${idSuffix}" value="Não"> Não</label>
        </div>

        <div class="inline-label-input">
          <label>Como tentou renegociar? <span class="asterisco">*</span></label>
          <div class="checkbox-group">
            <label><input type="checkbox" name="credor_como_${idSuffix}[]" value="Próprio credor"> Próprio credor</label>
            <label><input type="checkbox" name="credor_como_${idSuffix}[]" value="Defensoria Pública"> Defensoria Pública</label>
            <label><input type="checkbox" name="credor_como_${idSuffix}[]" value="Advogado"> Advogado</label>
            <label><input type="checkbox" name="credor_como_${idSuffix}[]" value="Juizado Especial"> Juizado Especial Cível</label>
          </div>
        </div>

        <div class="inline-label-input">
          <label>Recebeu cópia do contrato? <span class="asterisco">*</span></label>
          <label><input type="radio" name="credor_contrato_${idSuffix}" value="Sim"> Sim</label>
          <label><input type="radio" name="credor_contrato_${idSuffix}" value="Não"> Não</label>
          <label><input type="radio" name="credor_contrato_${idSuffix}" value="Não se aplica"> Não se aplica</label>
          <label><input type="radio" name="credor_contrato_quando_${idSuffix}" value="Antes"> Antes de assinar</label>
          <label><input type="radio" name="credor_contrato_quando_${idSuffix}" value="Depois"> Depois de assinar</label>
        </div>

        <div class="inline-label-input">
          <label>Estava em cadastro de inadimplentes ao contratar? <span class="asterisco">*</span></label>
          <label><input type="radio" name="credor_inadimplente_${idSuffix}" value="Sim"> Sim</label>
          <label><input type="radio" name="credor_inadimplente_${idSuffix}" value="Não"> Não</label>
        </div>

        <button type="button" class="remove-btn">Remover Credor</button>
      </div>
    `;

    // Incrementa o ID para o próximo bloco
    id++;

    // Botão de remover credor
    div.querySelector(".remove-btn").addEventListener("click", () => {
      container.removeChild(div);
    });

    // Colapsar / Expandir
    const legend = div.querySelector("legend");
    const content = div.querySelector(".credor-content");
    content.style.display = "block"; // inicial aberto

    legend.addEventListener("click", () => {
      if (content.style.display === "none") {
        content.style.display = "block";
        legend.textContent = "Credor (clique para expandir/recolher)";
      } else {
        content.style.display = "none";
        legend.textContent = "Credor (clique para expandir/recolher) ▼";
      }
    });

    container.appendChild(div);
  }

  // Adiciona dinamicamente novos credores
  addBtn.addEventListener("click", () => {
    createCredorBlock();
  });

  // Cria o primeiro credor por padrão
  createCredorBlock();
});
