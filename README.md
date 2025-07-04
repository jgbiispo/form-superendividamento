# Formulário NAS - PROCON/ES

Sistema web para formulário de mapeamento de superendividados do Núcleo de Apoio ao Superendividado (NAS) do PROCON/ES.

## 📋 Sobre o Projeto

Este sistema foi desenvolvido para facilitar o processo de coleta de informações de pessoas em situação de superendividamento, permitindo que os usuários preencham um formulário estruturado em etapas e enviem os dados por email para análise.

### Funcionalidades Principais

- **Formulário Multi-etapas**: Dividido em 5 etapas para melhor organização:

  1. Identificação pessoal
  2. Dados socioeconômicos
  3. Despesas familiares
  4. Informações de endividamento
  5. Dados dos credores

- **Interface Responsiva**: Design adaptativo para diferentes dispositivos
- **Validação de Campos**: Validação em tempo real dos dados inseridos
- **Máscaras de Input**: Formatação automática para CPF, telefone e valores monetários
- **Envio por Email**: Dados enviados automaticamente via email usando Nodemailer
- **Logs de Sistema**: Registro de acessos e operações
- **Acessibilidade**: Interface desenvolvida seguindo boas práticas de acessibilidade

## 🚀 Tecnologias Utilizadas

### Backend

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **EJS** - Template engine
- **Nodemailer** - Envio de emails
- **Dotenv** - Gerenciamento de variáveis de ambiente
- **CORS** - Controle de acesso cross-origin

### Frontend

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna com Flexbox/Grid
- **JavaScript ES6+** - Interatividade e validações
- **Design Responsivo** - Compatível com dispositivos móveis

### Ferramentas de Desenvolvimento

- **Nodemon** - Desenvolvimento com hot reload
- **ESM Modules** - Módulos ES6 nativos

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Passos para instalação

1. **Clone o repositório**

```bash
git clone [URL_DO_REPOSITORIO]
cd nas-foms
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**
   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Configurações do servidor
PORT=3000

# Configurações de email (Nodemailer)
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-ou-app-password
```

4. **Inicie o servidor**

Para desenvolvimento:

```bash
npm run dev
```

Para produção:

```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`

## 🏗️ Estrutura do Projeto

```
nas-foms/
├── src/
│   ├── app.js              # Arquivo principal da aplicação
│   ├── routes.js           # Definição das rotas
│   ├── mailer.js          # Configuração do envio de emails
│   └── logger.js          # Sistema de logs
├── views/
│   ├── form.ejs           # Página principal do formulário
│   ├── sent.ejs           # Página de confirmação
│   ├── 404.ejs            # Página de erro 404
│   └── partials/          # Componentes reutilizáveis
│       ├── header.ejs
│       ├── footer.ejs
│       ├── form-identificacao.ejs
│       ├── form-socioeconomico.ejs
│       ├── form-despesas.ejs
│       ├── form-endividamento.ejs
│       └── form-credores.ejs
├── public/
│   ├── css/               # Estilos CSS
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── form.css
│   │   ├── responsive.css
│   │   └── utils.css
│   ├── script.js          # JavaScript principal
│   ├── form-wizard.js     # Navegação entre etapas
│   └── preenchimento-teste.js  # Dados de teste
├── logs/
│   └── sistema.log        # Arquivo de logs
├── package.json
├── web.config             # Configuração IIS (se necessário)
└── README.md
```

## 🔧 Configuração para Produção

### IIS (Windows Server)

O projeto inclui um arquivo `web.config` para deployment em servidores IIS com iisnode.

### Variáveis de Ambiente de Produção

Certifique-se de configurar todas as variáveis de ambiente necessárias no servidor de produção.

## 📝 Como Usar

1. **Acesse o formulário**: Navegue para a URL do sistema
2. **Preencha os dados**: Complete todas as 5 etapas do formulário
3. **Validação**: O sistema valida os dados em tempo real
4. **Envio**: Após preencher todos os campos obrigatórios, clique em "Enviar"
5. **Confirmação**: Uma página de confirmação será exibida

## 🎨 Recursos de Interface

- **Barra de Progresso**: Mostra o progresso atual no formulário
- **Validação Visual**: Campos com erro são destacados
- **Botão "Voltar ao Topo"**: Facilita a navegação em formulários longos
- **Máscaras de Input**: Formatação automática para CPF, telefone e valores
- **Design Responsivo**: Funciona em desktop, tablet e mobile

## 📊 Logs e Monitoramento

O sistema gera logs automaticamente em `logs/sistema.log` para:

- Acessos às páginas
- Envios de formulário
- Erros do sistema

## 🔒 Segurança

- Sanitização de dados de entrada
- Validação server-side
- Escape de HTML para prevenir XSS
- Configuração CORS adequada

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença ISC. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema, entre em contato com a equipe de TI do PROCON/ES.

---

**PROCON/ES** - Núcleo de Informática (NUINF)
