
import { GoogleGenAI } from "@google/genai";

// Always use new GoogleGenAI({ apiKey: process.env.API_KEY }) as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Interacts with Gemini 3 Flash model to provide context-aware help regarding 
 * the 2026 Syrian currency redenomination.
 */
export async function askGemini(message: string): Promise<string> {
  // التحقق من حالة الاتصال بالإنترنت
  if (!navigator.onLine) {
    return "عذراً، أنت الآن غير متصل بالإنترنت. المساعد الذكي يحتاج للإنترنت للإجابة، لكن المحوّل الأساسي وجامع الفئات يعملان بشكل كامل بدون إنترنت.";
  }

  try {
    // Using gemini-3-flash-preview for general task assistance
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: `أنت مساعد ذكي لتطبيق "محوّل الليرة السورية". 
        مهمتك هي مساعدة المستخدمين في فهم عملية حذف الصفرين من العملة السورية في عام 2026.
        القاعدة الأساسية: 100 ليرة قديمة = 1 ليرة جديدة.
        أجب باللغة العربية بأسلوب ودود وواضح ومختصر. 
        الفئات النقدية الجديدة المتوفرة هي: 10، 25، 50، 100، 200، 500 ليرة.`,
      },
    });

    // Directly access the .text property of GenerateContentResponse (do not use text())
    return response.text || "عذراً، لم أتمكن من الحصول على رد مناسب.";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "عذراً، حدث خطأ في التواصل مع المساعد الذكي. يرجى المحاولة لاحقاً.";
  }
}
