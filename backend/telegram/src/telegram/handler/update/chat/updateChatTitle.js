const updateChatTitle = async (e, t) => {
    try{
        await t.pg_client.query(`
            UPDATE telegram.supergroup
            SET title = $3
            WHERE chat_id = $1 AND api_id = $2
        `, [e.chat_id,
            t.credentials.api_id,
            e.title]);
    } catch (e) {
        console.error('Error handle updateChatTitle:', e);
    }

}

module.exports = updateChatTitle;