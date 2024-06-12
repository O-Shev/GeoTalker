const messageAnimatedEmoji = async (content, t) => {
    const animated_emoji_content = {
        width: content.animated_emoji.sticker.width,
        height: content.animated_emoji.sticker.height,
        emoji: content.animated_emoji.sticker.emoji,
        format: content.animated_emoji.sticker.format['@type'],
        file: null
    };
    //full_type: content.animated_emoji.sticker.full_type
    //sound

    animated_emoji_content.file = await t.putFileAndGetName(content.animated_emoji.sticker.sticker, t.config.MINIO_BUCKET_STICKER);

    return animated_emoji_content;
};

module.exports = messageAnimatedEmoji;
