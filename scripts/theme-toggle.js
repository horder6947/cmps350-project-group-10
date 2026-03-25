// reads the saved theme from localstorage and sets it
// so the page doesnt flash white when you reload in dark mode

const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

const toggleBtn = document.getElementById('theme-toggle');

if (toggleBtn) {
    // show the right icon based on current theme
    toggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

    toggleBtn.addEventListener('click', function () {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);

        // swap the icon
        toggleBtn.textContent = next === 'dark' ? '☀️' : '🌙';
    });
}
