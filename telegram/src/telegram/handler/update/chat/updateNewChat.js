//only for chatTypeSupergroup
const axios = require("axios");
const updateNewChat = async (e, t) => {
    if(e.chat.type['@type'] !== 'chatTypeSupergroup') return;
    try{
        if(e?.chat?.photo?.small?.remote?.unique_id){
            t.putFileAndGetName(e.chat.photo.small, t.config.MINIO_BUCKET_PROFILE_PHOTO);
            const file = e.chat.photo.small.remote.unique_id;
            await t.pg_client.query(`
                UPDATE telegram.supergroup
                SET chat_id = $3, title = $4, profile_photo = $5
                WHERE id = $1 AND api_id = $2
            `, [e.chat.type.supergroup_id,
                t.credentials.api_id,
                e.chat.id,
                e.chat.title,
                file]);

        } else {
            await t.pg_client.query(`
            UPDATE telegram.supergroup
            SET chat_id = $3, title = $4
            WHERE id = $1 AND api_id = $2
            `, [e.chat.type.supergroup_id,
                t.credentials.api_id,
                e.chat.id,
                e.chat.title]);
        }


        axios.post(`${t.config.CORE_URL}/${t.credentials.api_id}/updateNewChat`, e.chat)
            .then(function (response) {

            })
            .catch(function (error) {
                console.log(error);
            });

    } catch (error) {console.error('Error handle updateNewChat (pg_client.query):', error);}
}

module.exports = updateNewChat;