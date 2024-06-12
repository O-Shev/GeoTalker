export function formatNumberWithSpaces(number) {
    // Convert number to string
    const numberString = number.toString();

    // Split the string into groups of three digits from the right side
    let result = '';
    let count = 0;
    for (let i = numberString.length - 1; i >= 0; i--) {
        result = numberString[i] + result;
        count++;
        // Add a space after every three digits, except for the last group
        if (count % 3 === 0 && i !== 0) {
            result = ' ' + result;
        }
    }

    return result;
}

export function constructChatExtra(memberCount, isChannel) {
    return `${formatNumberWithSpaces(memberCount)} ${isChannel ? 'subscribers' : 'members'}`
}

export const calculateDimensions = (width, height, maxWidth) => {
    if(width <= maxWidth ) return { width: width, height: height};

    let newWidth, newHeight;
    newWidth = maxWidth;
    newHeight = (height / width) * maxWidth;
    return { width: newWidth, height: newHeight };
};