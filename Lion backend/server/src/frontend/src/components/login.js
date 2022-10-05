//let html = 
// `
// <div className="login-wrapper">
// <form id="login">
//   <div>Login</div>
//   <div className="login-input">
//     <input
//       value=''
//       type="text"
//       name="email"
//       placeholder="Email"
//       autoComplete="email"
//       id="email"
//     />
//     <input
//       value=''
//       type="password"
//       name="password"
//       autoComplete="current-password"
//       placeholder="Password"
//       id="password"
//     />
//     <button type="submit">Login</button>
//   </div>
// </form>
// </div>
// `




(function () {
  let html = `
  <html>
<head>
  <link rel="stylesheet" href="styles/site.css">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
  
</head>
<body>
<link rel="stylesheet" href="styles/site.css">
    <div class="divimage py-5" style="
    height: 100%;
">
      

        <div class="container">
          <div class="row justify-content-center align-items-center" style="height:100%">
                  <div class="card" style="width:500px">
                      <div class="card-body">
                          <form id="login">
                            <h2>Login</h2>
                            <hr class="colorgraph">
                              <div class="form-group">
                                <!-- <label >email</label> -->
                                  <input type="text" class="form-control" name="email" id="email" placeholder="Username">
                              </div>
                              <div class="form-group" style="margin-top: 20px;">
                                  <!-- <label >Password</label> -->
                                  <input type="password" class="form-control" name="password" id="password" placeholder="Password">
                              </div>
                              <button type="submit" id="sendlogin" class="btn " style="margin-top: 20px;background-color:#eb8d2a;">login</button>
                          </form>
                      </div>
                  </div>
          </div>
      </div>
      </div>
      

      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-A3rJD856KowSb7dwlZdYEkO39Gagi7vIsF0jrRAoQmDKKtQBHUuLZ9AsSv4jD4Xa" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.5/dist/umd/popper.min.js" integrity="sha384-Xe+8cL9oJa6tN/veChSP7q+mnSPaj5Bcu9mPX5F5xIGE0DVittaqT5lorf0EI7Vk" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.min.js" integrity="sha384-ODmDIVzN+pFdexxHEHFBQH3/9/vQ9uori45z4JjnFsRydbmQbmL5t1tQ0culUzyK" crossorigin="anonymous"></script>
    

</body>
</html>
  
  `
  const onLogin = async (e) => {
    e.preventDefault();
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;
    const result = await (await fetch('http://localhost:4000/login', {
      method: 'POST',
      credentials: 'include', // Needed to include the cookie
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })).json();
    if (result.accesstoken) {
      window.accesstoken = result.accesstoken;
      window.utente=result.user;
      //console.log("admin", " "+result.admin);
      if(this.window.accesstoken){
        document.getElementById("navbarregister").style.display="none";
        document.getElementById("navbarlogin").style.display="none";
        // document.getElementById("navbarlogout").style.display="block";
        document.getElementById("profilo").style.display="block";
        document.getElementById("navroulette").style.display="block";
        document.getElementById("navslot").style.display="block";
        if(result.user.admin && result.user.admin==1){
          document.getElementById("navbaradmin").style.display="block";
        }else{
          document.getElementById("navbaradmin").style.display="none";
        }  
        document.getElementById("username").innerHTML =  result.user.username;
        document.getElementById("saldo").innerHTML =  result.user.balance.toFixed(2);
      }else{
        document.getElementById("navbarregister").style.display="block";
        document.getElementById("navbarlogin").style.display="block";
        // document.getElementById("navbarlogout").style.display="none";
        document.getElementById("navbaradmin").style.display="none";
        document.getElementById("navroulette").style.display="none";
        document.getElementById("navslot").style.display="none";
        document.getElementById("profilo").style.display="none";
      }

      
      this.window.navigate("home");
      new AWN().success('Login eseguito', { labels: { success: "Info" }, durations: { success: 3000 } });

    } else {
      console.log(result.error);
      new AWN().alert('Errore nel login,controlla le credenziali', { labels: { alert: "Info" }, durations: { alert: 3000 } });

    }
  };

  var logoutUI = `
    <a id="logout" href='#'>Logout</a>
  `

  window.login = async function (parent) {
    let h = this.window.accesstoken ? logoutUI : html;
    parent.innerHTML = h;
 

    const form = document.getElementById('login');

    if (form) {
      form.addEventListener('submit', onLogin);
    }
    const logout = document.querySelector("#logout");
    if (!logout) return;
    logout.addEventListener('click', async () => {
      // new AWN().success('Logout eseguito', { labels: { success: "Info" }, durations: { success: 3000 } });

      await fetch('http://localhost:4000/logout', {
        method: 'POST',
        credentials: 'include', 
      });
      
      this.window.accesstoken = null;
      

      this.window.navigate("home");
    });
  }

}())