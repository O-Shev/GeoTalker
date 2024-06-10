const messageContentHandler = require("../../messageContentHandler");
const updateMessageContent = async (e, t) => {

    try {
        const content = await messageContentHandler(e.new_content, t);
        await t.pg_client.query(`
            UPDATE telegram.message
            SET content_type = $4, content = $5
            WHERE api_id = $1 AND chat_id = $2 AND id = $3
        `, [
            t.credentials.api_id,
            e.chat_id,
            e.message_id,
            e.new_content['@type'],
            content
        ])

    } catch (e) {
        console.log(`Error handle updateMessageContent: ${e}`);
    }
};

module.exports = updateMessageContent;
