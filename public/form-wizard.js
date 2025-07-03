// Controla as etapas do formulario
let etapaAtual = 0;

// Espera o DOM carregar
window.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".form-step");
  const btnProximo = document.getElementById("btn-proximo");
  const btnVoltar = document.getElementById("btn-voltar");
  const btnEnviar = document.getElementById("btn-enviar");
  const formulario = document.getElementById("formulario");

  const mostrarEtapa = (indice) => {
    steps.forEach((s, i) => s.classList.toggle("ativo", i === indice));
    btnVoltar.style.display = indice === 0 ? "none" : "inline-block";
    btnProximo.style.display =
      indice === steps.length - 1 ? "none" : "inline-block";
    btnEnviar.style.display =
      indice === steps.length - 1 ? "inline-block" : "none";
    steps[indice].scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const validarEtapa = () => {
    const campos = steps[etapaAtual].querySelectorAll(
      "input, select, textarea"
    );
    for (let campo of campos) {
      if (campo.hasAttribute("required") && !campo.value.trim()) {
        campo.focus({ preventScroll: true });
        campo.scrollIntoView({ behavior: "smooth", block: "center" });
        campo.classList.add("erro-campo");
        return false;
      } else {
        campo.classList.remove("erro-campo");
      }
    }
    return true;
  };

  btnProximo?.addEventListener("click", () => {
    if (etapaAtual < steps.length - 1) {
      if (validarEtapa()) {
        etapaAtual++;
        mostrarEtapa(etapaAtual);
      }
    }
  });

  btnVoltar?.addEventListener("click", () => {
    if (etapaAtual > 0) {
      etapaAtual--;
      mostrarEtapa(etapaAtual);
    }
  });

  mostrarEtapa(etapaAtual);
});
