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
                    api_key: 'f6be6070-119b-4af0-b58d-cf791e0bae52191ce3ba4aa149', // 適切なAPIキーに置き換えてください
                    agent_id: 'df432407-de8b-488f-8772-f5c4861063a5191ce3b222e2b3', // 適切なエージェントIDに置き換えてください
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
            // コードブロック (3つのバッククォート) を <pre><code> タグに変換
            .replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>')
            // インラインコード (1つのバッククォート) を <code> タグに変換
            .replace(/`([^`]+)`/g, '<code>$1</code>')
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
