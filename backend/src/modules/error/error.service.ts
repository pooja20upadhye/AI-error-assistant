import groq from "../../config/groq";
import redis from "../../config/redis";
import * as errorRepository from "./error.repository";

export const processError = async (userId: number, errorMessage: string) => {
  // 1. Check Redis Cache
  const cacheKey = `error_explanation_groq_v5:${Buffer.from(errorMessage).toString("base64")}`;
  const cachedExplanation = await redis.get(cacheKey);

  let explanation: string;

  if (cachedExplanation) {
    console.log("Serving explanation from cache");
    explanation = cachedExplanation;
  } else {
    // 2. Call Groq API
    console.log("Calling Groq for explanation");
    try {
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that explains programming errors simply and provides a potential fix."
          },
          {
            role: "user",
            content: `Explain this error and how to fix it: ${errorMessage}`
          }
        ],
        model: "llama-3.3-70b-versatile",
      });

      explanation = response.choices[0]?.message?.content || "Could not generate an explanation.";

      // 3. Cache the result for 24 hours
      await redis.setex(cacheKey, 86400, explanation);
    } catch (error: any) {
      console.error("Groq Error Details:", error);
      explanation = "AI explanation is currently unavailable. Please check your Groq API key and quota.";
    }
  }

  // 4. Save to DB
  return await errorRepository.createErrorLog({
    user_id: userId,
    error_message: errorMessage,
    ai_explanation: explanation
  });
};

export const getHistory = async (userId: number, page: number, limit: number, keyword?: string) => {
  const offset = (page - 1) * limit;
  return await errorRepository.getErrorHistory(userId, limit, offset, keyword);
};

export const getById = async (userId: number, id: number) => {
  return await errorRepository.getErrorById(userId, id);
};
