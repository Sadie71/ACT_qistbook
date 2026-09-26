import { GoogleGenAI } from '@google/genai';

/**
 * Shared Gemini client instance configured for server-side use
 */
const apiKey = process.env.GEMINI_API_KEY;

export const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Prioritize fast, high-availability flash models
const CANDIDATE_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.6-flash',
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
  'gemini-flash-latest',
];

/**
 * Helper to wait for a given duration
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Robust content generator with fallback for temporary spikes or rate limits
 */
export async function generateGeminiContent({
  contents,
  systemInstruction,
  config = {},
  fallback = null,
}) {
  if (!process.env.GEMINI_API_KEY) {
    if (fallback) {
      return typeof fallback === 'function' ? await fallback() : fallback;
    }
    throw new Error('GEMINI_API_KEY is not configured on the server. Please check Settings > Secrets.');
  }

  const client =
    ai ||
    new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

  let lastError = null;

  // Round 1: Try candidate models in order of speed and stability
  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await client.models.generateContent({
        model,
        contents,
        config: {
          ...(systemInstruction ? { systemInstruction } : {}),
          ...config,
        },
      });

      if (response && typeof response.text === 'string' && response.text.trim()) {
        return response.text;
      }
    } catch (err) {
      console.warn(`Model ${model} attempt failed (${err?.status}):`, err?.message || err);
      lastError = err;

      // If unauthorized or permission denied, stop early
      if (err?.status === 401 || err?.status === 403) {
        if (fallback) {
          return typeof fallback === 'function' ? await fallback() : fallback;
        }
        throw new Error('Invalid or unauthorized Gemini API key.');
      }

      // If transient (503 high demand, 429 rate limit, 404 retired, 500 internal), proceed to next candidate
      continue;
    }
  }

  // Round 2: If all models returned transient errors, perform a brief backoff and retry the top 2 models
  console.warn('All initial Gemini candidate models busy. Retrying with backoff...');
  await sleep(600);

  for (const model of ['gemini-3.5-flash-lite', 'gemini-3.5-flash']) {
    try {
      const response = await client.models.generateContent({
        model,
        contents,
        config: {
          ...(systemInstruction ? { systemInstruction } : {}),
          ...config,
        },
      });

      if (response && typeof response.text === 'string' && response.text.trim()) {
        return response.text;
      }
    } catch (retryErr) {
      console.warn(`Retry model ${model} failed (${retryErr?.status}):`, retryErr?.message || retryErr);
      lastError = retryErr;
    }
  }

  // If all upstream attempts failed and a fallback generator is provided, use it gracefully
  if (fallback) {
    try {
      return typeof fallback === 'function' ? await fallback() : fallback;
    } catch (fallbackErr) {
      console.error('Fallback generation error:', fallbackErr);
    }
  }

  throw lastError || new Error('AI service temporarily unavailable. Please try again in a few moments.');
}
