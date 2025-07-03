import nodemailer from "nodemailer";
import { registrarLog } from "./logger.js";

export async function sendForm(req, res) {
  const dados = req.body;

  // Número de credores
  const qtdCredores = Array.isArray(dados["credor_nome"])
    ? dados["credor_nome"].length
    : 0;

  // Montar array de credores com todos os campos
  const credores = [];

  for (let i = 0; i < qtdCredores; i++) {
    // Pegando checkbox que vem como string ou array, normalizando em string
    // Exemplo: tipo de dívida (checkbox múltipla)
    let tipoDivida = [];
    // Como os nomes são dinâmicos tipo: credor_tipo_0[], credor_tipo_1[], ...
    // o req.body vai ter as chaves: credor_tipo_0, credor_tipo_1 ...
    // Porém, se foi checkbox, deve vir como array ou string
    const tipoChave = `credor_tipo_${i}`;
    if (dados[tipoChave]) {
      if (Array.isArray(dados[tipoChave])) tipoDivida = dados[tipoChave];
      else tipoDivida = [dados[tipoChave]];
    }

    let comoRenegociou = [];
    const comoChave = `credor_como_${i}`;
    if (dados[comoChave]) {
      if (Array.isArray(dados[comoChave])) comoRenegociou = dados[comoChave];
      else comoRenegociou = [dados[comoChave]];
    }

    credores.push({
      nome: dados["credor_nome"][i] || "",
      cnpj: dados["credor_cnpj"][i] || "",
      valor: dados["credor_valor"][i] || "",
      valor_parcela: dados["credor_valor_parcela"][i] || "",
      parcelasPagas: dados["credor_parcelas_pagas"][i] || "",
      parcelasRestantes: dados["credor_parcelas_restantes"][i] || "",

      tipo_divida: tipoDivida.join(", "),
      tipo_divida_outros: dados["credor_tipo_outros"]?.[i] || "",

      garantia: dados[`credor_garantia_${i}`] || "",
      garantia_qual: dados["credor_garantia_qual"]?.[i] || "",

      processo_judicial: dados[`credor_processo_${i}`] || "",

      desconto_folha: dados[`credor_desconto_${i}`] || "",
      num_prestacoes: dados["credor_num_prestacoes"]?.[i] || "",

      divida_vencida: dados[`credor_vencida_${i}`] || "",

      renegociou: dados[`credor_renegociacao_${i}`] || "",
      como_renegociou: comoRenegociou.join(", "),

      recebeu_contrato: dados[`credor_contrato_${i}`] || "",
      contrato_quando: dados[`credor_contrato_quando_${i}`] || "",

      inadimplente_contratacao: dados[`credor_inadimplente_${i}`] || "",
    });
  }

  // Causas checkbox
  const causas = Array.isArray(dados.causas)
    ? dados.causas.join(", ")
    : dados.causas || "";

  const despensaTotal = [
    dados.despesa_luz,
    dados.despesa_agua,
    dados.despesa_telefone_internet,
    dados.despesa_aluguel,
    dados.despesa_condominio,
    dados.despesa_medicamentos,
    dados.despesa_alimentacao,
    dados.despesa_gas,
    dados.despesa_plano_saude,
    dados.despesa_educacao,
    dados.despesa_pensao_alimenticia,
    dados.despesa_impostos,
    dados.despesa_outras,
  ].reduce((total, valor) => {
    const numValor = parseFloat(valor) || 0;
    return total + numValor;
  }, 0);

  // Montar corpo do e-mail
  const conteudoEmail = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #004085; border-bottom: 2px solid #004085; padding-bottom: 4px;">Formulário de Superendividamento</h2>

    <h3 style="color: #0069d9;">1. Identificação</h3>
    <p><strong>Nome:</strong> ${dados.nome}</p>
    <p><strong>CPF:</strong> ${dados.cpf}</p>
    <p><strong>Endereço:</strong> ${dados.endereco}</p>
    <p><strong>Telefone:</strong> (${dados.telefone_ddd}) ${
    dados.telefone_numero
  }</p>
    <p><strong>Email:</strong> ${dados.email}</p>

    <h3 style="color: #0069d9;">2. Dados Socioeconômicos</h3>
    <p><strong>Sexo:</strong> ${dados.sexo}</p>
    <p><strong>Idade:</strong> ${dados.idade}</p>
    <p><strong>Cor/Raça:</strong> ${dados.cor_raca}</p>
    <p><strong>Data de Nascimento:</strong> ${dados.data_nascimento}</p>
    <p><strong>Profissão:</strong> ${dados.profissao}</p>
    <p><strong>Situação:</strong> ${dados.situacao}</p>
    <p><strong>Empresa/Órgão:</strong> ${dados.empresa_orgao}</p>
    <p><strong>Estado Civil:</strong> ${dados.estado_civil}</p>
    <p><strong>Número de Dependentes:</strong> ${dados.numero_dependentes}</p>
    <p><strong>Renda Bruta:</strong> R$ ${dados.renda_bruta}</p>
    <p><strong>Renda Líquida:</strong> R$ ${dados.renda_liquida}</p>
    <p><strong>Renda Familiar:</strong> R$ ${dados.renda_familiar}</p>

    <h3 style="color: #0069d9;">3. Despesas Mensais</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tbody>
        ${[
          ["Luz", dados.despesa_luz],
          ["Água", dados.despesa_agua],
          ["Telefone/Internet", dados.despesa_telefone_internet],
          ["Aluguel", dados.despesa_aluguel],
          ["Condomínio", dados.despesa_condominio],
          ["Medicamentos", dados.despesa_medicamentos],
          ["Alimentação", dados.despesa_alimentacao],
          ["Gás", dados.despesa_gas],
          ["Plano de Saúde", dados.despesa_plano_saude],
          ["Educação", dados.despesa_educacao],
          ["Pensão Alimentícia", dados.despesa_pensao_alimenticia],
          ["Impostos", dados.despesa_impostos],
          ["Outras", dados.despesa_outras],
          ["Total de Despesas", despensaTotal.toFixed(2)],
        ]
          .map(
            ([desc, valor]) => `
            <tr style="border-bottom: 1px solid #ccc;">
              <td><strong>${desc}:</strong></td>
              <td>R$ ${valor || "0"}</td>
            </tr>
          `
          )
          .join("")}
      </tbody>
    </table>

    <h3 style="color: #0069d9;">4. Situação de Endividamento</h3>
    <p><strong>Casa própria:</strong> ${dados.casa_propria}</p>
    <p><strong>Montante da dívida:</strong> R$ ${dados.divida_total}</p>
    <p><strong>Comprometimento mensal:</strong> ${
      dados.comprometimento_mensal
    }</p>
    <p><strong>Número de credores:</strong> ${dados.numero_credores}</p>
    <p><strong>Número de dívidas:</strong> ${dados.numero_dividas}</p>
    <p><strong>Causas:</strong> ${causas}</p>
    <p><strong>Está em cadastros de inadimplentes?:</strong> ${
      dados.cadastro_inadimplente
    }</p>
    <p><strong>Valor possível de pagar:</strong> R$ ${
      dados.valor_possivel_pagar
    }</p>

    <h3 style="color: #0069d9;">5. Mapa dos Credores</h3>
    ${credores
      .map(
        (c, i) => `
      <fieldset style="margin-bottom: 20px; padding: 15px; border: 1px solid #ccc; border-radius: 5px;">
        <legend style="font-weight: bold; color: #333;">Credor ${i + 1}</legend>
        <p><strong>Nome:</strong> ${c.nome}</p>
        <p><strong>CNPJ:</strong> ${c.cnpj}</p>
        <p><strong>Valor original:</strong> R$ ${c.valor}</p>
        <p><strong>Valor da parcela:</strong> R$ ${c.valor_parcela}</p>
        <p><strong>Parcelas pagas:</strong> ${c.parcelasPagas}</p>
        <p><strong>Parcelas restantes:</strong> ${c.parcelasRestantes}</p>
        <p><strong>Tipo de dívida:</strong> ${c.tipo_divida}</p>
        ${
          c.tipo_divida_outros
            ? `<p><strong>Outros (tipo):</strong> ${c.tipo_divida_outros}</p>`
            : ""
        }
        <p><strong>Com garantia:</strong> ${c.garantia}</p>
        ${
          c.garantia_qual
            ? `<p><strong>Qual garantia:</strong> ${c.garantia_qual}</p>`
            : ""
        }
        <p><strong>Processo judicial:</strong> ${c.processo_judicial}</p>
        <p><strong>Desconto em folha:</strong> ${c.desconto_folha}</p>
        ${
          c.num_prestacoes
            ? `<p><strong>Nº de prestações:</strong> ${c.num_prestacoes}</p>`
            : ""
        }
        <p><strong>Dívida vencida:</strong> ${c.divida_vencida}</p>
        <p><strong>Renegociou:</strong> ${c.renegociou}</p>
        ${
          c.como_renegociou
            ? `<p><strong>Como renegociou:</strong> ${c.como_renegociou}</p>`
            : ""
        }
        <p><strong>Recebeu cópia do contrato:</strong> ${c.recebeu_contrato}</p>
        ${
          c.contrato_quando
            ? `<p><strong>Quando:</strong> ${c.contrato_quando}</p>`
            : ""
        }
        <p><strong>Estava inadimplente na contratação:</strong> ${
          c.inadimplente_contratacao
        }</p>
      </fieldset>
    `
      )
      .join("")}
  </div>
`;

  // Nodemailer
  const transporter = nodemailer.createTransport({
    host: "procon.correio.es.gov.br",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${dados.nome} - NAS" <superendividamento@procon.es.gov.br>`,
      to: "joao.bispo@procon.es.gov.br",
      subject: `Formulário de Superendividamento - ${dados.nome}`,
      html: conteudoEmail,
    });

    res.render("sent", { title: "Formulário Enviado" });
  } catch (err) {
    registrarLog("ERRO", `Falha ao enviar e-mail: ${err.message}`);
    res.status(500).send("Erro ao enviar e-mail.");
  }
}
