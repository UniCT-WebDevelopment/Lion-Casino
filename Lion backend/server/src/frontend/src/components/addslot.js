(function () {
  
    window.addslot = async function (parent) {
      if (!window.accesstoken) {
        this.window.navigate("home");
        return;
      }
      console.log('found:', window.accesstoken);
      const result = await (await fetch('http://localhost:4000/addSlot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${window.accesstoken}`,
        },
      })).json();
      if (result.data) {
        parent.innerHTML = result.data;
        const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            });
    
            var buttonroom=document.getElementById("addSlot");
           
            buttonroom.addEventListener('click', async function() {
              if(document.getElementById("nomeSlot").value && document.getElementById("nomeSlot").value.replace(/ /g, '').length>0 && document.getElementById("descrizioneSlot").value  &&  document.getElementById("descrizioneSlot").value.replace(/ /g, '').length>0  && document.querySelector('#immagineSlot').files[0]){

                console.log("mikko puppo");
                const file = document.querySelector('#immagineSlot').files[0];
            
                let img=await toBase64(file);
                var obj={
                        nomeroom: document.getElementById("nomeSlot").value,
                        descrizione: document.getElementById("descrizioneSlot").value,
                        url: document.getElementById("urlSlot").value,
                        immagine: img
                };
                const result2=await (await fetch('http://localhost:3030/addSlot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                     authorization: `Bearer ${window.accesstoken}`,
                },
                body: JSON.stringify(obj),
                })).json();

              }else{
                alert("non worka un cazzo")
              }  
              
          }, false);
      } else {
        parent.innerHTML = "Not authorised!";
      }
    }
  }())

























