const express = require('express'); // vado a chiamare il pacchetto di express
const connectDB = require('./config/db')
const cors = require('cors');

const app = express(); // inizializzo l' app con il pacchetto 
app.use(cors({
    origin: 'http://localhost:3000'
}))

connectDB();


app.use(cors());
app.options('*', cors());
// Init Middleware
app.use(express.json({ extended: false}))  // json 

app.get('/', (req, res) => res.send('API Running per mern_app'));
app.get('/client', (req, res) => res.json('collegamento al server fatto'));


app.post('/', (req, res) => res.json(req.body));
// define routes
/*
verranno impostate in questo modo se non si importa in questo modo una rotta
allora essa sarà sempre il (nome del file) + ('/{valore api}')
mentre in questo modo l' importazione viene fatta in questo modo : 
(api/nome del file) + ('/{valore api}')
*/

app.use('/api/users',require('./routes/api/users'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/profile',require('./routes/api/profile'));
app.use('/api/posts',require('./routes/api/posts'));


/*
serve a trovare la porta a dove connettersi che poi dopo verrà settata su hiroku che dovremmo settargli la porta corretta 
ma in locale voglio collegarmi con il mio indirizzo di localhost nella porta 5000 
*/

const PORT = process.env.PORT || 5000 ;


app.listen(PORT ,() => console.log('mern_app listening on port' + PORT));  // mi sta dicendo che quando parte allora va a daremi una funzione callback con il consolelog 