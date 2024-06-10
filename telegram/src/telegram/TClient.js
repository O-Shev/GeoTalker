const ffi = require('ffi-napi');
const { EventEmitter } = require('events');
const updateAuthorizationState = require('./handler/update/updateAuthorizationState.js')
const updateSupergroup = require('./handler/update/chat/updateSupergroup.js')
const updateSupergroupFullInfo = require('./handler/update/chat/updateSupergroupFullInfo.js')
const updateNewChat = require('./handler/update/chat/updateNewChat.js')
const updateChatTitle = require('./handler/update/chat/updateChatTitle')
const path = require("path");
const fs = require("fs");
const updateNewMessage = require("./handler/update/message/updateNewMessage");
const updateMessageContent = require("./handler/update/message/updateMessageContent");
const updateMessageEdited = require("./handler/update/message/updateMessageEdited");
const updateDeleteMessages = require("./handler/update/message/updateDeleteMessages");
const updateChatIsBlocked = require("./handler/update/chat/updateChatIsBlocked");
const updateMessageIsPinned = require("./handler/update/message/updateMessageIsPinned");
const updateChatPhoto = require("./handler/update/chat/updateChatPhoto");
const updateMessageInteractionInfo = require("./handler/update/message/updateMessageInteractionInfo");

class TClient {
  #tdjson;
  #clientId;
  pg_client;
  minio_client;

  config;
  credentials;

  eventEmitter;

  #requestId = 0;
  getNextRequestId() {
    return ++this.#requestId;
  }

  async #tdReceive() {
    const result = this.#tdjson.td_receive(this.config.receive_timeout);
    if (result) {
      return JSON.parse(Buffer.from(result, 'utf-8').toString());
    }
    return null;
  }

  tdSend(query) {
    this.#tdjson.td_send(this.#clientId, JSON.stringify(query));
  }

  tdExecute(query){
    const result = this.#tdjson.td_execute(JSON.stringify(query));
    if (result) {
      return JSON.parse(Buffer.from(result, 'utf-8').toString());
    }
    return null;   
  }

  #logMessageCallback = ffi.Callback('void', [ 'int', 'string' ], (verbosityLevel, message) => {
    // TODO. Catch warnings(2), error(1) and fatalerror(0)
    console.log(`${verbosityLevel}: ${message}`)
    if (verbosityLevel === 0) {
      console.error(`TDLib fatal error: ${message}`);
      process.exit(1);
    }
  }); 

  constructor(credentials, config, pg_client, minio_client){
    this.credentials = credentials;
    this.config = config;
    this.pg_client = pg_client;
    this.minio_client = minio_client;

    this.eventEmitter = new EventEmitter();


    this.#tdjson = ffi.Library('libtdjson', {
      'td_set_log_message_callback': [ 'void', [ 'int', 'pointer' ] ],
      'td_create_client_id': ['int', []],
      'td_receive': ['string', ['double']],
      'td_send': ['void', ['int', 'string']],
      'td_execute': ['string', ['string']]
    });
    
  }

  #init(){
    this.#tdjson.td_set_log_message_callback(2, this.#logMessageCallback);
    this.tdExecute({'@type': 'setLogVerbosityLevel', 'new_verbosity_level': 1}); // consol errors
    this.#clientId = this.#tdjson.td_create_client_id();
  }

  loadChats(){
    this.tdSend({
      "@type": "loadChats",
      "limit": 20,
      "@extra": 0.01
    })
  }

  async putFileAndGetName(file, bucket) {

    const response = await this.putFile(file, bucket);


    if(response && response.error
        && response.error !== 'FILE_IS_ALREADY_EXIST'
        && response.error !== 'FILE_IS_DOWNLOADING') {
      if(response.error === 'IS_TOO_LARGE') return 'IS_TOO_LARGE';
      else{
        console.log(response);
        return file.remote.unique_id;
      }
    } else return file.remote.unique_id;
  }


  //ПИПИСЬКААА
  async putFile(file, bucket){
    if(!file.remote?.is_uploading_completed)  return {error: 'is_uploading_completed is false or undefined'};
    if(!file.local?.can_be_downloaded)        return {error: 'can_be_downloaded is false or undefined'};
    if(!file.remote?.unique_id)               return {error: 'unique_id is false or undefined'};
    if(!file.id)                              return {error: 'id is false or undefined'};
    if(file.local.is_downloading_active)      return {error: 'FILE_IS_DOWNLOADING'};


    //check size
    if(file.size && file.size !== 0) {
      if(file.size > this.config.FILE_MAX_SIZE_TO_DOWNLOAD) return {error: 'IS_TOO_LARGE'};
    } else if (file.expected_size && file.expected_size !== 0){
      if(file.expected_size > this.config.FILE_MAX_SIZE_TO_DOWNLOAD) return {error: 'IS_TOO_LARGE'};
    }

    const file_name = file.remote.unique_id;
    let stat = null;
    try {stat = await this.minio_client.statObject(bucket, file_name);}
    catch (e) {if(e.code !== 'NotFound')      return {error: `minio error: ${e}`};}
    if(stat)                                  return {error: 'FILE_IS_ALREADY_EXIST'};

    const that = this;
    const requestId = this.getNextRequestId();
    this.eventEmitter.once(requestId, async (response_file) => {
      if(response_file['@type'] !== "file"){
        console.log("putFile error: response_file['@type'] !== \"file\"");
      }
      else {
        try{
          if (response_file.remote?.unique_id !== file.remote?.unique_id) {
            console.log("error downloaded file: response_file.remote.unique_id !== file.remote.unique_id");
            return;
          }
          const metadata = {'telegram-client-api-id': this.credentials.api_id}
          this.minio_client.fPutObject(bucket, file_name, response_file.local.path, metadata, function (err, etag) {
            if (err){
              console.log("fPutObject")
              console.log(err);
              console.log(response_file);
            }
            else {
              that.tdSend({
                "@type": "deleteFile",
                "file_id": response_file.id
              });
            }
          })
        } catch (e) {
          console.log(e);
        }
      }
    });

    this.tdSend({
      "@type": "downloadFile",
      "file_id": file.id,
      "priority": 2,
      "synchronous": true,
      "@extra": requestId
    });

  }


  async start(){
    this.#init();
    // Start the client by sending a request to it
    this.tdSend({'@type': 'getOption', 'name': 'version'}); 

    while(true){
      const event = await this.#tdReceive();
      
      if (event) {
        if(event['@extra'] && event['@extra'] === 0.01) {
          if(event['@type'] === 'Ok') this.loadChats();
        }

        if(event['@extra']) this.eventEmitter.emit(event['@extra'], event);
        switch (event['@type']) {
          case 'updateAuthorizationState':      await updateAuthorizationState(event, this);     break;
          case 'updateSupergroup':              await updateSupergroup(event, this);             break;
          case 'updateSupergroupFullInfo':      await updateSupergroupFullInfo(event, this);     break;
          case 'updateNewChat':                 await updateNewChat(event, this);                break;
          case 'updateChatTitle':               await updateChatTitle(event, this);              break;
          case 'updateChatIsBlocked':           await updateChatIsBlocked(event, this);          break;
          case 'updateChatPhoto':               await updateChatPhoto(event, this);              break;
          case 'updateMessageInteractionInfo':  await updateMessageInteractionInfo(event, this); break;
          case 'updateNewMessage':              await updateNewMessage(event, this);             break;
          case 'updateMessageContent':          await updateMessageContent(event, this);         break;
          case 'updateMessageEdited':           await updateMessageEdited(event, this);          break;
          case 'updateDeleteMessages':          await updateDeleteMessages(event, this);         break;
          case 'updateMessageIsPinned':         await updateMessageIsPinned(event, this);        break;
          // case 'updateChatOnlineMemberCount':   console.log(event); break; // only if chat is open
          // case 'updateConnectionState':         console.log(event); break;
          case 'error': console.log(event); break;
          default:
            // Handle default case
        }

      }

      await new Promise(resolve => setTimeout(resolve, 0));
    } 

  }


}

