const API = 'http://localhost:3000/api';
let token;
let sessionUser;
let currentUser;

// Função para buscar os dados do usuário da sessão autenticada:
async function fetchSessionUser() {
    try {
        // Obtém o token do armazenamento local ou de sessão:
        token = localStorage.getItem('token') || sessionStorage.getItem('token');

        // Verifica se o token foi encontrado:
        if (!token) return null;

        // Busca os dados do usuário da sessão autenticada:
        const response = await fetch(`${API}/session/user`, {
                method: 'GET',
                headers: {
                    'Authorization': `${token}`
                }
        });

        // Verifica se a resposta foi bem-sucedida:
        if (!response.ok) return null;

        const data = await response.json();

        return data.user;
    } catch (error) {
        console.error('Erro ao buscar os dados do usuário:', error);
        return null;
    }
}

// Função para buscar os dados de um usuário pelo ID:
async function fetchUser(userID) {
    try {
        const response = await fetch(`${API}/user/${userID}`);

        if (!response.ok) return null;

        const data = await response.json();

        return data.user;
    } catch (error) {
        console.error('Erro ao buscar o usuário:', error);
        return null;
    }
}

// Função para buscar os posts de um usuário pelo ID do autor:
async function fetchPosts(author) {
    try {
        const response = await fetch(`${API}/posts/${author}`);

        if (!response.ok) return null;

        const data = await response.json();

        return data.posts;
    } catch (error) {
        console.error('Erro ao buscar os posts:', error);
        return null;
    }
}

// Função para buscar os amigos de um usuário pelo ID do usuário:
async function fetchFriends(userID) {
    try {
        const response = await fetch(`${API}/friends/${userID}/Aceito`);

        if (!response.ok) return null;

        const data = await response.json();
        return data.friends;

    } catch (error) {
        return null;
    }
}

// Função para buscar o status de amizade entre o usuário da sessão e outro usuário pelo ID:
async function fetchFriendship(userID) {
    try {
        const response = await fetch(`${API}/friendship/${sessionUser.id}/${userID}`);

        if (!response.ok) return null;

        const data = await response.json();

        return data.friendship;
    } catch (error) {
        console.error('Erro ao buscar o status de amizade:', error);
        return null;
    }
}

// Função para enviar uma solicitação de amizade a outro usuário pelo ID:
async function requestFriendship(userID) {
    try {
        const response = await fetch(`${API}/friendship`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ requester: sessionUser.id, requested: userID })
        });
        if (!response.ok) return null;
        const data = await response.json();
        return data.friendship;
    } catch (error) {
        console.error('Erro ao solicitar amizade:', error);
        return null;
    }
}

// Função para aceitar uma solicitação de amizade de outro usuário pelo ID:
async function acceptFriendship(userID) {
    try {
        const response = await fetch(`${API}/friendship/accept`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ requester: userID, requested: sessionUser.id })
        });

        if (!response.ok) return null;

        const data = await response.json();
        return data.friendship;
    } catch (error) {
        console.error('Erro ao aceitar a amizade:', error);
        return null;
    }
}

// Função para recusar uma solicitação de amizade de outro usuário pelo ID:
async function declineFriendship(userID) {
    try {
        const response = await fetch(`${API}/friendship/decline`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ requester: userID, requested: sessionUser.id })
        });
        if (!response.ok) return null;
        const data = await response.json();
        return data.friendship;
    } catch (error) {
        console.error('Erro ao recusar a amizade:', error);
        return null;
    }
}

// Função para mostrar uma caixa de diálogo para aceitar ou recusar a amizade:
async function acceptFriendshipDialogue(userID) {
    // Mostra uma caixa de diálogo para aceitar ou recusar a amizade:
    const confirmation = confirm('Deseja aceitar ou recusar a solicitação de amizade?\nClique em "OK" para aceitar ou "Cancelar" para recusar.');
    if (confirmation) {
        const acceptedFriendship = await acceptFriendship(userID);
        if (acceptedFriendship) {
            alert('Amizade aceita!');
            return acceptedFriendship;
        }
    } else {
        const declinedFriendship = await declineFriendship(userID);
        if (declinedFriendship) {
            alert('Amizade recusada!');
            return declinedFriendship;
        }
    }
    return null;
}

