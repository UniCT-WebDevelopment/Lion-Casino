
const TIME_LIMIT = 20;
var timePassed = 0;
var lanciato=false;
var timeLeft = TIME_LIMIT;
var timerInterval = null;
var user=0;
var bets;
var result=-1;
var sectormultipliers=[
	[0,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3],//3rd column
	[0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0],//2nd column
	[0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0],//1st column
	[0,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//1st 12
	[0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0],//2nd 12
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3],//3rd 12
	[0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//1 to 18
	[0,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],//even
	[0,2,0,2,0,2,0,2,0,2,0,0,2,0,2,0,2,0,2,2,0,2,0,2,0,2,0,2,0,0,2,0,2,0,2,0,2],//Red
	[0,0,2,0,2,0,2,0,2,0,2,2,0,2,0,2,0,2,0,0,2,0,2,0,2,0,2,0,2,2,0,2,0,2,0,2,0],//Black
	[0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0],//odd
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2] //19 to 36
];
var CurrentTier=0.01;
var roomList={};
var tiers=[
	0.0001,
	0.0002,
	0.001,
	0.002,
	0.01,
	0.02
];
const express = require('express');
const axios = require('axios').default;
var _ = require('lodash');
var dbo = null;

const cors= require('cors');
var path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var obj={timelimit:TIME_LIMIT};
var MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://root:rootPassword@localhost:27017/?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1";
MongoClient.connect(uri, function (err, db) {
  if (err) throw err;
   dbo = db.db("admin");

   initCheck();

app.use(cors());
app.use( express.static(path.join(__dirname,'html')));
  // Read json encoded body data
  app.use(express.json({limit:"50mb"}));

  // Url encoded bodies
  app.use(express.urlencoded({
    extended: true,
    limit:"50mb"
  }));
app.get('/', (req, res) => {
 // res.sendFile(__dirname ,'html');
});
 
app.get("/getRooms", async (req, res) => {

  let arrResponse = [];

  let objK = Object.keys(roomList)

  for(let i = 0;i<objK.length;i++) {
    arrResponse.push(roomList[objK[i]])
  }
  res.send(arrResponse);
});

app.get("/getSlot", async (req, res) => {
  let slot = await getSlot(dbo);
  if (!slot) throw new Error('Slot does not exist');
  res.send(slot);
});

app.post('/createRoom', async (req, res) => {
  let room = req.body;
  room["id"]=Date.now()+"";
  try {
    roomList[room.id] = room;
    roomList[room.id].players={};
    // rooms.push(room);
    
    updateRooms(roomList);
  } catch (err) {
    console.log(err)
    res.send({
      error: `${err.message}`
    })
  }
})


app.post('/addSlot', async (req, res) => {
  let room = req.body;
  room["id"]=Date.now()+"";
  try {
    insertSlot(dbo,room);
  } catch (err) {
    console.log(err)
    res.send({
      error: `${err.message}`
    })
  }
})


async function insertSlot(dbo, myobj) {

  await dbo.collection("slot").insertOne(myobj, function (err, res) {
    console.log(err);
    if (err) throw err;
    console.log("1 document inserted");
 //   db.close();
  });
}


app.post('/editRoom', async (req, res) => {

  //todo check player 0 

  let room = req.body;
  if(room.id && roomList[room.id] && Object.keys(roomList[room.id].players).length == 0){


    try {
      roomList[room.id] = room;
      if(!roomList[room.id].players)  roomList[room.id].players = {}
      // rooms.push(room);
      updateRooms(roomList);

      res.send({
        error: null,
        message:"Inserimento avvenuto"
      })


    } catch (err) {
      console.log(err)
      res.send({
        error: `${err.message}`
      })
    }
  }else{
    res.send({
      error: true,
      description:`Errore nell'inserimento`
    })
  }

})




app.post('/removeRoom', async (req, res) => {

  //todo check player 0 

  let room = req.body;
  if(room.id && roomList[room.id] && Object.keys(roomList[room.id].players).length == 0){


    try {
     delete roomList[room.id]
      // rooms.push(room);
      updateRooms(roomList);

      res.send({
        error: null,
        message:"Delete avvenuta"
      })


    } catch (err) {
      console.log(err)
      res.send({
        error: `${err.message}`
      })
    }
  }else{
    res.send({
      error: true,
      description:`Errore nella delete`
    })
  }

})



// io.on('connection', (socket) => {
//   console.log('a user connected');
// });

io.on('connection', (socket) => {
    // io.emit("init",obj);

    console.log('a user connected');

 socket.on('joinRoom',async (msg) => {
  try{
    console.log("joinRoom from "+
     socket.id);

    let msgObj = JSON.parse(msg);

    console.log(msgObj)

    let user = await getUser(msgObj.accessToken);

    user = user.data;
    console.log(+msgObj.balance,"balance log")

    if(+user.balance < +msgObj.balance || +user.balance < 0 ){
      console.log("1")

      socket.emit("roomJoined",{"error":true,"description":"Errore nel balance"});
      return;
    }


    if(socket["rouletteRoom"]){
      console.log("SEI GIA IN ROOM!!!")
      socket.emit("roomJoined",{"error":true,"description":"Utente già in stanza"});
      return;
    }


    if(!roomList[msgObj.roomId]){
      console.log("3")
      socket.emit("roomJoined",{"error":true,"description":"Stanza non esistente"});
      return;
    }

    console.log("provaaaaa"+user.id)
    await updatePlayerBalance(user.id,-(msgObj.balance))
    socket["rouletteRoom"]=msgObj.roomId;
    socket["name"]=user.nome;
    user["balanceRoom"] = msgObj.balance;
    user["bets"]=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    user["wsId"]=socket.id;
    roomList[msgObj.roomId].players[socket.id] = user;
    updateRooms(roomList);

    socket.emit("roomJoined",{minBet:roomList[msgObj.roomId].puntata,error:false,balance:msgObj.balance,bets:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]})
    socket.join(msgObj.roomId);
    
  }catch(e){
    console.log(e);
  }
    
    });



    socket.on('chat message', (msg) => {
      if(!socket["rouletteRoom"]) return;

        // io.emit("chat",user+ " "+ msg);
      // io.sockets.in(socket["rouletteRoom"]).emit("chat",user+ " "+ msg);

      console.log(socket["rouletteRoom"])
      // socket.broadcast.to(socket["rouletteRoom"]).emit("chat",user+ " "+ msg);
      io.to(socket["rouletteRoom"]).emit("chat",socket["name"]+ ": "+ msg);

      console.log(  io.sockets.adapter.rooms);
    });
    user++;

     socket.on('betsUpdate',async (bets) => {

      //todo implement checkTime

      let bet = 0;
      


      for(var i=0;i<bets.length;i++)if(bets[i]!=0)bet+=bets[i];

        if(bet > roomList[socket["rouletteRoom"]].players[socket.id].balanceRoom){
          io.to(socket.id).emit("tooBigBet",{error:true,description:"too big bet"});
bets=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            bet=0;
        }




      console.log(bets,"ok")

      roomList[socket["rouletteRoom"]].players[socket.id].bets = bets;
      updateRooms(roomList);




           let winForUser =  calcolawin(+ roomList[socket["rouletteRoom"]]["currentNumber"], roomList[socket["rouletteRoom"]].players[socket.id].bets);
      
         roomList[socket["rouletteRoom"]].players[socket.id].balanceRoom = (+ roomList[socket["rouletteRoom"]].players[socket.id].balanceRoom) + (+winForUser) - (+ bet)
         io.to(socket.id).emit("winUpdate",{totalWin:(+winForUser),totalBalance:(+ roomList[socket["rouletteRoom"]].players[socket.id].balanceRoom)});

         roomList[socket["rouletteRoom"]].players[socket.id].bets=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

         updateRooms(roomList);



     })

     socket.on('disconnect',async () => {

      if(!socket["rouletteRoom"]) return;
      let user = roomList[socket["rouletteRoom"]].players[socket.id]
     

      let betsArr = user.bets;
      let totalBets = 0;

      for(let n = 0;n<betsArr.length;n++) totalBets+= +betsArr[n];
      console.log("log bello")

     await updatePlayerBalance( user.id,(+ user.balanceRoom)+(+totalBets))

      delete  roomList[socket["rouletteRoom"]].players[socket.id];

      updateRooms(roomList)

     })
    
    //     user--;
    //     console.log("ci sono "+user+" utenti collegati");
    //   });
    //   socket.on('puntate', (msg) => {
    
        
    //     console.log("le puntate sono: "+msg);
    //     bets=msg;
    //   });

    //   socket.on('pallina', (msg) => {
       
    //   console.log('evento: ' + msg);
    });
       
         
    
    
  });


  timePassed = 0;
  timeLeft = TIME_LIMIT;
  timerInterval = null;

 timerInterval = setInterval(async () => {
    
     timePassed = timePassed += 1;
     timeLeft = TIME_LIMIT - timePassed;
     await io.emit("time",timeLeft);
 
     if (timeLeft+13 <= 0) {
         timePassed = 0;
         timeLeft = TIME_LIMIT;
         timerInterval = null;
         lanciato=false;
        //  console.log("risultato di result",result);
        //  if (user>0)calcolawin(result);
         reset();
     }



     if(timeLeft<=0 && lanciato==false){
        lanciaPallina();
        lanciato=true;
     }
   }, 1000);

  

