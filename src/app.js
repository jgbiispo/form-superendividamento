import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes.js";

const __filename = fileURLToPath(import.meta.url); // Pega o caminho do arquivo atual
const __dirname = path.dirname(__filename); // Pega o diretório do arquivo atual

const app = express();
const PORT = process.env.PORT || 3000;

//view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

//middleware
app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/", routes);

//404 handler
app.use((req, res) => {
  res.status(404).render("404", { title: "404 Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
