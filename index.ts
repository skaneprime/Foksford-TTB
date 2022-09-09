import axios from "axios";
import { config } from "dotenv";
import { WebClient } from "@slack/web-api";

interface APIUser {
  rukovoditel: string,
  sotrudniki: Record<string, {
    name: string,
    email: string,
    birthday: string,
  }>
}

config();

if (!process.env.API_POST_URL) {
  console.log("Укажите в .env API_POST_URL");
  process.exit(1);
} 

const web = new WebClient(process.env.SLACK_TOKEN);

axios.post<APIUser[]>(process.env.API_POST_URL).then(({ data }) => {
  data.forEach(async ({ rukovoditel, sotrudniki }) => {
    const { ok, user } = await web.users.lookupByEmail({ email: rukovoditel });
    
    if (!user?.id || !ok) return;
  
    const result = await web.chat.postMessage({
      channel: user.id,
      text: `${Object.values(sotrudniki).map(({ name, email, birthday }) => `У ${name} (${email}) День рождение в ${birthday}`).join('\n')}`
    });

    if (result.ok) {
      console.log(`Оповестил ${rukovoditel} о ${Object.keys(sotrudniki).length} сотрудниках`);
    } else {
      console.log(`Не смог оповестить ${rukovoditel} о др сотрудниках [Errors]:`, result.error || result.errors);  
    }
  })
}).catch(err => console.error('Ошибка в POST Запрос:', err));