import {Box, Typography} from "@mui/material";
import {formattedTextToHtml} from "../util/formattedTextParser";
import {getTelegramPhotoUrl} from "../../../api/apiCore";

const MessagePhoto = ({content, maxWidth}) => {

    return (
        <div style={{maxWidth: maxWidth}}>
            <img width={'100%'} src={getTelegramPhotoUrl(content.photo.file)} alt={''}/>
            <Typography variant="body2" sx={{px:'8px'}} children={formattedTextToHtml(content.caption)}/>
        </div>
    )
}

export default MessagePhoto;