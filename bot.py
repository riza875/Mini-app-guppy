from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, ContextTypes

# ============================================================
# GANTI INI DENGAN TOKEN BOT KAMU (dari @BotFather)
# ============================================================
BOT_TOKEN = "GANTI_TOKEN_BOT_KAMU"

# URL mini app kamu
MINI_APP_URL = "https://t.me/guppy_Tetribot/guppycoin"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    nama = user.first_name if user.first_name else "Guppy Miner"

    # Ambil referral code dari start param (jika ada)
    ref_code = ""
    if context.args:
        ref_code = context.args[0]

    # URL mini app + referral jika ada
    app_url = MINI_APP_URL
    if ref_code:
        app_url = f"{MINI_APP_URL}?startapp={ref_code}"

    # Tombol buka mini app
    keyboard = [
        [InlineKeyboardButton(
            "⛏ BUKA GUPPY COIN",
            web_app=WebAppInfo(url="https://DOMAIN_KAMU/index.html")
            # Atau pakai link langsung:
            # url=app_url
        )],
        [InlineKeyboardButton("🔗 Share Referral", url=f"https://t.me/share/url?url={app_url}")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    pesan = (
        f"👋 Halo, *{nama}*!\n\n"
        f"⛏ Selamat datang di *GUPPY.IO*!\n\n"
        f"🪙 Mining poin gratis setiap hari\n"
        f"💰 Tukar poin jadi rupiah\n"
        f"👥 Ajak teman, dapat bonus!\n\n"
        f"Klik tombol di bawah untuk mulai mining 👇"
    )

    if ref_code:
        pesan += f"\n\n🎁 Kamu diundang dengan kode: `{ref_code}`"

    await update.message.reply_text(
        pesan,
        parse_mode="Markdown",
        reply_markup=reply_markup
    )

def main():
    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    print("Bot GUPPY.IO berjalan...")
    app.run_polling()

if __name__ == "__main__":
    main()
