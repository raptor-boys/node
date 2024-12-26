const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Load your service account key
const serviceAccount = require('/workspaces/empty/node/data.json>

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'test-30b8e.appspot.com' // Set your bucket URL here
});

const bucket = admin.storage().bucket();

// Function to upload a directory recursively
const uploadDirectory = async (dir) => {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // If it's a directory, call the function recursively
      await uploadDirectory(filePath);
    } else {
      // If it's a file, upload it
      await uploadFile(filePath);
    }
  }
};

// Function to upload a single file
const uploadFile = async (filePath) => {
  const fileName = path.relative(__dirname, filePath); // Use relative path for storage
  const file = bucket.file(fileName);

  await bucket.upload(filePath, {
    destination: fileName, // You can specify a path here if needed
  });

  console.log(`${filePath} uploaded to ${file.name}.`);
};

// Set the upload directory path
const directoryPath = '/wirkspaces/empty'; // Set your upload directory path>

// Start the upload process
uploadDirectory(directoryPath)
  .then(() => {
    console.log('All files uploaded successfully!');
  })
  .catch((error) => {
    console.error('Error uploading files:', error);
  });

