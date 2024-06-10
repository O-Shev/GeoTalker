import {Typography} from "@mui/material";
import {formattedTextToHtml} from "../util/formattedTextParser";

const MessageText = ({content}) => {

    return (<Typography variant="body2"  sx={{px:'8px'}} children={formattedTextToHtml(content)}/>);
}
export default MessageText;