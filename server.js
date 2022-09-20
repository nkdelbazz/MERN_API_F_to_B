const express = require('express'); // vado a chiamare il pacchetto di express

const app = express(); // inizializzo l' app con il pacchetto 


app.get('/', (req, res) => res.send('API Running per mern_app'));
/*
serve a trovare la porta a dove connettersi che poi dopo verrà settata su hiroku che dovremmo settargli la porta corretta 
ma in locale voglio collegarmi con il mio indirizzo di localhost nella porta 5000 
*/
const PORT = process.env.PORT || 5000 ;


app.listen(PORT ,() => console.log('mern_app listening on port' + PORT));  // mi sta dicendo che quando parte allora va a daremi una funzione callback con il consolelog 