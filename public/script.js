document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("credores-container");
  const addBtn = document.getElementById("add-credor");

  function createCredorBlock() {
    const div = document.createElement("div");
    div.className = "credor-block";

    div.innerHTML = `
        <label>Nome do Credor: <input type="text" name="credor-nome" required></label><br>
        <label>CNPJ: <input type="text" name="credor-cnpj" required></label><br>
        <label>Valor da dívida: <input type="number" name="credor-valor" step="0.01" required></label><br>
        <label>Parcelas restantes: <input type="number" name="credor-parcelas" required></label><br>
        <button type="button" class="remove-btn">Remover Credor</button>
      `;

    div.querySelector(".remove-btn").addEventListener("click", () => {
      container.removeChild(div);
    });

    container.appendChild(div);
  }

  addBtn.addEventListener("click", () => {
    createCredorBlock();
  });

  // Adiciona um credor por padrão
  createCredorBlock();
});
