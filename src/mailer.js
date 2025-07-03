import nodemailer from "nodemailer";
import { registrarLog } from "./logger.js";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

function escapeHtml(text) {
  return text
    ? String(text).replace(
        /[&<>"']/g,
        (m) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          }[m])
      )
    : "";
}

const parseMoney = (v) => {
  if (!v) return 0;
  let s = String(v).trim();
  s = s.replace(/\./g, "").replace(",", ".");
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
};

export async function sendForm(req, res) {
  const dados = req.body;

  const getField = (key, i = 0) =>
    Array.isArray(dados[key]) ? dados[key][i] || "" : dados[key] || "";

  const getArrayField = (key) => {
    const v = dados[key];
    return !v ? [] : Array.isArray(v) ? v : [v];
  };

  const nCredores = Array.isArray(dados.credor_nome)
    ? dados.credor_nome.length
    : 0;

  const credores = Array.from({ length: nCredores }, (_, i) => {
    const tipo = getArrayField(`credor_tipo_${i}`).join(", ");
    const como = getArrayField(`credor_como_${i}`).join(", ");

    return {
      nome: getField("credor_nome", i),
      cnpj: getField("credor_cnpj", i),
      valor: getField("credor_valor", i),
      valor_parcela: getField("credor_valor_parcela", i),
      parcelasPagas: getField("credor_parcelas_pagas", i),
      parcelasRestantes: getField("credor_parcelas_restantes", i),

      tipo_divida: tipo,
      tipo_divida_outros: getField("credor_tipo_outros", i),

      garantia: getField(`credor_garantia_${i}`) || "",
      garantia_qual: getField("credor_garantia_qual", i),

      processo_judicial: getField(`credor_processo_${i}`) || "",

      desconto_folha: getField(`credor_desconto_${i}`) || "",
      num_prestacoes: getField("credor_num_prestacoes", i),

      divida_vencida: getField(`credor_vencida_${i}`) || "",

      renegociou: getField(`credor_renegociacao_${i}`) || "",
      como_renegociou: como,

      recebeu_contrato: getField(`credor_contrato_${i}`) || "",
      contrato_quando: getField(`credor_contrato_quando_${i}`) || "",

      inadimplente_contratacao: getField(`credor_inadimplente_${i}`) || "",
    };
  });

  const causas = getArrayField("causas");

  const despesas = [
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
  ];

  const totalDespesas = despesas.reduce((tot, [, v]) => tot + parseMoney(v), 0);

  const rendaLiquida =
    parseFloat((dados.renda_liquida || "0").replace(",", ".")) || 0;
  const comprometido =
    parseFloat(
      String(dados.comprometimento_mensal || "0").replace(/[^\d.-]/g, "")
    ) || 0;
  const percComprometido =
    rendaLiquida > 0 ? (comprometido / rendaLiquida) * 100 : 0;

  let situacao = "Em situação regular";
  if (percComprometido > 30 || totalDespesas > rendaLiquida) {
    situacao = "Superendividado";
  } else if (percComprometido >= 25 && percComprometido <= 30) {
    situacao = "Possivelmente superendividado";
  }

  const resumoIA = await gerarResumoIA(
    dados,
    totalDespesas,
    percComprometido,
    causas
  );

  const fromName = dados.nome ? dados.nome.replace(/["<>]/g, "") : "Usuário";

  const conteudoEmail = `
  <div style="font-family:Arial, sans-serif; color:#333;">
    <h2 style="color:#004085;border-bottom:2px solid #004085;">Formulário de Superendividamento</h2>

    <!-- 1. Identificação -->
    <h3 style="color:#0069d9;">1. Identificação</h3>
    <p><strong>Nome:</strong> ${escapeHtml(dados.nome)}</p>
    <p><strong>CPF:</strong> ${escapeHtml(dados.cpf)}</p>
    <p><strong>Endereço:</strong> ${escapeHtml(dados.endereco)}</p>
    <p><strong>Telefone:</strong> (${escapeHtml(
      dados.telefone_ddd
    )}) ${escapeHtml(dados.telefone_numero)}</p>
    <p><strong>Email:</strong> ${escapeHtml(dados.email)}</p>

    <!-- 2. Dados Socioeconômicos -->
    <h3 style="color:#0069d9;">2. Dados Socioeconômicos</h3>
    <p><strong>Sexo:</strong> ${escapeHtml(dados.sexo)}</p>
    <p><strong>Idade:</strong> ${escapeHtml(dados.idade)}</p>
    <p><strong>Cor/Raça:</strong> ${escapeHtml(dados.cor_raca)}</p>
    <p><strong>Nascimento:</strong> ${escapeHtml(dados.data_nascimento)}</p>
    <p><strong>Profissão:</strong> ${escapeHtml(dados.profissao)}</p>
    <p><strong>Situação:</strong> ${escapeHtml(dados.situacao)}</p>
    <p><strong>Empresa/Órgão:</strong> ${escapeHtml(dados.empresa_orgao)}</p>
    <p><strong>Estado Civil:</strong> ${escapeHtml(dados.estado_civil)}</p>
    <p><strong>Dependentes:</strong> ${escapeHtml(dados.numero_dependentes)}</p>
    <p><strong>Renda Bruta:</strong> R$ ${escapeHtml(dados.renda_bruta)}</p>
    <p><strong>Renda Líquida:</strong> R$ ${escapeHtml(dados.renda_liquida)}</p>
    <p><strong>Renda Familiar:</strong> R$ ${escapeHtml(
      dados.renda_familiar
    )}</p>

    <!-- 3. Despesas -->
    <h3 style="color:#0069d9;">3. Despesas Mensais</h3>
    <table style="width:100%; border-collapse:collapse;">
      <tbody>
        ${despesas
          .map(
            ([d, v]) =>
              `<tr><td><strong>${escapeHtml(
                d
              )}:</strong></td><td>R$ ${escapeHtml(v || "0,00")}</td></tr>`
          )
          .join("")}
        <tr><td><strong>Total:</strong></td><td><strong>R$ ${totalDespesas.toFixed(
          2
        )}</strong></td></tr>
      </tbody>
    </table>

    <!-- 4. Situação -->
    <h3 style="color:#0069d9;">4. Situação de Endividamento</h3>
    <p><strong>Casa própria:</strong> ${escapeHtml(dados.casa_propria)}</p>
    <p><strong>Montante da dívida:</strong> R$ ${escapeHtml(
      dados.divida_total
    )}</p>
    <p><strong>Comprometimento mensal:</strong> R$ ${escapeHtml(
      dados.comprometimento_mensal
    )}</p>
    <p><strong>Nº credores:</strong> ${escapeHtml(dados.numero_credores)}</p>
    <p><strong>Nº dívidas:</strong> ${escapeHtml(dados.numero_dividas)}</p>
    <p><strong>Causas:</strong> ${escapeHtml(causas.join(", "))}</p>
    <p><strong>Cadastros de inadimplência:</strong> ${escapeHtml(
      dados.cadastro_inadimplente
    )}</p>
    <p><strong>Valor possível de pagar:</strong> R$ ${escapeHtml(
      dados.valor_possivel_pagar
    )}</p>

    <!-- 5. Credores -->
    <h3 style="color:#0069d9;">5. Mapa dos Credores</h3>
    ${credores
      .map(
        (c, i) => `
      <fieldset style="border:1px solid #ccc;padding:10px;margin-bottom:15px;">
        <legend style="font-weight:bold;">Credor ${i + 1}</legend>
        <p><strong>Nome:</strong> ${escapeHtml(c.nome)}</p>
        <p><strong>CNPJ:</strong> ${escapeHtml(c.cnpj)}</p>
        <p><strong>Valor Original:</strong> R$ ${escapeHtml(c.valor)}</p>
        <p><strong>Valor Parcela:</strong> R$ ${escapeHtml(c.valor_parcela)}</p>
        <p><strong>Parcelas Pagas:</strong> ${escapeHtml(c.parcelasPagas)}</p>
        <p><strong>Parcelas Restantes:</strong> ${escapeHtml(
          c.parcelasRestantes
        )}</p>
        <p><strong>Tipo:</strong> ${escapeHtml(c.tipo_divida)}</p>
        ${
          c.tipo_divida_outros
            ? `<p><strong>Outros:</strong> ${escapeHtml(
                c.tipo_divida_outros
              )}</p>`
            : ""
        }
        <p><strong>Com Garantia:</strong> ${escapeHtml(c.garantia)}</p>
        ${
          c.garantia_qual
            ? `<p><strong>Qual:</strong> ${escapeHtml(c.garantia_qual)}</p>`
            : ""
        }
        <p><strong>Processo Judicial:</strong> ${escapeHtml(
          c.processo_judicial
        )}</p>
        <p><strong>Desconto em folha:</strong> ${escapeHtml(
          c.desconto_folha
        )}</p>
        ${
          c.num_prestacoes
            ? `<p><strong>Nº Prestações:</strong> ${escapeHtml(
                c.num_prestacoes
              )}</p>`
            : ""
        }
        <p><strong>Dívida vencida:</strong> ${escapeHtml(c.divida_vencida)}</p>
        <p><strong>Renegociou:</strong> ${escapeHtml(c.renegociou)}</p>
        ${
          c.como_renegociou
            ? `<p><strong>Como:</strong> ${escapeHtml(c.como_renegociou)}</p>`
            : ""
        }
        <p><strong>Recebeu contrato:</strong> ${escapeHtml(
          c.recebeu_contrato
        )}</p>
        ${
          c.contrato_quando
            ? `<p><strong>Quando:</strong> ${escapeHtml(c.contrato_quando)}</p>`
            : ""
        }
        <p><strong>Inadimplente na contratação:</strong> ${escapeHtml(
          c.inadimplente_contratacao
        )}</p>
      </fieldset>`
      )
      .join("")}

    <h3 style="color:#0069d9;">6. Resumo Final</h3>
    ${resumoIA}
  </div>
  `;

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
      from: `"${fromName} - NAS" <superendividamento@procon.es.gov.br>`,
      to: "joao.bispo@procon.es.gov.br",
      subject: `Formulário de Superendividamento – ${fromName}`,
      headers: {
        "Content-Type": "text/html; charset=UTF-8",
      },
      html: conteudoEmail,
    });

    res.render("sent", { title: "Formulário enviado" });
  } catch (err) {
    registrarLog("ERRO", `Falha ao enviar e-mail: ${err.message}`);
    res.status(500).send("Erro ao enviar e-mail.");
  }
}

