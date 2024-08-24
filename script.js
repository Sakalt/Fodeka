document.getElementById('startConversation').addEventListener('click', () => {
    const apiKey1 = 'd6089a37-308f-4e0a-a136-856565ddef06191820644ff3a7';
    const agentId1 = '531604ce-edc4-43d3-9fbe-b6f3516810171917f2dae9b212';
    const apiKey2 = 'e2f526dc-4da0-471b-b222-c3ec7466530b191823f3bd424d';
    const agentId2 = '6844ece1-a5c2-4163-8a58-105f4fb9ec091917f2904307e';

    let conversationDiv = document.getElementById('conversation');
    let currentUtterance = 'Hello from Agent 1';  // 最初の発話
    let isAgent1Turn = true;  // エージェント1のターンから開始

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
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            conversationDiv.innerHTML += '<p class="error">Error occurred. Check console for details.</p>';
            return null;
        }
    }

    async function continueConversation() {
        let uid1 = 'unique_user_id_1';
        let uid2 = 'unique_user_id_2';

        while (true) {
            if (isAgent1Turn) {
                // エージェント1からメッセージを送信
                let data = await sendMessage(apiKey1, agentId1, currentUtterance, uid1);
                if (!data) break;
                const responseFromAgent1 = data.bestResponse.utterance;

                // エージェント1のメッセージを表示
                conversationDiv.innerHTML += `
                    <div class="message agent1">
                        <p><strong>Agent 1:</strong> ${currentUtterance}</p>
                    </div>
                    <div class="message agent2">
                        <p><strong>Agent 2:</strong> ${responseFromAgent1}</p>
                    </div>
                `;
                conversationDiv.scrollTop = conversationDiv.scrollHeight;

                // 次のメッセージを準備
                currentUtterance = responseFromAgent1;
            } else {
                // エージェント2からメッセージを送信
                let data = await sendMessage(apiKey2, agentId2, currentUtterance, uid2);
                if (!data) break;
                const responseFromAgent2 = data.bestResponse.utterance;

                // エージェント2のメッセージを表示
                conversationDiv.innerHTML += `
                    <div class="message agent2">
                        <p><strong>Agent 2:</strong> ${currentUtterance}</p>
                    </div>
                    <div class="message agent1">
                        <p><strong>Agent 1:</strong> ${responseFromAgent2}</p>
                    </div>
                `;
                conversationDiv.scrollTop = conversationDiv.scrollHeight;

                // 次のメッセージを準備
                currentUtterance = responseFromAgent2;
            }

            // ターンを切り替え
            isAgent1Turn = !isAgent1Turn;
        }
    }

    continueConversation();
});
