document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const userTable = document.getElementById('userTable');

    // Load users from JSON
    function loadUsers() {
        return fetch('data.json')
            .then(response => response.json())
            .catch(() => ({ users: [] }));
    }

    // Save users to JSON
    function saveUsers(users) {
        return fetch('data.json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ users })
        });
    }

    // Register a new user
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            loadUsers().then(data => {
                const users = data.users;
                if (users.find(user => user.username === username)) {
                    alert('Username already exists!');
                } else {
                    users.push({ username, password, lastLogin: null, loginCount: 0 });
                    saveUsers(users).then(() => {
                        alert('User registered successfully!');
                        window.location.href = 'index.html';
                    });
                }
            });
        });
    }

    // Login a user
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            loadUsers().then(data => {
                const user = data.users.find(user => user.username === username && user.password === password);
                if (user) {
                    user.lastLogin = new Date().toISOString();
                    user.loginCount++;
                    saveUsers(data.users).then(() => {
                        alert('Login successful!');
                        window.location.href = 'index.html';
                    });
                } else {
                    alert('Invalid username or password!');
                }
            });
        });
    }

    // Display users in table
    if (userTable) {
        loadUsers().then(data => {
            const tbody = userTable.querySelector('tbody');
            data.users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${user.username}</td><td>${user.lastLogin || 'N/A'}</td><td>${user.loginCount}</td>`;
                tbody.appendChild(row);
            });
        });
    }
});
