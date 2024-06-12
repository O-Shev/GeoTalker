const messageVideo  = async (content, t) => {
    const video_content = {
        caption: content.caption,
        is_secret: content.is_secret,
        has_spoiler: content.has_spoiler,
        video: {
            minithumbnail: content.video.minithumbnail,
            duration: content.video.duration,
            width: content.video.width,
            height: content.video.height,
            file: null
        }
    };

    video_content.video.file = await t.putFileAndGetName(content.video.video, t.config.MINIO_BUCKET_VIDEO);
    return video_content;
};

module.exports = messageVideo;

//
//mime_type: content.video.mime_type,