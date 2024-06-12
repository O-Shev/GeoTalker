import {Typography} from "@mui/material";
import {formattedTextToHtml} from "../util/formattedTextParser";
import {getTelegramAnimationUrl} from "../../../api/apiCore";

//TODO button for fetch and in content add size of file
const MessageAnimation = ({ content, maxWidth}) => {
    const thumbnailDataUrl = `data:image/jpeg;base64,${content.animation.minithumbnail.data}`;

    const width = content.animation.width > maxWidth ? maxWidth : content.animation.width;
    const height =  (content.animation.height / content.animation.width) * width;
    const boxHeight = content.caption?.text === "" ? height : '100%';

    return (
        <div style={{maxWidth: maxWidth}}>
            <div>
                <video

                    width={'100%'}
                    height={'100%'}
                    autoPlay
                    loop
                    muted
                    poster={thumbnailDataUrl}
                >
                    <source src={getTelegramAnimationUrl(content.animation.file)}/>
                </video>
            </div>
            <Typography variant="body2" sx={{px:'8px'}} children={formattedTextToHtml(content.caption)}/>
        </div>
    );
}

export default MessageAnimation;