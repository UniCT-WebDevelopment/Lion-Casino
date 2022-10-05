(function () {
  let html = '<h1>Protected data </h1>';

  window.protected = async function (parent) {
    if (!window.accesstoken) {
      this.window.navigate("login");
      return;
    }
    console.log('found:', window.accesstoken);
    const result = await (await fetch('http://localhost:4000/protected', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${window.accesstoken}`,
      },
    })).json();
    if (result.data) {
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
        element.getElementsByClassName("card")[0].addEventListener('click', function (event) {
          window.open("http"+':\/\/'+window.location.hostname+':3030?roomId='+element.getAttribute("roomId")+"&accessToken="+window.accesstoken, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
        });
        element.querySelector("h5[name='nomeRoom']").innerHTML=getR[i].nomeroom;
        element.querySelector("p[name='descrizione']").innerHTML=getR[i].descrizione;
        element.querySelector("p[name='descrizione']").setAttribute("title",getR[i].descrizione);

        element.querySelector("img[name='immagine']").src=getR[i].immagine;
        element.querySelector("div[name='over']").innerHTML=getR[i].puntata+"$"+" - "+"100$";
        document.getElementById("roomShow").append(element);
        element.style.display="flex";
  
      }
    }
      
      


    } else {
      parent.innerHTML = "Not authorised!";
    }
  }
}())



