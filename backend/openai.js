const OpenAI = require("openai");
require("dotenv").config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error("❌ Missing OPENAI_API_KEY in .env");
}

// ✅ Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Function to get a habit suggestion
const getHabitSuggestion = async (prompt) => {
  try {
    console.log("🧠 Sending prompt to OpenAI...");

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.7,
    });

    const suggestion = response.choices?.[0]?.message?.content?.trim();
    console.log("✅ Suggestion received:", suggestion);
    return suggestion;
  } catch (err) {
    console.error("❌ OpenAI API error (full dump):", err);
    return "Could not get a suggestion at this time.";
  }
};

module.exports = { getHabitSuggestion };
