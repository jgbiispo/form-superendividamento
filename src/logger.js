import fs from "fs";
import path from "path";

const logDir = path.resolve("logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const logFile = path.join(logDir, "sistema.log");

/**
 * Adiciona uma linha ao arquivo de log
 * @param {string} tipo - Tipo do log (INFO, ERROR, etc.)
 * @param {string} mensagem - Mensagem principal
 * @param {object} [req] - Objeto da requisição Express (opcional)
 */
export function registrarLog(tipo = "INFO", mensagem = "", req = null) {
  const timestamp = new Date().toISOString();
  const ip =
    req?.headers?.["x-forwarded-for"]?.split(",")[0] || // Se estiver atrás de proxy
    req?.socket?.remoteAddress ||
    "IP não identificado";
  const linha = `[${timestamp}] [${tipo.toUpperCase()}] [IP: ${ip}] ${mensagem}\n`;

  fs.appendFileSync(logFile, linha, "utf-8");
}
