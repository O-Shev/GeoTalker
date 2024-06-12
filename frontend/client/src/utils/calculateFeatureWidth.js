// convert [css width] (like '123px' or '23%') to exactly width based on windows width
export const calculateFeatureWidth = (featureWidth) => {
        if (featureWidth.slice(-1) === '%') {
            const percent = parseFloat(featureWidth) / 100;
            return Math.round(window.innerWidth * percent);
        } else {
            return parseInt(featureWidth);
        }
}