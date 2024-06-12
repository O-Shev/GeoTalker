import {Grid, ImageList, ImageListItem} from "@mui/material";
import {getTelegramPhotoUrl, getTelegramVideoUrl} from "../../../api/apiCore";

function srcset(image, size, rows = 1, cols = 1) {
    return {
        src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
        srcSet: `${image}?w=${size * cols}&h=${
            size * rows
        }&fit=crop&auto=format&dpr=2 2x`,
    };
}

const MessageAlbum = ({content, maxWidth}) => {


    //content is array of contents



    return (
        <div style={{maxWidth: maxWidth}}>
            <Grid container spacing={0}>
                {content.map(item => {

                    return (
                        <Grid xs={6}>
                            {item.contentType === 'messagePhoto' ?
                                <div>
                                    <img width={'100%'} src={getTelegramPhotoUrl(item.photo.file)} alt={''}/>
                                </div>
                                : item.contentType === 'messageVideo' ?
                                <div>
                                    <video
                                        controls
                                        width={'100%'}
                                        height={'100%'}
                                    >
                                        <source src={getTelegramVideoUrl(item.video.file)}/>
                                    </video>
                                </div> : <div>{item.contentType}</div>
                            }
                        </Grid>
                    )
                })}
            </Grid>
        </div>

    );


}

export default MessageAlbum;