server.listen(3030, () => {
  console.log('listening on *:3030');
});





function lanciaPallina(){

  



  let objK = Object.keys(roomList)
  for(let i =0;i<objK.length;i++){
    roomList[objK[i]]["currentNumber"] = Math.floor(Math.random()*37);
    if(!roomList[objK[i]].players)  roomList[objK[i]].players={}
    let objKPlayers = Object.keys( roomList[objK[i]].players)


    for(let k =0;k<objKPlayers.length;k++){
      console.log("prova")

     let winForUser =  calcolawin(+ roomList[objK[i]]["currentNumber"], roomList[objK[i]].players[objKPlayers[k]].bets);

   io.to(objKPlayers[k]).emit("lanciaPallina",{number:  roomList[objK[i]]["currentNumber"],totalWin:(+winForUser)});


     
    }



   

  }
    // result=Math.floor(Math.random()*37);

    // io.emit("lanciaPallina",result);
    
   
}

function reset(){
    io.emit("resettaLancio");
}
function calcolawin(result,bets){
    var bet=0;
    var win=0
    if(result==-1) return;
    if(!bets) return;
    for(var i=0;i<bets.length;i++)if(bets[i]!=0)bet+=bets[i];
    console.log("BET: "+bet+"result "+result);
	if(bets[result]!=0)win+=bets[result]*36;

	for(var i=37;i<bets.length;i++)win+=bets[i]*sectormultipliers[i-37][result];
   
  


  console.log("BET: "+bet+" WIN: "+win);
  // let obj={
  //   winat:win,
  //   // bettt:bet,
  // }
	//win*=CurrentTier;
  //   win2=win;
	// win-=bet;
	
 
	// io.emit("vincita",obj);
	
	// var vintos;
	// //balance+=win;
  //   if(win>=bet || win2>0)vintos=true;
  //   else vintos=false;


  return win;
    console.log(win);

  
  
    


      

}


