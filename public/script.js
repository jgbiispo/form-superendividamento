import nodemailer from "nodemailer";

export async function sendForm(req, res) {
  const dados = req.body;

  // Etapa 1: Identificar quantidade de credores
  const nomesCredores = dados["credor_nome[]"];
  const totalCredores = Array.isArray(nomesCredores)
    ? nomesCredores.length
    : nomesCredores
    ? 1
    : 0;

  // Etapa 2: Agrupar os campos dinâmicos por índice
  const credores = [];

  for (let i = 0; i < totalCredores; i++) {
    const credor = {
      nome: getValue(dados["credor_nome[]"], i),
      cnpj: getValue(dados["credor_cnpj[]"], i),
      valor: getValue(dados["credor_valor[]"], i),
      valor_parcela: getValue(dados["credor_valor_parcela[]"], i),
      parcelas_pagas: getValue(dados["credor_parcelas_pagas[]"], i),
      parcelas_restantes: getValue(dados["credor_parcelas_restantes[]"], i),
      tipo_outros: getValue(dados["credor_tipo_outros[]"], i),
      num_prestacoes: getValue(dados["credor_num_prestacoes[]"], i),
      garantia_qual: getValue(dados["credor_garantia_qual[]"], i),
    };

    // Etapa 3: Capturar campos com nomes dinâmicos via sufixo (ex: credor_tipo_1234[])
    const chaves = Object.keys(dados);
    const tipos = [];
    let garantia = "";
    let processo = "";
    let desconto = "";
    let vencida = "";
    let renegociacao = "";
    let como_renegociou = [];
    let contrato = "";
    let contrato_quando = "";
    let inadimplente = "";

    for (let key of chaves) {
      if (key.startsWith("credor_tipo_") && Array.isArray(dados[key]))
        tipos.push(...dados[key]);
      if (key.startsWith("credor_garantia_")) garantia = dados[key];
      if (key.startsWith("credor_processo_")) processo = dados[key];
      if (key.startsWith("credor_desconto_")) desconto = dados[key];
      if (key.startsWith("credor_vencida_")) vencida = dados[key];
      if (key.startsWith("credor_renegociacao_")) renegociacao = dados[key];
      if (key.startsWith("credor_como_") && Array.isArray(dados[key]))
        como_renegociou.push(...dados[key]);
      if (key.startsWith("credor_contrato_") && !key.includes("quando"))
        contrato = dados[key];
      if (key.startsWith("credor_contrato_quando_"))
        contrato_quando = dados[key];
      if (key.startsWith("credor_inadimplente_")) inadimplente = dados[key];
    }

    credor.tipo = tipos;
    credor.garantia = garantia;
    credor.processo = processo;
    credor.desconto = desconto;
    credor.vencida = vencida;
    credor.renegociacao = renegociacao;
    credor.como = como_renegociou;
    credor.contrato = contrato;
    credor.contrato_quando = contrato_quando;
    credor.inadimplente = inadimplente;

    credores.push(credor);
  }

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
    <p><strong>Data de nascimento:</strong> ${dados.data_nascimento}</p>
    <p><strong>Profissão:</strong> ${dados.profissao}</p>
    <p><strong>Situação:</strong> ${dados.situacao}</p>
    <p><strong>Empresa/Órgão:</strong> ${dados.empresa_orgao}</p>
    <p><strong>Estado Civil:</strong> ${dados.estado_civil}</p>
    <p><strong>Nº de Dependentes:</strong> ${dados.numero_dependentes}</p>
    <p><strong>Renda Bruta:</strong> ${dados.renda_bruta}</p>
    <p><strong>Renda Líquida:</strong> ${dados.renda_liquida}</p>
    <p><strong>Renda Familiar:</strong> ${dados.renda_familiar}</p>

    <h3>4 - Mapa dos Credores</h3>
    ${credores
      .map(
        (c, i) => `
      <h4>Credor ${i + 1}</h4>
      <ul>
        <li><strong>Nome:</strong> ${c.nome}</li>
        <li><strong>CNPJ:</strong> ${c.cnpj}</li>
        <li><strong>Valor original:</strong> ${c.valor}</li>
        <li><strong>Valor da parcela:</strong> ${c.valor_parcela}</li>
        <li><strong>Parcelas pagas:</strong> ${c.parcelas_pagas}</li>
        <li><strong>Parcelas restantes:</strong> ${c.parcelas_restantes}</li>
        <li><strong>Tipo:</strong> ${c.tipo.join(", ") || "Não informado"}</li>
        <li><strong>Tipo outros:</strong> ${c.tipo_outros}</li>
        <li><strong>Com garantia:</strong> ${c.garantia} - ${
          c.garantia_qual
        }</li>
        <li><strong>Processo judicial:</strong> ${c.processo}</li>
        <li><strong>Desconto em folha:</strong> ${c.desconto} (${
          c.num_prestacoes || "0"
        } prestações)</li>
        <li><strong>Dívida vencida:</strong> ${c.vencida}</li>
        <li><strong>Tentou renegociar:</strong> ${c.renegociacao}</li>
        <li><strong>Como:</strong> ${c.como.join(", ") || "Não informado"}</li>
        <li><strong>Recebeu contrato:</strong> ${c.contrato} (${
          c.contrato_quando
        })</li>
        <li><strong>Estava inadimplente ao contratar:</strong> ${
          c.inadimplente
        }</li>
      </ul>
    `
      )
      .join("")}
  `;

  const transporter = nodemailer.createTransport({
    host: "procon.correio.es.gov.br",
    port: 587,
    secure: false,
    auth: {
      user: "superendividamento@procon.es.gov.br",
      pass: "@Procon123", // usar process.env depois
    },
  });

  try {
    await transporter.sendMail({
      from: '"Formulário PROCON" <superendividamento@procon.es.gov.br>',
      to: "joao.bispo@procon.es.gov.br",
      subject: "Novo Formulário de Superendividamento",
      html: conteudoEmail,
    });

    res.send("Formulário enviado com sucesso!");
  } catch (err) {
    console.error("Erro ao enviar e-mail:", err);
    res.status(500).send("Erro ao enviar e-mail.");
  }
}

function getValue(field, index) {
  if (Array.isArray(field)) return field[index] || "";
  return index === 0 ? field : "";
}
