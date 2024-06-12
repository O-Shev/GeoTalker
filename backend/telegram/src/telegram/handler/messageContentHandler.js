// content constructor
const messageText = require("./messageContent/messageText");
const messagePhoto = require("./messageContent/messagePhoto");
const messageVideo = require("./messageContent/messageVideo");
const messageVideoNote = require("./messageContent/messageVideoNote");
const messageAudio = require("./messageContent/messageAudio");
const messageVoiceNote = require("./messageContent/messageVoiceNote");
const messageSticker = require("./messageContent/messageSticker");
const messageAnimatedEmoji = require("./messageContent/messageAnimatedEmoji");
const messageAnimation = require("./messageContent/messageAnimation");
const messageContentHandler = async (content, t) => {
    switch (content['@type']) {
        case 'messageAnimatedEmoji':                   return await messageAnimatedEmoji(content, t);
        case 'messageAnimation':                       return await messageAnimation(content, t);
        case 'messageAudio':                           return await messageAudio(content, t);
        // case 'messageBasicGroupChatCreate':            return await messageBasicGroupChatCreate(content, t);
        // case 'messageCall':                            return await messageCall(content, t);
        // case 'messageChatAddMembers':                  return await messageChatAddMembers(content, t);
        // case 'messageChatChangePhoto':                 return await messageChatChangePhoto(content, t);
        // case 'messageChatChangeTitle':                 return await messageChatChangeTitle(content, t);
        // case 'messageChatDeleteMember':                return await messageChatDeleteMember(content, t);
        // case 'messageChatDeletePhoto':                 return await messageChatDeletePhoto(content, t);
        // case 'messageChatJoinByLink':                  return await messageChatJoinByLink(content, t);
        // case 'messageChatJoinByRequest':               return await messageChatJoinByRequest(content, t);
        // case 'messageChatSetTheme':                    return await messageChatSetTheme(content, t);
        // case 'messageChatSetTtl':                      return await messageChatSetTtl(content, t);
        // case 'messageChatUpgradeFrom':                 return await messageChatUpgradeFrom(content, t);
        // case 'messageChatUpgradeTo':                   return await messageChatUpgradeTo(content, t);
        // case 'messageContact':                         return await messageContact(content, t);
        // case 'messageContactRegistered':               return await messageContactRegistered(content, t);
        // case 'messageCustomServiceAction':             return await messageCustomServiceAction(content, t);
        // case 'messageDice':                            return await messageDice(content, t);
        // case 'messageDocument':                        return await messageDocument(content, t);
        // case 'messageExpiredPhoto':                    return await messageExpiredPhoto(content, t);
        // case 'messageExpiredVideo':                    return await messageExpiredVideo(content, t);
        // case 'messageGame':                            return await messageGame(content, t);
        // case 'messageGameScore':                       return await messageGameScore(content, t);
        // case 'messageInviteVideoChatParticipants':     return await messageInviteVideoChatParticipants(content, t);
        // case 'messageInvoice':                         return await messageInvoice(content, t);
        // case 'messageLocation':                        return await messageLocation(content, t);
        // case 'messagePassportDataReceived':            return await messagePassportDataReceived(content, t);
        // case 'messagePassportDataSent':                return await messagePassportDataSent(content, t);
        // case 'messagePaymentSuccessful':               return await messagePaymentSuccessful(content, t);
        // case 'messagePaymentSuccessfulBot':            return await messagePaymentSuccessfulBot(content, t);
        case 'messagePhoto':                           return await messagePhoto(content, t);
        // case 'messagePinMessage':                      return await messagePinMessage(content, t);
        // case 'messagePoll':                            return await messagePoll(content, t);
        // case 'messageProximityAlertTriggered':         return await messageProximityAlertTriggered(content, t);
        // case 'messageScreenshotTaken':                 return await messageScreenshotTaken(content, t);
        case 'messageSticker':                         return await messageSticker(content, t);
        // case 'messageSupergroupChatCreate':            return await messageSupergroupChatCreate(content, t);
        case 'messageText':                            return await messageText(content, t);
        case 'messageUnsupported':                     return null;
        // case 'messageVenue':                           return await messageVenue(content, t);
        case 'messageVideo':                           return await messageVideo(content, t);
        // case 'messageVideoChatEnded':                  return await messageVideoChatEnded(content, t);
        // case 'messageVideoChatScheduled':              return await messageVideoChatScheduled(content, t);
        // case 'messageVideoChatStarted':                return await messageVideoChatStarted(content, t);
        case 'messageVideoNote':                       return await messageVideoNote(content, t);
        case 'messageVoiceNote':                       return await messageVoiceNote(content, t);
        // case 'messageWebsiteConnected':                return await messageWebsiteConnected(content, t);
        default: {
            // console.log(content)
            return null;
        }
    }
};

module.exports = messageContentHandler;