// Função para desfazer uma amizade com outro usuário pelo ID:
async function undoFriendship(userID) {
    try {
        const response = await fetch(`${API}/friendship/undo`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ requester: sessionUser.id, requested: userID })
        });
        if (!response.ok) return null;
        const data = await response.json();
        return data.friendship;
    } catch (error) {
        console.error('Erro ao desfazer a amizade:', error);
        return null;
    }
}
// Função para mostrar uma caixa de diálogo para desfazer a amizade:
async function undoFriendshipDialogue(userID) {
    const confirmation = confirm('Tem certeza de que deseja desfazer a amizade?');
    if (confirmation) {
        const undoneFriendship = await undoFriendship(userID);
        if (undoneFriendship) {
            alert('Amizade desfeita!');
            return undoneFriendship
        }
    }
    return null;
}

// Função para buscar os posts do feed de um usuário (posts dos amigos):
async function fetchFeedPosts(userID) {
    try {
        const friends = await fetchFriends(userID);
        if (!friends) return null;
        let allPosts = [];
        for (const friend of friends) {
            const friendPosts = await fetchPosts(friend.id);
            if (friendPosts) {
                allPosts = allPosts.concat(friendPosts);
            }
        }
        // Ordena os posts por data de criação, do mais recente ao mais antigo:
        allPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return allPosts;
    } catch (error) {
        console.error('Erro ao buscar os posts do feed:', error);
        return null;
    }
}

