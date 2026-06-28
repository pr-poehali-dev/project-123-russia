import json
import os
import urllib.request
import urllib.parse


DEFAULT_RULES = [
    {"keyword": "привет", "reply": "Привет! Я бот-помощник. Чем могу помочь? Напишите «помощь»."},
    {"keyword": "помощь", "reply": "Я отвечаю по ключевым словам: цена, контакты, время. Просто напишите слово."},
    {"keyword": "цена", "reply": "Актуальные цены уточняйте у менеджера или на сайте."},
    {"keyword": "контакты", "reply": "Свяжитесь с нами по почте или телефону, указанным на сайте."},
    {"keyword": "время", "reply": "Мы работаем ежедневно с 9:00 до 21:00."},
]

FALLBACK_REPLY = "Не совсем понял запрос. Напишите «помощь», чтобы увидеть, что я умею."


def send_message(token: str, chat_id: int, text: str) -> None:
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    data = urllib.parse.urlencode({"chat_id": chat_id, "text": text}).encode()
    req = urllib.request.Request(url, data=data)
    urllib.request.urlopen(req, timeout=10)


def set_webhook(token: str, webhook_url: str) -> dict:
    url = f"https://api.telegram.org/bot{token}/setWebhook"
    data = urllib.parse.urlencode({"url": webhook_url}).encode()
    req = urllib.request.Request(url, data=data)
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read().decode())


def find_reply(text: str, rules: list) -> str:
    low = (text or "").lower()
    for rule in rules:
        if rule.get("keyword", "").lower() in low:
            return rule.get("reply", FALLBACK_REPLY)
    return FALLBACK_REPLY


def handler(event: dict, context) -> dict:
    """Telegram-бот: принимает webhook-обновления и отвечает по ключевым словам, а также настраивает webhook."""
    method = event.get("httpMethod", "GET")

    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-User-Id, X-Auth-Token, X-Session-Id",
        "Access-Control-Max-Age": "86400",
    }

    if method == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    body_raw = event.get("body") or "{}"
    try:
        body = json.loads(body_raw)
    except Exception:
        body = {}

    params = event.get("queryStringParameters") or {}
    action = params.get("action") or body.get("action")

    if action == "setup":
        token = body.get("token", "").strip()
        webhook_url = body.get("webhook_url", "").strip()
        if not token or not webhook_url:
            return {
                "statusCode": 400,
                "headers": {**cors, "Content-Type": "application/json"},
                "body": json.dumps({"ok": False, "error": "token и webhook_url обязательны"}),
            }
        result = set_webhook(token, webhook_url)
        return {
            "statusCode": 200,
            "headers": {**cors, "Content-Type": "application/json"},
            "body": json.dumps({"ok": result.get("ok", False), "result": result}, ensure_ascii=False),
        }

    if action == "rules":
        return {
            "statusCode": 200,
            "headers": {**cors, "Content-Type": "application/json"},
            "body": json.dumps({"ok": True, "rules": DEFAULT_RULES}, ensure_ascii=False),
        }

    token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    message = body.get("message") or body.get("edited_message")
    if message and token:
        chat_id = message.get("chat", {}).get("id")
        text = message.get("text", "")
        if chat_id:
            reply = find_reply(text, DEFAULT_RULES)
            send_message(token, chat_id, reply)

    return {
        "statusCode": 200,
        "headers": {**cors, "Content-Type": "application/json"},
        "body": json.dumps({"ok": True}),
    }
