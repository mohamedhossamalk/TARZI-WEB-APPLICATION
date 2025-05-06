const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // إنشاء ناقل
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465', // true للمنفذ 465، false للمنافذ الأخرى
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // إعداد خيارات البريد الإلكتروني
  const emailOptions = {
    from: `${process.env.EMAIL_FROM} <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  // إرسال البريد الإلكتروني
  const info = await transporter.sendMail(emailOptions);

  console.log(`تم إرسال البريد الإلكتروني: ${info.messageId}`);
};

module.exports = sendEmail;