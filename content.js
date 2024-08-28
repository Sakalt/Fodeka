document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startConversation');
    if (!startButton) {
        console.error('要素が見つかりません: startConversation');
        return;
    }
    
    const conversationDiv = document.getElementById('conversation');
    let conversationStarted = false;
    let currentAgent = 'itch';

    const initialMessages = {
        itch: 'こんにちは、イッチです!',
        neeta: 'こんにちは、イッチ! 今日はどうですか？'
    };

    startButton.addEventListener('click', async function(event) {
        if (conversationStarted) return;

        conversationStarted = true;
        startButton.classList.add('started');

        // 初期メッセージで会話を開始
        let conversation = [
            { agent: 'itch', text: initialMessages.itch },
            { agent: 'neeta', text: initialMessages.neeta }
        ];

        displayConversation(conversation);

        // 会話をループで続ける
        while (true) {
            // 最後のメッセージを取得
            const lastMessage = conversation[conversation.length - 1];
            
            // メッセージを送信し、レスポンスを取得
            let response = await sendMessage(lastMessage.text, lastMessage.agent);
            if (!response) {
                displayError('申し訳ありませんが、何か問題が発生しました。後で再試行してください。');
                break;
            }

            // 次のエージェントとメッセージを決定
            const nextAgent = lastMessage.agent === 'itch' ? 'neeta' : 'itch';
            const nextText = response.bestResponse?.utterance || '応答がありません';

            // 次のメッセージを会話に追加
            conversation.push({ agent: nextAgent, text: nextText });
            displayConversation(conversation);

            // ストップ条件を確認 (例: メッセージに "end" が含まれているか)
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
                    api_key: agent === 'itch' ? '<API_KEY_ITCH>' : '<API_KEY_NEETA>',
                    agent_id: agent === 'itch' ? '<AGENT_ID_ITCH>' : '<AGENT_ID_NEETA>',
                    utterance: utterance,
                    uid: 'unique_user_id'
                })
            });

            if (!response.ok) {
                console.error('ネットワーク応答が正常ではありません:', response.statusText);
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
        conversationDiv.innerHTML = ''; // 前の会話をクリア

        conversation.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', msg.agent);
            messageDiv.textContent = msg.text;
            conversationDiv.appendChild(messageDiv);
        });

        conversationDiv.scrollTop = conversationDiv.scrollHeight; // 下にスクロール
    }

    function displayError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('error');
        errorDiv.textContent = message;
        conversationDiv.appendChild(errorDiv);
        conversationDiv.scrollTop = conversationDiv.scrollHeight; // 下にスクロール
    }

    function displayEndMessage() {
        const endDiv = document.createElement('div');
        endDiv.classList.add('end-message');
        endDiv.textContent = '会話が終了しました。';
        conversationDiv.appendChild(endDiv);
        conversationDiv.scrollTop = conversationDiv.scrollHeight; // 下にスクロール
    }
});
