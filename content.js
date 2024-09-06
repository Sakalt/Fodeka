document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('sendMessage');
    const conversationDiv = document.getElementById('conversation');
    const userMessageInput = document.getElementById('userMessage');

    sendButton.addEventListener('click', async function () {
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
                    api_key: '228dc901-c7fa-4bfe-9996-68b521c75ffd191c6ddbbfcb1', // 適切なAPIキーに置き換えてください
                    agent_id: 'c22cd462-77b8-47e1-9c5f-6f82b8da336a191c6dbb9ca3d1', // 適切なエージェントIDに置き換えてください
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

        // Markdown形式をHTMLに変換
        let formattedMessage = message
            // 見出しをHTMLに変換
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            // ボールドテキストをHTMLに変換
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/__(.+?)__/g, '<strong>$1</strong>')
            // イタリックテキストをHTMLに変換
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/_(.+?)_/g, '<em>$1</em>')
            // リンクをHTMLに変換
            .replace(/\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g, '<a href="$2" target="_blank">$1</a>')
            // 生のURLをリンクに変換
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');

        messageDiv.innerHTML = formattedMessage;
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
