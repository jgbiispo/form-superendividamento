window.preencherTeste = () => {
  // Identificação
  document.getElementById('nome-completo').value = 'João Teste da Silva';
  document.getElementById('cpf').value = '123.456.789-00';
  document.getElementById('endereco').value =
    'Rua Exemplo, 123, Centro, Vitória';
  document.getElementById('telefone_ddd').value = '27';
  document.getElementById('telefone_numero').value = '99999-8888';
  document.getElementById('email').value = 'teste@email.com';

  // Socioeconômico
  document.querySelector(
    'input[name="sexo"][value="Masculino"]'
  ).checked = true;
  document.getElementById('idade').value = '35';
  document.getElementById('cor-raca').value = 'Pardo';
  document.getElementById('data-nascimento').value = '1990-01-01';
  document.getElementById('profissao').value = 'Analista de Sistemas';
  document.querySelector(
    'input[name="situacao"][value="Ativo"]'
  ).checked = true;
  document.getElementById('empresa-orgao').value = 'Empresa de Teste';
  document.querySelector(
    'input[name="estado_civil"][value="Solteiro"]'
  ).checked = true;
  document.getElementById('numero-dependentes').value = '1';
  document.getElementById('renda-bruta').value = 'R$ 5.000,00';
  document.getElementById('renda-liquida').value = 'R$ 4.000,00';
  document.getElementById('renda-familiar').value = 'R$ 4.500,00';

  // Despesas
  const despesas = {
    'despesa-luz': 'R$ 150,00',
    'despesa-agua': 'R$ 80,00',
    'despesa-telefone-internet': 'R$ 120,00',
    'despesa-aluguel': 'R$ 1000,00',
    'despesa-condominio': 'R$ 250,00',
    'despesa-medicamentos': 'R$ 100,00',
    'despesa-alimentacao': 'R$ 800,00',
    'despesa-gas': 'R$ 100,00',
    'despesa-plano-saude': 'R$ 300,00',
    'despesa-educacao': 'R$ 200,00',
    'despesa-pensao-alimenticia': 'R$ 0,00',
    'despesa-impostos': 'R$ 150,00',
    'despesa-outras': 'R$ 50,00',
  };
  Object.entries(despesas).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  });

  // Endividamento
  document.querySelector(
    'input[name="casa_propria"][value="Não"]'
  ).checked = true;
  document.getElementById('divida_total').value = 'R$ 20.000,00';
  document.getElementById('comprometimento_mensal').value = 'R$ 1.200,00';
  document.getElementById('numero_credores').value = '2';
  document.getElementById('numero_dividas').value = '3';

  ['Gastou mais do que ganha', 'Desemprego'].forEach((val) => {
    const el = document.querySelector(`input[name="causas[]"][value="${val}"]`);
    if (el) el.checked = true;
  });

  document.querySelector(
    'input[name="cadastro_inadimplente"][value="Sim"]'
  ).checked = true;
  document.getElementById('valor_possivel_pagar').value = 'R$ 500,00';

  // Credores
  for (let i = 0; i < 2; i++) {
    document.getElementById('add-credor').click();
  }

  setTimeout(() => {
    document.querySelectorAll('.credor-wrapper').forEach((wrapper, index) => {
      const prefix = `credor`;

      wrapper.querySelector(
        `input[name="credor_nome[]"]`
      ).value = `Empresa Credora ${index + 1}`;
      wrapper.querySelector(
        `input[name="credor_cnpj[]"]`
      ).value = `00.000.000/000${index + 1}-00`;
      wrapper.querySelector(`input[name="credor_valor[]"]`).value =
        'R$ 10.000,00';
      wrapper.querySelector(`input[name="credor_valor_parcela[]"]`).value =
        'R$ 500,00';
      wrapper.querySelector(`input[name="credor_parcelas_pagas[]"]`).value =
        '5';
      wrapper.querySelector(`input[name="credor_parcelas_restantes[]"]`).value =
        '15';

      wrapper.querySelector(
        `input[name="credor_tipo_${index}[]"][value="Fatura Cartão de Crédito"]`
      ).checked = true;

      wrapper.querySelector(
        `input[name="credor_garantia_${index}"][value="Não se aplica"]`
      ).checked = true;
      wrapper.querySelector(
        `input[name="credor_processo_${index}"][value="Não"]`
      ).checked = true;
      wrapper.querySelector(
        `input[name="credor_desconto_${index}"][value="Não"]`
      ).checked = true;
      wrapper.querySelector(
        `input[name="credor_vencida_${index}"][value="Sim"]`
      ).checked = true;
      wrapper.querySelector(
        `input[name="credor_renegociacao_${index}"][value="Sim"]`
      ).checked = true;

      ['Próprio credor', 'Defensoria Pública'].forEach((v) => {
        wrapper.querySelector(
          `input[name="credor_como_${index}[]"][value="${v}"]`
        ).checked = true;
      });

      wrapper.querySelector(
        `input[name="credor_contrato_${index}"][value="Sim"]`
      ).checked = true;
      wrapper.querySelector(
        `input[name="credor_contrato_quando_${index}"][value="Depois"]`
      ).checked = true;
      wrapper.querySelector(
        `input[name="credor_inadimplente_${index}"][value="Sim"]`
      ).checked = true;
    });
  }, 500); // espera os campos renderizarem
};
