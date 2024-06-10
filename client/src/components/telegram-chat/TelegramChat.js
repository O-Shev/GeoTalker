import {useEffect, useRef, useState} from "react";
import Message from "./Message";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from '@mui/material/CircularProgress';
import {Box} from "@mui/material";
import {getTelegramMessages} from "../../api/apiCore";

const TelegramChat = ({wiretap}) => {
    const [messages, setMessages] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const fetchMessages = async (fromMessageId) => {
        if(fromMessageId === undefined) fromMessageId = messages.length === 0 ? -1 : messages[messages.length-1].id;
        try {
            const response = await getTelegramMessages(wiretap.id, fromMessageId);
            if(fromMessageId === -1) setMessages(response.data);
            else setMessages([...messages, ...response.data]);
            if(response?.data?.length === 0) setHasMore(false);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        setHasMore(true);
        fetchMessages(-1);
    }, [wiretap]);


    return (
        <Box
            id="scrollableDiv"
            sx={{
                height:'100%',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                px: 2
            }}
        >
            <InfiniteScroll
                dataLength={messages.length}
                next={fetchMessages}
                hasMore={hasMore}
                loader={<div style={{ width: '100%', marginTop: 20, marginBottom: 10, textAlign: 'center'}}><CircularProgress size={25}/></div>}
                scrollableTarget="scrollableDiv"
                style={{display: 'flex', flexDirection: 'column-reverse', overflow:'hidden', paddingBottom: '25px'}} //To put endMessage and loader to the top.
                inverse={true}
            >
                {messages.map(message => (
                    <Message key={message.id} message={message} wiretap={wiretap}/>
                ))}
            </InfiniteScroll>
        </Box>
    );
}

export default TelegramChat;