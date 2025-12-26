const axios = require('axios');

// البيانات التي قدمتها مدمجة في المحرك
const TARGET_URL = "https://abdultowabomar-ux.github.io/Image_extensions/"; 
const TELEGRAM_TOKEN = "8001439036:AAFAVndQ0GlWuz0djflhyPYo5Jo17oMLAHo";
const CHAT_ID = "6068331455";

async function sendTelegram(message) {
    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: message
        });
    } catch (e) {
        console.error("❌ خطأ في إرسال رسالة التليجرام");
    }
}

async function smartCheck() {
    let retries = 3; // عدد محاولات إعادة التحميل
    let success = false;

    for (let i = 0; i < retries; i++) {
        try {
            console.log(`🔍 محاولة فحص رقم ${i + 1}...`);
            // إرسال طلب للموقع مع مهلة 15 ثانية
            const response = await axios.get(TARGET_URL, { timeout: 15000 });
            
            if (response.status === 200) {
                console.log("✅ الموقع يعمل بشكل ممتاز (200 OK)");
                success = true;
                break; 
            }
        } catch (error) {
            console.log(`⚠️ فشل في المحاولة ${i + 1}: ${error.message}`);
            // إذا فشل، ينتظر 10 ثواني قبل إعادة المحاولة (Reload)
            if (i < retries - 1) {
                console.log("⏳ انتظار 10 ثواني قبل إعادة المحاولة...");
                await new Promise(res => setTimeout(res, 10000));
            }
        }
    }

    if (!success) {
        console.log("🚨 جاري إرسال تنبيه للتليجرام...");
        await sendTelegram(`🚨 عاجل: الموقع لا يستجيب!\nالرابط: ${TARGET_URL}\nتمت محاولة إعادة التحميل 3 مرات وفشلت.`);
    }
}

// تشغيل الفحص
smartCheck();
