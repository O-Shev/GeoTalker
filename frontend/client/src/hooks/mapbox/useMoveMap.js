import {useMap} from "../../context/MapboxContext";
import {useEffect, useRef} from "react";

const commonOptions = {
    duration: 500
}
export const useMoveMap = () => {
    const {map} = useMap();
    const backOption = useRef({});

    useEffect(() => {
        backOption.current = {
            ...commonOptions,
            padding: {right: 0, left: 0},
            zoom: map.current.getZoom(),
            center: map.current.getCenter()
        }
    }, []);

    const moveBack = () => {
        map.current.easeTo(backOption.current);
    }

    const slideBack = () => {
        map.current.easeTo({
            ...commonOptions,
            padding: {right: 0, left: 0}
        });
    }

    const slideLeft = (rightPadding) => {
        let options = commonOptions;
        options['padding'] = {right: rightPadding};
        map.current.easeTo(options)
    }
    const slideRight = (leftPadding) => {
        let options = commonOptions;
        options['padding'] = {left: leftPadding};
        map.current.easeTo(options)
    }

    const slideLeftAndFitBounds = (bbox, rightPadding) => {
        slideLeft(rightPadding);
        setTimeout(()=>{
            map.current.fitBounds(bbox)
        }, commonOptions.duration)
    }


    return {
        moveBack,
        slideBack,
        slideLeft,
        slideRight,
        slideLeftAndFitBounds
    }
}