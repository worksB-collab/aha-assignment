import {getCookie} from "./cookieUtil.js";

document.addEventListener('DOMContentLoaded', async () => {
    await getProfile();
    await getAllUsers();
    await getStatistics();
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
};

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
        const html = data.reduce((acc, user) => {
            return acc + `
        <div class="field-container card">
          <div class="field card-field">
            <label>Name:</label>
            <p>${user.name}</p>
          </div>
          <div class="field card-field">
            <label>Create time:</label>
            <p>${user.createTime}</p>
          </div>
          <div class="field card-field">
            <label>Login count:</label>
            <p>${user.loginCount}</p>
          </div>
          <div class="field card-field">
            <label>Last login time:</label>
            <p>${user.lastLoginTime}</p>
          </div>
        </div>
      `;
        }, '');
        const userList = document.getElementById('user-list');
        userList.innerHTML = html;
    } else {
        console.error('Failed to load user list', data.message);
        window.location.href = '/signin';
    }
};

const getStatistics = async () => {
    const token = getCookie('token');
    const res = await fetch(`/auth/get-statistics`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    const data = await res.json();
    if (res.status === 200) {
        const totalNumSignUp = document.getElementById('total-number-sign-up');
        const activeSessionNumberToday = document.getElementById('active-session-number-today');
        const avgNumActiveSevenDaysRolling = document.getElementById('avg-number-active-seven-days-rolling');
        totalNumSignUp.innerText = data.totalNumSignUp;
        activeSessionNumberToday.innerText = data.activeSessionNumberToday;
        avgNumActiveSevenDaysRolling.innerText = data.avgNumActiveSevenDaysRolling;
    } else {
        console.error('Failed to load statistics', data.message);
        window.location.href = '/signin';
    }
};

const updateName = async (newName) => {
    const token = getCookie('token');
    const email = getCookie('email');
    try {
        const res = await fetch(`/auth/update-username`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({email, newName: newName})
        });
        const data = await res.json();
        if (res.status === 200) {
            document.getElementById('name').innerText = newName;
            document.getElementById('new-name').value = '';
        } else {
            console.error('Failed to update name', data.message);
        }
    } catch (error) {
        console.error('Error updating name', error);
        window.location.href = '/signin';
    }
};

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
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({email, oldPassword, newPassword, repeatPassword})
        });
        const data = await res.json();
        const idleTime = 2000;
        if (res.status === 200) {
            statusText.innerText = 'updated!';
            oldPasswordField.value = '';
            newPasswordField.value = '';
            repeatPasswordField.value = '';
            setTimeout(() => {
                statusText.innerText = '';
            }, idleTime);
        } else {
            console.error('Failed to update password', data.message);
            statusText.innerText = data.message;
            setTimeout(() => {
                statusText.innerText = '';
            }, idleTime);
        }
    } catch (error) {
        console.error('Error updating password', error);
        window.location.href = '/signin';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('apply-name-btn');
    button.addEventListener('click', async () => {
        button.disabled = true;
        const newName = document.getElementById('new-name').value;
        if (newName) {
            await updateName(newName);
            button.disabled = false;
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('reset-password-btn');
    button.addEventListener('click', async () => {
        button.disabled = true;
        const oldPassword = document.getElementById('old-password').value;
        const newPassword = document.getElementById('new-password').value;
        const repeatPassword = document.getElementById('repeat-password').value;
        await resetPassword(oldPassword, newPassword, repeatPassword);
        button.disabled = false;
    });
});
