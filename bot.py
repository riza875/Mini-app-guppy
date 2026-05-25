from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

BOT_TOKEN = "8849881003:AAGk1D9_qWME23QXhfLn7q8Q-TTHo6RPxOY"
MINI_APP_URL = "https://t.me/guppy_Tetribot/guppycoin"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    nama = user.first_name or "Guppy Miner"
    app_url = MINI_APP_URL

    keyboard = InlineKeyboardMarkup([
        [InlineKeyboardButton("⛏ BUKA GUPPY COIN", url=app_url)],
        [InlineKeyboardButton("🔗 Share ke Teman", url=f"https://t.me/share/url?url={app_url}")]
    ])

    await update.message.reply_text(
        f"👋 Halo *{nama}*!\n\n"
        f"⛏ Selamat datang di *GUPPY.IO*!\n\n"
        f"🪙 Mining poin gratis setiap hari\n"
        f"💰 Tukar poin jadi rupiah\n"
        f"👥 Ajak teman, dapat bonus 50 poin!\n\n"
        f"Klik tombol di bawah 👇",
        parse_mode="Markdown",
        reply_markup=keyboard
    )

if __name__ == "__main__":
    app = ApplicationBuilder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    print("Bot jalan!")
    app.run_polling()
