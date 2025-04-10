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

// export const generateComplementaryOutfits = async (
//   event,
//   selectedItemDesc,
//   selectedItemId,
//   clothingDescriptions
// ) => {
//   const prompt = `You are a fashion industry expert. I've selected a specific clothing item: "${selectedItemDesc}" (ID: ${selectedItemId}).

// Given this item and the following other clothing items in my closet: "${clothingDescriptions}", construct 3 different complete outfit looks that include my selected item for going to ${event}.

// Each outfit should be cohesive and consider color coordination, style compatibility, and occasion appropriateness. The selected item must be included in every outfit suggestion. Each outfit should include complementary pieces that work well with the selected item (bottoms if I selected a top, tops if I selected bottoms, accessories that match, etc.).

// Each outfit should be presented with a catchy three-word name in quotes and items listed from top to bottom, followed by the exact product IDs with no spaces. Ensure that all items used come from the provided list, without inventing new items or colors.

// Additionally, provide an accuracy rating (Accuracy Rating) for each outfit, representing how well it complements my selected item and fits the given event, on a scale of 0 to 100% (use specific numbers like 72%, 85%, not round figures) in this format:
// Accuracy Rating: 70% (brief explanation why)

// Example format:
// Outfit 1: "Urban Professional Chic"
// Selected Item: navy blazer (21c909)
// Top: white collaredshirt (0e503d)
// Bottom: black slacks (23a43c)
// Shoes: brown loafers (3de69e)
// Accessories: silver watch (6c24ac)
// Accuracy Rating: 87% (excellent color coordination and professional look)

// Outfit 2: ...
// `;

//   const response = await openai.completions.create({
//     model: "gpt-3.5-turbo-instruct",
//     prompt,
//     max_tokens: 1000,
//     temperature: 0.2,
//   });

//   return response.choices[0].text;
// };

export const generateComplementaryOutfits = async (
  event,
  selectedItemDesc,
  selectedItemId,
  selectedItemCategory,
  clothingDescriptions
) => {
  const prompt = `You are a fashion industry expert. I've selected a specific clothing item: "${selectedItemDesc}" (ID: ${selectedItemId}), which is a ${selectedItemCategory}.
  
Given this ${selectedItemCategory} and the following other clothing items in my closet: "${clothingDescriptions}", construct 3 different complete outfit looks that include my selected ${selectedItemCategory} for going to ${event}.

IMPORTANT: DO NOT suggest ANY additional items in the same category as my selected item (${selectedItemCategory}). For example, if I selected pants, do not suggest additional pants or bottoms. Never include two items of the same category in one outfit.

Each outfit should be cohesive and consider color coordination, style compatibility, and occasion appropriateness. The selected item must be included in every outfit suggestion. Each outfit should include complementary pieces that work well with the selected item (such as tops, accessories, and shoes if I selected bottoms; or bottoms, accessories, and shoes if I selected a top).

Each outfit should be presented with a catchy three-word name in quotes and items listed, followed by the exact product IDs with no spaces. Ensure that all items used come from the provided list, without inventing new items or colors.

Additionally, provide an accuracy rating (Accuracy Rating) for each outfit, representing how well it complements my selected item and fits the given event, on a scale of 0 to 100% (use specific numbers like 72%, 85%, not round figures) in this format:
Accuracy Rating: 70% (brief explanation why)

Example format:
Outfit 1: "Urban Professional Chic"
Selected ${selectedItemCategory}: ${selectedItemDesc} (${selectedItemId})
[Additional complementary items with their categories - NEVER include another ${selectedItemCategory}]
Accuracy Rating: 87% (excellent color coordination and professional look)

Outfit 2: ...
`;

  const response = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct",
    prompt,
    max_tokens: 1000,
    temperature: 0.2,
  });

  return response.choices[0].text;
};

export default generateClothingSuggestions;
