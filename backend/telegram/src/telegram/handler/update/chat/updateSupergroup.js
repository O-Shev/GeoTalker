const updateSupergroup = async (e, t) => {
    try{
        if(e.supergroup.id === 0) return;
        if(e.supergroup.hasOwnProperty('usernames') && e.supergroup.usernames.hasOwnProperty('editable_username')){
            await t.pg_client.query(`
                INSERT INTO telegram.supergroup (id, api_id, member_count, username, member_status, has_linked_chat, is_channel, is_broadcast_group, is_verified, is_scam, is_fake)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                ON CONFLICT (id, api_id) DO UPDATE
                SET member_count = $3, username = $4, member_status = $5, has_linked_chat = $6, is_channel = $7, is_broadcast_group = $8, is_verified = $9, is_scam = $10, is_fake = $11;
            `, [e.supergroup.id,
                t.credentials.api_id,
                e.supergroup.member_count,
                e.supergroup.usernames.editable_username,
                e.supergroup.status['@type'],
                e.supergroup.has_linked_chat,
                e.supergroup.is_channel,
                e.supergroup.is_broadcast_group,
                e.supergroup.is_verified,
                e.supergroup.is_scam,
                e.supergroup.is_fake]);
        } else {
            await t.pg_client.query(`
                INSERT INTO telegram.supergroup (id, api_id, member_count, member_status, has_linked_chat, is_channel, is_broadcast_group, is_verified, is_scam, is_fake)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                ON CONFLICT (id, api_id) DO UPDATE
                SET member_count = $3, member_status = $4, has_linked_chat = $5, is_channel = $6, is_broadcast_group = $7, is_verified = $8, is_scam = $9, is_fake = $10;
            `, [e.supergroup.id,
                t.credentials.api_id,
                e.supergroup.member_count,
                e.supergroup.status['@type'],
                e.supergroup.has_linked_chat,
                e.supergroup.is_channel,
                e.supergroup.is_broadcast_group,
                e.supergroup.is_verified,
                e.supergroup.is_scam,
                e.supergroup.is_fake]);
        }
    } catch (error) {
        console.error('Error handle updateSupergroup:', error);
    }

}

module.exports = updateSupergroup;