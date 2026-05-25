const API_URL = "http://localhost:3000/api";
function getToken(){ return localStorage.getItem("token"); }
async function api(path, options = {}){
  const headers = { "Content-Type":"application/json", ...(options.headers || {}) };
  const token = getToken();
  if(token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if(!res.ok) throw new Error(data.error || "Erro na requisição");
  return data;
}
