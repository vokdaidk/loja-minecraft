async function register(){
  try{
    const data = await api("/auth/register", {method:"POST", body:JSON.stringify({email:email.value,minecraft_nick:minecraft_nick.value,discord_nick:discord_nick.value,password:password.value})});
    localStorage.setItem("token", data.token); location.href="loja.html";
  }catch(e){alert(e.message)}
}
async function login(){
  try{
    const data = await api("/auth/login", {method:"POST", body:JSON.stringify({email:email.value,password:password.value})});
    localStorage.setItem("token", data.token); location.href="loja.html";
  }catch(e){alert(e.message)}
}
