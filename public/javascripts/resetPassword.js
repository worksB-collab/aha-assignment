import {getCookie} from "./utils";

const resetPassword = async (oldPassword, newPassword, repeatPassword) => {
  const token = getCookie('token');
  const email = getCookie('email');
  const statusText = document.getElementById('status');
  statusText.innerText = '';

  try {
    const res = await fetch(`/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({email, oldPassword, newPassword, repeatPassword})
    });
    const data = await res.json();
    if (res.status === 200) {
      statusText.innerText = 'updated!';
    } else {
      console.error('Failed to update password', data.message);
      statusText.innerText = 'failed to reset password!';
    }
  } catch (error) {
    console.error('Error updating name', error);
    window.location.href = '/signin';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('reset-password-btn').addEventListener('click', async () => {
    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;
    const repeatPassword = document.getElementById('repeat-password').value;
    await resetPassword(oldPassword, newPassword, repeatPassword);
  });
});
