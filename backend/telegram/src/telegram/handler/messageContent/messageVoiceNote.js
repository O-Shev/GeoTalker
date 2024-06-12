const messageVoiceNote = async (content, t) => {
    const voice_note_content = {
        caption: content.caption,
        is_listened: content.is_listened,
        voice_note: {
            duration: content.voice_note.duration,
            waveform: content.voice_note.waveform,
            file: null
        }
    };

    voice_note_content.voice_note.file = await t.putFileAndGetName(content.voice_note.voice, t.config.MINIO_BUCKET_VOICE_NOTE);
    return voice_note_content;
};

module.exports = messageVoiceNote;

//
//mime_type: content.voice_note.mime_type,