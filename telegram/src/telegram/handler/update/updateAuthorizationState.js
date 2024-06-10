const updateAuthorizationState = async (e, t) => {
  const authState = e.authorization_state;
  console.log(authState);

  if (authState['@type'] === 'authorizationStateWaitTdlibParameters') {
    t.tdSend({
      '@type': 'setTdlibParameters',
      'api_id': t.credentials.api_id,
      'api_hash': t.credentials.api_hash,
      'device_model': t.config.device_model,
      'application_version': t.config.application_version,
      'system_language_code': 'en',
      'database_directory': t.config.database_directory,
      'use_chat_info_database': false,
      'use_message_database': false,
      'use_secret_chats': false,
      'enable_storage_optimizer': false
    });
  }

  else if (authState['@type'] === 'authorizationStateWaitPhoneNumber') {
    t.tdSend({'@type': 'setAuthenticationPhoneNumber', 'phone_number': t.credentials.phone_number})
  }

  else if (authState['@type'] === 'authorizationStateWaitCode') {

  }

  else if (authState['@type'] === 'authorizationStateWaitPassword') {
    t.tdSend({'@type': 'checkAuthenticationPassword', 'password': t.credentials.password});
  }

  else if (authState['@type'] === 'authorizationStateWaitEncryptionKey'){
    // TODO. TDLib needs an encryption key to decrypt the local database.
    t.tdSend({'@type': 'close', '@extra': 0.1})
  } 

  else if (authState['@type'] === 'authorizationStateWaitOtherDeviceConfirmation'){
    // TODO. The user needs to confirm authorization on another logged in device by scanning a QR code with the provided link.
    t.tdSend({'@type': 'close', '@extra': 0.2})
  } 

  else if (authState['@type'] === 'authorizationStateWaitRegistration'){
    // TODO. The user is unregistered and need to accept terms of service and enter their first name and last name to finish registration.
    console.log("unhandler state: authorizationStateWaitRegistration")
    t.tdSend({'@type': 'close', '@extra': 0.3})
  } 

  else if (authState['@type'] === 'authorizationStateLoggingOut'){
    // TODO. If loggingOut -> delete td.binlog and create new Client object 
    t.tdSend({'@type': 'close', '@extra': 0.4})
  } 

  else if (authState['@type'] === 'authorizationStateReady'){
    // TODO. The user has been successfully authorized. TDLib is now ready to answer queries.
    t.loadChats();
  } 

  else if (authState['@type'] === 'authorizationStateClosing'){
    // TODO. TDLib is closing, all subsequent queries will be answered with the error 500. Note that closing TDLib can take a while. All resources will be freed only after authorizationStateClosed has been received.
  } 

  else if (authState['@type'] === 'authorizationStateClosed'){
    // TODO. TDLib client is in its final state. All databases are closed and all resources are released. No other updates will be received after this. All queries will be responded to with error code 500. To continue working, one must create a new instance of the TDLib client.
    process.exit(0)
  } 

  else {
    console.error(new Error(`unexception authorizationState handler state: ${authState['@type']}`));
    process.exit(1) 
  }
}

module.exports = updateAuthorizationState;







// const readline = require('readline');

// const fs = require('fs').promises;
// async function deleteFile(filePath) {
//     try {
//         // Check if the file exists before attempting to delete
//         await fs.access(filePath);

//         // Delete the file
//         await fs.unlink(filePath);
//         console.log(`File ${filePath} deleted successfully.`);
//     } catch (error) {
//         console.error(`Error deleting file: ${error.message}`);
//     }
// }

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });
//
// const askQuestion = (question) => {
//   return new Promise((resolve) => {
//     rl.question(question, (answer) => {
//       rl.close();
//       resolve(answer);
//     });
//   });
// };

// const code = await askQuestion('authorization code:');
// t_client.tdSend({'@type': 'checkAuthenticationCode', 'code': code});