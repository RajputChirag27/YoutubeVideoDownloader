const port = 3000; // Replace 3000 with your server's port number

ngrok.connect(port)
  .then(url => {
    console.log('Ngrok tunnel created:', url);
  })
  .catch(error => {
    console.error('Error starting Ngrok:', error);
  });
