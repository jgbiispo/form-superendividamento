import { Router } from "express";
import { sendForm } from "./mailer.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("form");
});

router.post("/send", sendForm);

export default router;
