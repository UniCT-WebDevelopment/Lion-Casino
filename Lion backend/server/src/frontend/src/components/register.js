let html = `
<div className="login-wrapper">
   <form id="register">
     <div>Register</div>
     <div className="login-input">
       <input
         value=''
         type="text"
         name="email"
         placeholder="Email"
         autoComplete="email"
         id="email"
       />
       <input
         value={password}
         type="password"
         name="password"
         autoComplete="current-password"
         placeholder="Password"
         id="password"
       />
       <button type="submit">Register</button>
     </div>
   </form>
 </div>`;




(function () {
  let html =`
  
  


    <div class="divimage py-5" style="
    height: 100%;
">

      

        <div class="container">
          <div class="row justify-content-center align-items-center" style="height:100%">
                  <div class="card" style="width:500px">
                      <div class="card-body">
                        <form id="register">
                            <h2>Registrati</h2>
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
                                <input type="text" name="display_name" id="display_name" class="form-control input-lg" placeholder="Username" tabindex="3">
                            </div>
                            <div class="form-group" style="margin-top: 20px;">
                                <input type="email" name="email" id="email" class="form-control input-lg" placeholder="Email" tabindex="4">
                            </div>
                            <div class="row" style="margin-top: 20px;">
                                <div class="col-xs-12 col-sm-6 col-md-6">
                                    <div class="form-group">
                                        <input type="password" name="password" id="password" class="form-control input-lg" placeholder="Password" tabindex="5">
                                    </div>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-6">
                                    <div class="form-group">
                                        <input type="password" name="password_confirmation" id="password_confirmation" class="form-control input-lg" placeholder="Confirm Password" tabindex="6">
                                    </div>
                                </div>
                            </div>
                            <button type="submit" id="sendlogin" class="btn " style="margin-top: 20px;width: fit-content;background-color:#eb8d2a;">Registrati</button>
                            
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
    let nome = document.querySelector("#first_name").value;
    let cognome = document.querySelector("#last_name").value;
    let username = document.querySelector("#display_name").value;

  if( email.replace(/ /g, '').length==0   ||
  password.replace(/ /g, '').length==0   ||  
  nome.replace(/ /g, '').length==0   ||
  cognome.replace(/ /g, '').length==0   ||  
  username.replace(/ /g, '').length==0   
  ){
    new AWN().alert('Errore nella registrazione', { labels: { alert: "Info" }, durations: { alert: 3000 } });

    return;
  }


    const result = await (await fetch('http://localhost:4000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome :nome,
        cognome:cognome,
        username:username,
        email: email,
        password: password,

      }),
    })).json();
    if (!result.error) {
      console.log(result.message);
      new AWN().success('Registrazione eseguita', { labels: { success: "Info" }, durations: { success: 3000 } });
      this.window.navigate("login");

      //navigate('/');
    } else {
      new AWN().alert('Errore nella registrazione', { labels: { alert: "Info" }, durations: { alert: 3000 } });

      console.log(result.error);
    }
  }

  window.register = function (parent) {
    parent.innerHTML = html;
    const form = document.getElementById('register');
    form.addEventListener('submit', register);
  };
}())