module.exports = TClient;


// async downloadFileIfNotPresent(file, t_client){
//   try{
//     if(!file.local?.can_be_downloaded) return;
//     if(!file.id || !file.remote?.unique_id) return;
//     if(!file.remote?.is_uploading_completed) return;
//
//     const result = await t_client.pg_client.query(
//         `SELECT name FROM telegram.file WHERE id = $1`,
//         [file.remote.unique_id]
//     );
//
//
//     if (result.rows.length === 0 ||
//         !result.rows[0].name ||
//         !result.rows[0].type ||
//         !fs.existsSync(path.join(this.config.database_directory, result.rows[0].type, result.rows[0].name))){
//
//       const requestId = t_client.getNextRequestId()
//
//       t_client.eventEmitter.once(requestId, (file) => {
//         if(file['@type'] !== "file") {
//           console.log(file);
//           return;
//         }
//
//         const fileName = path.basename(file.local.path);
//         t_client.pg_client.query(
//             `INSERT INTO telegram.file (id, name) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET name=$2`,
//             [file.remote.unique_id, fileName]
//         );
//
//       });
//
//       t_client.tdSend({
//         "@type": "downloadFile",
//         "file_id": file.id,
//         "priority": 2,
//         "synchronous": true,
//         "@extra": requestId
//       });
//     }
//
//
//
//
//   } catch(error) {
//     console.error('Error handle updateNewChat (process profile_photo):', error);
//   }
// }









//оставь Лёшу в покое и заработай так как он хочет
//писька писька овались ка
//ААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA  https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley