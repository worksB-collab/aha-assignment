import {getCookie} from "./utils.js";

document.addEventListener('DOMContentLoaded', async () => {
  const token = getCookie('token');
  const email = getCookie('email');
  const res = await fetch(`/auth/get-profile?email=${email}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  const data = await res.json();
  if (res.status === 200) {
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    nameField.innerText = data.name;
    emailField.innerText = data.email;
  } else {
    console.error('Failed to update name', data.message);
  }
});

const updateName = async (newName) => {
  const token = getCookie('token');
  const email = getCookie('email');
  try {
    const res = await fetch(`/auth/update-username`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({email, newName: newName})
    });
    const data = await res.json();
    if (res.status === 200) {
      document.getElementById('name').innerText = newName;
    } else {
      console.error('Failed to update name', data.message);
    }
  } catch (error) {
    console.error('Error updating name', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('apply-name-btn').addEventListener('click', async () => {
    const newName = document.getElementById('new-name').value;
    if (newName) {
      await updateName(newName);
    }
  });
});
