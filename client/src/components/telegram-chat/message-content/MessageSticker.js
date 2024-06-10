import LottieSticker from "../util/LottieSticker";
import {getTelegramStickerUrl} from "../../../api/apiCore";

const MessageSticker = ({ content, maxWidth}) => {

    const renderSticker = () => {
        switch (content.format) {
            case 'stickerFormatWebp':
                return <img width={'100%'} src={getTelegramStickerUrl(content.file)} alt={content.emoji} />;
            case 'stickerFormatWebm':
                return (
                    <video width={'100%'} autoPlay loop muted>
                        <source src={getTelegramStickerUrl(content.file)} type="video/webm" />
                    </video>
                );
            case 'stickerFormatTgs':
                return <LottieSticker file={content.file}/>
            default:
                return <div>Unsupported format</div>;
        }
    };

    return (
        <div style={{maxWidth: maxWidth}}>
            {renderSticker()}
        </div>
    );
};
export default MessageSticker;