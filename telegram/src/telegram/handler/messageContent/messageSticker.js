const messageSticker = async (content, t) => {
    const sticker_content = {
        width: content.sticker.width,
        height: content.sticker.height,
        emoji: content.sticker.emoji,
        format: content.sticker.format['@type'],
        file: null
    };
    //full_type: content.sticker.full_type

    sticker_content.file = await t.putFileAndGetName(content.sticker.sticker, t.config.MINIO_BUCKET_STICKER);

    return sticker_content;
};

module.exports = messageSticker;
