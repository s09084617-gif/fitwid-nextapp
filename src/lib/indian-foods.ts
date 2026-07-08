export type FoodCategory =
  | "grains"
  | "legumes"
  | "protein"
  | "dairy"
  | "vegetables"
  | "fruits"
  | "snacks"
  | "breads";

export type DietTag = "veg" | "egg" | "nonveg" | "vegan";

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  dietTags: DietTag[];
  servingDesc: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export const INDIAN_FOODS: FoodItem[] = [
  // Grains
  { id: "white-rice", name: "White Rice (cooked)", category: "grains", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "1 cup (150g)", calories: 195, proteinG: 4, carbsG: 43, fatG: 0.5 },
  { id: "brown-rice", name: "Brown Rice (cooked)", category: "grains", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "1 cup (150g)", calories: 172, proteinG: 4, carbsG: 36, fatG: 1.3 },
  { id: "poha", name: "Poha", category: "grains", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "1 bowl (150g)", calories: 250, proteinG: 5, carbsG: 45, fatG: 6 },
  { id: "upma", name: "Upma", category: "grains", dietTags: ["veg", "egg", "nonveg"], servingDesc: "1 bowl (150g)", calories: 230, proteinG: 6, carbsG: 35, fatG: 8 },
  { id: "idli", name: "Idli", category: "grains", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "3 pieces", calories: 170, proteinG: 6, carbsG: 35, fatG: 0.6 },
  { id: "dosa-plain", name: "Plain Dosa", category: "grains", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "1 medium", calories: 133, proteinG: 3.5, carbsG: 22, fatG: 3.5 },
  { id: "oats", name: "Oats (cooked)", category: "grains", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "1 bowl (200g)", calories: 150, proteinG: 6, carbsG: 27, fatG: 3 },
  { id: "quinoa", name: "Quinoa (cooked)", category: "grains", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "1 cup (185g)", calories: 220, proteinG: 8, carbsG: 39, fatG: 3.5 },

  // Legumes / Dal
  { id: "moong-dal", name: "Moong Dal", category: "legumes", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "1 bowl (200g)", calories: 210, proteinG: 14, carbsG: 32, fatG: 2 },
  { id: "toor-dal", name: "Toor Dal", category: "legumes", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "1 bowl (200g)", calories: 230, proteinG: 13, carbsG: 35, fatG: 3 },
  { id: "chana-masala", name: "Chana Masala", category: "legumes", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "1 bowl (200g)", calories: 280, proteinG: 12, carbsG: 40, fatG: 8 },
  { id: "rajma", name: "Rajma", category: "legumes", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "1 bowl (200g)", calories: 260, proteinG: 13, carbsG: 38, fatG: 6 },
  { id: "sprouts-salad", name: "Sprouts Salad", category: "legumes", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "1 bowl (150g)", calories: 150, proteinG: 11, carbsG: 22, fatG: 2 },

  // Protein
  { id: "grilled-chicken-breast", name: "Grilled Chicken Breast", category: "protein", dietTags: ["nonveg"], servingDesc: "150g", calories: 248, proteinG: 46, carbsG: 0, fatG: 5.4 },
  { id: "chicken-curry", name: "Chicken Curry", category: "protein", dietTags: ["nonveg"], servingDesc: "1 bowl (200g)", calories: 320, proteinG: 28, carbsG: 8, fatG: 20 },
  { id: "egg-boiled", name: "Boiled Egg", category: "protein", dietTags: ["egg", "nonveg"], servingDesc: "2 eggs", calories: 155, proteinG: 13, carbsG: 1, fatG: 11 },
  { id: "egg-bhurji", name: "Egg Bhurji", category: "protein", dietTags: ["egg", "nonveg"], servingDesc: "2 eggs", calories: 220, proteinG: 14, carbsG: 4, fatG: 16 },
  { id: "fish-curry", name: "Fish Curry", category: "protein", dietTags: ["nonveg"], servingDesc: "1 bowl (200g)", calories: 260, proteinG: 30, carbsG: 6, fatG: 12 },
  { id: "paneer-tikka", name: "Paneer Tikka", category: "protein", dietTags: ["veg", "egg", "nonveg"], servingDesc: "150g", calories: 320, proteinG: 22, carbsG: 8, fatG: 22 },
  { id: "paneer-bhurji", name: "Paneer Bhurji", category: "protein", dietTags: ["veg", "egg", "nonveg"], servingDesc: "150g", calories: 300, proteinG: 20, carbsG: 6, fatG: 22 },
  { id: "tofu-stirfry", name: "Tofu Stir-Fry", category: "protein", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "150g", calories: 180, proteinG: 16, carbsG: 8, fatG: 10 },
  { id: "soya-chunks-curry", name: "Soya Chunks Curry", category: "protein", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "1 bowl (150g)", calories: 210, proteinG: 22, carbsG: 15, fatG: 6 },
  { id: "whey-protein", name: "Whey Protein Shake", category: "protein", dietTags: ["veg", "egg", "nonveg"], servingDesc: "1 scoop + water", calories: 120, proteinG: 24, carbsG: 3, fatG: 1.5 },

  // Dairy
  { id: "curd", name: "Curd / Dahi", category: "dairy", dietTags: ["veg", "egg", "nonveg"], servingDesc: "1 bowl (200g)", calories: 120, proteinG: 7, carbsG: 9, fatG: 6 },
  { id: "paneer-raw", name: "Paneer (raw)", category: "dairy", dietTags: ["veg", "egg", "nonveg"], servingDesc: "100g", calories: 265, proteinG: 18, carbsG: 4, fatG: 21 },
  { id: "milk", name: "Milk (toned)", category: "dairy", dietTags: ["veg", "egg", "nonveg"], servingDesc: "1 glass (250ml)", calories: 125, proteinG: 8, carbsG: 12, fatG: 4.5 },
  { id: "buttermilk", name: "Buttermilk / Chaas", category: "dairy", dietTags: ["veg", "egg", "nonveg"], servingDesc: "1 glass (250ml)", calories: 60, proteinG: 3, carbsG: 5, fatG: 2 },
  { id: "greek-yogurt", name: "Greek Yogurt", category: "dairy", dietTags: ["veg", "egg", "nonveg"], servingDesc: "1 cup (200g)", calories: 140, proteinG: 18, carbsG: 8, fatG: 4 },

  // Vegetables
  { id: "mixed-veg-sabzi", name: "Mixed Vegetable Sabzi", category: "vegetables", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "1 bowl (150g)", calories: 120, proteinG: 3, carbsG: 15, fatG: 6 },
  { id: "palak", name: "Palak (Spinach) Sabzi", category: "vegetables", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "1 bowl (150g)", calories: 100, proteinG: 4, carbsG: 8, fatG: 6 },
  { id: "bhindi-fry", name: "Bhindi Fry", category: "vegetables", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "1 bowl (150g)", calories: 140, proteinG: 3, carbsG: 12, fatG: 9 },
  { id: "cucumber-salad", name: "Cucumber & Onion Salad", category: "vegetables", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "1 bowl (150g)", calories: 40, proteinG: 1.5, carbsG: 8, fatG: 0.3 },
  { id: "salad-mixed", name: "Mixed Green Salad", category: "vegetables", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "1 bowl (150g)", calories: 55, proteinG: 2, carbsG: 9, fatG: 1.5 },

  // Fruits
  { id: "banana", name: "Banana", category: "fruits", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "1 medium", calories: 105, proteinG: 1.3, carbsG: 27, fatG: 0.4 },
  { id: "apple", name: "Apple", category: "fruits", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "1 medium", calories: 95, proteinG: 0.5, carbsG: 25, fatG: 0.3 },
  { id: "papaya", name: "Papaya", category: "fruits", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "1 cup cubed (140g)", calories: 55, proteinG: 0.6, carbsG: 14, fatG: 0.2 },
  { id: "mixed-fruit-bowl", name: "Mixed Fruit Bowl", category: "fruits", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "1 bowl (200g)", calories: 110, proteinG: 1.5, carbsG: 28, fatG: 0.4 },
  { id: "orange", name: "Orange", category: "fruits", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "1 medium", calories: 62, proteinG: 1.2, carbsG: 15, fatG: 0.2 },

  // Snacks / Nuts
  { id: "almonds", name: "Almonds", category: "snacks", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "10 pieces (12g)", calories: 70, proteinG: 2.5, carbsG: 2.5, fatG: 6 },
  { id: "peanuts-roasted", name: "Roasted Peanuts", category: "snacks", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "small handful (30g)", calories: 170, proteinG: 7, carbsG: 5, fatG: 14 },
  { id: "makhana", name: "Roasted Makhana", category: "snacks", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "1 bowl (30g)", calories: 105, proteinG: 3.5, carbsG: 19, fatG: 1 },
  { id: "sprouts-chaat", name: "Sprouts Chaat", category: "snacks", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "1 bowl (150g)", calories: 160, proteinG: 10, carbsG: 24, fatG: 3 },
  { id: "peanut-butter-toast", name: "Peanut Butter on Toast", category: "snacks", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "2 slices + 1 tbsp PB", calories: 240, proteinG: 9, carbsG: 26, fatG: 12 },

  // Breads
  { id: "roti", name: "Roti / Chapati", category: "breads", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "1 piece", calories: 85, proteinG: 3, carbsG: 18, fatG: 0.5 },
  { id: "brown-bread", name: "Brown Bread", category: "breads", dietTags: ["veg", "egg", "nonveg", "vegan"], servingDesc: "2 slices", calories: 140, proteinG: 6, carbsG: 24, fatG: 2 },
  { id: "paratha-plain", name: "Plain Paratha", category: "breads", dietTags: ["veg", "egg", "nonveg"], servingDesc: "1 piece", calories: 180, proteinG: 4, carbsG: 27, fatG: 7 },
  { id: "naan", name: "Naan", category: "breads", dietTags: ["veg", "egg", "nonveg"], servingDesc: "1 piece", calories: 260, proteinG: 8, carbsG: 45, fatG: 5 },
];
