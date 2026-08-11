#!/usr/bin/env python3
"""
SPORTIVERF — Telegram Webhook Listener Service
Receives booking & inquiry submissions from the web platform and forwards formatted notifications
with Telegram Interactive Inline Keyboard Buttons to the official SPORTIVERF Telegram Bot Concierge channel.

Bot Token: 8921060827:AAHUNo_mdKGBwTlbysIf3nbBYd3BIX9k1Pw
Chat ID:   269309616
"""

import json
import logging
import re
import urllib.request
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
from datetime import datetime

# Server & Telegram Settings
HOST = "0.0.0.0"
PORT = 5000
TELEGRAM_BOT_TOKEN = "8921060827:AAHUNo_mdKGBwTlbysIf3nbBYd3BIX9k1Pw"
TELEGRAM_CHAT_ID = "269309616"

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")

def send_telegram_message(text: str, phone_digits: str = "") -> bool:
    """
    Sends text message payload to Telegram Bot API with Inline Keyboard Button for WhatsApp.
    """
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": text,
        "parse_mode": "Markdown"
    }

    if phone_digits and len(phone_digits) >= 7:
        payload["reply_markup"] = {
            "inline_keyboard": [
                [
                    {
                        "text": "💬 Open WhatsApp Chat",
                        "url": f"https://wa.me/{phone_digits}"
                    }
                ]
            ]
        }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"}
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode("utf-8")
            logging.info(f"Telegram API response: {res_body}")
            return response.status == 200
    except Exception as e:
        logging.error(f"Failed to send Telegram notification: {e}")
        return False


class InquiryWebhookHandler(BaseHTTPRequestHandler):
    def _set_response(self, status_code=200, content_type="application/json"):
        self.send_response(status_code)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_response(200)

    def do_POST(self):
        if self.path == "/api/inquiry" or self.path == "/":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode("utf-8"))
            except Exception:
                data = {}

            # Extract fields
            full_name = str(data.get("fullName") or data.get("name") or data.get("agentName") or "").strip()
            email = str(data.get("email") or data.get("emailAddress") or "").strip()
            raw_phone = str(data.get("phone") or data.get("whatsapp") or data.get("phoneNumber") or data.get("mobile") or "").strip()
            sport = str(data.get("sport") or "FOOTBALL").strip()
            star_tier = str(data.get("starTier") or "5-Star VIP").strip()
            participants = str(data.get("participants") or data.get("athletesCount") or "1").strip()
            notes = str(data.get("notes") or data.get("message") or "No extra demands.").strip()
            camp_title = str(data.get("campTitle") or data.get("tourTitle") or "SPORTIVERF Expedition").strip()
            locale = str(data.get("locale") or "en").upper().strip()
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            # 1. Full Name Validation
            if not full_name or len(full_name) < 2:
                self._set_response(400)
                self.wfile.write(json.dumps({
                    "success": False,
                    "status": "error",
                    "message": "Validation Error: Full Name is required and must be at least 2 characters."
                }).encode("utf-8"))
                return

            # 2. Strict Email Regex Validation
            if not email or not EMAIL_REGEX.match(email):
                self._set_response(400)
                self.wfile.write(json.dumps({
                    "success": False,
                    "status": "error",
                    "message": "Validation Error: Please enter a valid email address (e.g. name@domain.com)."
                }).encode("utf-8"))
                return

            # 3. Strict Phone Validation (7-15 digits, no repeated fake digits)
            phone_digits = "".join(filter(str.isdigit, raw_phone))
            is_repeated = len(set(phone_digits)) <= 1 if phone_digits else True

            if not raw_phone or len(phone_digits) < 7 or len(phone_digits) > 15 or is_repeated:
                self._set_response(400)
                self.wfile.write(json.dumps({
                    "success": False,
                    "status": "error",
                    "message": "Validation Error: Please enter a valid international phone number with country code (7–15 digits)."
                }).encode("utf-8"))
                return

            # Format Telegram Markdown Notification
            msg_text = (
                f"🏆 *NEW SPORTIVERF PRICING INQUIRY*\n"
                f"━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
                f"📍 *Camp:* {camp_title}\n"
                f"⭐ *Tier:* {star_tier} | *Sport:* {sport}\n"
                f"👤 *Athlete/Agent:* {full_name}\n"
                f"📧 *Email:* `{email}`\n"
                f"📱 *Phone/WhatsApp:* `{raw_phone}`\n"
                f"👥 *Athletes Count:* {participants}\n"
                f"🌐 *Locale:* {locale}\n"
                f"📝 *Notes:* {notes}\n"
                f"⏰ *Time:* {timestamp}\n"
                f"━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
                f"⚡ *Action Required:* Click button below to contact via WhatsApp:"
            )

            success = send_telegram_message(msg_text, phone_digits)

            if success:
                self._set_response(200)
                response_data = {
                    "success": True,
                    "status": "success",
                    "message": "Inquiry successfully processed and dispatched to Telegram concierge.",
                    "referenceId": f"SRF-{int(datetime.now().timestamp())}"
                }
            else:
                self._set_response(500)
                response_data = {
                    "success": False,
                    "status": "error",
                    "message": "Failed to deliver inquiry to Telegram Bot."
                }

            self.wfile.write(json.dumps(response_data).encode("utf-8"))
        else:
            self._set_response(404)
            self.wfile.write(json.dumps({"success": False, "error": "Endpoint not found"}).encode("utf-8"))


def run_server():
    server_address = (HOST, PORT)
    httpd = HTTPServer(server_address, InquiryWebhookHandler)
    logging.info(f"SPORTIVERF Telegram Receiver listening on http://{HOST}:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        logging.info("Server shutting down.")
        httpd.server_close()

if __name__ == "__main__":
    run_server()
