



(function () {
  let htmlSetting =`
  
  


    <div class="divimage py-5" style="
    height: 100%;
">

      

        <div class="container">
          <div class="row justify-content-center align-items-center" style="height:100%">
                  <div class="card" style="width:500px">
                      <div class="card-body">
                        <form id="register">
                            <h2>Modifica account</h2>
                            <hr class="colorgraph">
                            <div class="row">
                                <div class="col-xs-12 col-sm-6 col-md-6">
                                    <div class="form-group">
                                        <input type="text" name="first_name" id="first_name" class="form-control input-lg" placeholder="Nome" tabindex="1">
                                    </div>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-6">
                                    <div class="form-group">
                                        <input type="text" name="last_name" id="last_name" class="form-control input-lg" placeholder="cognome" tabindex="2">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-group" style="margin-top: 20px;">
                                <input type="email" name="email" id="email" class="form-control input-lg" placeholder="Email" tabindex="4">
                            </div>
                            <div class="row" style="margin-top: 20px;">
                                <div class="col-xs-12 col-sm-6 col-md-6">
                                    <div class="form-group">
                                        <input type="password" name="password" id="password" class="form-control input-lg" placeholder="nuova password" tabindex="5">
                                    </div>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-6">
                                    <div class="form-group">
                                        <input type="password" name="password_confirmation" id="password_confirmation" class="form-control input-lg" placeholder="Confirm Password" tabindex="6">
                                    </div>
                                </div>
                            </div>
                            <button type="submit" id="sendlogin" class="btn btn-primary" style="margin-top: 20px;width: fit-content;background-color:#eb8d2a;">Modifica dati</button>
                            
                            </div>
                            
                           
                        </form>
                      </div>
                  </div>
          </div>
      </div>
      </div>
      


  
  
  
  
  `;

  const register = async (e) => {
    e.preventDefault();
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;
    let password_confirmation = document.querySelector("#password_confirmation").value;

    let nome = document.querySelector("#first_name").value;
    let cognome = document.querySelector("#last_name").value;

  if( email.replace(/ /g, '').length==0   ||
  nome.replace(/ /g, '').length==0   ||
  cognome.replace(/ /g, '').length==0   
  ||  

  password_confirmation != password

  ){

    new AWN().alert('Errore nella modifica', { labels: { alert: "Info" }, durations: { alert: 3000 } });

    return;
  }

  console.log(password_confirmation,password)


    const result = await (await fetch('http://localhost:4000/modificaUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${window.accesstoken}`,

      },
      body: JSON.stringify({
        nome :nome,
        cognome:cognome,
        email: email,
        password: password,

      }),
    })).json();
    if (!result.error) {
      console.log(result.message);
      new AWN().success('Modifica eseguita', { labels: { success: "Info" }, durations: { success: 3000 } });

      //navigate('/');
    } else {
      new AWN().alert('Errore nella modifica dei dati', { labels: { alert: "Info" }, durations: { alert: 3000 } });

      console.log(result.error);
    }
  }

  window.setting = async function (parent) {
    parent.innerHTML = htmlSetting;
    const form = document.getElementById('register');
    form.addEventListener('submit', register);


    const result = await (await fetch('http://localhost:4000/getUser', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${window.accesstoken}`,

      },
    })).json();

    if(result.error){
        new AWN().alert('Errore nella ricezione dei dati', { labels: { alert: "Info" }, durations: { alert: 3000 } });
        this.window.navigate("home");

    }else{

        document.getElementById("first_name").value = result.nome;
        document.getElementById("last_name").value = result.cognome;

        document.getElementById("email").value = result.email;

    }



  };
}())