const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const sendBtn = document.getElementById('send-btn');
const loadingIndicator = document.getElementById('loading-indicator');
 
const API_KEY = 'Sua chave aqui';
 
function addMessageToDom(role, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', role);
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv)
    // Rola o chat para o final (scroll automático)
    chatBox.scrollTop = chatBox.scrollHeight;
}
 
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;
    userInput.value = '';
    userInput.disable = true;
    sendBtn.disable = true;
    loadingIndicator.style.display = 'block'
    addMessageToDom('user', text)
    try {
        const response = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/' +
            'gemini-2.5-flash:generateContent?key=${API_KEY}',
            {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: text}]
                    }]
                }),
            }
        );
        const data = await response.json();
        if (data.error) {
            throw new Error (data.error.message);
        }
        const botReplay = data.candidates[0].content.parts[0].text;
        addMessageToDom('bot', botReplay)
    }
    catch (error) {
        console.error('Erro de requisição:', error);
        addMessageToDom('bot', 'Ocorreu um erro de conexão. Tente novamente. ');
    } finally {
        userInput.disable = false;
        sendBtn.disable = false;
        loadingIndicator.style.display = 'none';
        userInput.focus();
    }
});
 