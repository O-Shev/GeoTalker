CREATE SCHEMA telegram;


CREATE TYPE telegram.chat_member_status AS ENUM (
    'chatMemberStatusCreator',
    'chatMemberStatusAdministrator',
    'chatMemberStatusMember',
    'chatMemberStatusRestricted',
    'chatMemberStatusLeft',
    'chatMemberStatusBanned'
);

CREATE TABLE telegram.supergroup(
    id BIGINT NOT NULL,
    api_id INT NOT NULL,
    chat_id BIGINT,

    title VARCHAR,
    profile_photo VARCHAR,
    member_count INT,
    username VARCHAR,
    description TEXT,
    member_status telegram.chat_member_status,

    has_linked_chat boolean,
    linked_chat_id BIGINT,

    is_channel boolean,
    is_broadcast_group boolean,
    is_verified boolean,
    is_scam boolean,
    is_fake boolean,
    is_blocked boolean,

    PRIMARY KEY (id, api_id),
    CONSTRAINT unique_api_chat_id UNIQUE (api_id, chat_id)
);
CREATE INDEX idx_supergroup_api_chat ON telegram.supergroup (api_id, chat_id);



CREATE TYPE telegram.message_sender_type AS ENUM (
    'messageSenderUser',
    'messageSenderChat'
);


CREATE TABLE telegram.message(
     api_id INT NOT NULL,
     chat_id BIGINT NOT NULL,
     id BIGINT NOT NULL,

     sender_type telegram.message_sender_type NOT NULL,
     sender_id BIGINT NOT NULL,

     date TIMESTAMP,
     edit_date TIMESTAMP,

     is_pinned BOOLEAN,
     is_channel_post BOOLEAN,
     reply_to_chat_id BIGINT,
     reply_to_message_id BIGINT,
     message_thread_id BIGINT,
     media_album_id BIGINT,

     view_count INT,
     forward_count INT,

     content_type varchar(50) NOT NULL,
     content JSONB NOT NULL,

     PRIMARY KEY (api_id, chat_id, id),
     FOREIGN KEY (api_id, chat_id) REFERENCES telegram.supergroup(api_id, chat_id)
);