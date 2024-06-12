const updateChatPhoto = async (e, t) => {

    try{
        if(e.photo){
            const file = await t.putFile(e.photo.small, t.config.MINIO_BUCKET_PROFILE_PHOTO);
            await t.pg_client.query(`
                UPDATE telegram.supergroup
                SET profile_photo = $3
                WHERE api_id = $1 AND chat_id = $2
            `, [t.credentials.api_id,
                e.chat_id,
                file]);

        } else {
            await t.pg_client.query(`
                UPDATE telegram.supergroup
                SET profile_photo = $3
                WHERE api_id = $1 AND chat_id = $2
            `, [t.credentials.api_id,
                e.chat_id,
                null]);
        }
    } catch (error) {console.log('Error handle updateChatPhoto:', error);}
}

module.exports = updateChatPhoto;