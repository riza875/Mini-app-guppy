import asyncio
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

BOT_TOKEN = "8849881003:AAGk1D9_qWME23QXhfLn7q8Q-TTHo6RPxOY"
MINI_APP_URL = "https://t.me/guppy_Tetribot/guppycoin"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    nama = user.first_name if user.first_name else "Guppy Miner"

    ref_code = context.args[0] if context.args else ""
    app_url = f"{MINI_APP_URL}?startapp={ref_code}" if ref_code else MINI_APP_URL

    keyboard = [
        [InlineKeyboardButton("⛏ BUKA GUPPY COIN", url=app_url)],
        [InlineKeyboardButton("🔗 Share ke Teman", url=f"https://t.me/share/url?url={app_url}&text=⛏ Ikut GUPPY.IO! Mining poin gratis tiap hari!")]
    ]

    pesan = (
        f"👋 Halo, *{nama}*!\n\n"
        f"⛏ Selamat datang di *GUPPY.IO*!\n\n"
        f"🪙 Mining poin gratis setiap hari\n"
        f"💰 Tukar poin jadi rupiah\n"
        f"👥 Ajak teman, dapat bonus 50 poin!\n\n"
        f"Klik tombol di bawah untuk mulai mining 👇"
    )

    if ref_code:
        pesan += f"\n\n🎁 Kamu diundang dengan kode: `{ref_code}`"

    await update.message.reply_text(
        pesan,
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(keyboard)
    )

def main():
    app = ApplicationBuilder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    print("✅ Bot GUPPY.IO berjalan...")
    app.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()
