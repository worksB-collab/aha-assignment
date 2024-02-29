import {getCookie} from "./utils.js";

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('resendEmail');
  button.onclick = async () => {
    const email = getCookie('email');
    const res = await fetch(`/auth/resend-email?email=${email}`, {
      method: 'GET'
    });
    const data = await res.json();
    console.log(data);
  };
});