async function getUser(accessToken) {

  const config = {
    headers: { Authorization: `Bearer ${accessToken}` }
};


  try {
    const response = await axios.get('http://localhost:4000/getUser',config);
    if(response) return response
  } catch (error) {
    console.error(error);
  }
}


async function updateRooms( myobj) {


  // let arrResponse = [];

  // let objK = Object.keys(myobj)

  // for(let i = 0;i<objK.length;i++) {

  //  let arrTempPlayer = [];
  //  let tempRoom = _.cloneDeep(myobj[objK[i]]);


  //  let tempPlayerMap =  myobj[objK[i]].players



  //   let objKPlayers = Object.keys(tempPlayerMap);

  //   for(let k = 0;k<objKPlayers.length;k++) {

  //     arrTempPlayer.push(tempPlayerMap[objKPlayers[k]]);

  //   }

  //   tempRoom["players"]=arrTempPlayer;


  //   arrResponse.push(_.cloneDeep(tempRoom))
  // }


  var myquery = { _id: "roomList"};
  var newvalues = { $set: {roomList: myobj} };

  await dbo.collection("rooms").updateOne(myquery, newvalues, function(err, res) {
    console.log(err);
    if (err) throw err;
    console.log("1 document inserted");
 //   db.close();
  });
}



async function getRoomsFromDB() {
   
  let returnOutput = null;
// console.log(dbo)
  let promise =await new Promise(function(resolve, reject) {

      dbo.collection("rooms").findOne({_id:"roomList"}, async (err, result)=> {
      if (err) throw err;
      //todo not throw
       //console.log(result)
       console.log(result)
       resolve(result);
    });
  });

  returnOutput = await promise;
  return returnOutput;
}



