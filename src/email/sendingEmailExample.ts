import { spawn } from "child_process";
import { emailBackgroundFile } from "../constants/essentialPaths";

export const testingSendEmail = () => {
    const childProcess = spawn("node", [
        emailBackgroundFile,
        JSON.stringify({
           subject:'This is accound activation email'
        }),
        JSON.stringify({
            name:'testername.hbs', type:'html', templateVariables:{
                message:'Hi',
                hello:'bye'
            }
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
