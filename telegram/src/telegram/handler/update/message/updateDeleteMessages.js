const updateDeleteMessages = async (e, t) => {
    if(e.from_cache === true) {
        console.log(`received 'updateDeleteMessages' but not was delete because [from_cache === true]: ${e}`)
        return;
    }
    if(e.is_permanent === false) {
        console.log(`received 'updateDeleteMessages' but not was delete because [is_permanent === false]: ${e}`)
        return;
    }

    try {
        await t.pg_client.query(`
            DELETE FROM telegram.message
            WHERE api_id = $1 AND chat_id = $2 AND id = ANY($3)
        `, [
            t.credentials.api_id,
            e.chat_id,
            e.message_ids
        ])
    } catch (e) {
        console.log(`Error handle updateDeleteMessages: ${e}`);
    }
};

module.exports = updateDeleteMessages;
