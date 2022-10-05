
const logoutbtn = document.querySelector("#logoutbtn");
const editUserBtn = document.querySelector("#settingBtn");





logoutbtn.addEventListener('click', async () => {
  await fetch('http://localhost:4000/logout', {
    method: 'POST',
    credentials: 'include', // Needed to include the cookie
  });
  // Clear user from context
  this.window.accesstoken = null;
  // document.cookie = 'accessToken=; Max-Age=0; path=/; domain=' + location.host;

  // Navigate back to startpage
  if(this.window.accesstoken){
    document.getElementById("navbarregister").style.display="none";
    document.getElementById("navbarlogin").style.display="none";
    // document.getElementById("navbarlogout").style.display="block";
    document.getElementById("profilo").style.display="block";
  }else{

    new AWN().success('Logout eseguito', { labels: { success: "Info" }, durations: { success: 3000 } });

    document.getElementById("navbarregister").style.display="block";
    document.getElementById("navbarlogin").style.display="block";
    // document.getElementById("navbarlogout").style.display="none";
    document.getElementById("navbaradmin").style.display="none";
    document.getElementById("profilo").style.display="none";
    document.getElementById("navroulette").style.display="none";
        document.getElementById("navslot").style.display="none";
  }
  this.window.navigate("home");



});