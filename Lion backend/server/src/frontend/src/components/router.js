function route(path) {
  alert(path);
}

let links = document.querySelectorAll('.nav-item');
let contentRoot = document.querySelector("#content");

//prende l'addributo datalink in index html(nomi delle pagine ) e al click binda navigate.
for (var i = 0; i < links.length; i++) {
  console.log(links[i]);
  links[i].addEventListener('click', function (e) {
    let link = e.target.parentNode.dataset.navLink;
    navigate(link);
    
  });
}



//invoca la funzione asyncrona passando il div container. Link è l'attributo data nav link.
const navigate = (link) => {
  if(!window[link]){
    link="notfound";
  }
  window[link](contentRoot);
  const url=new URL(window.location);
  url.searchParams.set('section',link);
  window.history.pushState(null,'',url.toString());

}



async function checkRefreshToken() {
  console.log(document.cookie,"prova");

  setTimeout(() => {
    console.log(document.cookie);

  }, 1000);

  const result = await (
    await fetch('http://localhost:4000/refresh_token', {
      method: 'POST',
      credentials: 'include', // Needed to include the cookie
      headers: {
        'Content-Type': 'application/json',
      }
    })).json();

    
    
  window.accesstoken = result.accesstoken;
  window.navigate = navigate;
  const url=new URL(window.location);
  let par=url.searchParams.get('section');
  if(par){
    navigate(par);
  }


  if(this.window.accesstoken){
    document.getElementById("navbarregister").style.display="none";
    document.getElementById("navbarlogin").style.display="none";
    // document.getElementById("navbarlogout").style.display="block";
    document.getElementById("profilo").style.display="block";
    document.getElementById("navroulette").style.display="block";
    document.getElementById("navslot").style.display="block";
    const resultUser = await (
      await fetch('http://localhost:4000/getUser', {
        method: 'GET',
        credentials: 'include', // Needed to include the cookie
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${window.accesstoken}`,
        }
      })).json();
      if(resultUser){
        document.getElementById("username").innerHTML =  resultUser.username;
        document.getElementById("saldo").innerHTML =  resultUser.balance.toFixed(2);
        if(resultUser.admin==1)document.getElementById("navbaradmin").style.display="block";
        else document.getElementById("navbaradmin").style.display="none";
      }
    
  }else{
    document.getElementById("navbarregister").style.display="block";
    document.getElementById("navbarlogin").style.display="block";
    // document.getElementById("navbarlogout").style.display="none";
    document.getElementById("navbaradmin").style.display="none";
    document.getElementById("navroulette").style.display="none";
    document.getElementById("navslot").style.display="none";
    document.getElementById("profilo").style.display="none";
  }
  // if(result.accesstoken)
  // document.cookie = "accessToken="+result.accesstoken;
  // else       document.cookie = 'accessToken=; Max-Age=0; path=/; domain=' + location.host;


}

//window.navigate = navigate;

checkRefreshToken();


// const url=new URL(window.location);
//   let par=url.searchParams.get('section');
//   if(par){
//     navigate(par);
//   }



