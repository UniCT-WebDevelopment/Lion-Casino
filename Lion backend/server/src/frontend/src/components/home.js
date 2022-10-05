{/* <h1 class="display-5 fw-bolder text-white mb-2">Vuoi diventare il maestro del fumo?</h1>
                  <p class="lead text-white-50 mb-4">per diventare il maestro del fumo , ascolta i consigli di mirko.</p>
                   */}

(function () {
  var html = `
  <header class="divimage">
  <div class="divContainer">
  <div class="row gx-5 justify-content-center" style="height: fit-content;">

          <div class="animationOpacity d-grid gap-3 d-sm-flex justify-content-sm-center" style="opacity:0;height: fit-content;">
          <div style="
          display: flex;
          text-align: center;
          justify-content: center;
          flex-flow: column;
          align-items: center;
          padding-left: 10%;
    padding-top: 15%;
      ">
          <h1 class="display-5 fw-bolder  mb-2" style="color:#eb8d2a;">Non sei ancora registrato?</h1>
                  <p class="lead text-white mb-4" >Se non sei registrato, fallo! Altrimenti inizia a perdere soldi!</p>

                  <div style="display:flex;">
                  <a class="btn  btn-lg px-4 me-sm-3" style="background-color:#eb8d2a;" id="bregistrati" href="http://localhost:4000/src/public/index.html?section=register">Registrati</a>
                      <a class="btn btn-outline-light btn-lg px-4"  href="http://localhost:4000/src/public/index.html?section=login">Iscriviti</a>
                  </div>
              
        
          
      </div>
  </div>
</div>
  <div id="immagineCinisi" class="animationRightToLeft">    
              </div>
              </div>


               <div class="d-flex justify-content-center" style="flex-direction:column;align-items:center;">
               <h2 class=" fw-bolder  mb-2" style="color:#eb8d2a;margin-top:30px;">Lion casino</h2>
             <p class=" text-white" style="width: 60%;
             font-size: 20px;" >Su Lion casinò puoi vivere il divertimento e le emozioni dei giochi da casinò quando vuoi, dove vuoi: i giochi sono disponibili su computer, tablet e smartphone, per darti il massimo del divertimento sia da casa che quando sei in giro. LionCasino offre un’ampia gamma di giochi classici come Roulette e Blackjack, innovative Slot machine, giochi live, fantastiche offerte di benvenuto e bonus e promozioni tutti i giorni. L'ambiente di gioco è sicuro e protetto grazie a tecnologie d'avanguardia e al pieno rispetto della normativa imposta dall'ente regolatore italiano.
             </p>

              
             </div>
</header>
  `;


  window.home = async function (parent) {
    parent.innerHTML = html;
  }
}());


