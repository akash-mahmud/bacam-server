import 'module-alias/register'


import main from "./main";

main().then(async({start})=> {
await start()
}) .catch((error) => {
  console.error(error);
}) .finally(async () => {
  
  console.log('Final');
  
});;
