export function mapVisionResultToInventoryItem(visionResult) {
  const {
    labelAnnotations = [],
    textAnnotations = [],
    cleanText = "",
  } = visionResult;

  const quantities = extractQuantities(cleanText);

  // Lọc label theo confidence và loại bỏ các label quá chung chung
  const filteredLabels = labelAnnotations.filter(
    (label) =>
      label.score >= 0.8 && // chỉ lấy label >= 0.8 confidence
      !["food", "recipe", "meal", "cuisine"].includes(
        label.description.toLowerCase()
      )
  );

  // Map label thành inventory_item
  const inventoryItems = filteredLabels.map((label) => {
    const name = label.description;
    const category = mapCategory(name);
    const quantity = quantities[name.toLowerCase()] || 1;
    const confidence = label.score;

    return { name, category, quantity, confidence };
  });

  // Loại trùng lặp: nếu cùng name, giữ confidence cao nhất
  const uniqueItems = [];
  const seen = new Map();

  for (const item of inventoryItems) {
    const key = item.name.toLowerCase();
    if (!seen.has(key) || seen.get(key).confidence < item.confidence) {
      seen.set(key, item);
    }
  }

  return Array.from(seen.values());
}

/**
 * Map tên item thành category (nâng cao)
 */
function mapCategory(label) {
  if (!label) return "other";
  const labelLower = label.toLowerCase().trim();

  // Fruits
  const fruits = [
    "apple",
    "banana",
    "orange",
    "strawberry",
    "blueberry",
    "mango",
    "pear",
    "pineapple",
    "grape",
    "kiwi",
    "watermelon",
    "lemon",
    "lime",
    "peach",
    "plum",
    "cherry",
    "raspberry",
    "blackberry",
    "papaya",
    "cantaloupe",
    "apricot",
  ];

  // Vegetables
  const vegetables = [
    "carrot",
    "lettuce",
    "tomato",
    "onion",
    "pepper",
    "cucumber",
    "spinach",
    "broccoli",
    "cauliflower",
    "cabbage",
    "kale",
    "zucchini",
    "eggplant",
    "radish",
    "celery",
    "mushroom",
    "pumpkin",
    "corn",
    "peas",
    "beans",
    "potato",
    "sweet potato",
  ];

  // Ingredients (common pantry items)
  const ingredients = [
    "cheese",
    "flour",
    "sugar",
    "salt",
    "pepper",
    "butter",
    "oil",
    "egg",
    "milk",
    "cream",
    "honey",
    "garlic",
    "onion powder",
    "vanilla",
    "yeast",
    "meat",
    "chicken",
    "beef",
    "pork",
    "fish",
    "shrimp",
  ];

  // Beverages
  const beverages = [
    "milk",
    "coffee",
    "tea",
    "water",
    "juice",
    "soda",
    "coke",
    "pepsi",
    "lemonade",
    "smoothie",
    "beer",
    "wine",
  ];

  // Dishes / prepared foods
  const dishes = [
    "pizza",
    "burger",
    "sandwich",
    "pasta",
    "sushi",
    "taco",
    "salad",
    "cake",
    "cookies",
    "bread",
    "noodles",
    "soup",
    "curry",
    "omelette",
    "pancake",
    "waffle",
    "stew",
    "pie",
  ];

  // Check which category it belongs to
  if (fruits.some((f) => labelLower.includes(f))) return "fruit";
  if (vegetables.some((v) => labelLower.includes(v))) return "vegetable";
  if (ingredients.some((i) => labelLower.includes(i))) return "ingredient";
  if (beverages.some((b) => labelLower.includes(b))) return "beverage";
  if (dishes.some((d) => labelLower.includes(d))) return "dish";

  return "other";
}

/**
 * Extract quantity từ cleanText
 */
function extractQuantities(text) {
  const result = {};
  if (!text) return result;

  const regex = /(\d+)\s*(\w+)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const quantity = parseInt(match[1], 10);
    const name = match[2].toLowerCase();
    result[name] = (result[name] || 0) + quantity;
  }
  return result;
}
