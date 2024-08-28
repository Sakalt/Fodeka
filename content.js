document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startConversation');
    const conversationDiv = document.getElementById('conversation');
    let conversationStarted = false;

    const initialMessages = {
        itch: 'こんにちは、イッチです!',
        neeta: 'こんにちは、イッチ! 今日はどうですか？'
    };

    const apiKeys = {
        itch: 'd6089a37-308f-4e0a-a136-856565ddef06191820644ff3a7',
        neeta: 'e2f526dc-4da0-471b-b222-c3ec7466530b191823f3bd424d'
    };

    const agentIds = {
        itch: '531604ce-edc4-43d3-9fbe-b6f3516810171917f2dae9b212',
        neeta: '6844ece1-a5c2-4163-8a58-105f4fb9ec091917f2904307e'
    };

    startButton.addEventListener('click', async function(event) {
        if (conversationStarted) return;

        conversationStarted = true;
        startButton.classList.add('started');

        let conversation = [
            { agent: 'itch', text: initialMessages.itch },
            { agent: 'neeta', text: initialMessages.neeta }
        ];

        displayConversation(conversation);

        while (true) {
            const lastMessage = conversation[conversation.length - 1];
            
            let response = await sendMessage(lastMessage.text, lastMessage.agent);
            if (!response) {
                displayError('申し訳ありませんが、何か問題が発生しました。後で再試行してください。');
                break;
            }

            const nextAgent = lastMessage.agent === 'itch' ? 'neeta' : 'itch';
            const nextText = response.bestResponse?.utterance || '応答がありません';

            conversation.push({ agent: nextAgent, text: nextText });
            displayConversation(conversation);

            if (nextText.includes('end')) {
                displayEndMessage();
                break;
            }
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
                    api_key: apiKeys[agent],
                    agent_id: agentIds[agent],
                    utterance: utterance,
                    uid: 'unique_user_id' // ユーザーごとに一意のIDを設定してください
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('ネットワーク応答が正常ではありません:', response.status, errorText);
                return null;
            }

            const text = await response.text();
            try {
                const data = JSON.parse(text);
                return data;
            } catch (e) {
                console.error('JSONのパースエラー:', e);
                console.error('応答テキスト:', text);
                return null;
            }
        } catch (error) {
            console.error('フェッチエラー:', error);
            return null;
        }
    }

    function displayConversation(conversation) {
        conversationDiv.innerHTML = '';

        conversation.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', msg.agent);
            messageDiv.textContent = msg.text;
            conversationDiv.appendChild(messageDiv);
        });

        conversationDiv.scrollTop = conversationDiv.scrollHeight;
    }

    function displayError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('error');
        errorDiv.textContent = message;
        conversationDiv.appendChild(errorDiv);
        conversationDiv.scrollTop = conversationDiv.scrollHeight;
    }

    function displayEndMessage() {
        const endDiv = document.createElement('div');
        endDiv.classList.add('end-message');
        endDiv.textContent = '会話が終了しました。';
        conversationDiv.appendChild(endDiv);
        conversationDiv.scrollTop = conversationDiv.scrollHeight;
    }
});
