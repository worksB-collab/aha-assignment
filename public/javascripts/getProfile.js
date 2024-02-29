import {getCookie} from "./utils.js";

document.addEventListener('DOMContentLoaded', async () => {
  const token = getCookie('token');
  const res = await fetch(`/auth/get-profile?token=${token}`, {
    method: 'GET'
  });
  const data = await res.json();
  console.log('data', data)

  const name = document.getElementById('name');
  const email = document.getElementById('email');
  name.innerText = data.user.name;
  email.innerText = data.user.email;
});