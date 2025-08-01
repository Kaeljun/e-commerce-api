requirements:
have nodejs installed
create .env with the following secrets and fill with your own values:
REFRESH_TOKEN_SECRET="blablabla"
ACCESS_TOKEN_SECRET="blablablabla"

run the project with:
npm install
npx tsc
npm start

ajuste seu endereço IP no Front
src/services/api.service.ts:
![alt text](image.png)
