import { createTransport } from "nodemailer";
import sanitizeHtml from "sanitize-html";
import { ApiError } from "./../src/ApiError";
require("dotenv").config();

function getTransporter() {
  return createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_ADRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

const transport = getTransporter();

async function sendMail(options) {
  try {
    await transport.sendMail(options);
    return { success: true };
  } catch (error) {
    throw new Error(error?.message);
  }
}
const from = `Nastya Lytvyn - ${process.env.EMAIL_ADRESS}`;
async function formSubmit(formData) {
  let html = "";
  for (const option in formData) {
    html += option + " : " + formData[option] + "<br/>";
  }
  return sendMail({
    from,
    to: process.env.EMAIL_TO_USER,
    subject: "New form submision",
    html: sanitizeHtml(html),
  });
}

const history = new Map();
const rateLimit = (ip, limit = 3) => {
  const count = history.get(ip) || 0;
  if (count > limit) {
    throw ApiError.RateLimitError();
  }
  history.set(ip, count + 1);
};

const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameValid = /[a-zA-ZЁёА-я]+$/;

const validate = (body) => {
  const { email, name, password, confirmPassword } = body;
  if (!email || !name || !password || !confirmPassword) {
    throw ApiError.ValidationError("Empty fields");
  }
  if (!emailValid.test(email)) {
    throw ApiError.ValidationError("Email not valid");
  }
  if (!nameValid.test(name)) {
    throw ApiError.ValidationError("Name not valid");
  }
  if (password !== confirmPassword) {
    throw ApiError.ValidationError("Password doesn`t match");
  }
};

module.exports = async (req, res) => {
  try {
    rateLimit(req.headers["x-real-ip"], 1);
    validate(req.body);
    const result = await formSubmit(req.body);
    return res.json({ result });
  } catch (e) {
    return res.status(e.status).json({
      status: e.status,
      errors: [e.message],
      result: {
        success: false,
      },
    });
  }
};