// Função para publicar um novo post:
async function publicatePost(author, content) {
    try {
        const response = await fetch(`${API}/post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify({ author, content })
        });

        if (!response.ok) return null;

        const data = await response.json();
        return data.post;
    } catch (error) {
        return null;
    }
}

// Função para buscar usuários pelo nome (busca parcial):
async function searchUsersByName(name) {
    try {
        const response = await fetch(`${API}/users/find/${name}`);
        if (!response.ok) return null;
        const data = await response.json();
        if (data.users < 1) return null;
        return data.users;
    } catch (error) {
        console.error('Erro ao buscar usuários pelo nome:', error);
        return null;
    }
}

// Função para carregar a página principal de um usuário pelo ID:
async function loadMainPage(userID) {
    const user = await fetchUser(userID);
    if (!user) {
        console.error('Erro ao carregar os dados do usuário.');
        return;
    }

    currentUser = user;
    setProfileBar(user);
    loadFriends(user.id);

    const contextBar = document.getElementById('context-bar');
    while (contextBar.firstChild) {
        contextBar.removeChild(contextBar.firstChild);
    }

    const postsTab = document.createElement('div');
    postsTab.id = 'posts-tab';
    postsTab.className = 'posts-tab';

    const feedTab = document.createElement('div');
    feedTab.id = 'feed-tab';
    feedTab.className = 'feed-tab';

    if (user.id === sessionUser.id) {
        postsTab.innerHTML = '<h1>Seus Posts</h1>';
        feedTab.innerHTML = '<h1>Seu Feed</h1>';
        postsTab.addEventListener('click', () => userPosts(user.id));
        feedTab.addEventListener('click', () => userFeed(user.id));
        contextBar.appendChild(postsTab);
        contextBar.appendChild(feedTab);
        userFeed(user.id);
    } else {
        postsTab.innerHTML = `<h1>Posts de ${user.name}</h1>`;
        postsTab.addEventListener('click', () => userPosts(user.id));
        contextBar.appendChild(postsTab);
        userPosts(user.id);
    }
}

// Função para mostrar um post na área de posts:
function showPost(post) {
    const postArea = document.getElementById('post-area');
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    postCard.id = `post-${post.author}-${post.id}`;
    postCard.innerHTML = `
        <div class="post-avatar">
            <img src="assets/user.png" alt="User Avatar">
        </div>
        <div class="post-content">
            <div class="post-content-header">
                <div class="post-content-header-author">
                    <h1>${post.authors.name} ${post.authors.lastname}</h1>
                </div>
                <div class="post-content-header-dot">
                    <p>·</p>
                </div>
                <div class="post-content-header-date">
                    <p>${new Date(post.created_at).toLocaleString('pt-br')}</p>
                </div>
            </div>
            <p>${post.content}</p>
        </div>
    `;
    postArea.appendChild(postCard);
}

// Função para mostrar o card de novo post:
function showNewPostCard() {
    const newPostForm = document.getElementById('new-post-form');
    newPostForm.style.display = 'flex';
    
    let cancelButton = document.getElementById('cancel-button');
    cancelButton.replaceWith(cancelButton.cloneNode(true));
    cancelButton = document.getElementById('cancel-button');
    cancelButton.addEventListener('click', () => {
        const textarea = document.getElementById('new-post-content');
        textarea.value = '';
        newPostForm.style.display = 'none';
    });
    
    let postButton = document.getElementById('post-button');
    postButton.replaceWith(postButton.cloneNode(true));
    postButton = document.getElementById('post-button');
    postButton.addEventListener('click', async () => {
        const textarea = document.getElementById('new-post-content');
        const content = textarea.value.trim();
        if (content === '') {
            alert('O conteúdo do post não pode estar vazio.');
            return;
        }

        const newPost = await publicatePost(sessionUser.id, content);

        if (!newPost) {
            alert('Erro ao publicar o post. Tente novamente mais tarde.');
            return;
        }

        alert('Post publicado com sucesso!');
        textarea.value = '';
        newPostForm.style.display = 'none';
        userPosts(sessionUser.id);
    });
}

// Função para mostrar um amigo na lista de amigos:
function showFriend(friend) {
    const friendList = document.getElementById('friend-list');
    const friendCard = document.createElement('div');
    friendCard.className = 'friend-card';
    friendCard.id = `friend-${friend.id}`;
    friendCard.innerHTML = `
        <img src="assets/user.png" alt="User Avatar">
        <h1>${friend.name} ${friend.lastname}</h1>
    `;
    friendCard.addEventListener('click', () => {
        // Carrega a página do usuário ao clicar no card do amigo:
        loadMainPage(friend.id);
    });
    friendList.appendChild(friendCard);
}

// Função para mostrar o botão de ação na barra lateral do perfil:
async function showProfileButton(userID) {
    const profileSidebarButtons = document.getElementById('profile-sidebar-buttons');
    
    // Limpa os botões existentes:
    while (profileSidebarButtons.firstChild) {
        profileSidebarButtons.removeChild(profileSidebarButtons.firstChild);
    }

    const profileButton = document.createElement('button');
    profileButton.className = 'profile-button';

    if (userID === sessionUser.id) {
        profileButton.textContent = 'Sair';
        profileButton.classList.add('logout-button');
        profileButton.addEventListener('click', () => {
            // Limpa o token do armazenamento local ou de sessão:
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            // Redireciona para a página de login:
            window.location.href = './login.html';
        });
    } else {
        const friendship = await fetchFriendship(userID);
        if (friendship && friendship.status === 'Aceito') {
            profileButton.textContent = 'Desfazer';
            profileButton.classList.add('delete-button');
            profileButton.addEventListener('click', async () => {
                const undoneFriendship = await undoFriendship(userID);
                if (undoneFriendship) {
                    alert('Amizade desfeita!');
                    showProfileButton(userID);
                    loadFriends(userID);
                }
            });
        } else if (friendship && friendship.requester === sessionUser.id && friendship.status === 'Pendente') {
            profileButton.textContent = 'Pendente...';
            profileButton.classList.add('pending-button');
        } else if (friendship && friendship.requested === sessionUser.id && friendship.status === 'Pendente') {
            profileButton.textContent = 'Aceitar';
            profileButton.classList.add('accept-button');
            profileButton.addEventListener('click', async () => {
                const acceptedFriendship = await acceptFriendship(userID);
                if (acceptedFriendship) {
                    alert('Amizade aceita!');
                    showProfileButton(userID);
                    loadFriends(userID);
                }
            });
        } else {
            profileButton.textContent = 'Adicionar';
            profileButton.classList.add('add-button');
            profileButton.addEventListener('click', async () => {
                const newFriendship = await requestFriendship(userID);
                if (newFriendship) {
                    alert('Solicitação de amizade enviada!');
                    showProfileButton(userID);
                }
            });
        }
    }
    profileSidebarButtons.appendChild(profileButton);
    profileSidebarButtons.style.display = 'flex';
}

// Função para carregar e mostrar a lista de amigos de um usuário pelo ID:
async function loadFriends(userID) {
    const friends = await fetchFriends(userID);
    if (!friends) return;

    const friendList = document.getElementById('friend-list');
    while (friendList.firstChild) {
        friendList.removeChild(friendList.firstChild);
    }

    for (const friend of friends) {
        showFriend(friend);
    }
}

// Função para carregar e mostrar os posts de um usuário pelo ID:
async function userPosts(userID) {
    const newPostCard = document.getElementById('new-post-card');
    let newPostLabel = document.getElementById('new-post-label');
    newPostLabel.replaceWith(newPostLabel.cloneNode(true));
    newPostLabel = document.getElementById('new-post-label');
    const postsTab = document.getElementById('posts-tab');
    postsTab.classList.add('posts-tab-active');
    if (userID === sessionUser.id) {
        document.getElementById('feed-tab').classList.remove('feed-tab-active');
        newPostLabel.addEventListener('click', showNewPostCard);
        newPostCard.style.display = 'flex';
    } else if (newPostLabel) {
        newPostCard.style.display = 'none';
    }

    // Limpa a área de posts:
    const postArea = document.getElementById('post-area');
    while (postArea.firstChild) {
        postArea.removeChild(postArea.firstChild);
    }

    // Insere os posts na área de posts:
    const posts = await fetchPosts(userID);
    for (const post of posts) {
        showPost(post);
    }
}

// Função para carregar e mostrar os posts do feed de um usuário pelo ID:
async function userFeed(userID) {
    // Ativa a aba de feed:
    const feedTab = document.getElementById('feed-tab');
    feedTab.classList.add('feed-tab-active');
    document.getElementById('posts-tab').classList.remove('posts-tab-active');

    const newPostCard = document.getElementById('new-post-card');
    newPostCard.style.display = 'none';

    // Limpa a área de posts:
    const postArea = document.getElementById('post-area');
    while (postArea.firstChild) {
        postArea.removeChild(postArea.firstChild);
    }

    // Insere os posts na área de posts:
    const posts = await fetchFeedPosts(userID);
    if (posts) {
        for (const post of posts) {
            showPost(post);
        }
    }
}

// Função para configurar o cabeçalho com os dados do usuário da sessão:
function setUserHeader() {
    const userName = document.getElementById('user-name');
    userName.textContent = `${sessionUser.name} ${sessionUser.lastname}`;
    userName.addEventListener('click', () => {
        loadMainPage(sessionUser.id);
    });

    const userAvatar = document.getElementById('user-avatar');
    userAvatar.addEventListener('click', () => {
        loadMainPage(sessionUser.id);
    });
}

// Função para configurar a barra lateral do perfil com os dados do usuário:
function setProfileBar(user) {
    showProfileButton(user.id);
    document.getElementById('avatar-user-name').textContent = `${user.name} ${user.lastname}`;
    document.getElementById('info-nationality').textContent = user.country;
    document.getElementById('info-birthday').textContent = new Date(user.birthday).toLocaleDateString('pt-BR');
    document.getElementById('info-relationship').textContent = user.relationship;
    const editProfile = document.getElementById('edit-profile');
    if (user.id !== sessionUser.id) {
        editProfile.style.display = 'none';
    } else {
        editProfile.style.display = 'block';
        editProfile.replaceWith(editProfile.cloneNode(true));
        document.getElementById('edit-profile').addEventListener('click', () => {
            window.location.href = './register.html';
        });
    }
}

// Função para buscar e mostrar usuários pelo nome da busca:
async function searchUsers() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim();
    if (query === '') {
        alert('Por favor, insira um nome para buscar.');
        return;
    }

    const users = await searchUsersByName(query);
    if (!users) {
        alert('Nenhum usuário encontrado com esse nome.');
        return;
    }
    const contextBar = document.getElementById('context-bar');
    while (contextBar.firstChild) {
        contextBar.removeChild(contextBar.firstChild);
    }
    const searchTab = document.createElement('div');
    searchTab.id = 'search-tab';
    searchTab.className = 'search-tab';
    searchTab.innerHTML = '<h1>Resultados da Busca</h1>';
    contextBar.appendChild(searchTab);

    const newPostCard = document.getElementById('new-post-card');
    if (newPostCard) newPostCard.style.display = 'none';
    
    const searchResults = document.getElementById('post-area');
    while (searchResults.firstChild) {
        searchResults.removeChild(searchResults.firstChild);
    }

    for (const user of users) {
        if (user.id !== sessionUser.id) {
            let icon;
            let action;
            const friendship = await fetchFriendship(user.id);
            if (friendship && friendship.status === 'Aceito') {
                icon = 'fluent-color-person-available';
                action = undoFriendshipDialogue;
            } else if (friendship && friendship.requester === sessionUser.id && friendship.status === 'Pendente') {
                icon = 'fluent-color-person-tentative';
                action = () => { alert('Solicitação de amizade pendente.')};
            }
            else if (friendship && friendship.requested === sessionUser.id && friendship.status === 'Pendente') {
                icon = 'fluent-color-person-warning';
                action = acceptFriendshipDialogue;
            }
            else {
                icon = 'fluent-color-person-add';
                action = requestFriendship;
            }
            const userCard = document.createElement('div');
            userCard.id = `search-card-${user.id}`;
            userCard.className = 'search-card';
            userCard.innerHTML = `
                <div class="search-card-avatar" id="search-card-avatar-${user.id}">
                    <img src="assets/user.png" alt="User Avatar">
                </div>
                <div class="search-card-content" id="search-card-content-${user.id}">
                    <h1>${user.name} ${user.lastname}</h1>
                </div>
                <div class="search-card-action" id="search-card-action-${user.id}">
                    <img src="assets/icons/${icon}.svg" alt="Action Icon">
                </div>
            `;

            searchResults.appendChild(userCard);

            document.getElementById(`search-card-action-${user.id}`).addEventListener('click', async () => {
                const result = await action(user.id);
                if (result) {
                    searchUsers();
                    if (currentUser.id === sessionUser.id) {
                        loadFriends(sessionUser.id);
                    } else {
                        loadFriends(currentUser.id);
                    }
                }
            });

            document.getElementById(`search-card-content-${user.id}`).addEventListener('click', () => {
                searchInput.value = '';
                searchResults.style.display = 'none';
                loadMainPage(user.id);
            });
        }
    }
    searchResults.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', async () => {

    // Obtém os dados do usuário da sessão:
    sessionUser = await fetchSessionUser();

    // Se não houver usuário na sessão, redireciona para a página de login:
    if (!sessionUser) {
        alert('Erro ao obter os dados do usuário! Por favor, faça login novamente.');
        window.location.href = './login.html';
        return;
    }

    // Configura o cabeçalho com os dados do usuário da sessão:
    setUserHeader(sessionUser);
    
    // Trata o evento de busca ao pressionar Enter no campo de busca:
    document.getElementById('search-input').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchUsers();
        }
    });

    // Carrega a página principal do usuário da sessão:
    loadMainPage(sessionUser.id);
});
