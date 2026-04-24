import openai from "../../config/openai";
import redis from "../../config/redis";
import * as errorRepository from "./error.repository";

export const processError = async (userId: number, errorMessage: string) => {
  // 1. Check Redis Cache
  const cacheKey = `error_explanation:${Buffer.from(errorMessage).toString("base64")}`;
  const cachedExplanation = await redis.get(cacheKey);

  let explanation: string;

  if (cachedExplanation) {
    console.log("Serving explanation from cache");
    explanation = cachedExplanation;
  } else {
    // 2. Call OpenAI API
    console.log("Calling OpenAI for explanation");
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that explains programming errors simply and provides a potential fix."
        },
        {
          role: "user",
          content: `Explain this error and how to fix it: ${errorMessage}`
        }
      ]
    });

    explanation = response.choices[0]?.message?.content || "Could not generate an explanation.";

    // 3. Cache the result for 24 hours
    await redis.setex(cacheKey, 86400, explanation);
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
