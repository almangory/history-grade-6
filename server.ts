/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON
  app.use(express.json());

  // Initialize Gemini API
  // Using the new @google/genai SDK as recommended
  const isKeyAvailable = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
  
  let ai: GoogleGenAI | null = null;
  if (isKeyAvailable) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // API Check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      geminiAvailable: isKeyAvailable,
    });
  });

  // History chatbot tutoring API
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!message) {
        return res.status(400).json({ error: "الرجاء إدخال نص السؤال." });
      }

      if (!isKeyAvailable || !ai) {
        // Fallback friendly mock response if API Key is not set yet
        const defaultReplies: Record<string, string> = {
          "أهلاً": "أهلاً بك يا بطل! أنا معلم التاريخ الذكي الخاص بك. اسألني عن أي حدث في كتاب التاريخ للصف السادس، مثل غزو السودان، أو بناء بغداد العبّاسية، أو رحلة حج منسا موسى ملك مالي!",
          "مرحبا": "أهلاً بك يا بطل! أنا معلم التاريخ الذكي الخاص بك. اسألني عن أي حدث في كتاب التاريخ للصف السادس، مثل غزو السودان، أو بناء بغداد العبّاسية، أو رحلة حج منسا موسى ملك مالي!",
        };
        const textLower = message.trim().toLowerCase();
        let reply = "أنا معلم التاريخ الذكي لبلدنا وممالكنا الإفريقية الحبيبة. حالياً أعمل في الوضع المحلي الفوري. إسألني عن: 'مقتل إسماعيل باشا'، 'بناء بغداد'، 'منسا موسى'، أو 'حقوق المواطنة' وسأجيبك فوراً!";
        
        if (textLower.includes("إسماعيل") || textLower.includes("نمر") || textLower.includes("حرق")) {
          reply = "الملك نمر هو ملك شندي الذي ضاق ذرعاً بإهانات وقسوة إسماعيل باشا (ابن محمد علي باشا) وفرضه للضرائب الباهظة. فاستدرجه عام 1822م وقام بحرقه حياً في ديوانه بعد محاصرته بنيران القش والتبن. مما دفع الدفتدار لشن حملات انتقامية دموية قاسية على الأهالي.";
        } else if (textLower.includes("بغداد") || textLower.includes("المنصور") || textLower.includes("دائري")) {
          reply = "تأسست بغداد الدائرية عام 145هـ (762م) بأمر من الخليفة العباسي الثاني أبو جعفر المنصور (المؤسس الحقيقي للدولة العباسية). اختار موقعها الحيوي على نهر دجلة وصممها بشكل دائري عظيم لتسهيل الدفاع عنها وجعل لها 4 أبواب (الشام، الكوفة، البصرة، خراسان) وبسط قصر الذهب والمسجد بمركزها.";
        } else if (textLower.includes("موسى") || textLower.includes("منسا") || textLower.includes("مالي")) {
          reply = "الملك منسا موسى هو أعظم ملوك إمبراطورية مالي الإسلامية بغرب إفريقيا في القرن 14م. يشتهر برحلته الأسطورية للحج عام 1324م التي وزع فيها أطناناً من الذهب النقي بمصر ومكة مما تسبب في خفض قيمة الذهب لسنوات، وجلب معه علماء لتطوير تيمبكتو عاصمة العلم واللغة العربية.";
        } else if (textLower.includes("مواطن") || textLower.includes("أركان") || textLower.includes("حقوق") || textLower.includes("واجبات")) {
          reply = "سؤال رائع! أركان الدولة الأربعة هي: الشعب، الأرض، الحكومة، والدستور والقوانين. كمواطنين سودانيين صالحين، لدينا حقوق (كالحياة الكريمة والتعليم والصحة والعمل) وواجبات (كاحترام القوانين، محبة الدفاع العسكري، صيانة الممتلكات والبيئة).";
        } else if (defaultReplies[textLower]) {
          reply = defaultReplies[textLower];
        }

        return res.json({ text: reply });
      }

      // Format history into compatible structure
      // The systemInstruction sets context precisely as a Sudan Grade 6 tutor
      const systemInstruction = 
        `أنت المعلم والمؤرخ الذكي المشوق والمحبوب لطلاب الصف السادس الابتدائي لمادة التاريخ في السودان.
        تتكلم باللغة العربية الواضحة المليئة بالتشجيع، والحرص، وتخاطب الطالب بيا 'بطل التاريخ' أو 'يا ذكي'.
        تجيب بحدود 2 إلى 4 أسطر وتقدم معلوماًت دقيقة جداً ترتكز حصراً على منهج التاريخ للصف السادس (الموجود في السودان):
        - الوحدة الأولى: تاريخ السودان تحت الحكم التركي المصري (1821م - 1885م) (محمد علي باشا، إسماعيل باشا، معركة كورتي، الملك نمر وحرق شندي، الدفتدار، الخرطوم عاصمة 1824م، الخديوي إسماعيل، الزبير ود رحمة).
        - الوحدة الثانية: التاريخ الإسلامي بالعصر العباسي (132هـ - 656هـ) (أبو العباس السفاح والزاب، أبو جعفر المنصور وبغداد الدائرية وبواباتها الأربعة، هارون الرشيد، المأمون وبيت الحكمة العظيم، المعتصم وسامراء العسكرية لجيوشه التركية، عمورية، وسقوط بغداد 1258م على يد هولاكو المغولي).
        - الوحدة الثالثة: تاريخ إفريقيا (دولة الأدارسة بالرباط وفاس، الأغالبة بالقيروان وصناعة الأسطول لفتح صقلية، الفاطميون بتونس ومصر وجوهر الصقلي وبناء القاهرة والأزهر، سلطنة كلوة بتنزانيا والذهب، إمبراطورية مالي وسندياتا ومنسا موسى الذي حج بذهب السافانا، وممالك الهوسا شمال نيجيريا وحرف النسيج وخلافة سوكوتو).
        - الوحدة الرابعة: النهضة الأوروبية (إيطاليا مهد الفن والأدب، دانتي الكوميديا الإلهية، بوكاتشيو، مكيافلي الأمير، دافنشي والموناليزا، مايكل أنجلو وقبة القديس بطرس، روفائيل بالفاتيكان، شكسبير بإنكلترا. حركة الكشوف الجغرافية كفاسكو دي جاما بروب الرجاء الصالح، كريستوفر كولومبوس بأمريكا، ماجلان بكروية الأرض. الثورة الصناعية ببريطانيا وقوة البخار، آلة غزل هارجريفز، بخار جيمس وات، قاطرة ستيفنسن، تليفون غراهام بيل، لاسلكي ماركوني، دينامو فارادي، ديزل).
        - الوحدة الخامسة: التربية الوطنية (أركان الدولة الأربعة: الشعب، الأرض، الحكومة، الدستور. مهام الدولة الممثلة بالوزارات كتمويل المالية، رعاية الخارجية، تعليم المدارس وصحة المستشفيات وأمن المحاكم والشرطة. حقوق المواطن وواجباته).
        قاعدة صارمة للغاية: يجب أن ترفض تماماً وبالكامل الإجابة على أي أسئلة خارجة عن هذا المنهج أو لا علاقة لها بتاريخ السودان والتربية الوطنية للصف السادس والوحدات الخمسة المذكورة. إذا سألك الطالب عن أي موضوع خارجي (مثل الرياضيات، العلوم، اللغات، البرمجة، أو تاريخ بلدان وقضايا غير مشمولة هنا)، فاعتذر منه بلطف وبأسلوب تربوي دافئ، ليوجه تركيزه إلى دروس التاريخ والتربية الوطنية للصف السادس المتاحة بالموقع فقط.
        أجب فقط بالمنهج المحدد وحفّز التلميذ لمعرفة المزيد وحل الاختبارات بحب. شجعهم على خوض مغامرات الإجابة.`;

      const contents = history ? [...history, { role: "user", parts: [{ text: message }] }] : [{ role: "user", parts: [{ text: message }] }];

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      return res.json({ text: response.text });

    } catch (error: any) {
      console.error("Gemini API Error in /api/chat:", error);
      res.status(500).json({ error: "حدث خطأ أثناء التواصل مع المعلم الذكي. الرجاء المحاولة مرة أخرى." });
    }
  });

  // Serve Vite development assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`History platform running on port ${PORT}`);
  });
}

startServer();
