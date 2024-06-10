const messageContentHandler = require("../../messageContentHandler");
const updateNewMessage = async (event, t) => {
    const m = event.message;
    try {
        const content = await messageContentHandler(m.content, t);
        await t.pg_client.query(`
            INSERT INTO telegram.message(api_id, chat_id, id, sender_type, sender_id, date, edit_date, is_pinned, is_channel_post, reply_to_chat_id, reply_to_message_id, message_thread_id, media_album_id, view_count, forward_count, content_type, content)
            VALUES ($1, $2, $3, $4, $5, TO_TIMESTAMP($6), TO_TIMESTAMP($7), $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        `, [t.credentials.api_id,
            m.chat_id,
            m.id,
            m.sender_id['@type'],
            m.sender_id['@type'] === 'messageSenderUser' ? m.sender_id.user_id : m.sender_id.chat_id,
            m.date,
            m.edit_date != 0 ? m.edit_date : null,
            m.is_pinned,
            m.is_channel_post,
            m.reply_to && m.reply_to['@type'] === 'messageReplyToMessage' ? m.reply_to.chat_id : null,
            m.reply_to && m.reply_to['@type'] === 'messageReplyToMessage' ? m.reply_to.message_id : null,
            m.message_thread_id != 0 ? m.message_thread_id : null,
            m.media_album_id != 0 ? m.media_album_id : null,
            m.interaction_info ? m.interaction_info.view_count : null,
            m.interaction_info ? m.interaction_info.forward_count : null,
            m.content['@type'],
            content
        ])
    } catch (e) {
        console.log(`Error handle updateNewMessage: ${e}`);
    }

};

module.exports = updateNewMessage;