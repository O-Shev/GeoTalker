import {useEffect, useState} from "react";
import Lottie from "lottie-react";
import pako from "pako";
import {getTelegramSticker} from "../../../api/apiCore";

const LottieSticker = ({file, style}) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        getTelegramSticker()
            .then((response)=>{
               return JSON.parse(pako.inflate(response.data, { to: 'string' }));
            })
            .then(data => setData(data))
            .catch((error)=>{console.log(error)});

    }, []);

    return <Lottie animationData={data} loop={true} style={style}/>;
}

export default LottieSticker;