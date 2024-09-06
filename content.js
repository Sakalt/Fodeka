document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('sendMessage');
    const conversationDiv = document.getElementById('conversation');
    const userMessageInput = document.getElementById('userMessage');

    sendButton.addEventListener('click', async function() {
        const userMessage = userMessageInput.value.trim();
        if (!userMessage) return;

        // ユーザーメッセージを表示
        displayMessage('user', userMessage);

        // AIにメッセージを送信
        const response = await sendMessage(userMessage);
        if (!response) {
            displayError('申し訳ありませんが、何か問題が発生しました。後で再試行してください。');
            return;
        }

        // AIの応答を表示
        const aiResponse = response.bestResponse?.utterance || '応答がありません';
        displayMessage('ai', aiResponse);
    });

    async function sendMessage(utterance) {
        try {
            const response = await fetch('https://api-mebo.dev/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    api_key: 'd6089a37-308f-4e0a-a136-856565ddef06191820644ff3a7', // 適切なAPIキーに置き換えてください
                    agent_id: '531604ce-edc4-43d3-9fbe-b6f3516810171917f2dae9b212', // 適切なエージェントIDに置き換えてください
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

    function displayMessage(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.textContent = message;
        conversationDiv.appendChild(messageDiv);
        conversationDiv.scrollTop = conversationDiv.scrollHeight;
    }

    function displayError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('error');
        errorDiv.textContent = message;
        conversationDiv.appendChild(errorDiv);
        conversationDiv.scrollTop = conversationDiv.scrollHeight;
    }
});
