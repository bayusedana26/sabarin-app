import { GoogleGenAI, Type } from "@google/genai";
import { Language, Tone } from "../types";

// Type definitions for API responses
interface GeminiResponse {
  translated: string;
  score: {
    professional: number;
    savage: number;
  };
}

interface GeminiErrorResponse {
  error: string;
}

// Validation schema for API responses
const validateGeminiResponse = (data: any): data is GeminiResponse => {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.translated === 'string' &&
    data.score &&
    typeof data.score === 'object' &&
    typeof data.score.professional === 'number' &&
    typeof data.score.savage === 'number' &&
    data.score.professional >= 0 && data.score.professional <= 100 &&
    data.score.savage >= 0 && data.score.savage <= 100
  );
};

const SYSTEM_INSTRUCTION = `
Role: Kamu adalah "Corporate Communication Strategist" yang ahli dalam mengubah bahasa emosional, kasar, atau informal menjadi jargon profesional yang elegan.

Task:
1. Terima input berupa kalimat emosional/marah/informal dari user.
2. Identifikasi maksud asli dari user, termasuk konteks lokal Indonesia.
3. Jika input tidak memiliki konteks yang jelas (seperti "hhh", "123", "asdf", atau hanya satu kata tanpa makna), berikan pesan error yang sopan dalam properti "error" dan biarkan "translated" kosong.
4. Ubah menjadi format bahasa korporat yang sopan namun tetap menyampaikan poin utamanya. Usahakan hasil terjemahan ringkas dan padat (maksimal 25 kata) agar estetika kartu sertifikat tetap terjaga.
5. Berikan skor "savage" (0-100) untuk input asli user (seberapa toxic/marah/kasar inputnya).
6. Berikan skor "professional" (0-100) untuk hasil terjemahan yang kamu buat (seberapa elegan dan korporat hasilnya).

Tone Guidelines:
- Professional: Netral, fokus pada solusi.
- Savage-but-Polite (Passive-Aggressive): Sopan di permukaan, tapi tajam maknanya.
- Direct: Jelas, to the point, tapi tetap formal.

Output Format:
Berikan output dalam format JSON dengan struktur:
{
  "translated": "hasil terjemahan",
  "score": {
    "professional": number,
    "savage": number
  },
  "error": "pesan error jika input tidak valid (opsional)"
}
`;

export async function translateToCorporate(
  text: string,
  tone: Tone,
  language: Language
): Promise<{ translated: string; score: { professional: number; savage: number }; error?: string }> {
  // Check API key availability
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return {
      translated: "",
      score: { professional: 0, savage: 0 },
      error: "Konfigurasi sistem bermasalah. Coba lagi nanti ya."
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  // Enhanced client-side validation
  const trimmedText = text.trim();
  if (trimmedText.length < 3) {
    return {
      translated: "",
      score: { professional: 0, savage: 0 },
      error: "Teks terlalu pendek nih. Minimal 3 karakter ya!"
    };
  }

  if (trimmedText.length > 1000) {
    return {
      translated: "",
      score: { professional: 0, savage: 0 },
      error: "Teks terlalu panjang nih. Maksimal 1000 karakter ya!"
    };
  }

  // Check for nonsense patterns
  if (/^[0-9]+$/.test(trimmedText) ||
      /^([a-zA-Z])\1+$/i.test(trimmedText) ||
      /^[^\w\s]*$/.test(trimmedText)) {
    return {
      translated: "",
      score: { professional: 0, savage: 0 },
      error: "Input lo kurang jelas nih, coba ketik uneg-uneg yang ada konteksnya dikit dong."
    };
  }

  const languageMap: Record<Language, string> = {
    'ID-ID': 'Input is Indonesian, Output must be Indonesian.',
    'EN-EN': 'Input is English, Output must be English.',
    'ID-EN': 'Input is Indonesian, Output must be English.',
    'EN-ID': 'Input is English, Output must be Indonesian.'
  };

  const toneMap: Record<Tone, string> = {
    'Professional': 'Focus on being calm, solution-oriented, and highly corporate. Use standard formal jargon.',
    'Savage-but-Polite': 'Passive-aggressive. Use extremely polite words that carry a sharp, critical underlying message. "Savage" but hidden behind corporate etiquette.',
    'Direct': 'To the point, no fluff, but still formal and professional. Clear and assertive.'
  };

  const prompt = `
  Input Message: "${trimmedText}"
  Target Language Context: ${languageMap[language]}
  Target Tone Style: ${toneMap[tone]}

  Please translate the input message into a professional corporate version based on the tone and language context provided.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translated: { type: Type.STRING },
            score: {
              type: Type.OBJECT,
              properties: {
                professional: { type: Type.NUMBER },
                savage: { type: Type.NUMBER }
              },
              required: ["professional", "savage"]
            }
          },
          required: ["translated", "score"]
        }
      },
    });

    // Safe JSON parsing
    let result: any;
    try {
      result = JSON.parse(response.text || "{}");
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      return {
        translated: "",
        score: { professional: 0, savage: 0 },
        error: "Respons dari sistem tidak bisa dipahami. Coba lagi ya!"
      };
    }

    // Validate response structure
    if (!validateGeminiResponse(result)) {
      console.error('Invalid Gemini response structure:', result);
      return {
        translated: "",
        score: { professional: 0, savage: 0 },
        error: "Respons sistem tidak sesuai format. Coba lagi ya!"
      };
    }

    return {
      translated: result.translated || "Gagal menghasilkan terjemahan.",
      score: result.score
    };

  } catch (error: any) {
    console.error("Gemini API Error:", error);

    // Handle specific error types
    if (error?.status === 429) {
      return {
        translated: "",
        score: { professional: 0, savage: 0 },
        error: "Strategis Korporat lagi sibuk banget nih. Tunggu sebentar ya!"
      };
    }

    if (error?.status === 403) {
      return {
        translated: "",
        score: { professional: 0, savage: 0 },
        error: "Akses ke Strategis Korporat diblokir. Coba lagi nanti ya!"
      };
    }

    if (error?.status >= 500) {
      return {
        translated: "",
        score: { professional: 0, savage: 0 },
        error: "Server Strategis Korporat lagi maintenance. Coba lagi nanti ya!"
      };
    }

    if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
      return {
        translated: "",
        score: { professional: 0, savage: 0 },
        error: "Koneksi internet bermasalah. Cek WiFi atau data kamu ya!"
      };
    }

    // Generic fallback
    return {
      translated: "",
      score: { professional: 0, savage: 0 },
      error: "Ada masalah teknis nih. Coba lagi ya!"
    };
  }
}
