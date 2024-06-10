const updateMessageEdited = async (e, t) => {

    try {
        await t.pg_client.query(`
            UPDATE telegram.message
            SET edit_date = TO_TIMESTAMP($4)
            WHERE api_id = $1 AND chat_id = $2 AND id = $3
        `, [
            t.credentials.api_id,
            e.chat_id,
            e.message_id,
            e.edit_date
        ])

    } catch (e) {
        console.log(`Error handle updateMessageEdited: ${e}`);
    }
};

module.exports = updateMessageEdited;
