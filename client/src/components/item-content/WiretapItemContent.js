import {Avatar, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import {constructChatExtra} from "../../utils/utils";
import React from "react";
import {getTelegramProfilePhotoUrl} from "../../api/apiCore";

const WiretapItemContent = ({w, sx}) => {


    return <>
        <ListItem sx={sx}>
            <ListItemAvatar>
                {w.chatPhotoId ? <Avatar alt={w.chatTitle[0]} src={getTelegramProfilePhotoUrl(w.chatPhotoId)} /> : <Avatar children={w.chatTitle[0]}/>}
            </ListItemAvatar>
            <ListItemText
                primary={w.chatTitle}
                secondary={constructChatExtra(w.memberCount, w.isChannel)}
                primaryTypographyProps={{
                    noWrap: true,
                }}
            />
        </ListItem>
    </>
}

export default WiretapItemContent;