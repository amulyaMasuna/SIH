const nodemailer = require("nodemailer");

async function sendEmail(to, subject, html) {
  if(!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("Email envs are not available.");
    return;
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: {
      user,
      pass,
    }
  })

  await transporter.sendMail({
    from, to, subject, html
  })
}

module.exports = sendEmail;