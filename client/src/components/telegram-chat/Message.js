import {Avatar, Box, Card, Chip, Grid, Stack, Typography} from "@mui/material";
import MessageText from "./message-content/MessageText";
import MessageContentWrapper from "./MessageContentWrapper";
import MessageSticker from "./message-content/MessageSticker";
import React from "react";
import MessageAnimation from "./message-content/MessageAnimation";
import MessagePhoto from "./message-content/MessagePhoto";
import MessageVideo from "./message-content/MessageVideo";
import MessageAlbum from "./message-content/MessageAlbum";
import {getTelegramProfilePhotoUrl} from "../../api/apiCore";

const Message = ({message, wiretap}) => {

    let senderName;
    let content;
    let disableBottom;
    let disableTop;

    const slotProps= {
        img: {
            style: {
                background: 'rgba(0, 0, 0, 0.4)',
            }
        }
    }

    switch (message.sender.type) {
        case 'USER' : senderName=message.sender.name; break;
        case 'CURRENT_CHAT' : senderName = wiretap.chatTitle; break;
        case 'ANOTHER_CHAT' : senderName = `${message.sender.name} (chat)`; break;
        default: senderName = 'unknown user';
    }


    switch (message.contentType) {
        case 'messageText' :
            disableBottom = false;
            disableTop = false;
            content =  <MessageText content={message.content} />;
            break;
        case 'messageSticker':
            disableBottom = true;
            disableTop = true;
            content = <MessageSticker content={message.content} maxWidth={208}/>;
            break;
        case 'messageAnimatedEmoji':
            disableBottom = true;
            disableTop = true;
            content =  <MessageSticker content={message.content} maxWidth={112}/>;
            break;
        case 'messageAnimation':
            disableBottom = message.content.caption?.text === "";
            disableTop = disableBottom;
            content = <MessageAnimation content={message.content} maxWidth={400} />;
            break;
        case 'messageVideo':
            disableBottom = message.content.caption?.text === "";
            disableTop = false;
            content = <MessageVideo content={message.content} maxWidth={400} />;
            break;
        case 'messagePhoto':
            disableBottom = message.content.caption?.text === "";
            disableTop = false;
            content = <MessagePhoto content={message.content} maxWidth={400} />;
            break;
        case 'messageAlbum':
            disableBottom = false;
            disableTop = false;
            content = <MessageAlbum content={message.content} maxWidth={400}/>
            break;
        default:
            disableBottom = false;
            disableTop = false;
            content = <Typography variant={'body2'} sx={{px:'8px'}}>message unsuported</Typography>;
            break;
    }

    const MessageTimeChip = ({date, editeDate, disableBottom}) =>{

        const addLeadingZero = (number) => {
            return number < 10 ? `0${number}` : number;
        };
        let time;
        if(editeDate !== null) {
            const dateObject = new Date(editeDate);
            time = `edited ${addLeadingZero(dateObject.getHours())}:${addLeadingZero(dateObject.getMinutes())}`;
        } else {
            const dateObject = new Date(date);
            time = `${addLeadingZero(dateObject.getHours())}:${addLeadingZero(dateObject.getMinutes())}`;
        }

        if(disableBottom) return (
            <div style={{fontSize: '10px', position: 'absolute', right: 0, bottom: 0, padding: '3px'}}>
                <div style={{
                    borderRadius: '12px',
                    backgroundColor: 'rgba(43,43,43,0.4)',
                    padding: '0px 4px',
                    color: '#f0f0f0'
                }}>
                    {time}
                </div>
            </div>
        )
        else return (
            <div style={{
                fontSize: '10px',
                textAlign: 'right',
                paddingRight: '10px',
                paddingBottom: '5px',
            }}>
                {time}
            </div>
        )

    }
    return <>
        <Box
            sx={{
                mt: 1,
                maxWidth: 400,
            }}
        >
            <Stack direction="row" spacing={1} alignItems="flex-end">
                {message?.sender?.type !== 'CURRENT_CHAT' ?
                    <Avatar alt={message.sender.name} src={message.sender.avatar} slotProps={slotProps}/>
                    :
                    wiretap.chatPhotoId ?
                        <Avatar alt={wiretap.chatTitle[0]} src={getTelegramProfilePhotoUrl(wiretap.chatPhotoId)} />
                        :
                        <Avatar children={wiretap.chatTitle[0]}/>

                }
                <MessageContentWrapper disableTop={disableTop} disableBottom={disableBottom}>
                    {!disableTop ? <Typography variant="subtitle2" sx={{pt:'5px', px:'8px'}}>{senderName}</Typography> : null }
                    {content}
                    <MessageTimeChip date={message.date} editeDate={message.editDate} disableBottom={disableBottom}/>
                </MessageContentWrapper>
            </Stack>
        </Box>
    </>
}

export default Message;