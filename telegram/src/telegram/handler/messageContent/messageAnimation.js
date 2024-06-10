const messageAnimation = async (content, t) =>{
    const animation_content = {
        caption: content.caption,
        has_spoiler: content.has_spoiler,
        is_secret: content.is_secret,
        animation: {
            minithumbnail: content.animation.minithumbnail,
            duration: content.animation.duration,
            width: content.animation.width,
            height: content.animation.height,
            file: null
        }
    };

    animation_content.animation.file = await t.putFileAndGetName(content.animation.animation, t.config.MINIO_BUCKET_ANIMATION);

    return animation_content
}

module.exports=messageAnimation;