import {getCookie} from "./utils.js";

document.addEventListener('DOMContentLoaded', async () => {
  await getProfile();
  await getAllUsers();
});

const getProfile = async () => {
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
    console.error('Failed to load profile', data.message);
    window.location.href = '/signin';
  }
}

const getAllUsers = async () => {
  const token = getCookie('token');
  const res = await fetch(`/auth/get-all-users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  const data = await res.json();
  if (res.status === 200) {
    const html = data.map((user) => {
      return `
        <div>
          <p>${user.name}</p>
          <p>${user.createTime}</p>
          <p>${user.loginCount}</p>
          <p>${user.lastLoginTime}</p>
        </div>
      `;
    });
    const userList = document.getElementById('user-list');
    userList.innerHTML = html;
  } else {
    console.error('Failed to load profile', data.message);
    // window.location.href = '/signin';
  }
}

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
    window.location.href = '/signin';
  }
}

const resetPassword = async (oldPassword, newPassword, repeatPassword) => {
  const token = getCookie('token');
  const email = getCookie('email');
  const statusText = document.getElementById('status');
  const oldPasswordField = document.getElementById('old-password');
  const newPasswordField = document.getElementById('new-password');
  const repeatPasswordField = document.getElementById('repeat-password');
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
      oldPasswordField.value = '';
      newPasswordField.value = '';
      repeatPasswordField.value = '';

    } else {
      console.error('Failed to update password', data.message);
      statusText.innerText = data.message;
    }
  } catch (error) {
    console.error('Error updating name', error);
    window.location.href = '/signin';
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

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('reset-password-btn').addEventListener('click', async () => {
    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;
    const repeatPassword = document.getElementById('repeat-password').value;
    await resetPassword(oldPassword, newPassword, repeatPassword);
  });
});
