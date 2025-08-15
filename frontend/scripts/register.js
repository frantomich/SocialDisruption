document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('.register-form');
    const avatarInput = document.getElementById('avatar-input');
    const avatarButton = document.getElementById('avatar-button');
    const avatarPreview = document.getElementById('avatar-preview');
    let avatarBase64 = null;

    avatarButton.addEventListener('click', () => {
        avatarInput.click();
    });

    avatarInput.addEventListener('change', () => {
        const file = avatarInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                avatarPreview.src = e.target.result;
                avatarBase64 = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            avatarPreview.src = 'assets/user.png';
            avatarBase64 = null;
        }
    });

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const lastname = document.getElementById('lastname').value;
        const birthday = new Date(document.getElementById('birthday').value).toISOString();
        const country = document.getElementById('country').value;
        const relationship = document.getElementById('relationship').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }

        const userData = {
            email,
            password,
            name,
            lastname,
            avatar: avatarBase64,
            birthday,
            country,
            relationship
        };

        try {
            const response = await fetch('http://localhost:3000/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.status === 201) {
                alert('Cadastro realizado com sucesso! Você será redirecionado para a página de login.');
                window.location.href = 'login.html';
            } else {
                alert(data.message || 'Erro ao realizar o cadastro.');
            }
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            alert('Ocorreu um erro ao tentar se cadastrar. Verifique o console para mais detalhes.');
        }
    });
});
