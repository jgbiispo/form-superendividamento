import nodemailer from "nodemailer";

export async function sendForm(req, res) {
  const dados = req.body;

  console.log("Dados recebidos:", dados);

  const credores = Array.isArray(dados["credor-nome"])
    ? dados["credor-nome"].map((_, i) => ({
        nome: dados["credor-nome"][i],
        cnpj: dados["credor-cnpj"][i],
        valor: dados["credor-valor"][i],
        parcelas: dados["credor-parcelas"][i],
      }))
    : [
        {
          nome: dados["credor-nome"],
          cnpj: dados["credor-cnpj"],
          valor: dados["credor-valor"],
          parcelas: dados["credor-parcelas"],
        },
      ];

  const conteudoEmail = `
    <h2>Formulário de Superendividamento</h2>
    <p><strong>Nome:</strong> ${dados.nome}</p>
    <p><strong>CPF:</strong> ${dados.cpf}</p>
    <p><strong>Email:</strong> ${dados.email}</p>
    <h3>Credores:</h3>
    <ul>
      ${credores
        .map(
          (c) =>
            `<li>${c.nome} (CNPJ: ${c.cnpj}) - R$${c.valor} em ${c.parcelas}x</li>`
        )
        .join("")}
    </ul>
  `;

  // Configuração do Nodemailer
  const transporter = nodemailer.createTransport({
    host: "procon.correio.es.gov.br",
    port: 587,
    secure: false,
    auth: {
      user: "superendividamento@procon.es.gov.br",
      pass: "@Procon123", // adicionar no .env depois
    },
  });

  // Envio do e-mail
  try {
    await transporter.sendMail({
      from: '"Formulário PROCON" <superendividamento@procon.es.gov.br>',
      to: "joao.bispo@procon.es.gov.br",
      subject: "Novo Formulário de Superendividamento",
      html: conteudoEmail,
    });

    res.send("Formulário enviado com sucesso!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao enviar e-mail.");
  }
}
