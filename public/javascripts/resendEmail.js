import {getCookie} from "./utils.js";

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('resendEmail');
  button.onclick = async () => {
    button.disabled = true;
    const email = getCookie('email');
    const res = await fetch(`https://aha-pink.vercel.app/auth/resend-email?email=${email}`, {
      method: 'GET'
    });
    const data = await res.json();
    const statusText = document.getElementById('status');
    statusText.innerText = data.message;
    setTimeout(() => {
      statusText.innerText = '';
      button.disabled = false;
    }, 2000);
  };
});
