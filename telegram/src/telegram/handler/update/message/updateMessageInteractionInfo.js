const updateMessageInteractionInfo = async (e, t) => {
    if(!e.interaction_info) return;
    try {
        await t.pg_client.query(`
            UPDATE telegram.message
            SET view_count = $4, forward_count = $5
            WHERE api_id = $1 AND chat_id = $2 AND id = $3
        `, [
            t.credentials.api_id,
            e.chat_id,
            e.message_id,
            e.interaction_info.view_count,
            e.interaction_info.forward_count
        ])

    } catch (error) {
        console.log(`Error handle updateMessageInteractionInfo: ${error}`);
    }
};

module.exports = updateMessageInteractionInfo;
