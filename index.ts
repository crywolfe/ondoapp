import axios from 'axios';
import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/roles', async (req, res) => {
    try {
      const response = await getResult()
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response, null, 2))

    } catch (err) {
      console.log(err)
    }

  });

app.listen(PORT, () => {
  console.log(`Express with Typescript! http://localhost:${PORT}`);
});


const getResult = async () => {
    const result = await axios.post('https://api.thegraph.com/subgraphs/name/crywolfe/ondo-roles', {
      query: `
      query {
        roles {
            id
            adminRole
            accounts
        }
      }`
    })

  return result.data.data
}
  