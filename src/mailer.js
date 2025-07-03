import nodemailer from 'nodemailer';

export async function sendForm(req, res) {
  const dados = req.body;

  console.log('Dados recebidos:', dados);

  const credores = Array.isArray(dados['credor_nome'])
    ? dados['credor_nome'].map((_, i) => ({
        nome: dados['credor_nome'][i],
        cnpj: dados['credor_cnpj'][i],
        valor: dados['credor_valor_parcela'][i],
        parcelas: dados['credor_parcelas_restantes'][i],
        parcelasPagas: dados['credor_parcelas_pagas'][i],
      }))
    : [
        {
          nome: dados['credor_nome'],
          cnpj: dados['credor_cnpj'],
          valor: dados['credor_valor_parcela'],
          parcelas: dados['credor_parcelas_restantes'],
          parcelasPagas: dados['credor_parcelas_pagas'][i],
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
            `<li>
            <strong>Nome:</strong> ${c.nome} <br>
            <strong>CNPJ:</strong> ${c.cnpj || 'N/A'} <br>
            <strong>Valor Original da Dívida:</strong> ${c.valor || 'N/A'} <br>
            <strong>Parcelas Pagas:</strong> ${c.parcelasPagas || '0'} <br>
            <strong>Parcelas Restantes:</strong> ${c.parcelas || '0'} <br>
          </li><br>`
        )
        .join('')}
    </ul>
  `;

  // Configuração do Nodemailer
  const transporter = nodemailer.createTransport({
    host: 'procon.correio.es.gov.br',
    port: 587,
    secure: false,
    auth: {
      user: 'superendividamento@procon.es.gov.br',
      pass: '@Procon123', // adicionar no .env depois
    },
  });

  // Envio do e-mail
  try {
    await transporter.sendMail({
      from: `"${dados.nome} - NAS" <superendividamento@procon.es.gov.br>`,
      to: 'joao.bispo@procon.es.gov.br',
      subject: `Formulário de Superendividamento - ${dados.nome}`,
      html: conteudoEmail,
    });

    res.send('Formulário enviado com sucesso!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao enviar e-mail.');
  }
}
