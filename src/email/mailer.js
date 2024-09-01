


const nodemailer = require("nodemailer")
const mg = require("nodemailer-mailgun-transport")
const handlebars = require("handlebars")
const fs = require("fs")
const path = require("path")
// const { MAILGUN_AUTHORIZED_DOMAIN, MAILGUN_API_KEY } = require("../constants/secret")



class Mailer {

  constructor(user, password) {
    this.emailContent = '';

    this.mailOptions = {
      from: "wel@economy.org",
      to: "recipient@domain",
      subject: "EMAIL SUBJECT LINE",
    }
    // this.mailgunAuth = {
    //   auth: {
    //     api_key: api,
    //     domain: domain
    //   }
    // }
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user:user,
        pass: password,
      },
      secure: true,
       
      tls: {
        rejectUnauthorized: false, // this will allow the avatar to show in the email sent by the sender
      },
    });
    // this.transporter = nodemailer.createTransport(mg({
    //   auth: {
    //     // api_key: '971380c8775ea65428fac94bd583cae1-451410ff-71cc0869',
    //     // domain: 'sandbox24f8699cb13048589522a03e0c5851a8.mailgun.org'
    //     api_key: api,
    //     domain: domain
    //   }
    // }))

  }




prepareTemplate({name, type ='html', templateVariables={}}){
  const loadedHbs = fs.readFileSync(path.join(__dirname,'template', name), "utf8")
  const template = handlebars.compile(loadedHbs)

  this.emailContent = template({...templateVariables})

}



  sendMail(mailOptions) {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail({
        ...this.mailOptions,
      ...mailOptions,
      html:this.emailContent
      }, (err, info) => {
        if (err){
          console.log(err.message);
          reject(err)};

        resolve(info);
      });
    });
  }

  close() {
    return this.transporter.close();
  }
}

module.exports ={
  Mailer
}