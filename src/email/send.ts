import Mail from "nodemailer/lib/mailer";
import { emailBackgroundFile } from "../constants/essentialPaths";
import { spawn } from "child_process";
import { GOOGLE_MAIL_APP_EMAIL, GOOGLE_MAIL_APP_PASSWORD, MAILGUN_API_KEY, MAILGUN_AUTHORIZED_DOMAIN } from "../constants/secret";
export enum EmailContentType{
    html,
    text
}
const sendEmailWithBackgroundTask =async (mailerOptions:Mail.Options , templateCreateOptions: {
    name:string, type?:EmailContentType , templateVariables:{}
}={
    name:'',
    type:EmailContentType.html, 
    templateVariables:{}
}) => {

    const childProcess = spawn("node", [
        emailBackgroundFile,
        JSON.stringify(mailerOptions),
        JSON.stringify(templateCreateOptions),
        JSON.stringify({
          user:GOOGLE_MAIL_APP_EMAIL,
          password:GOOGLE_MAIL_APP_PASSWORD
        }),
      ]);
      childProcess.stdout.on("data", (data) => {
        console.log(`child stdout:\n${data}`);
      });
    
      childProcess.stderr.on("data", (data) => {
        
        console.error(`child stderr:\n${data}`);
      });
    
      childProcess.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
      });
}


export default sendEmailWithBackgroundTask