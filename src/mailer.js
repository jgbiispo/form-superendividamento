import nodemailer from "nodemailer";
import { registrarLog } from "./logger.js";

export async function sendForm(req, res) {
  const dados = req.body;

  // Credores
  const credores = Array.isArray(dados["credor_nome"])
    ? dados["credor_nome"].map((_, i) => ({
        nome: dados["credor_nome"][i],
        cnpj: dados["credor_cnpj"][i],
        valor: dados["credor_valor"][i],
        valor_parcela: dados["credor_valor_parcela"][i],
        parcelasPagas: dados["credor_parcelas_pagas"][i],
        parcelasRestantes: dados["credor_parcelas_restantes"][i],
      }))
    : [];

  // Causas checkbox
  const causas = Array.isArray(dados.causas)
    ? dados.causas.join(", ")
    : dados.causas || "";

  // Montar corpo do e-mail
  const conteudoEmail = `
    <h2>Formulário de Superendividamento</h2>

    <h3>1 - Identificação</h3>
    <p><strong>Nome:</strong> ${dados.nome}</p>
    <p><strong>CPF:</strong> ${dados.cpf}</p>
    <p><strong>Endereço:</strong> ${dados.endereco}</p>
    <p><strong>Telefone:</strong> (${dados.telefone_ddd}) ${
    dados.telefone_numero
  }</p>
    <p><strong>Email:</strong> ${dados.email}</p>

    <h3>2 - Dados Socioeconômicos</h3>
    <p><strong>Sexo:</strong> ${dados.sexo}</p>
    <p><strong>Idade:</strong> ${dados.idade}</p>
    <p><strong>Cor/Raça:</strong> ${dados.cor_raca}</p>
    <p><strong>Data de Nascimento:</strong> ${dados.data_nascimento}</p>
    <p><strong>Profissão:</strong> ${dados.profissao}</p>
    <p><strong>Situação:</strong> ${dados.situacao}</p>
    <p><strong>Empresa/Órgão:</strong> ${dados.empresa_orgao}</p>
    <p><strong>Estado Civil:</strong> ${dados.estado_civil}</p>
    <p><strong>Dependentes:</strong> ${dados.numero_dependentes}</p>
    <p><strong>Renda Bruta:</strong> ${dados.renda_bruta}</p>
    <p><strong>Renda Líquida:</strong> ${dados.renda_liquida}</p>
    <p><strong>Renda Familiar:</strong> ${dados.renda_familiar}</p>

    <h3>3 - Despesas Mensais</h3>
    <ul>
      <li>Luz: R$ ${dados.despesa_luz || "0"}</li>
      <li>Água: R$ ${dados.despesa_agua || "0"}</li>
      <li>Telefone/Internet: R$ ${dados.despesa_telefone_internet || "0"}</li>
      <li>Aluguel: R$ ${dados.despesa_aluguel || "0"}</li>
      <li>Condomínio: R$ ${dados.despesa_condominio || "0"}</li>
      <li>Medicamentos: R$ ${dados.despesa_medicamentos || "0"}</li>
      <li>Alimentação: R$ ${dados.despesa_alimentacao || "0"}</li>
      <li>Gás: R$ ${dados.despesa_gas || "0"}</li>
      <li>Plano de Saúde: R$ ${dados.despesa_plano_saude || "0"}</li>
      <li>Educação: R$ ${dados.despesa_educacao || "0"}</li>
      <li>Pensão Alimentícia: R$ ${dados.despesa_pensao_alimenticia || "0"}</li>
      <li>Impostos: R$ ${dados.despesa_impostos || "0"}</li>
      <li>Outras: R$ ${dados.despesa_outras || "0"}</li>
    </ul>

    <h3>4 - Situação de Endividamento</h3>
    <p><strong>Casa própria:</strong> ${dados.casa_propria}</p>
    <p><strong>Montante da dívida:</strong> ${dados.divida_total}</p>
    <p><strong>Comprometimento mensal:</strong> ${
      dados.comprometimento_mensal
    }</p>
    <p><strong>Número de credores:</strong> ${dados.numero_credores}</p>
    <p><strong>Número de dívidas:</strong> ${dados.numero_dividas}</p>
    <p><strong>Causas:</strong> ${causas}</p>
    <p><strong>Está em cadastros de inadimplentes?:</strong> ${
      dados.cadastro_inadimplente
    }</p>
    <p><strong>Valor possível de pagar:</strong> ${
      dados.valor_possivel_pagar
    }</p>

    <h3>5 - Mapa dos Credores</h3>
    ${credores
      .map(
        (c, i) => `
      <h4>Credor ${i + 1}</h4>
      <ul>
        <li><strong>Nome:</strong> ${c.nome}</li>
        <li><strong>CNPJ:</strong> ${c.cnpj}</li>
        <li><strong>Valor original:</strong> R$ ${c.valor}</li>
        <li><strong>Valor da parcela:</strong> R$ ${c.valor_parcela}</li>
        <li><strong>Parcelas pagas:</strong> ${c.parcelasPagas}</li>
        <li><strong>Parcelas restantes:</strong> ${c.parcelasRestantes}</li>
      </ul>
    `
      )
      .join("")}
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

    res.send("Formulário enviado com sucesso!");
  } catch (err) {
    registrarLog("ERRO", `Falha ao enviar e-mail: ${err.message}`);
    res.status(500).send("Erro ao enviar e-mail.");
  }
}
