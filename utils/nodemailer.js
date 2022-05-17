nodemailer = require('nodemailer');
/*
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'youremail@gmail.com',
      pass: 'yourpassword'
    }
  });
*/
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'augustus.daniel89@ethereal.email',
        pass: 'Gkj47HDrgtuWeh7mkq'
    }
});
module.exports = {nodemailer, transporter}