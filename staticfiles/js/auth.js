// auth.js - Handles login form, password toggle, and Google login integration

document.addEventListener('DOMContentLoaded', function () {

  const loginForm = document.getElementById('login');
  const loginBtn = document.getElementById('loginBtn');
  const spinner = document.getElementById('loginSpinner');
  const togglePwd = document.getElementById('togglePassword');
  const usernameError = document.getElementById('usernameError');
  const passwordError = document.getElementById('passwordError');

  // Helper to show spinner and disable button
  function setLoading(isLoading) {
    if (isLoading) {
      loginBtn.disabled = true;
      if (spinner) spinner.classList.remove('hidden');
      spinner.classList.add('inline-block', 'animate-spin');
    } else {
      loginBtn.disabled = false;
      if (spinner) spinner.classList.add('hidden');
      spinner.classList.remove('inline-block', 'animate-spin');
    }
  }

  // Password visibility toggle
  if (togglePwd) {
    togglePwd.addEventListener('click', function () {
      const pwdInput = document.getElementById('password');
      if (pwdInput.type === 'password') {
        pwdInput.type = 'text';
        this.innerHTML = '<i class="fas fa-eye-slash"></i>';
      } else {
        pwdInput.type = 'password';
        this.innerHTML = '<i class="fas fa-eye"></i>';
      }
    });
  }

  // Submit login via fetch with client‑side validation
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Clear previous errors
      if (usernameError) usernameError.classList.add('hidden');
      if (passwordError) passwordError.classList.add('hidden');

      const username = loginForm.username.value.trim();
      const password = loginForm.password.value.trim();
      let hasError = false;

      if (!username) {
        if (usernameError) { usernameError.textContent = 'Username is required'; usernameError.classList.remove('hidden'); }
        hasError = true;
      }
      if (!password) {
        if (passwordError) { passwordError.textContent = 'Password is required'; passwordError.classList.remove('hidden'); }
        hasError = true;
      }
      if (hasError) return;

      const formData = new FormData(loginForm);
      setLoading(true);
      fetch(loginForm.action, {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
      })
        .then(resp => {
          // Ensure we get JSON even on non‑200 responses
          return resp.json().catch(() => ({}));
        })
        .then(function (data) {
          if (data && data.success) {
            Swal.fire({icon: 'success', title: 'Login successful', timer: 1500, showConfirmButton: false});
            setTimeout(() => { window.location.href = '/'; }, 1500);
          } else {
            Swal.fire({icon: 'error', title: 'Login failed', text: (data && data.error) || 'Invalid credentials'});
          }
        })
        .catch(function (err) {
          Swal.fire({icon: 'error', title: 'Error', text: err.message});
        })
        .finally(function () {
          setLoading(false);
        });
    });
  }

  // Google login button redirects to allauth URL
  const googleBtn = document.getElementById('googleLoginBtn');
  if (googleBtn) {
    googleBtn.addEventListener('click', function () {
      const url = this.getAttribute('data-href');
      if (url) window.location.href = url;
    });
  }
});
