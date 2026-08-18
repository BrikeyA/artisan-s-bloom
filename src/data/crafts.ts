import pottery from "@/assets/craft-pottery.jpg";
import textile from "@/assets/craft-textile.jpg";
import brass from "@/assets/craft-brass.jpg";

export type Craft = {
  id: string;
  name: string;
  craftType: string;
  image: string;
  imageAlt: string;
  price: number;
  suggestedPrice: number;
  stock: number;
  status: "live" | "draft" | "review";
  languages: string[];
  views: number;
};

export const CRAFTS: Craft[] = [
  {
    id: "kal-101",
    name: "Jaipur Blue Pottery Vase",
    craftType: "Blue Pottery · Rajasthan",
    image: pottery,
    imageAlt: "Indigo blue pottery vase with turquoise flower motifs beside a small matching pot",
    price: 2450,
    suggestedPrice: 2650,
    stock: 6,
    status: "live",
    languages: ["English", "हिन्दी", "Español", "日本語"],
    views: 1284,
  },
  {
    id: "kal-102",
    name: "Banarasi Zari Silk Stole",
    craftType: "Handloom Silk · Varanasi",
    image: textile,
    imageAlt: "Magenta and emerald silk stole with a gold zari border folded on a wooden table",
    price: 5600,
    suggestedPrice: 6100,
    stock: 3,
    status: "live",
    languages: ["English", "हिन्दी", "Français"],
    views: 2071,
  },
  {
    id: "kal-103",
    name: "Dhokra Brass Figurine",
    craftType: "Lost-wax Casting · Bastar",
    image: brass,
    imageAlt: "Brass Dhokra tribal figurine with fine thread-like metal texture on a red backdrop",
    price: 3200,
    suggestedPrice: 3450,
    stock: 0,
    status: "review",
    languages: ["English", "हिन्दी"],
    views: 640,
  },
];

export type Order = {
  id: string;
  craft: string;
  buyer: string;
  place: string;
  amount: number;
  stage: "packing" | "shipped" | "delivered";
  due: string;
};

export const ORDERS: Order[] = [
  {
    id: "#4821",
    craft: "Jaipur Blue Pottery Vase",
    buyer: "Anna Meyer",
    place: "Berlin, Germany",
    amount: 2450,
    stage: "packing",
    due: "Pack by Friday",
  },
  {
    id: "#4818",
    craft: "Banarasi Zari Silk Stole",
    buyer: "Rhea Kapoor",
    place: "Mumbai, India",
    amount: 5600,
    stage: "shipped",
    due: "Reaches buyer in 2 days",
  },
  {
    id: "#4809",
    craft: "Jaipur Blue Pottery Vase",
    buyer: "Kenji Sato",
    place: "Osaka, Japan",
    amount: 2450,
    stage: "delivered",
    due: "Payment received",
  },
];
