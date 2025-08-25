const API = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', async() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const registerForm = document.querySelector('.register-form');
    const avatarInput = document.getElementById('avatar-input');
    const avatarButton = document.getElementById('avatar-button');
    const avatarPreview = document.getElementById('avatar-preview');
    const cancelButton = document.getElementById('form-cancel');
    let id = null;
    let avatar = null;

    // Manipula o clique no botão de cancelar:
    cancelButton.addEventListener('click', () => {
        if (token) {
            window.location.href = './main.html';
        } else {
            window.location.href = './login.html';
        }
    });

    // Manipula o clique no botão de selecionar avatar:
    avatarButton.addEventListener('click', () => {
        avatarInput.click();
    });

    // Manipula a mudança no input de avatar:
    avatarInput.addEventListener('change', () => {
        const file = avatarInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                avatarPreview.src = e.target.result;
                //avatar = e.target.result;
                avatar = null; // Desativa o upload de avatar
            };
            reader.readAsDataURL(file);
        } else {
            avatarPreview.src = '../assets/user.png';
            avatar = null;
        }
    });
    
    // Verifica se o usuário está logado para carregar os dados para edição:
    if (token) {
        const response = await fetch(`${API}/session/user`, {
                method: 'GET',
                headers: {
                    'Authorization': `${token}`
                }
        });

        if (!response.ok) {
            console.error("Failed to fetch session user:");
            window.location.href = './main.html';
        }

        const data = await response.json()

        // Ajusta o formulário para o modo de edição:
        document.getElementById('form-title').textContent = 'Editar Perfil';
        document.getElementById('form-description').textContent = 'Atualize seus dados para continuar se divertindo com a vida alheia.';
        document.getElementById('password').parentElement.style.display = 'none';
        document.getElementById('password').disabled = true;
        document.getElementById('confirm-password').parentElement.style.display = 'none';
        document.getElementById('confirm-password').disabled = true;
        document.getElementById('form-submit').textContent = 'Atualizar';
        
        // Preenche os campos com os dados do usuário:
        id = data.user.id;
        document.getElementById('email').value = data.user.email || '';
        document.getElementById('name').value = data.user.name || '';
        document.getElementById('lastname').value = data.user.lastname || '';
        document.getElementById('birthday').value = data.user.birthday ? new Date(data.user.birthday).toISOString().split('T')[0] : '';
        document.getElementById('country').value = data.user.country || '';
        document.getElementById('relationship').value = data.user.relationship || '';
    }

    // Manipula o envio do formulário de registro/edição:
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Coleta os dados do formulário:
        const name = document.getElementById('name').value;
        const lastname = document.getElementById('lastname').value;
        const birthday = new Date(document.getElementById('birthday').value).toISOString();
        const country = document.getElementById('country').value;
        const relationship = document.getElementById('relationship').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Verifica se as senhas coincidem:
        if (password !== confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }

        // Prepara os dados para envio:
        const userData = {
            id,
            email,
            password,
            name,
            lastname,
            avatar,
            birthday,
            country,
            relationship
        };

        if (!id) {
            // Realiza o registro do novo usuário:
            try {
                const response = await fetch(`${API}/session/user`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                const data = await response.json();

                if (response.status === 201) {
                    alert('Cadastro realizado com sucesso!');
                    window.location.href = './login.html';
                } else {
                    alert(data.message || 'Erro ao realizar o cadastro.');
                }
            } catch (error) {
                console.error('Erro ao cadastrar usuário:', error);
                alert('Ocorreu um erro ao tentar se cadastrar!');
            }
        } else {
            // Realiza a atualização dos dados do usuário:
            try {
                const response = await fetch(`${API}/user`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                const data = await response.json();

                if (response.status === 200) {
                    alert('Perfil atualizado com sucesso!');
                    window.location.href = './main.html';
                } else {
                    alert(data.message || 'Erro ao atualizar o perfil!');
                }
            } catch (error) {
                console.error('Erro ao atualizar o perfil:', error);
                alert('Ocorreu um erro ao tentar atualizar o perfil!');
                window.location.href = './main.html';
            }
        }
    });
});
