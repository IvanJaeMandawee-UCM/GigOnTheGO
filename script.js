function getStoredUsers() {
    // Retrieves the array of user objects from localStorage, or an empty array if none exists.
    return JSON.parse(localStorage.getItem('users')) || [];
}

function saveUsers(users) {
    // Saves the array of user objects back to localStorage.
    localStorage.setItem('users', JSON.stringify(users));
}

function setCurrentUser(user) {
    // Saves the currently logged-in user object to sessionStorage.
    if (user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        // Log out: remove the current user session.
        sessionStorage.removeItem('currentUser');
    }
}

function getCurrentUser() {
    // Retrieves the currently logged-in user object from sessionStorage.
    return JSON.parse(sessionStorage.getItem('currentUser'));
}

// --- Page-Specific Logic Handlers ---

function handleLoginPage() {
    const userNameInput = document.getElementById('userNameInput');
    const passwordInput = document.getElementById('passwordInput');
    const loginButton = document.getElementById('loginButton');
    const errorMessage = document.getElementById('errorMessage');

    if (loginButton) {
        loginButton.addEventListener('click', () => {
            const username = userNameInput.value.trim();
            const password = passwordInput.value.trim();

            if (!username || !password) {
                errorMessage.textContent = 'Please enter both email/mobile and password.';
                return;
            }

            const users = getStoredUsers();
            // Find user by email OR mobile number AND password
            const user = users.find(u => (u.email.toLowerCase() === username.toLowerCase() || u.mobile === username) && u.password === password);

            if (user) {
                setCurrentUser(user); // Set the logged-in user in session storage
                errorMessage.textContent = '';
                // Redirect to the inner/home page
                window.location.href = 'inner.html'; 
            } else {
                errorMessage.textContent = 'Invalid email/mobile or password.';
            }
        });
    }
}

function handleCreateAccountPage() {
    const btn = document.querySelector('.border .btn'); // Target the button inside the .border div
    
    if (btn && document.title.includes('Create Account')) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const email = document.getElementById('userName').value.trim();
            const pass = document.getElementById('password').value.trim();
            const mobile = document.getElementById('mobileNumber').value.trim();
            const firstName = document.getElementById('Name').value.trim();
            const surname = document.getElementById('Surname').value.trim();
            const midName = document.getElementById('middleName').value.trim();
            const addr = document.getElementById('address').value.trim();

            if (!email || !pass || !mobile || !firstName || !surname || !addr) {
                alert('Please fill in all required fields (Email, Password, Mobile, First Name, Surname, Address).');
                return;
            }
            
            // Basic email and mobile validation (optional but recommended)
            if (!email.includes('@')) {
                alert('Please enter a valid email address.');
                return;
            }

            const users = getStoredUsers();
            if (users.some(u => u.email.toLowerCase() === email.toLowerCase() || u.mobile === mobile)) {
                alert('An account with this email or mobile number already exists.');
                return;
            }

            const newUser = {
                email: email,
                password: pass, // In a real app, this should be hashed!
                mobile: mobile,
                firstName: firstName,
                surname: surname,
                middleName: midName,
                address: addr
            };

            users.push(newUser);
            saveUsers(users);

            // Redirect on successful account creation
            window.location.href = 'ConfirmNewAccount.html'; // Changed to redirect to login or a confirmation page
        });
    }
}

function handleAccountPage() {
    const user = getCurrentUser();
    const logoutBtn = document.querySelector('.logout-btn');

    if (document.title.includes('User Account Profile')) {
        if (!user) {
            // If no user is logged in, redirect to login page
            alert('You must be logged in to view your profile.');
            window.location.href = 'index.html'; // Assuming login page is index.html
            return;
        }

        // --- Display User Information ---
        
        // Full Name at the top
        document.querySelector('.name-box p').textContent = `${user.firstName} ${user.middleName ? user.middleName + '. ' : ''}${user.surname}`;

        // Detailed fields
        document.getElementById('firstName').textContent = user.firstName;
        document.getElementById('surname').textContent = user.surname;
        document.getElementById('midName').textContent = user.middleName || 'N/A'; // Use 'N/A' if middle name is empty
        document.getElementById('email').textContent = user.email;
        document.getElementById('mobile').textContent = user.mobile;
        document.getElementById('addr').textContent = user.address;

        // --- Logout Functionality ---
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                setCurrentUser(null); // Clear the session
               
                window.location.href = 'login.html'; // Redirect to login page
            });
        }
    }
}

// --- Initialization ---

// Check which page we are on and call the appropriate handler
document.addEventListener('DOMContentLoaded', () => {
    // We check the elements to determine which page we are on
    if (document.getElementById('loginButton')) {
        handleLoginPage();
    } else if (document.getElementById('userName') && document.title.includes('Create Account')) {
        handleCreateAccountPage();
    } else if (document.title.includes('User Account Profile')) {
        handleAccountPage();
    }
    
    // Add logic to check login status for protected pages like 'inner.html' or 'Account.html'
    // For 'inner.html', you would typically check if a user is logged in on page load.
    if (window.location.pathname.endsWith('inner.html')) {
         const user = getCurrentUser();
         if (!user) {
             // For a basic setup, you can redirect if not logged in
             // window.location.href = 'index.html'; 
             // Or just hide/disable protected elements
             console.log("User not logged in on inner page.");
         }
    }
});