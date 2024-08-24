const startButton = document.getElementById('start-button');
let conversationStarted = false;
let currentAgent = 'itch';

const initialMessages = {
    itch: 'Hello from イッチ!',
    neeta: 'Hello, イッチ! How are you today?'
};

startButton.addEventListener('click', async function(event) {
    if (conversationStarted) return;

    conversationStarted = true;
    startButton.classList.add('started');

    // Initialize conversation with initial messages
    let conversation = [
        { agent: 'itch', text: initialMessages.itch },
        { agent: 'neeta', text: initialMessages.neeta }
    ];

    displayConversation(conversation);

    // Continue conversation in a loop
    while (true) {
        // Get the latest message from the last agent
        const lastMessage = conversation[conversation.length - 1];
        
        // Send the message and get the response
        let response = await sendMessage(lastMessage.text, lastMessage.agent);
        if (!response) break;

        // Determine the next agent and message
        const nextAgent = lastMessage.agent === 'itch' ? 'neeta' : 'itch';
        const nextText = response.bestResponse.utterance;

        // Add the next message to the conversation
        conversation.push({ agent: nextAgent, text: nextText });
        displayConversation(conversation);

        // Check for a stop condition (e.g., if the message contains "end")
        if (nextText.includes('end')) break;
    }
});

async function sendMessage(utterance, agent) {
    try {
        const response = await fetch('https://api-mebo.dev/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                api_key: agent === 'itch' ? '<API_KEY_ITCH>' : '<API_KEY_NEETA>',
                agent_id: agent === 'itch' ? '<AGENT_ID_ITCH>' : '<AGENT_ID_NEETA>',
                utterance: utterance,
                uid: 'unique_user_id'
            })
        });

        if (!response.ok) {
            console.error('Network response was not ok:', response.statusText);
            return null;
        }

        const text = await response.text();
        try {
            const data = JSON.parse(text);
            return data;
        } catch (e) {
            console.error('Error parsing JSON:', e);
            console.error('Response text:', text);
            return null;
        }
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

function displayConversation(conversation) {
    const conversationDiv = document.getElementById('conversation');
    conversationDiv.innerHTML = ''; // Clear previous conversation

    conversation.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', msg.agent);
        messageDiv.textContent = msg.text;
        conversationDiv.appendChild(messageDiv);
    });

    conversationDiv.scrollTop = conversationDiv.scrollHeight; // Scroll to the bottom
}
