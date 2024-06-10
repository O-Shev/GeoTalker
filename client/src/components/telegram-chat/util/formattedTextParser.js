import React from 'react';

export const formattedTextToHtml = (formattedText) => {
    const { text, entities } = formattedText;
    let result = text;
    const resultIndexes = new Map();
    for (let i = 0; i < result.length; i++) resultIndexes.set(i, i);
    resultIndexes.set(result.length, result.length)
    const getTagByType = (type, length, offset) => {
        switch (type['@type']) {
            case 'textEntityTypeBold': return {openTag: `<strong>`, closeTag: `</strong>`};
            case 'textEntityTypeItalic': return {openTag: `<em>`, closeTag: `</em>`};
            case 'textEntityTypeUnderline':return { openTag: '<u>', closeTag: '</u>' };
            case 'textEntityTypeStrikethrough': return { openTag: '<del>', closeTag: '</del>' };
            case 'textEntityTypeTextUrl': return {openTag: `<a href=${type.url} target="_blank">`, closeTag: `</a>`};
            case 'textEntityTypeUrl': return {openTag: `<a href=${text.slice(offset, length)} target="_blank">`, closeTag: `</a>`};
            case 'textEntityTypeCode':return { openTag: '<code>', closeTag: '</code>' };
            case 'textEntityTypePre':return { openTag: '<pre>', closeTag: '</pre>' };
            case 'textEntityTypePreCode': return { openTag: '<pre><code>', closeTag: '</code></pre>' };
            default: return {openTag: `<span>`, closeTag: `</span>`};
        }
    }

    const putInTheResult = (str, position) => {
        result = result.slice(0, resultIndexes.get(position)) + str + result.slice(resultIndexes.get(position));
        for (let i = position; i < resultIndexes.size; i++) {
            resultIndexes.set(i, resultIndexes.get(i)+str.length);
        }
    }

    entities.forEach((entity) => {
        const { type, length, offset } = entity;
        const {openTag, closeTag} = getTagByType(type, length, offset);
        putInTheResult(openTag, offset);
        putInTheResult(closeTag, offset+length);
    });


    result = result.replace(/\n/g, '<br>');
    return <div dangerouslySetInnerHTML={{ __html: result }} />;
}