const messagePinMessage = async (content, t) => {
    delete content['@type'];
    return content;
};

module.exports = messagePinMessage;
