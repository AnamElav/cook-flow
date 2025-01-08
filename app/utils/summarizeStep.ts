import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

export const summarizeStep = async (step: string, ingredients: string[]) => {
  const prompt = `
    Given the following recipe step and list of ingredients, simplify the step
    and include ingredient amounts if applicable.

    Recipe Step: "${step}"

    Ingredients:
    ${ingredients.join("\n")}

    Simplified Step:
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that simplifies recipe steps.",
        },
        { role: "user", content: prompt },
      ],
    });

    console.log("API Response:", response);

    // Ensure response and choices exist
    if (response && response.choices && response.choices.length > 0) {
      const message = response.choices[0]?.message?.content;
      if (message) {
        return message.trim();
      }
    }

    // Handle cases where response or choices are null/empty
    console.warn("No valid response received from OpenAI");
    return step;
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    return step; // Fallback to original step
  }
};