async function gerarResumoIA(
  dados,
  totalDespesas,
  percComprometido,
  causasArray
) {
  const prompt = `
Você é um assistente financeiro que deve gerar um resumo, com base na Lei 14.181/2021, claro e objetivo sobre a situação de superendividamento do consumidor, com base nos seguintes dados:

- Renda líquida mensal: R$ ${dados.renda_liquida || "0,00"}
- Total de despesas mensais: R$ ${totalDespesas.toFixed(2)}
- Percentual da renda comprometida com dívidas: ${percComprometido.toFixed(1)}%
- Número de credores: ${dados.numero_credores || 0}
- Número de dívidas: ${dados.numero_dividas || 0}
- Outras informações relevantes: causas das dívidas são "${causasArray.join(
    ", "
  )}".
---

Não adicione caracteres especiais, deve ser em html por vai ir para um email. O resumo deve ser claro, objetivo e fácil de entender, evitando jargões financeiros complexos. Foque nos seguintes pontos:
- Situação financeira atual do consumidor;
- Principais causas do superendividamento;
- Recomendações gerais para lidar com a situação;
- Sugestões de ações imediatas que o consumidor pode tomar.

Resumo deve ser escrito em português.
Não precisa volta bloco de código, apenas o texto do resumo em HTML. Sem titulo, apenas paragrafos e listas, se necessário.
Adicione aviso que não se deve confiar 100% na IA, e que é recomendável consultar um advogado ou especialista em finanças para uma análise mais detalhada e personalizada da situação do consumidor.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "Você é um assistente financeiro experiente e objetivo.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 4000,
      temperature: 1.0,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    registrarLog("ERRO", `Erro ao gerar resumo IA: ${error.message}`);
    return "Resumo financeiro indisponível no momento.";
  }
}
