const messageAudio = async (content, t) => {
    const audio_content = {
        caption: content.caption,
        audio: {
            duration: content.audio.duration,
            performer: content.audio.performer,
            title: content.audio.title,
            file: null
        }
    };

    audio_content.audio.file = await t.putFileAndGetName(content.audio.audio, t.config.MINIO_BUCKET_AUDIO);
    return audio_content;
};

module.exports = messageAudio;

//
//mime_type: content.audio.mime_type,