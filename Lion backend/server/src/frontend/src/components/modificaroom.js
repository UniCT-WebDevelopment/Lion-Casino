(function () {
    let html = '<h1>Protected data </h1>';
  
    window.modificaroom = async function (parent) {
      if (!window.accesstoken) {
        this.window.navigate("login");
        return;
      }
      console.log('found:', window.accesstoken);
      const result = await (await fetch('http://localhost:4000/modificaRoom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${window.accesstoken}`,
        },
      })).json();
      if (result.data) {



        const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            });
    






        parent.innerHTML = result.data;
        const getR = await (await fetch('http://localhost:3030/getRooms', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${window.accesstoken}`,
        },
      })).json();
      if(getR){
        for(i=0;i<getR.length;i++){
          let element=document.getElementById("templateRoom").cloneNode(true);
          element.id="";
          element.setAttribute("roomId",getR[i].id);
          
          element.querySelector("input[name='nomeRoom']").value=getR[i].nomeroom;
          element.querySelector("input[name='descrizione']").value=getR[i].descrizione;

          element.querySelector("label[for='immagineRoom']").setAttribute("for","immagineRoom"+i)
          element.querySelector("input[id='immagineRoom']").setAttribute("id","immagineRoom"+i)
          element.querySelector("img[name='immagine']").src=getR[i].immagine;

          let fileInputElement = element.querySelector("input[id='immagineRoom"+i+"']")

          fileInputElement.onchange = async  function(e) { 
            let imgBase64= await toBase64(fileInputElement.files[0]);
            element.querySelector("img[name='immagine']").src= imgBase64;
          };

          let radio=element.querySelectorAll("input[type='radio']");
          for(let q of radio){
            q.setAttribute("name","inlineRadioOptions"+i);
          }
     element.querySelector("input[value='"+getR[i].puntata+"'][type='radio']").setAttribute("checked",true);




      var buttonroomEdit = element.querySelector("button[name='modificaBtn']");
      var buttonroomDelete = element.querySelector("button[name='cancellaBtn']");



      buttonroomDelete.addEventListener('click', async function() {


        var obj={

            id: element.getAttribute("roomId"),
          

    };


    
    
        const result2=await (await fetch('http://localhost:3030/removeRoom', {
             method: 'post',
             headers: {
                 'content-type': 'application/json',
                  authorization: `bearer ${window.accesstoken}`,
             },
             body: JSON.stringify(obj),
             })).json();

             if(result2.error){
              new AWN().alert('Errore nella cancellazione', { labels: { alert: "Info" }, durations: { alert: 3000 } });

                //todo trigger error
             }else{
              new AWN().success('Stanza eliminata', { labels: { success: "Info" }, durations: { success: 3000 } });

                element.remove();
                //todo trigger complete
             }


      });

      buttonroomEdit.addEventListener('click', async function() {





        console.log("trigger edit " + element.getAttribute("roomId"));
        let name =element.querySelector("input[type='radio']").getAttribute("name")

        var obj={

            id: element.getAttribute("roomId"),
            nomeroom:  element.querySelector("input[name='nomeRoom']").value,
            descrizione:  element.querySelector("input[name='descrizione']").value,
            immagine:  element.querySelector("img[name='immagine']").src,
            puntata:document.querySelector('input[name="'+name+'"]:checked').value

    };


    if(!(obj.nomeroom && obj.nomeroom .replace(/ /g, '').length>0 && obj.descrizione   &&  obj.descrizione.replace(/ /g, '').length>0  && obj.immagine && obj.puntata)){
        //todo trigger error field

        return;
    }

    
    
    
        const result2=await (await fetch('http://localhost:3030/editRoom', {
             method: 'post',
             headers: {
                 'content-type': 'application/json',
                  authorization: `bearer ${window.accesstoken}`,
             },
             body: JSON.stringify(obj),
             })).json();

             console.log(result2)
            if(result2.error){
              new AWN().alert('Errore nella modifica', { labels: { alert: "Info" }, durations: { alert: 3000 } });

                //todo trigger error
             }else{
              new AWN().success('Stanza modificata', { labels: { success: "Info" }, durations: { success: 3000 } });

                //todo trigger complete
             }


      });


      buttonroomDelete.addEventListener('click', async function() {
        console.log("trigger delete " + element.getAttribute("roomId"));


    });
           
//      buttonroom.addEventListener('click', async function() {
//        if(document.getElementById("nomeRoom").value && document.getElementById("nomeRoom").value.replace(/ /g, '').length>0 && document.getElementById("descrizione").value  &&  document.getElementById("descrizione").value.replace(/ /g, '').length>0  && document.querySelector('#immagineRoom').files[0] && document.querySelector('input[name="inlineRadioOptions"]:checked').value){

//          console.log("mikko puppo");
//          const file = document.querySelector('#immagineRoom').files[0];
     
//          let img=await toBase64(file);
//          var obj={
//                  nomeroom: document.getElementById("nomeRoom").value,
//                  descrizione: document.getElementById("descrizione").value,
//                  immagine: img,
//                  puntata:document.querySelector('input[name="inlineRadioOptions"]:checked').value
//          };
//          const result2=await (await fetch('http://localhost:3030/createRoom', {
//          method: 'POST',
//          headers: {
//              'Content-Type': 'application/json',
//               authorization: `Bearer ${window.accesstoken}`,
//          },
//          body: JSON.stringify(obj),
//          })).json();

//        }else{
//          alert("non worka un cazzo")
//        }  
       
//    }, false);


          document.getElementById("roomShow").append(element);
          element.style.display="block";

        }
      }
        
        
  
  
      } else {
        parent.innerHTML = "Not authorised!";
      }
    }
  }())
  
  
  
  