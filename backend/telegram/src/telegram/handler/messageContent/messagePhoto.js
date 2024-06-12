const choosePhotoSize = require("../../util/choosePhotoSize");
const messagePhoto  = async (content, t) => {
    const photo_content = {
        caption: content.caption,
        is_secret: content.is_secret,
        has_spoiler: content.has_spoiler,
        photo: {
            minithumbnail: content.photo.minithumbnail,
            width: null,
            height: null,
            file: null
        }
    };

    const photoSize = await choosePhotoSize(content.photo.sizes);
    if(!photoSize) return photo_content;
    photo_content.photo.width = photoSize.width;
    photo_content.photo.height = photoSize.height;

    photo_content.photo.file= await t.putFileAndGetName(photoSize.photo, t.config.MINIO_BUCKET_PHOTO);

    return photo_content;
};

module.exports = messagePhoto;