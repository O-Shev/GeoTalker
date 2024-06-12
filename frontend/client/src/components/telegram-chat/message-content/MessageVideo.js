import {IconButton, Typography} from "@mui/material";
import {formattedTextToHtml} from "../util/formattedTextParser";
import DownloadIcon from '@mui/icons-material/Download';
import {useState} from "react";
import {getTelegramVideoUrl} from "../../../api/apiCore";

//TODO button for fetch and in content add size of file
const MessageVideo = ({ content, maxWidth}) => {
    const [download, setDownload] = useState(false);

    let thumbnailDataUrl = '';
    if(content?.video?.minithumbnail?.data) thumbnailDataUrl = `data:image/jpeg;base64,${content.video.minithumbnail.data}`;


    const width = content.video.width > maxWidth ? maxWidth : content.video.width;
    const height =  (content.video.height / content.video.width) * width;
    const boxHeight = content.caption?.text === "" ? height : '100%';


    return (
        <div style={{maxWidth: maxWidth, height: boxHeight}}>
            {download ?
                <div>
                    <video
                        style={{
                            minWidth: width,
                            minHeight: height,
                        }}
                        controls
                        width={'100%'}
                        height={'100%'}
                    >
                        <source src={getTelegramVideoUrl()}/>
                    </video>
                </div>
                :
                <div style={{position: 'relative'}}>
                    <img alt="" src={thumbnailDataUrl} width={width} style={{display: 'block'}}/>
                    <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                        <IconButton
                            onClick={()=>setDownload(true)}
                            sx={{
                                backgroundColor: 'rgba(43,43,43,0.3)'
                            }}
                        >
                            <DownloadIcon sx={{color: '#f0f0f0'}}/>
                        </IconButton>
                    </div>
                </div>
            }
            <Typography variant="body2" sx={{px: '8px'}} children={formattedTextToHtml(content.caption)}/>
        </div>
    );
}

export default MessageVideo;
