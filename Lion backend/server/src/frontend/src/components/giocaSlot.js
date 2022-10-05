(function () {
    let html = '<h1>Protected data </h1>';
  
    window.giocaSlot = async function (parent) {
      if (!window.accesstoken) {
        this.window.navigate("login");
        return;
      }
      console.log('found:', window.accesstoken);
      const result = await (await fetch('http://localhost:4000/giocaSlot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${window.accesstoken}`,
        },
      })).json();
      if (result.data) {
        parent.innerHTML = result.data;
        const getR = await (await fetch('http://localhost:3030/getSlot', {
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
          element.setAttribute("roomId",getR[i].url);
          element.getElementsByClassName("card")[0].addEventListener('click', function (event) {
            
            window.open(element.getAttribute("roomId"));
          });
          element.querySelector("h5[name='nomeRoom']").innerHTML=getR[i].nomeroom;
          element.querySelector("p[name='descrizione']").innerHTML=getR[i].descrizione;
          element.querySelector("p[name='descrizione']").setAttribute("title",getR[i].descrizione);
  
          element.querySelector("img[name='immagine']").src=getR[i].immagine;
          document.getElementById("roomShow").append(element);
          element.style.display="flex";
    
        }
      }
        
        
  
  
      } else {
        parent.innerHTML = "Not authorised!";
      }
    }
  }())
  
  
  
  