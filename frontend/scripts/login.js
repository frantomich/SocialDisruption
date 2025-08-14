
document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.querySelector('.login-button');
    loginButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, remember })
            });

            const data = await response.json();

            if (response.ok) {
                if (remember) {
                    localStorage.setItem('token', data.token);
                } else {
                    sessionStorage.setItem('token', data.token);
                }
                window.location.href = 'main.html';
            } else {
                alert(data.message || 'Falha no login.');
            }
        } catch (error) {
            console.error('Erro ao tentar fazer login:', error);
            alert('Ocorreu um erro ao tentar fazer login. Verifique o console para mais detalhes.');
        }
    });
});
