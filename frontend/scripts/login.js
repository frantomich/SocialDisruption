
const API = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberInput = document.getElementById('remember');
    const loginButton = document.querySelector('.login-button');

    // Muda o foco para o campo de senha ao pressionar Enter no campo de email:
    emailInput.addEventListener('keydown', (event) => {
        console.log(event.key);
        if (event.key === 'Enter') {
            password.focus();
        }
    });

    // Executa a tentativa de login ao pressionar Enter no campo de senha:
    passwordInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            loginButton.click();
        }
    });

    // Manipula o clique no botão de login:
    loginButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;
        const remember = rememberInput.checked;

        // Verifica se os campos estão preenchidos:
        if (!email || !password) {
            alert('Por favor, insira seu e-mail e senha.');
            return;
        }

        // Verifica se o email é válido:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, insira um email válido.');
            return;
        }

        // Realiza a tentativa de login:
        try {
            const response = await fetch(`${API}/login`, {
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
                alert(data.message || 'Falha no login!');
            }
        } catch (error) {
            console.error('Erro ao tentar fazer login:', error);
            alert('Ocorreu um erro ao tentar fazer login. Verifique o console para mais detalhes.');
        }
    });
});
