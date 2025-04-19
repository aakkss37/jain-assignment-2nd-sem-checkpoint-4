// Authentication and user management module

// Function to load users from localStorage or initialize with default user
function loadUsers() {
    try {
        // Get users from localStorage
        const storedUsers = localStorage.getItem('users');
        
        // If users exist in localStorage, return them
        if (storedUsers) {
            return JSON.parse(storedUsers);
        } 
        
        // Otherwise, initialize with default user
        const defaultUsers = [
            {
                "fullname": "Demo User",
                "contact": "9876543210",
                "dob": "1990-01-01",
                "email": "demo@example.com",
                "password": "password123",
                "gender": "male"
            }
        ];
        
        // Save default users to localStorage
        localStorage.setItem('users', JSON.stringify(defaultUsers));
        return defaultUsers;
    } catch (error) {
        console.error('Error loading users:', error);
        return [];
    }
}

// Function to save users to localStorage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Function to register a new user
// Update the register and login functions to work with synchronous loadUsers
function registerUser(userData) {
    try {
        const users = loadUsers();
        // Check if email already exists
        if (users.some(user => user.email === userData.email)) {
            return { success: false, message: 'Email already registered' };
        }
        
        // Add new user
        users.push(userData);
        
        // Save to localStorage for persistence
        localStorage.setItem('users', JSON.stringify(users));
        
        return { success: true, message: 'Registration successful' };
    } catch (error) {
        console.error('Error registering user:', error);
        return { success: false, message: 'Registration failed' };
    }
}
// Function to validate login
function loginUser(email, password) {
    try {
        console.log('Attempting to login with email:', email, 'and password:', password);
        const users = loadUsers();
        const user = users.find(user => user.email === email && user.password === password);
        
        if (user) {
            // Store login state in localStorage
            localStorage.setItem('currentUser', JSON.stringify({
                fullname: user.fullname,
                email: user.email,
                isLoggedIn: true
            }));
            return { success: true, user: user };
        } else {
            return { success: false, message: 'Invalid email or password' };
        }
    } catch (error) {
        console.error('Error during login:', error);
        return { success: false, message: 'Login failed' };
    }
}

// Function to check if user is logged in
function isLoggedIn() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        return user.isLoggedIn === true;
    }
    return false;
}

// Function to get current user
function getCurrentUser() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
}

// Function to logout user
function logoutUser() {
    localStorage.removeItem('currentUser');
}

// Function to update UI based on login status
function updateUIForAuthState() {
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        if (isLoggedIn()) {
            const user = getCurrentUser();
            authButtons.innerHTML = `
                <span class="user-greeting">Hi, ${user.fullname.split(' ')[0]}!</span>
                <button id="logout-btn">Logout</button>
            `;
            document.getElementById('logout-btn').addEventListener('click', function() {
                logoutUser();
                window.location.href = 'index.html';
            });
        } else {
            authButtons.innerHTML = `
                <button><a href="login.html">Login</a></button>
                <button><a href="register.html">Register</a></button>
            `;
        }
    }
}