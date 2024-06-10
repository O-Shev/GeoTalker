package com.geotalker.core.dto.telegram.TObject;

import com.fasterxml.jackson.annotation.*;
import com.geotalker.core.dto.telegram.TlObject;

@JsonSubTypes({
        @JsonSubTypes.Type(value = TError.class, name = "error"),
        @JsonSubTypes.Type(value = TChatInviteLinkInfo.class, name = "chatInviteLinkInfo"),
        @JsonSubTypes.Type(value = TChat.class, name = "chat"),
        @JsonSubTypes.Type(value = TChatPhotoInfo.class, name = "chatPhotoInfo"),
        @JsonSubTypes.Type(value = TFile.class, name = "file"),
        @JsonSubTypes.Type(value = TRemoteFile.class, name = "remoteFile"),
        @JsonSubTypes.Type(value = TLocalFile.class, name = "localFile"),
        @JsonSubTypes.Type(value = TMiniThumbnail.class, name = "minithumbnail"),
        @JsonSubTypes.Type(value = TOk.class, name = "ok")
})
public abstract class TObject extends TlObject {}
