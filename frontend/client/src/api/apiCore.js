import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_CORE_BASE_URL;
const apiCore = axios.create({
 baseURL: API_BASE_URL,
 headers: {
  'Content-Type': 'application/json',
 }
});


const endpointsCore = {
 getBoundaries: '/getBoundaries',
 getInitialWiretaps: '/getInitialWiretaps',
 getInitialLocalities: '/getInitialLocalities',
 getWiretapDetails: '/getWiretapDetails',
 getTelegramMessages: '/loadMessages',
 getTelegramSticker: '/file/telegram/sticker',
 getTelegramVideo: '/file/telegram/video',
 getTelegramPhoto: '/file/telegram/photo',
 getTelegramAnimation: '/file/telegram/animation',
 getTelegramProfilePhoto: '/getTelegramProfilePhoto',
 postGeoChat: '/postGeoChat',
 getPlacesByLngLat: '/placesByLngLat',
 getPlacesByStr: '/placesByStr',
 getTelegramPreviewByInterlink: '/previewByInterlink',
 getMe: '/user-account/getMe',
 postUserAccount: '/user-account/authorize/register',
 loginUserAccount: '/user-account/authorize/login',
 loginUserAccountOAuth2: '/user-account/authorize/oauth2',
 logoutUserAccount: '/user-account/logout'
};

export const fetchBoundaries = (id) => {
 return apiCore.get(`${endpointsCore.getBoundaries}/${id}`);
};

export const getMe = () => {
  return apiCore.get(endpointsCore.getMe);
}

export const getInitialWiretaps = () => {
 return apiCore.get(endpointsCore.getInitialWiretaps);
}

export const getInitialLocalities = () => {
 return apiCore.get(endpointsCore.getInitialLocalities);
}

export const fetchWiretapDetails = (id) => {
 return apiCore.get(`${endpointsCore.getWiretapDetails}/${id}`);
}

export const getTelegramMessages = (id, fromMessageId) => {
 return apiCore.get(`${endpointsCore.getTelegramMessages}/${id}/${fromMessageId}`);
}

export const getTelegramSticker = (file) => {
 return apiCore.get(`${endpointsCore.getTelegramSticker}/${file}`, {responseType: 'arraybuffer'});
}

export const postGeoChat = (data) => {
 return apiCore.post(endpointsCore.postGeoChat, data);
}

export const getPlacesByLngLat = (params) => {
 return apiCore.get(endpointsCore.getPlacesByLngLat, {params});
}

export const getPlacesByStr = (params) => {
 return apiCore.get(endpointsCore.getPlacesByStr, {params});
}

export const getTelegramPreviewByInterlink = (params) => {
 return apiCore.get(endpointsCore.getTelegramPreviewByInterlink, {params});
}

export const loginUserAccountOAuth2 = (data) => {
 return apiCore.post(endpointsCore.loginUserAccountOAuth2, data);
}

export const logoutUserAccount = () => {
 return apiCore.get(endpointsCore.logoutUserAccount);
}

export const getTelegramVideoUrl = (file) => {
  return `${API_BASE_URL}${endpointsCore.getTelegramVideo}/${file}`
}

export const getTelegramStickerUrl = (file) => {
 return `${API_BASE_URL}${endpointsCore.getTelegramSticker}/${file}`
}

export const getTelegramPhotoUrl = (file) => {
 return `${API_BASE_URL}${endpointsCore.getTelegramPhoto}/${file}`
}

export const getTelegramAnimationUrl = (file) => {
 return `${API_BASE_URL}${endpointsCore.getTelegramAnimation}/${file}`
}

export const getTelegramProfilePhotoUrl = (file) => {
 return `${API_BASE_URL}${endpointsCore.getTelegramProfilePhoto}/${file}`
}

export const postUserAccountUrl = () => {
 return `${API_BASE_URL}${endpointsCore.postUserAccount}`
}

export const loginUserAccountUrl = () => {
 return `${API_BASE_URL}${endpointsCore.loginUserAccount}`
}




export {apiCore, endpointsCore};
