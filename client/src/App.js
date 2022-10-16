import './App.css';
import Test from'./components/Test';
import { useState } from 'react';
import {BrowserRouter as Router,Route,Switch,Link} from 'react-router-dom'; 
import axios from 'axios';
import {useSelector,useDispatch} from 'react-redux'  // redux
import { bindActionCreators } from 'redux';
import {actionCreators} from "./state/index"


function App() {

  // redux ---------------
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const {depositMoney,withdrawmoney} = bindActionCreators(actionCreators,dispatch);
  // reduz

  console.log(state)  // cioè dello store dove si storicizza il tutto



 /*
axios.get('http://localhost:5000/client').then((resp) => {
                   console.log(resp.data)
                });

  axios.get('http://localhost:5000/api/users').then((resp) => {
      console.log(resp.data)
  });
*/
async function newUser(e){
  
e.preventDefault();
  const email = name +  'ndsad@gmail.com';
   const user = {
      name: name,
      email: email,
      password: password
    }

    try {
      
      const config = {
         headers: {
          'Content-Type': 'application/json',
         }
      }

      const body_req = JSON.stringify(user)
      //const res = await axios.post('http://localhost:5000/',body_req,config);
      const res1 = await axios.post('http://localhost:5000/api/users',body_req,config);

      console.log(res1.data.token)  // retribuzione del token passato 
      const token = (res1.data.token != '') ?  res1.data.token : '';

      if(token){
      const localToken = {
          name: name,
          token: token
        }

        localStorage.setItem("todo_app_token",JSON.stringify(localToken) )
        console.log(localStorage.getItem('todo_app_token'))
        setuser((<div>{name}</div>))
      }
  
    }catch(err){
      console.log(err.response.data)
    }

}


async function LoginUser(e){
  alert('login')
  e.preventDefault();
    const email = name +  'ndsad@gmail.com';
     const user = {
        name: name,
        email: email,
        password: password
      }
  
      try {
        
        const config = {
           headers: {
            'Content-Type': 'application/json',
           }
        }
  
        const body_req = JSON.stringify(user)
        //const res = await axios.post('http://localhost:5000/',body_req,config);
        const res1 = await axios.post('http://localhost:5000/api/auth',body_req,config);
  
        console.log(res1.data.token)  // retribuzione del token passato 
        const token = (res1.data.token != '') ?  res1.data.token : '';
  
        if(token){
        const localToken = {
            name: name,
            token: token
          }
  
          localStorage.setItem("todo_app_token",JSON.stringify(localToken) )
          console.log(localStorage.getItem('todo_app_token'))
          setuser((<div>{name}</div>))
        }
    
      }catch(err){
        console.log(err.response.data)
      }
  
  }





function rimuoviUtente(e) {
  e.preventDefault();
 alert('rimuovi l\' utente' );
 localStorage.removeItem("todo_app_token");
 setuser((''))
}

function infoToken(e) {
  e.preventDefault();
  if(localStorage.getItem('todo_app_token')){
    console.log(JSON.parse(localStorage.getItem('todo_app_token')).name)
  }
  console.log('token non esite nel localStorage')
}

async function infoUtente(e) {
  e.preventDefault();
  console.log('info utente')
  if(localStorage.getItem('todo_app_token')){
    var token_temp = JSON.parse(localStorage.getItem('todo_app_token')).token;  // recupero del token

   try {
        
    const config = {
       headers: {
        'x-auth-token': token_temp,
       }
    }
    //const res = await axios.post('http://localhost:5000/',body_req,config);
    var call = await axios.get('http://localhost:5000/api/auth',config);

    console.log(call.data)  // retribuzione del token passato 
    console.log('andato a buon fine')

  }catch(err){
    console.log(err.response.data)
  }




  }
}


// redux 
async function addStore(e){
  e.preventDefault();
  depositMoney(100)
}

async function subStore(e){
  e.preventDefault();
  withdrawmoney(100)
}



            
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [user_attribute , setuser] = useState(
    (localStorage.getItem('todo_app_token')) ? JSON.parse(localStorage.getItem('todo_app_token')).name : '' 
    );

  return (
    <Router>
   <div>
    ciao
    <Switch>
      <Route path='/about' exact>
        <Test></Test>
      </Route>
      <Route path='/about1'>
        <Test></Test>
      </Route>
    </Switch>
   </div>
   <Link to='/about1'>a</Link>

   <form onSubmit={(e) => {newUser(e); e.preventDefault();}}>
      <label>Register Form:
        <input
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <br/>
      <label>Enter your password:
        <input
          type="text" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button style={{backgroundColor: "red" , height : "40px",borderRadius: "10px",cursor:"pointer"}} type='submit' >scegli cosa premere </button>

    </form>

<br></br>
<br></br>

    <form onSubmit={(e) => {LoginUser(e); e.preventDefault();}}>
      <label>Login Form:
        <input
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <br/>
      <label>Enter your password:
        <input
          type="text" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button style={{backgroundColor: "red" , height : "40px",borderRadius: "10px",cursor:"pointer"}} type='submit' >scegli cosa premere </button>

    </form>

      <button onClick={rimuoviUtente}>
       rimuovi token
      </button>

      <button onClick={infoToken}>
      info token token
      </button>

      <br></br>
      <br></br>

      <button onClick={infoUtente}>
      info sull' utente
      </button>

      <br></br>
      <br></br>
      <br></br>

<div>   REDUX </div>
<br></br>
      <button onClick={addStore}>
       + 100 store
      </button>

      <button onClick={subStore}>
       - 100 store
      </button>

      <br></br>

   {user_attribute}



    </Router>

  );
}

export default App;
