"use server";

import OpenAI from "openai";

const openaiApiKey = process.env.OPEN_AI_API_KEY;

const openai = new OpenAI({
  apiKey: openaiApiKey,
  dangerouslyAllowBrowser: true,
});

const generateClothingSuggestions = async (
  event,
  feeling,
  weatherTemp,
  weatherCond,
  clothingDescriptions,
  wind,
  includeEventAndMood
) => {
  //  const prompt = `You are a fashion industry expert. Given the following clothing items "${clothingDescriptions}", construct 3 different suitable and complete outfit looks for a person going to ${
  //    includeEventAndMood ? event : ""
  //  }, feeling ${
  //    includeEventAndMood ? feeling : ""
  //  }. Each outfit should include one top (like a shirt or blouse), one bottom (like pants or a skirt), and a pair of shoes. Additional accessories or layers can be suggested based on the weather conditions: ${weatherCond}, wind speed of ${wind} km/h, and temperature of ${weatherTemp}°C. Cold temperatures range from -20° to 0°, cooler weather ranges from 0° to 20°, and warm weather ranges from 20° to 40°. Present the outfits in order from top to bottom and list the exact product ids after each outfit description, ensure that there is no space before and after each outfit. Remember to use only the provided clothing items and do not invent new items or colors. Additionally give a catchy name for each outfit with exactly 3 words.`;

  const prompt = `You are a fashion industry expert. Given the following clothing items "${clothingDescriptions}", construct 3 different suitable and complete outfit looks for a person going to ${
    includeEventAndMood ? event : ""
  }, feeling ${
    includeEventAndMood ? feeling : ""
  }. Each outfit should include one top (like a shirt or blouse), one bottom (like pants or a skirt), and a pair of shoes. Additional accessories or layers can be suggested based on the weather conditions: ${weatherCond}, wind speed of ${wind} km/h, and temperature of ${weatherTemp}°C. Cold temperatures range from -20° to 0°, cooler weather ranges from 0° to 20°, and warm weather ranges from 20° to 40°. Each outfit should be presented in order from top to bottom, followed by the exact product IDs with no spaces before or after each outfit. Ensure that all items used come from the provided list, without inventing new items or colors. Additionally, assign a catchy three-word name to each outfit. Finally, provide an accuracy rating with name (Accuracy Rating) for each outfit, representing how well it fits the given weather, event, and mood, on a scale of 0 to 100% (rating should be in different numbers not like round figures (eg: 72%, 85%, etc)) in format like
    Accuracy Rating: 70% (description)
    
    Entire Example:
    Outfit 1: "Beach Breeze"
    Top: aliceblue collaredshirt (21c909)
    Bottom: white cargopants (0e503d)
    Shoes: white platformshoes (23a43c)
    Accessories: None
    Accuracy Rating: 90% (perfect for warm weather and beach activities)

    Outfit 2: "Casual Chic"
    Top: black collaredshirt (3de69e)
    Bottom: brown cargopants (6c24ac)
    Shoes: black platformshoes (e77de5)
    Accessories: black jeans (a1c679)
    Accuracy Rating: 80% (suitable for cooler weather and casual outings)

    Outfit 3: "Semi-Formal Fun"
    Top: navajowhite longsleeved (de98e8)
    Bottom: black jeans (dd9321)
    Shoes: coralpink collaredshirt (68de65)
    Accessories: darkbrown collaredshirt (65695e)
    Accuracy Rating: 70% (may be too warm for hot weather, but suitable for semi-formal events)
    .`;

  const response = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct",
    prompt,
    max_tokens: 1000,
    temperature: 0.1,
  });

  console.log(response.choices[0].text);
  return response.choices[0].text;
};

export default generateClothingSuggestions;
