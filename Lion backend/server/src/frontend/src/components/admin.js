(function () {
  
    window.admin = async function (parent) {
      if (!window.accesstoken) {
        this.window.navigate("home");
        return;
      }
      
      const result = await (await fetch('http://localhost:4000/admin', {
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
    
            var buttonroom=document.getElementById("addRoom");
           
            buttonroom.addEventListener('click', async function() {
              if(document.getElementById("nomeRoom").value && document.getElementById("nomeRoom").value.replace(/ /g, '').length>0 && document.getElementById("descrizione").value  &&  document.getElementById("descrizione").value.replace(/ /g, '').length>0  && document.querySelector('#immagineRoom').files[0] && document.querySelector('input[name="inlineRadioOptions"]:checked').value){

               
                const file = document.querySelector('#immagineRoom').files[0];
            
                let img=await toBase64(file);
                var obj={
                        nomeroom: document.getElementById("nomeRoom").value,
                        descrizione: document.getElementById("descrizione").value,
                        immagine: img,
                        puntata:document.querySelector('input[name="inlineRadioOptions"]:checked').value
                };
                const result2=await (await fetch('http://localhost:3030/createRoom', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                     authorization: `Bearer ${window.accesstoken}`,
                },
                body: JSON.stringify(obj),
                })).json();
                
                
                
              }else{
                window.navigate("home");
                alert("non worka ")
              }  
              
          }, false);
         
      } else {
        parent.innerHTML = "Not authorised!";
      }
    }
  }())


























// (function () {
//     let html =`
  
  


//     <div class="divimage py-5" style="
//     height: 100%;
// ">

      

//         <div class="container">
//           <div class="row justify-content-center align-items-center" style="height:100%">
//               <div class="col-4">
//                   <div class="card">
//                       <div class="card-body">
//                         <form id="register">
//                             <h2>Aggiungi una stanza</h2>
//                             <hr class="colorgraph">
                           
//                             <div class="form-group" style="margin-top: 20px;">
//                                 <input type="text" name="display_name" id="display_name" class="form-control input-lg" placeholder="Nome stanza" tabindex="3">
//                             </div>
//                             <div class="form-check form-check-inline" style="margin-top: 20px;">
//                                 <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" >
//                                 <label class="form-check-label" for="inlineRadio1">0.10</label>
//                             </div>
//                             <div class="form-check form-check-inline">
//                                 <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2">
//                                 <label class="form-check-label" for="inlineRadio2">0.50</label>
//                             </div>
//                             <div class="form-check form-check-inline">
//                                 <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option3">
//                                 <label class="form-check-label" for="inlineRadio2">1</label>
//                             </div>
//                             <div class="form-check form-check-inline">
//                                 <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option4">
//                                 <label class="form-check-label" for="inlineRadio2">5</label>
//                             </div>
//                             <div class="form-check form-check-inline">
//                                 <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option5">
//                                 <label class="form-check-label" for="inlineRadio2">25</label>
//                             </div>
//                             <div class="form-check form-check-inline">
//                                 <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option6">
//                                 <label class="form-check-label" for="inlineRadio2">100</label>
//                             </div>
                            
//                             <button type="submit" id="sendlogin" class="btn btn-primary" style="margin-top: 20px;width: fit-content;">Crea stanza</button>
                            
//                             </div>
                            
                           
//                         </form>
//                       </div>
//                   </div>
//               </div>
//           </div>
//       </div>
//       </div>
      


  
  
  
  
//   `;
//     window.admin = async function (parent) {
//       parent.innerHTML = html;
//     }
//   }());