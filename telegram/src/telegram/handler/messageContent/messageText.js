const messageText = async (content, t) => {
    delete content.text['@type'];
    return content.text;
}

module.exports = messageText;