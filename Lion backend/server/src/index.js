require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const express = require('express');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');

const cors = require('cors');
const { verify } = require('jsonwebtoken');
const { hash, compare } = require('bcryptjs');
const { fakeDB } = require('../db/fake-db.js');
const uri = "mongodb://root:rootPassword@localhost:27017/?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1";
//const client = new MongoClient(uri);
//await client.connect();
const {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
  sendAccessToken
} = require('./tokens.js');

const { isAuth } = require('./auth.js');


MongoClient.connect(uri, function (err, db) {
  if (err) throw err;
  var dbo = db.db("admin");
  const server = express();
  var path = require('path');
  server.use( express.static(path.join(__dirname,'frontend')));
  // Use middleware
  server.use(cookieParser());

  // server.use(
  //   cors({
  //     origin: 'http://localhost:3000',
  //     credentials: true,
  //   })
  // )


   server.use(
     cors({
       credentials: true
     })
   )

  // Read
  server.use(express.json());

  // Url
  server.use(express.urlencoded({
    extended: true
  }));

  server.listen(process.env.PORT, () => {
    console.log(`server listening on port ${process.env.PORT}`);
  });

  // Test 
  server.get("/ping", async (req, res) => {
    res.send("PING OK...");
  });



  server.post("/addBalance", async (req, res) => {
    let idUser = isAuth(req);
    if(!idUser) throw new Error('User does not exist');
    let user = await findUserById(dbo,idUser);
    if (!user) throw new Error('User does not exist');
    if ((+req.body.money)<0){
      res.send({
        error: "Errore nel balance, balance negativo!",
      });    
    } else{
      await  updateUserBalance(dbo,idUser,(+req.body.money) +(+user.balance) )
      res.send({
        message: "Errore",
      });   
    }
  

    //res.send(user);
  });





  server.get("/getUser", async (req, res) => {
    let idUser = isAuth(req);
    if(!idUser) throw new Error('User does not exist');
    let user = await findUserById(dbo,idUser);
    if (!user) throw new Error('User does not exist');
    res.send(user);
  });
  

  server.post('/modificaUser', async (req, res) => {
    const { email, password,nome,cognome } = req.body;
    try {
      
      if( email.replace(/ /g, '').length==0   ||
      nome.replace(/ /g, '').length==0   ||
      cognome.replace(/ /g, '').length==0   
      ){
        res.send({
          error: "Errore",
        });    
      }



      const userId2 = isAuth(req);

      console.log(userId2)
      let user = await findUserById(dbo,userId2);

      console.log(user,"sopra");

      if (!user) {
        res.send({
          error: "User not exist."
        })

        return;

      }

      const hashPassword = await hash(password, 10);
      console.log(hashPassword);
      // fakedb.push({
      //   id: fakedb.length,
      //   email, 
      //   password: hashpassword
      // });



      // await insertUser(dbo, {
      //   id: uuidv4(),
      //   email,
      //   password: hashpassword
      // })

      

    //  const objpd =  { };

       let obj =  {
         "id": user.id,
         "nome":nome,
         "cognome":cognome,
         "username":user.username,
         "email":email,
         "password": password.replace(/ /g, '').length==0 ? null:hashPassword,
         "balance": user.balance,
         "admin":user.admin
       };

      await updateUserSetting(dbo,obj)
      //console.log(fakeDB);

      res.send({
        message: "User successfully created."
      })

    } catch (err) {
      console.log(err)
      res.send({
        error: `${err.message}`
      })
    }
  })

  // STEPS
  // 1. Register a user
  server.post('/register', async (req, res) => {
    const { email, password,username,nome,cognome } = req.body;
    try {
      
      if( email.replace(/ /g, '').length==0   ||
      password.replace(/ /g, '').length==0   ||  
      nome.replace(/ /g, '').length==0   ||
      cognome.replace(/ /g, '').length==0   ||  
      username.replace(/ /g, '').length==0   
      ){
        res.send({
          error: "Errore",
        });    
      }

      let user = await findUser(dbo,email);
      console.log(user,"sopra");

      if (user) throw new Error('User already exist');

      const hashPassword = await hash(password, 10);
      console.log(hashPassword);
      // fakedb.push({
      //   id: fakedb.length,
      //   email, 
      //   password: hashpassword
      // });



      // await insertUser(dbo, {
      //   id: uuidv4(),
      //   email,
      //   password: hashpassword
      // })

      let id = await uuidv4();

      console.log(id,email,hashPassword)
    //  const objpd =  { };

       let obj =  {
         "id": id,
         "nome":nome,
         "cognome":cognome,
         "username":username,
         "email":email,
         "password": hashPassword,
         "balance": 1000,
         "admin":0
       };

      await insertUser(dbo,obj)
      //console.log(fakeDB);

      res.send({
        message: "User successfully created."
      })

    } catch (err) {
      console.log(err)
      res.send({
        error: `${err.message}`
      })
    }
  })

  // 2. Login a user
  server.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      // 1. Find user in array. If not exist send error
      let user = await findUser(dbo,email);
      if (!user) throw new Error('User does not exist');
      // 2. Compare crypted password and see if it checks out. Send error if not
      const valid = await compare(password, user.password);


      if (!valid) throw new Error('Password not correct');


      let utente={
        "id":user.id,
        "nome": user.nome,
        "cognome": user.cognome,
        "email":user.email,
        "username":user.username,
        "admin":user.admin,
        "balance":user.balance

      };
      // res.send({
      //   admin: user.admin,
      // });
      // 3. Create Refresh- and Accesstoken
      const accesstoken = createAccessToken(user.id);
      const refreshtoken = createRefreshToken(user.id);

      // 4. Store Refreshtoken with user in "db"
      // Could also use different version numbers instead.
      // Then just increase the version number on the revoke endpoint

      user.refreshtoken = refreshtoken;

      await updateUser(dbo,user)
      // 5. Send token. Refreshtoken as a cookie and accesstoken as a regular response
      sendRefreshToken(res, refreshtoken);
      sendAccessToken(res, req, accesstoken,utente);
      console.log("user admin",user.admin);
        
    } catch (err) {
      res.send({
        error: `${err.message}`,
      });
    }
  });

  // 3. Logout a user
  server.post('/logout', (_req, res) => {
    res.clearCookie('refreshtoken', { path: '/refresh_token' });
    // Logic here for also remove refreshtoken from db

    return res.send({
      message: 'Logged out',
    });
  });

  // 4. Setup a protected route





  var admin=`
  
  


      <div class="divimage py-5" style="
      height: 100%;">
  
        
  
          <div class="container containerCard">
            <div class="row justify-content-center align-items-center" style="height:100%">
                <div class="col-4">
                    <div class="card">
                        <div class="card-body">
                          <div>
                              <h2>Aggiungi una stanza</h2>
                              <hr class="colorgraph">
                             
                              <div class="form-group" style="margin-top: 20px;">
                                  <label class="form-check-label" for="inlineRadio1">Nome stanza</label>
                                  <input type="text" name="nomeRoom" id="nomeRoom" class="form-control input-lg" placeholder="Nome stanza" tabindex="3">
                              </div>
                              <div class="form-group" style="margin-top: 20px;">
                              <label class="form-check-label" for="inlineRadio1">Descrizione</label>
                                  <input type="text" name="descrizione" id="descrizione" class="form-control input-lg" placeholder="Descrizione" tabindex="3">
                              </div>

                              <div class="form-check form-check-inline" style="margin-top: 20px;">
                                  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="0.1" checked >
                                  <label class="form-check-label" for="inlineRadio1">0.10</label>
                              </div>
                              <div class="form-check form-check-inline">
                                  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="0.5">
                                  <label class="form-check-label" for="inlineRadio2">0.50</label>
                              </div>
                              <div class="form-check form-check-inline">
                                  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="1">
                                  <label class="form-check-label" for="inlineRadio2">1</label>
                              </div>
                              <div class="form-check form-check-inline">
                                  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio4" value="5">
                                  <label class="form-check-label" for="inlineRadio2">5</label>
                              </div>
                              <div class="form-check form-check-inline">
                                  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio5" value="25">
                                  <label class="form-check-label" for="inlineRadio2">25</label>
                              </div>
                              <div class="form-check form-check-inline">
                                  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio6" value="100">
                                  <label class="form-check-label" for="inlineRadio2">100</label>
                              </div>
                              <div class="form-group">
                               <label for="exampleFormControlFile1">Example file input</label>
                               <input type="file" class="form-control-file" id="immagineRoom">
                              </div>
                              
                              <button  id="addRoom" class="btn btn-primary" style="margin-top: 20px;width: fit-content;">Crea stanza</button>
                              
                              </div>
                              
                             
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
        
  
  
        
    
    
    
    `;
    var addSlot=`
  
  


      <div class="divimage py-5" style="
      height: 100%;">
  
        
  
          <div class="container">
            <div class="row justify-content-center align-items-center" style="height:100%">
                <div class="col-4">
                    <div class="card">
                        <div class="card-body">
                          <div>
                              <h2>Aggiungi una slot</h2>
                              <hr class="colorgraph">
                             
                              <div class="form-group" style="margin-top: 20px;">
                                  <label class="form-check-label" for="inlineRadio1">Nome slot</label>
                                  <input type="text" name="nomeRoom" id="nomeSlot" class="form-control input-lg" placeholder="Nome slot" tabindex="3">
                              </div>
                              <div class="form-group" style="margin-top: 20px;">
                              <label class="form-check-label" for="inlineRadio1">Descrizione</label>
                                  <input type="text" name="descrizione" id="descrizioneSlot" class="form-control input-lg" placeholder="Descrizione" tabindex="3">
                              </div>
                              <div class="form-group" style="margin-top: 20px;">
                              <label class="form-check-label" for="inlineRadio1">Url slot</label>
                                  <input type="text" name="url" id="urlSlot" class="form-control input-lg" placeholder="Url" tabindex="3">
                              </div>
                              
                              <div class="form-group">
                               <label for="exampleFormControlFile1">Example file input</label>
                               <input type="file" class="form-control-file" id="immagineSlot">
                              </div>
                              
                              <button  id="addSlot" class="btn btn-primary" style="margin-top: 20px;width: fit-content;">Aggiungi slot</button>
                              
                              </div>
                              
                             
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
        
  
  
        
    
    
    
    `;

    
   var safepage= ` 
   <div class="container text-center">
   <div id="roomShow" style="margin-top:50px;display: grid;
   grid-template-columns: repeat(auto-fill, 288px);
   grid-template-rows: repeat(auto-fill, 273px);
   grid-gap: 30px;
   justify-content: space-evenly;
">
     
     <div id="templateRoom"  style="display:none;justify-content:start" >
       <a >
       <div class="card cardzoom" style="width: 288px;height:273px;cursor:pointer">
           <div class="containerimg">
               <img name="immagine" src="img/roulette.jpg" alt="Avatar" class="image" style="height: 183px;
               object-fit: cover;">
               <div class="overlay">
                 <div name="over" class="textimg">Hello World</div>
               </div>
             </div>
           <div class="card-body" style="overflow:hidden">
             <h5 name="nomeRoom" class="card-title">Card title</h5>
             <p data-toggle="tooltip" data-placement="top" title="Tooltip on top" name="descrizione" class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
             
           </div>
         </div>
       </a>
   </div>
   </div>
   </div>
 </div>`;

 var visualizzaSlot= ` 
   <div class="container text-center">
   <div id="roomShow" style="margin-top:50px;display: grid;
   grid-template-columns: repeat(auto-fill, 288px);
   grid-template-rows: repeat(auto-fill, 273px);
   grid-gap: 30px;
   justify-content: space-evenly;
">
     
     <div id="templateRoom"  style="display:none;justify-content:start" >
       <a >
       <div class="card cardzoom" style="width: 288px;height:273px;cursor:pointer">
           <div class="containerimg">
               <img name="immagine" src="img/roulette.jpg" alt="Avatar" class="image" style="height: 183px;
               object-fit: cover;">
               
             </div>
           <div class="card-body" style="overflow:hidden">
             <h5 name="nomeRoom" class="card-title">Card title</h5>
             <p data-toggle="tooltip" data-placement="top" title="Tooltip on top" name="descrizione" class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
             
           </div>
         </div>
       </a>
   </div>
   </div>
   </div>
 </div>`;

 var safepagemodifica= ` 
 <div class="container text-center">
 <div id="roomShow" style="margin-top:50px;display: grid;
 grid-template-columns: repeat(auto-fill, 288px);
 grid-template-rows: repeat(auto-fill, 460px);
 grid-gap: 30px;
 justify-content: space-evenly;
">
<div id="templateRoom"  style="display:none;justify-content:start" >
   
<div class="card " style="width: 288px;height:460px;cursor:pointer">
<div class=" containerimg image-upload">
         <label for="immagineRoom" class="w-100">
           <img  name="immagine" src="img/roulette.jpg" class="card-img-top" style="height: 183px;
           object-fit: cover;"/>
         </label>
       
         <input  type="file" style="display: none;" id="immagineRoom" />
       </div>
         
         <div class="card-body">
           <input name="nomeRoom" type="text" class="card-title" placeholder="nome room">
           <input name="descrizione" type="text" class="card-text" placeholder="Descrizione room">
           <div class="form-check form-check-inline" style="margin-top: 20px;">
             <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="0.1" checked >
             <label class="form-check-label" for="inlineRadio1">0.10</label>
         </div>
         <div class="form-check form-check-inline">
             <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="0.5">
             <label class="form-check-label" for="inlineRadio2">0.50</label>
         </div>
         <div class="form-check form-check-inline">
             <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="1">
             <label class="form-check-label" for="inlineRadio2">1</label>
         </div>
         <div class="form-check form-check-inline">
             <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio4" value="5">
             <label class="form-check-label" for="inlineRadio2">5</label>
         </div>
         <div class="form-check form-check-inline">
             <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio5" value="25">
             <label class="form-check-label" for="inlineRadio2">25</label>
         </div>
         <div class="form-check form-check-inline">
             <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio6" value="100">
             <label class="form-check-label" for="inlineRadio2">100</label>
         </div>
           
         </div>
         <div class="card-body">
           <button name="cancellaBtn" class="btn"  value=""></button>
           <button name="modificaBtn" class="btn" value=""></button>
         </div>
         
       </div>
     
   </div>
   
 </div>
</div>`;


  server.post('/protected', async (req, res) => {
    try {
      const userId = isAuth(req);
      if (userId !== null) {
        res.send({
          // data: 'This is protected data.',
          data: safepage,
        });
      }
    } catch (err) {
      res.send({
        error: `${err.message}`,
      });
    }
  });


  server.post('/giocaSlot', async (req, res) => {
    try {
      const userId = isAuth(req);
      if (userId !== null) {
        res.send({
          // data: 'This is protected data.',
          data: visualizzaSlot,
        });
      }
    } catch (err) {
      res.send({
        error: `${err.message}`,
      });
    }
  });


  server.post('/modificaRoom', async (req, res) => {
    try {
      const userId = isAuth(req);
      if (userId !== null) {
        res.send({
          // data: 'This is protected data.',
          data: safepagemodifica,
        });
      }
    } catch (err) {
      res.send({
        error: `${err.message}`,
      });
    }
  });



  server.post('/addSlot', async (req, res) => {
    try {
      const userId2 = isAuth(req);
      let user2 = await findUserById(dbo,userId2);

      console.log("L'utente è admin?", user2.admin);
      if (userId2 !== null && user2.admin==1) {
        res.send({
          // data: 'This is protected data.',
          data: addSlot,
        });
      }
    } catch (err) {
      res.send({
        error: `${err.message}`,
      });
    }
  });

  server.post('/admin', async (req, res) => {
    try {
      const userId2 = isAuth(req);
      let user2 = await findUserById(dbo,userId2);

      console.log("L'utente è admin?", user2.admin);
      if (userId2 !== null && user2.admin==1) {
        res.send({
          // data: 'This is protected data.',
          data: admin,
        });
      }
    } catch (err) {
      res.send({
        error: `${err.message}`,
      });
    }
  });

  // 5. Refresh Token
  server.post('/refresh_token', async (req, res) => {
    
    const token = req.cookies.refreshtoken;

    
    if (!token) return res.send({ accesstoken: '' });

    console.log("pd")

    
    let payload = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      console.log(err)
      
      return res.send({ accesstoken: '' });
    }

   

    let user = await findUserById(dbo,payload.userId);

    
    if (!user) return res.send({ accesstoken: '' });

   
    if (user.refreshToken !== token)
      return res.send({ accesstoken: '' });

    
    const accesstoken = createAccessToken(user.id);
    const refreshtoken = createRefreshToken(user.id);

    
    user.refreshtoken = refreshtoken;


    user.refreshtoken = refreshtoken;

    await updateUser(dbo,user)
    
    
    sendRefreshToken(res, refreshtoken);
    

    return res.send({ accesstoken });
  });



});


  async function insertUser(dbo, myobj) {

    await dbo.collection("users").insertOne(myobj, function (err, res) {
      console.log(err);
      if (err) throw err;
      console.log("1 document inserted");
   //   db.close();
    });
  }


  async function updateUser(dbo, myobj) {
    var myquery = { id: myobj.id};
    var newvalues = { $set: {refreshToken: myobj.refreshtoken} };

    await dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
      console.log(err);
      if (err) throw err;
      console.log("1 document inserted");
   //   db.close();
    });
  }



  async function updateUserSetting(dbo, myobj) {
    var myquery = { id: myobj.id};
    var newvalues ={}
    if(myobj.password)
    var newvalues = { $set: {nome: myobj.nome,cognome:myobj.cognome,email:myobj.email,password:myobj.password} };
    else
    var newvalues = { $set: {nome: myobj.nome,cognome:myobj.cognome,email:myobj.email} };

    await dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
      console.log(err);
      if (err) throw err;
      console.log("1 document inserted");
   //   db.close();
    });
  }

  async function updateUserBalance(dbo,userId,inputBalance) {
    var myquery = { id: userId};
    var newvalues ={}
    var newvalues = { $set: {balance: inputBalance} };

    await dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
      console.log(err);
      if (err) throw err;
      console.log("1 document inserted");
   //   db.close();
    });
  }


  

  async function findUserById(dbo,id) {
   
    let returnOutput = null;




    let promise =await new Promise(function(resolve, reject) {

        dbo.collection("users").findOne({id:id}, async (err, result)=> {
        if (err) throw err;
         //console.log(result)
         console.log("Sono admin?",result.admin);
         resolve(result);
      });
    });




  

    returnOutput = await promise;
    return returnOutput;
  }



  async function findAdminById(dbo,id) {
    console.log(id,"id")
    let returnOutput = null;




    let promise =await new Promise(function(resolve, reject) {

        dbo.collection("users").findOne({id:id}, async (err, result)=> {
        if (err) throw err;
         console.log("Sono admin?",result.admin);
         resolve(result);
      });
    });




  

    returnOutput = await promise;
    return returnOutput;
  }

  async function findUser(dbo,emailUser) {
    let returnOutput = null;




    let promise =await new Promise(function(resolve, reject) {

        dbo.collection("users").findOne({email:emailUser}, async (err, result)=> {
        if (err) throw err;
         console.log(result)
         resolve(result);
      });
    });




  

    returnOutput = await promise;
    return returnOutput;
  }