async function initCheck(){

let response = await getRoomsFromDB();
if(response && response.roomList )
  roomList = response.roomList;

  else {
    roomList ={};
    updateRooms(roomList)
    return;
  }

  let objK = Object.keys(roomList)

  for(let i = 0;i<objK.length;i++){
    if(!roomList[objK[i]].players)  roomList[objK[i]].players={}

    let objKPlayers = Object.keys(roomList[objK[i]].players)


    for(let a = 0;a< objKPlayers.length;a++){

      roomList[objK[i]].players[objKPlayers[a]]


      let betsArr = roomList[objK[i]].players[objKPlayers[a]].bets;
      let totalBets = 0;

      for(let n = 0;n<betsArr.length;n++) totalBets+= +betsArr[n];
      console.log("log bello")
      console.log( roomList[objK[i]].players[objKPlayers[a]].id)

     await updatePlayerBalance( roomList[objK[i]].players[objKPlayers[a]].id,(+ roomList[objK[i]].players[objKPlayers[a]].balanceRoom)+(+totalBets))

     delete  roomList[objK[i]].players[objKPlayers[a]];
    }
  }
  updateRooms(roomList)

}


async function updatePlayerBalance(idPlayer,balanceInput) {


   let user =await findUserById(idPlayer);

   console.log(user,idPlayer)
  console.log(balanceInput)
   console.log("balance")
   console.log(user.balance+balanceInput)
  
  var myquery = { id: idPlayer};
  var newvalues = { $set: {balance: +(user.balance)+(+balanceInput)} };


  await dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
    console.log(err);
    if (err) throw err;
    console.log("1 document inserted");
 //   db.close();
  });
}

async function getSlot(dbo) {
   
  let returnOutput = null;




  let promise =await new Promise(function(resolve, reject) {
    console.log("ciao")

      dbo.collection("slot").find({}).toArray(async (err, result)=> {
      if (err) throw err;
       //console.log(result)
       resolve(result);
    });
  });






  returnOutput = await promise;
  return returnOutput;
}

async function findUserById(id) {
   
  let returnOutput = null;




  let promise =await new Promise(function(resolve, reject) {

      dbo.collection("users").findOne({id:id}, async (err, result)=> {
      if (err) throw err;
       //console.log(result)
       resolve(result);
    });
  });






  returnOutput = await promise;
  return returnOutput;
}
