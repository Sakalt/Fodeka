document.getElementById('startConversation').addEventListener('click', () => {
    const apiKey1 = 'd6089a37-308f-4e0a-a136-856565ddef06191820644ff3a7';
    const agentId1 = '531604ce-edc4-43d3-9fbe-b6f3516810171917f2dae9b212';
    const apiKey2 = 'e2f526dc-4da0-471b-b222-c3ec7466530b191823f3bd424d';
    const agentId2 = '6844ece1-a5c2-4163-8a58-105f4fb9ec091917f2904307e';

    let conversationDiv = document.getElementById('conversation');
    let currentUtterance = 'Hello from Agent 1';  // 最初の発話

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
        while (true) {
            // Agent 1 sends a message
            let data = await sendMessage(apiKey1, agentId1, currentUtterance, 'unique_user_id_1');
            if (!data) break;
            const responseFromAgent1 = data.bestResponse.utterance;

            // Display Agent 1's message
            conversationDiv.innerHTML += `
                <div class="message agent1">
                    <p><strong>Agent 1:</strong> ${currentUtterance}</p>
                </div>
                <div class="message agent2">
                    <p><strong>Agent 2:</strong> ${responseFromAgent1}</p>
                </div>
            `;
            conversationDiv.scrollTop = conversationDiv.scrollHeight;

            // Prepare the next message
            currentUtterance = responseFromAgent1;

            // Agent 2 responds
            data = await sendMessage(apiKey2, agentId2, currentUtterance, 'unique_user_id_2');
            if (!data) break;
            const responseFromAgent2 = data.bestResponse.utterance;

            // Display Agent 2's message
            conversationDiv.innerHTML += `
                <div class="message agent2">
                    <p><strong>Agent 2:</strong> ${currentUtterance}</p>
                </div>
                <div class="message agent1">
                    <p><strong>Agent 1:</strong> ${responseFromAgent2}</p>
                </div>
            `;
            conversationDiv.scrollTop = conversationDiv.scrollHeight;

            // Prepare the next message
            currentUtterance = responseFromAgent2;
        }
    }

    continueConversation();
});
