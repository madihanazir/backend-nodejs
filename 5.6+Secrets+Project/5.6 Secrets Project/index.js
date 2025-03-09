// HINTS:
// 1. Import express and axios
import express from 'express';
import axios from 'axios';

// 2. Create an express app and set the port number.
const app = express();
const port = 3000;
// 3. Use the public folder for static files.
app.use(express.static('public'));

// 4. When the user goes to the home page it should render the index.ejs file.
app.get('/', async (req, res) => {
    
try{
  const { data } = await axios.get('https://api.chucknorris.io/jokes/random');
  res.render('index.ejs', { secret: data.value, username: 'koko' });
} catch (error) {
    console.log(error.response.data);
    res.status(500);
    }
});

// 5. Use axios to get a random secret and pass it to index.ejs to display the
// secret and the username of the secret.


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// 6. Listen on your predefined port and start the server.
