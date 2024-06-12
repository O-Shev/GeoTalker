
const updateChatIsBlocked  = async (e, t) => {
    try{
        await t.pg_client.query(`
            UPDATE telegram.supergroup
            SET is_blocked = $3
            WHERE api_id = $1 AND chat_id = $2
        `, [t.credentials.api_id,
            e.chat_id,
            e.is_blocked]);
        console.log(`updateChatIsBlocked: ${e}`)
    } catch (e) {
        console.error('Error handle updateChatTitle:', e);
    }

}

module.exports = updateChatIsBlocked;