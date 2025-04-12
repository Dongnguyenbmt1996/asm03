const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

module.exports = transporter;
