const messageVideoNote  = async (content, t) => {
    const video_note_content = {
        is_secret: content.is_secret,
        is_viewed: content.is_viewed,
        video_note: {
            minithumbnail: content.video_note.minithumbnail,
            duration: content.video_note.duration,
            length: content.video_note.length,
            speech_recognition_result: content.video_note.speech_recognition_result,
            file: null
        }
    };

    video_note_content.video_note.file = await t.putFileAndGetName(content.video_note.video, t.config.MINIO_BUCKET_VIDEO_NOTE);
    return video_note_content;
};

module.exports = messageVideoNote;

//
//mime_type: content.video.mime_type,