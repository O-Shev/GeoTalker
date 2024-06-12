
const updateSupergroupFullInfo = async (e, t) => {
    try{
        await t.pg_client.query(`
        INSERT INTO telegram.supergroup (id, api_id, member_count, description, linked_chat_id)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id, api_id) DO UPDATE
            SET member_count = $3, description = $4, linked_chat_id = $5;
    `, [e.supergroup_id,
            t.credentials.api_id,
            e.supergroup_full_info.member_count,
            e.supergroup_full_info.description,
            e.supergroup_full_info.linked_chat_id]);

    } catch (error) {
        console.error('Error handle updateSupergroupFullInfo:', error);
    }

}

module.exports = updateSupergroupFullInfo;




// if(e.supergroup_full_info.hasOwnProperty('photo')){
//     try{
//         // const photoPath = path.join(process.cwd(), 'tdb', 'profile_photos', e.supergroup_full_info.photo.id + '.jpg')
//         // if (!fs.existsSync(photoPath)){
//         t_client.tdSend({
//             "@type": "downloadFile",
//             "file_id": e.supergroup_full_info.photo.sizes[1].photo.id,
//             "priority": 1,
//             "synchronous": true
//         });
//         // }
//         // console.log(e.supergroup_full_info.photo)
//     } catch(error) {
//         console.error('Error handle updateNewChat (process profile_photo):', error);
//     }
// }