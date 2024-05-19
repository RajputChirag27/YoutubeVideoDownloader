const ngrok = require('ngrok');

ngrok.disconnect()
  .then(() => {
    console.log('Ngrok tunnel stopped');
  })
  .catch(error => {
    console.error('Error stopping Ngrok:', error);
  });
