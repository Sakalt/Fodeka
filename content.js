document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startConversation');
    if (!startButton) {
        console.error('Start button not found');
        return;
    }

    startButton.addEventListener('click', async () => {
        // ボタンを無効化し、色を変更する
        startButton.disabled = true;
        startButton.classList.add('started');

        const apiKey1 = 'd6089a37-308f-4e0a-a136-856565ddef06191820644ff3a7';
        const agentId1 = '531604ce-edc4-43d3-9fbe-b6f3516810171917f2dae9b212';
        const apiKey2 = 'e2f526dc-4da0-471b-b222-c3ec7466530b191823f3bd424d';
        const agentId2 = '6844ece1-a5c2-4163-8a58-105f4fb9ec091917f2904307e';

        let conversationDiv = document.getElementById('conversation');
        if (!conversationDiv) {
            console.error('Conversation div not found');
            return;
        }

        let currentUtterance = 'Hello from イッチ'; // 初期発話
        let isAgent1Turn = true; // イッチ から開始

        async function sendMessage(apiKey, agentId, utterance, uid) {
            try {
                const response = await fetch('https://api-mebo.dev/api', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        api_key: apiKey,
                        agent_id: agentId,
                        utterance: utterance,
                        uid: uid
                    })
                });
                const text = await response.text(); // JSON 文字列をテキストとして取得
                console.log('Response:', text); // レスポンスをコンソールに表示
                return JSON.parse(text); // JSON に変換
            } catch (error) {
                console.error('Error:', error);
                conversationDiv.innerHTML += '<p class="error">Error occurred. Check console for details.</p>';
                return null;
            }
        }

        async function continueConversation() {
            let uid1 = 'unique_user_id_1';
            let uid2 = 'unique_user_id_2';

            // 初回はイッチから始める
            let data = await sendMessage(apiKey1, agentId1, currentUtterance, uid1);
            if (data) {
                const responseFromAgent1 = data.bestResponse.utterance;
                conversationDiv.innerHTML += `
                    <div class="message itch">
                        <p><strong>イッチ:</strong> ${currentUtterance}</p>
                    </div>
                    <div class="message neeta">
                        <p><strong>ニータ:</strong> ${responseFromAgent1}</p>
                    </div>
                `;
                currentUtterance = responseFromAgent1;
                conversationDiv.scrollTop = conversationDiv.scrollHeight;
            } else {
                return;
            }

            isAgent1Turn = false;

            while (true) {
                let data;
                if (isAgent1Turn) {
                    data = await sendMessage(apiKey1, agentId1, currentUtterance, uid1);
                    if (!data) break;
                    const responseFromAgent1 = data.bestResponse.utterance;
                    conversationDiv.innerHTML += `
                        <div class="message itch">
                            <p><strong>イッチ:</strong> ${currentUtterance}</p>
                        </div>
                        <div class="message neeta">
                            <p><strong>ニータ:</strong> ${responseFromAgent1}</p>
                        </div>
                    `;
                    currentUtterance = responseFromAgent1;
                } else {
                    data = await sendMessage(apiKey2, agentId2, currentUtterance, uid2);
                    if (!data) break;
                    const responseFromAgent2 = data.bestResponse.utterance;
                    conversationDiv.innerHTML += `
                        <div class="message neeta">
                            <p><strong>ニータ:</strong> ${currentUtterance}</p>
                        </div>
                        <div class="message itch">
                            <p><strong>イッチ:</strong> ${responseFromAgent2}</p>
                        </div>
                    `;
                    currentUtterance = responseFromAgent2;
                }

                conversationDiv.scrollTop = conversationDiv.scrollHeight;
                isAgent1Turn = !isAgent1Turn;
            }
        }

        continueConversation();
    });
});
