const { Mailer } = require("./mailer");

const sendEmailsInBackground = async () => {
    try {
        console.time("Email sending");
        const mailerOpion = JSON.parse(process.argv[2]);
        const prepareTemplateArgs = JSON.parse(process.argv[3]);
        const credentials = JSON.parse(process.argv[4]);
        const mailer = new Mailer(credentials.user, credentials.password)
        mailer.prepareTemplate({...prepareTemplateArgs})
        await mailer.sendMail(mailerOpion);
            console.timeEnd("Email sending"); 
    } catch (error) {
        console.log(error);
    }

}


sendEmailsInBackground();