/**
 * Maps Vision API labels to inventory items.
 * Filters out overly generic labels, duplicates, and maps names to categories.
 */

export function mapVisionResultToInventoryItem(visionResult) {
  const {
    labelAnnotations = [],
    textAnnotations = [],
    cleanText = "",
  } = visionResult;

  const quantities = extractQuantities(cleanText);

  const bannedLabels = [
    "food",
    "recipe",
    "meal",
    "cuisine",
    "produce",
    "tableware",
    "furniture",
    "container",
    "kitchenware",
    "ingredient",
    "drink",
    "beverage",
    "dishware",
    "utensil",
    "packaging",
    "cup",
    "plate",
    "dessert",
    "glaze",
    "finger food",
    "baking",
    "staple food",
    "bowl",
    "cutting board",
    "kitchen utensil",
    "breakfast",
    "fast food",
  ];

  // Filter labels by confidence and remove overly general labels
  const filteredLabels = labelAnnotations.filter(
    (label) =>
      label.score >= 0.7 &&
      !bannedLabels.includes(label.description.toLowerCase())
  );

  // Map label to inventory_item
  const inventoryItems = filteredLabels.map((label) => {
    const name = label.description;
    const category = mapCategory(name);

    const nameLower = name.toLowerCase();

    let quantity = quantities[nameLower];
    if (quantity === undefined){
      quantity = quantities[nameLower + 's'];
    }

    if (quantity === undefined){
      quantity = 1;
    }


    const confidence = label.score;
    return { name, category, quantity, confidence };
  });

  //aggressively filter out item that failed to map to a specific category (i.e., 'other')
  const categorizedItems = inventoryItems.filter(
    (item) => item.category !== "other"
  );

  // Duplicate type: if same name, keep highest confidence
  const seen = new Map();
  categorizedItems.forEach((item) => {
    const key = item.name.toLowerCase();
    if (!seen.has(key) || seen.get(key).confidence < item.confidence) {
      seen.set(key, item);
    }
  });

  return Array.from(seen.values());
}

/**
 * Map item name to category
 * Check which category the label belongs to. If none match, default to 'other'.
 */
function mapCategory(label) {
  if (!label) return "other";
  const l = label.toLowerCase();

  // Dishes
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



  const bannedLabels = [
    "food",
    "recipe",
    "meal",
    "cuisine",
    "produce",
    "tableware",
    "furniture",
    "container",
    "kitchenware",
    "cup",
  ];

  // Check which category it belongs to
  if (fruits.some((f) => l.includes(f))) return "fruit";
  if (vegetables.some((v) => l.includes(v))) return "vegetable";
  if (ingredients.some((i) => l.includes(i))) return "ingredient";
  if (beverages.some((b) => l.includes(b))) return "beverage";
  if (dishes.some((d) => l.includes(d))) return "dish";

  return "other";
}

/**
 * Extract quantity from cleanText
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
