import type { Restaurant } from '@/types/restaurant';
import type { Visit, VisitDish, VisitFriend } from '@/types/visit';
import type { Dish } from '@/types/dish';
import type { Friend } from '@/types/friend';
import type { Attachment } from '@/types/attachment';

export const SEED_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Burma Burma',
    description: 'Authentic Burmese tea room and kitchen serving rich plant-based heritage dishes in a serene, bamboo-accented ambience.',
    location: 'Indiranagar, Bangalore',
    address: '607, 12th Main Rd, 7th Cross, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
    cuisineTypes: ['Burmese', 'Asian', 'Vegetarian'],
    coverImage: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80',
    favourite: true,
    createdAt: '2026-05-10T10:00:00Z',
    updatedAt: '2026-11-15T15:00:00Z',
  },
  {
    id: 'rest-2',
    name: 'Brik Oven',
    description: 'Wood-fired sourdough Neapolitan pizzas, handmade pastas, and thick artisanal milkshakes in a cozy urban setting.',
    location: 'Church Street, Bangalore',
    address: 'Heart of Church Street, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560001',
    cuisineTypes: ['Italian', 'Artisanal Pizza', 'Desserts'],
    coverImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
    favourite: true,
    createdAt: '2026-05-12T11:00:00Z',
    updatedAt: '2026-11-18T18:00:00Z',
  },
  {
    id: 'rest-3',
    name: 'O Pedro',
    description: 'Vibrant Goan coastal comfort food, wood-fired seafood, and craft cocktails celebrating the spirit of vintage Panjim.',
    location: 'BKC, Mumbai',
    address: 'Unit 2, Ground Floor, Jet Airways-Godrej BKC Building, Bandra Kurla Complex, Mumbai, Maharashtra 400051',
    cuisineTypes: ['Goan', 'Seafood', 'Portuguese'],
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    favourite: true,
    createdAt: '2026-06-01T12:00:00Z',
    updatedAt: '2026-10-24T19:00:00Z',
  },
  {
    id: 'rest-4',
    name: 'Toast & Tonic',
    description: 'East Asian artisanal comfort kitchen with house-fermented gin tonics, cured meats, and local farm-to-table produce.',
    location: 'Richmond Town, Bangalore',
    address: '14/1, Wood St, Ashok Nagar, Bengaluru, Karnataka 560025',
    cuisineTypes: ['Contemporary', 'East Asian', 'Craft Cocktails'],
    coverImage: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
    favourite: false,
    createdAt: '2026-06-15T14:00:00Z',
    updatedAt: '2026-11-02T20:00:00Z',
  },
  {
    id: 'rest-5',
    name: 'The Bombay Canteen',
    description: 'Celebration of regional Indian food traditions re-imagined with modern techniques and nostalgic street-inspired twists.',
    location: 'Lower Parel, Mumbai',
    address: 'Unit-1, Process House, S.B. Road, Kamala Mills, Lower Parel, Mumbai, Maharashtra 400013',
    cuisineTypes: ['Modern Indian', 'Regional', 'Cocktails'],
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    favourite: true,
    createdAt: '2026-06-20T10:00:00Z',
    updatedAt: '2026-11-12T14:30:00Z',
  },
  {
    id: 'rest-6',
    name: 'Sienna Cafe & Store',
    description: 'Artisanal courtyard cafe surrounded by terracotta pottery, serving exquisite seasonal salads, hand-rolled pasta, and specialty coffee.',
    location: 'Hindustan Park, Kolkata',
    address: '49, 1, Hindustan Park, Gariahat, Kolkata, West Bengal 700029',
    cuisineTypes: ['Artisanal Cafe', 'European', 'Coffee'],
    coverImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
    favourite: false,
    createdAt: '2026-07-04T09:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z',
  },
  {
    id: 'rest-7',
    name: 'Trishna',
    description: 'Legendary coastal dining destination renowned for its iconic butter garlic crab and authentic Mangalorean coastal spices.',
    location: 'Fort, Mumbai',
    address: 'Sai Baba Mandir Marg, Next to Commerce House, Kala Ghoda, Fort, Mumbai, Maharashtra 400001',
    cuisineTypes: ['Mangalorean', 'Coastal Seafood', 'South Indian'],
    coverImage: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80',
    favourite: true,
    createdAt: '2026-07-15T15:00:00Z',
    updatedAt: '2026-11-05T21:00:00Z',
  },
  {
    id: 'rest-8',
    name: 'Olive Bar & Kitchen',
    description: 'Sunlit rustic Mediterranean courtyard under the banyan tree serving artisanal pastas, stone-baked flatbreads and wine.',
    location: 'Mehrauli, New Delhi',
    address: 'One Style Mile, 6-8, Kalka Das Marg, Mehrauli, New Delhi, Delhi 110030',
    cuisineTypes: ['Mediterranean', 'European', 'Italian'],
    coverImage: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1200&q=80',
    favourite: false,
    createdAt: '2026-08-01T12:00:00Z',
    updatedAt: '2026-10-18T16:00:00Z',
  },
];

export const SEED_FRIENDS: Friend[] = [
  { id: 'friend-1', name: 'Aarav Sharma', nickname: 'Aaru', createdAt: '2026-05-01T00:00:00Z' },
  { id: 'friend-2', name: 'Priya Venkatesh', nickname: 'Pree', createdAt: '2026-05-01T00:00:00Z' },
  { id: 'friend-3', name: 'Rohan Mehta', nickname: 'Ro', createdAt: '2026-05-01T00:00:00Z' },
  { id: 'friend-4', name: 'Ananya Sen', nickname: 'Annie', createdAt: '2026-05-01T00:00:00Z' },
  { id: 'friend-5', name: 'Vikram Das', nickname: 'Vik', createdAt: '2026-05-01T00:00:00Z' },
  { id: 'friend-6', name: 'Sneha Nair', nickname: 'Nair-san', createdAt: '2026-05-01T00:00:00Z' },
];

export const SEED_DISHES: Dish[] = [
  { id: 'dish-1', name: 'Burma Burma Oh No Khow Suey', category: 'Main Course', description: 'Creamy coconut milk broth with noodles and 8 traditional condiments.', createdAt: '2026-05-10T10:00:00Z' },
  { id: 'dish-2', name: 'Tea Leaf Salad (Laphet Thoke)', category: 'Salad', description: 'Fermented Burmese tea leaves, crunchy roasted nuts, toasted garlic, and tomatoes.', createdAt: '2026-05-10T10:00:00Z' },
  { id: 'dish-3', name: 'Lotus Root Crisps with Smoked Chilli', category: 'Snack', description: 'Thinly sliced crispy lotus stems tossed with dry spices and kaffir lime.', createdAt: '2026-05-10T10:00:00Z' },
  { id: 'dish-4', name: 'Sourdough Pepperoni & Hot Honey Pizza', category: 'Main Course', description: 'Wood-fired 48h cold-fermented sourdough pizza with San Marzano tomatoes and spicy pork pepperoni.', createdAt: '2026-05-12T11:00:00Z' },
  { id: 'dish-5', name: 'Truffle Burrata & Confit Cherry Tomatoes', category: 'Appetizer', description: 'Creamy fresh burrata topped with black truffle shavings, aged balsamic, and warm focaccia.', createdAt: '2026-05-12T11:00:00Z' },
  { id: 'dish-6', name: 'Classic Neapolitan Margherita', category: 'Main Course', description: 'Fior di latte mozzarella, fresh basil, and extra virgin olive oil.', createdAt: '2026-05-12T11:00:00Z' },
  { id: 'dish-7', name: 'Butter Garlic Mud Crab', category: 'Main Course', description: 'Fresh live mud crab tossed in clarified golden garlic butter and crushed black pepper.', createdAt: '2026-07-15T15:00:00Z' },
  { id: 'dish-8', name: 'Mangalorean Ghee Roast Chicken', category: 'Main Course', description: 'Tender chicken slow-roasted in pure ghee with Byadgi chillies and coastal spices.', createdAt: '2026-07-15T15:00:00Z' },
  { id: 'dish-9', name: 'Goan Choriz Chilli Fry Pau', category: 'Appetizer', description: 'Spiced smoked Goan pork sausages tossed with sweet onions and served in freshly baked poi.', createdAt: '2026-06-01T12:00:00Z' },
  { id: 'dish-10', name: 'Smoked Pork Ribs with Kokum Glaze', category: 'Main Course', description: 'Fall-off-the-bone smoked pork ribs drizzled with sweet tangy kokum reduction.', createdAt: '2026-06-01T12:00:00Z' },
  { id: 'dish-11', name: 'Wild Mushroom & Black Rice Risotto', category: 'Main Course', description: 'Local black rice with forest mushrooms, parmesan crisp, and cold-pressed mustard oil.', createdAt: '2026-06-15T14:00:00Z' },
  { id: 'dish-12', name: 'Kerala Fried Chicken with Rice Flakes', category: 'Appetizer', description: 'Curry leaf infused crispy chicken morsels served with coconut vinegar dip.', createdAt: '2026-06-20T10:00:00Z' },
  { id: 'dish-13', name: 'Artisanal Valrhona Tiramisu', category: 'Dessert', description: 'Savoiardi soaked in espresso, layered with light mascarpone cream and dusted with bitter cocoa.', createdAt: '2026-05-12T11:00:00Z' },
  { id: 'dish-14', name: 'Dark Chocolate & Hazelnut Panna Cotta', category: 'Dessert', description: 'Silky smooth single-origin chocolate cream served with raspberry compote.', createdAt: '2026-07-04T09:00:00Z' },
  { id: 'dish-15', name: 'Cold Brew Tonic & Kaffir Lime', category: 'Beverage', description: 'Slow-dripped single origin arabica poured over Indian tonic water with burnt lime.', createdAt: '2026-06-15T14:00:00Z' },
  { id: 'dish-16', name: 'Spiced Kokum & Plum Cooler', category: 'Beverage', description: 'Refreshing infusion of roasted cumin, fresh kokum extract, and crushed mint leaves.', createdAt: '2026-06-01T12:00:00Z' },
];

export const SEED_VISITS: Visit[] = [
  // 1. Burma Burma - May 20
  {
    id: 'visit-1',
    restaurantId: 'rest-1',
    visitedAt: '2026-05-20T19:30:00Z',
    totalBill: 2450,
    numberOfPeople: 2,
    overallRating: 5,
    foodQualityRating: 5,
    valueForMoneyRating: 4,
    serviceRating: 5,
    ambienceRating: 5,
    notes: 'Exquisite debut dinner. The Khow Suey broth was warm, aromatic, and richly layered. Impeccable hospitality.',
    createdAt: '2026-05-20T21:40:00Z',
    updatedAt: '2026-05-20T21:40:00Z',
  },
  // 2. Brik Oven - Jun 05
  {
    id: 'visit-2',
    restaurantId: 'rest-2',
    visitedAt: '2026-06-05T20:15:00Z',
    totalBill: 3100,
    numberOfPeople: 3,
    overallRating: 5,
    foodQualityRating: 5,
    valueForMoneyRating: 5,
    serviceRating: 4,
    ambienceRating: 4,
    notes: 'The sourdough crust had magnificent leopard spotting. Hot honey drizzle on pepperoni was sensational.',
    createdAt: '2026-06-05T22:30:00Z',
    updatedAt: '2026-06-05T22:30:00Z',
  },
  // 3. O Pedro - Jun 18
  {
    id: 'visit-3',
    restaurantId: 'rest-3',
    visitedAt: '2026-06-18T20:00:00Z',
    totalBill: 4600,
    numberOfPeople: 4,
    overallRating: 5,
    foodQualityRating: 5,
    valueForMoneyRating: 4,
    serviceRating: 5,
    ambienceRating: 5,
    notes: 'Incredible Goan vibes! The Choriz was smoky and punchy. Kokum drinks paired like magic.',
    createdAt: '2026-06-18T23:00:00Z',
    updatedAt: '2026-06-18T23:00:00Z',
  },
  // 4. Toast & Tonic - Jul 02
  {
    id: 'visit-4',
    restaurantId: 'rest-4',
    visitedAt: '2026-07-02T13:30:00Z',
    totalBill: 2850,
    numberOfPeople: 2,
    overallRating: 4,
    foodQualityRating: 4,
    valueForMoneyRating: 3,
    serviceRating: 4,
    ambienceRating: 4,
    notes: 'Pleasant Sunday brunch. Wild mushroom black risotto was deep and earthy, though portions were slightly modest.',
    createdAt: '2026-07-02T16:00:00Z',
    updatedAt: '2026-07-02T16:00:00Z',
  },
  // 5. The Bombay Canteen - Jul 14
  {
    id: 'visit-5',
    restaurantId: 'rest-5',
    visitedAt: '2026-07-14T20:30:00Z',
    totalBill: 3900,
    numberOfPeople: 3,
    overallRating: 5,
    foodQualityRating: 5,
    valueForMoneyRating: 4,
    serviceRating: 5,
    ambienceRating: 5,
    notes: 'Top tier meal. The Kerala fried chicken had unbelievable crunch and fragrant curry leaf aroma.',
    createdAt: '2026-07-14T23:00:00Z',
    updatedAt: '2026-07-14T23:00:00Z',
  },
  // 6. Burma Burma - Jul 28 (Repeat visit 1 to Burma Burma)
  {
    id: 'visit-6',
    restaurantId: 'rest-1',
    visitedAt: '2026-07-28T19:45:00Z',
    totalBill: 3350,
    numberOfPeople: 3,
    overallRating: 4,
    foodQualityRating: 4,
    valueForMoneyRating: 4,
    serviceRating: 4,
    ambienceRating: 5,
    notes: 'Brought friends along. Khow Suey was as reliable as always; Tea Leaf salad was crisp and refreshing.',
    createdAt: '2026-07-28T22:00:00Z',
    updatedAt: '2026-07-28T22:00:00Z',
  },
  // 7. Trishna - Aug 08
  {
    id: 'visit-7',
    restaurantId: 'rest-7',
    visitedAt: '2026-08-08T20:00:00Z',
    totalBill: 5800,
    numberOfPeople: 3,
    overallRating: 5,
    foodQualityRating: 5,
    valueForMoneyRating: 4,
    serviceRating: 4,
    ambienceRating: 3,
    notes: 'Legendary butter garlic crab lived up to every ounce of hype. Sweet fresh crab meat soaked in garlic.',
    createdAt: '2026-08-08T22:45:00Z',
    updatedAt: '2026-08-08T22:45:00Z',
  },
  // 8. Sienna Cafe - Aug 19
  {
    id: 'visit-8',
    restaurantId: 'rest-6',
    visitedAt: '2026-08-19T11:30:00Z',
    totalBill: 1750,
    numberOfPeople: 2,
    overallRating: 4,
    foodQualityRating: 4,
    valueForMoneyRating: 4,
    serviceRating: 4,
    ambienceRating: 5,
    notes: 'Gorgeous artistic courtyard. Coffee was roasted to perfection and the chocolate panna cotta was velvety.',
    createdAt: '2026-08-19T13:45:00Z',
    updatedAt: '2026-08-19T13:45:00Z',
  },
  // 9. Brik Oven - Sep 01 (Repeat visit 1 to Brik Oven)
  {
    id: 'visit-9',
    restaurantId: 'rest-2',
    visitedAt: '2026-09-01T19:00:00Z',
    totalBill: 2600,
    numberOfPeople: 2,
    overallRating: 5,
    foodQualityRating: 5,
    valueForMoneyRating: 5,
    serviceRating: 4,
    ambienceRating: 4,
    notes: 'Quick post-work dinner. Ordered the Margherita and Truffle Burrata. Consistent perfection.',
    createdAt: '2026-09-01T21:00:00Z',
    updatedAt: '2026-09-01T21:00:00Z',
  },
  // 10. Olive Bar & Kitchen - Sep 12
  {
    id: 'visit-10',
    restaurantId: 'rest-8',
    visitedAt: '2026-09-12T20:30:00Z',
    totalBill: 5200,
    numberOfPeople: 2,
    overallRating: 4,
    foodQualityRating: 4,
    valueForMoneyRating: 3,
    serviceRating: 4,
    ambienceRating: 5,
    notes: 'Dreamy ambience under the canopy. Great wine list, food was good though prices are elevated.',
    createdAt: '2026-09-12T23:30:00Z',
    updatedAt: '2026-09-12T23:30:00Z',
  },
  // 11. O Pedro - Sep 25 (Repeat visit 1 to O Pedro)
  {
    id: 'visit-11',
    restaurantId: 'rest-3',
    visitedAt: '2026-09-25T21:00:00Z',
    totalBill: 3800,
    numberOfPeople: 2,
    overallRating: 4,
    foodQualityRating: 4,
    valueForMoneyRating: 4,
    serviceRating: 5,
    ambienceRating: 5,
    notes: 'Tried the smoked ribs this time. Glaze had great tanginess. Packed house on a Friday night.',
    createdAt: '2026-09-25T23:45:00Z',
    updatedAt: '2026-09-25T23:45:00Z',
  },
  // 12. Burma Burma - Oct 03 (Repeat visit 2 to Burma Burma)
  {
    id: 'visit-12',
    restaurantId: 'rest-1',
    visitedAt: '2026-10-03T13:00:00Z',
    totalBill: 2900,
    numberOfPeople: 3,
    overallRating: 5,
    foodQualityRating: 5,
    valueForMoneyRating: 4,
    serviceRating: 5,
    ambienceRating: 5,
    notes: 'Family festive lunch. The Lotus root crisps were a hit with everyone. Very prompt service.',
    createdAt: '2026-10-03T15:30:00Z',
    updatedAt: '2026-10-03T15:30:00Z',
  },
  // 13. Toast & Tonic - Oct 14 (Repeat visit 1 to Toast & Tonic)
  {
    id: 'visit-13',
    restaurantId: 'rest-4',
    visitedAt: '2026-10-14T20:00:00Z',
    totalBill: 3400,
    numberOfPeople: 2,
    overallRating: 4,
    foodQualityRating: 4,
    valueForMoneyRating: 4,
    serviceRating: 4,
    ambienceRating: 4,
    notes: 'Dinner date with Priya. Craft drinks were standout. Cold brew tonic pairing was sublime.',
    createdAt: '2026-10-14T22:30:00Z',
    updatedAt: '2026-10-14T22:30:00Z',
  },
  // 14. Brik Oven - Oct 22 (Repeat visit 2 to Brik Oven)
  {
    id: 'visit-14',
    restaurantId: 'rest-2',
    visitedAt: '2026-10-22T20:30:00Z',
    totalBill: 4100,
    numberOfPeople: 4,
    overallRating: 5,
    foodQualityRating: 5,
    valueForMoneyRating: 5,
    serviceRating: 5,
    ambienceRating: 4,
    notes: 'Celebrated Rohan’s birthday! Ordered three pizzas and two tiramisus. Best tiramisu in town without doubt.',
    createdAt: '2026-10-22T23:15:00Z',
    updatedAt: '2026-10-22T23:15:00Z',
  },
  // 15. The Bombay Canteen - Oct 29 (Repeat visit 1 to Bombay Canteen)
  {
    id: 'visit-15',
    restaurantId: 'rest-5',
    visitedAt: '2026-10-29T21:15:00Z',
    totalBill: 5100,
    numberOfPeople: 4,
    overallRating: 5,
    foodQualityRating: 5,
    valueForMoneyRating: 4,
    serviceRating: 5,
    ambienceRating: 5,
    notes: 'Group dinner during Mumbai trip. The energy was electric and every plate was licked clean.',
    createdAt: '2026-10-29T23:50:00Z',
    updatedAt: '2026-10-29T23:50:00Z',
  },
  // 16. Trishna - Nov 04 (Repeat visit 1 to Trishna)
  {
    id: 'visit-16',
    restaurantId: 'rest-7',
    visitedAt: '2026-11-04T13:30:00Z',
    totalBill: 4400,
    numberOfPeople: 2,
    overallRating: 5,
    foodQualityRating: 5,
    valueForMoneyRating: 4,
    serviceRating: 4,
    ambienceRating: 3,
    notes: 'Took Sneha for her first taste of Butter Garlic Crab and Ghee Roast. She was completely blown away.',
    createdAt: '2026-11-04T16:00:00Z',
    updatedAt: '2026-11-04T16:00:00Z',
  },
  // 17. Burma Burma - Nov 10 (Repeat visit 3 to Burma Burma)
  {
    id: 'visit-17',
    restaurantId: 'rest-1',
    visitedAt: '2026-11-10T20:00:00Z',
    totalBill: 2750,
    numberOfPeople: 2,
    overallRating: 5,
    foodQualityRating: 5,
    valueForMoneyRating: 4,
    serviceRating: 5,
    ambienceRating: 5,
    notes: 'Comfort food night after a rainy afternoon. Khow Suey hit the spot instantly.',
    createdAt: '2026-11-10T22:15:00Z',
    updatedAt: '2026-11-10T22:15:00Z',
  },
  // 18. O Pedro - Nov 14 (Repeat visit 2 to O Pedro)
  {
    id: 'visit-18',
    restaurantId: 'rest-3',
    visitedAt: '2026-11-14T20:30:00Z',
    totalBill: 4900,
    numberOfPeople: 3,
    overallRating: 5,
    foodQualityRating: 5,
    valueForMoneyRating: 4,
    serviceRating: 5,
    ambienceRating: 5,
    notes: 'Friday drinks & dinner. Choriz and kokum cocktails were top tier as usual.',
    createdAt: '2026-11-14T23:30:00Z',
    updatedAt: '2026-11-14T23:30:00Z',
  },
  // 19. Brik Oven - Nov 18 (Repeat visit 3 to Brik Oven)
  {
    id: 'visit-19',
    restaurantId: 'rest-2',
    visitedAt: '2026-11-18T19:30:00Z',
    totalBill: 2700,
    numberOfPeople: 2,
    overallRating: 5,
    foodQualityRating: 5,
    valueForMoneyRating: 5,
    serviceRating: 5,
    ambienceRating: 4,
    notes: 'Midweek pizza fix. Tried spicy hot honey with extra burrata. Pure bliss.',
    createdAt: '2026-11-18T21:40:00Z',
    updatedAt: '2026-11-18T21:40:00Z',
  },
  // 20. Sienna Cafe - Nov 21 (Repeat visit 1 to Sienna)
  {
    id: 'visit-20',
    restaurantId: 'rest-6',
    visitedAt: '2026-11-21T12:00:00Z',
    totalBill: 2100,
    numberOfPeople: 2,
    overallRating: 5,
    foodQualityRating: 5,
    valueForMoneyRating: 4,
    serviceRating: 4,
    ambienceRating: 5,
    notes: 'Quiet Saturday reading session and brunch. Tiramisu and iced brew were delightful.',
    createdAt: '2026-11-21T14:30:00Z',
    updatedAt: '2026-11-21T14:30:00Z',
  },
];

export const SEED_VISIT_DISHES: VisitDish[] = [
  // Visit 1: Burma Burma (May 20)
  { id: 'vd-1', visitId: 'visit-1', dishId: 'dish-1', price: 650, quantity: 2, rating: 5, wouldOrderAgain: true, notes: 'Silky rich broth with great condiments' },
  { id: 'vd-2', visitId: 'visit-1', dishId: 'dish-2', price: 480, quantity: 1, rating: 5, wouldOrderAgain: true, notes: 'Crunchy, tangy, and deeply fermented' },

  // Visit 2: Brik Oven (Jun 05)
  { id: 'vd-3', visitId: 'visit-2', dishId: 'dish-4', price: 780, quantity: 1, rating: 5, wouldOrderAgain: true, notes: 'Best pepperoni pizza in South India' },
  { id: 'vd-4', visitId: 'visit-2', dishId: 'dish-5', price: 620, quantity: 1, rating: 5, wouldOrderAgain: true, notes: 'Creamy burrata paired wonderfully with balsamic' },
  { id: 'vd-5', visitId: 'visit-2', dishId: 'dish-13', price: 420, quantity: 1, rating: 5, wouldOrderAgain: true, notes: 'Ultra light mascarpone' },

  // Visit 3: O Pedro (Jun 18)
  { id: 'vd-6', visitId: 'visit-3', dishId: 'dish-9', price: 580, quantity: 2, rating: 5, wouldOrderAgain: true, notes: 'Spicy, tangy pork sausage with hot poi' },
  { id: 'vd-7', visitId: 'visit-3', dishId: 'dish-16', price: 320, quantity: 3, rating: 4, wouldOrderAgain: true, notes: 'Refreshing punch of sour kokum' },

  // Visit 4: Toast & Tonic (Jul 02)
  { id: 'vd-8', visitId: 'visit-4', dishId: 'dish-11', price: 750, quantity: 2, rating: 4, wouldOrderAgain: true, notes: 'Black rice texture was delightfully chewy' },
  { id: 'vd-9', visitId: 'visit-4', dishId: 'dish-15', price: 350, quantity: 2, rating: 4, wouldOrderAgain: true, notes: 'Crisp and effervescent tonic' },

  // Visit 5: Bombay Canteen (Jul 14)
  { id: 'vd-10', visitId: 'visit-5', dishId: 'dish-12', price: 620, quantity: 2, rating: 5, wouldOrderAgain: true, notes: 'Crackling crunch with fresh green chilli aroma' },

  // Visit 6: Burma Burma (Jul 28) - Price slightly changed, different rating demonstration
  { id: 'vd-11', visitId: 'visit-6', dishId: 'dish-1', price: 680, quantity: 2, rating: 4, wouldOrderAgain: true, notes: 'A touch saltier than first visit but still wonderful' },
  { id: 'vd-12', visitId: 'visit-6', dishId: 'dish-3', price: 390, quantity: 1, rating: 4, wouldOrderAgain: true, notes: 'Addictively crispy snack' },

  // Visit 7: Trishna (Aug 08)
  { id: 'vd-13', visitId: 'visit-7', dishId: 'dish-7', price: 2400, quantity: 1, rating: 5, wouldOrderAgain: true, notes: 'Unrivalled garlic butter sweetness' },
  { id: 'vd-14', visitId: 'visit-7', dishId: 'dish-8', price: 680, quantity: 1, rating: 5, wouldOrderAgain: true, notes: 'Fiery red ghee roast with deep aroma' },

  // Visit 8: Sienna Cafe (Aug 19)
  { id: 'vd-15', visitId: 'visit-8', dishId: 'dish-14', price: 440, quantity: 1, rating: 4, wouldOrderAgain: true, notes: 'Rich dark chocolate balanced by tart berries' },
  { id: 'vd-16', visitId: 'visit-8', dishId: 'dish-15', price: 290, quantity: 2, rating: 5, wouldOrderAgain: true, notes: 'Cold brew clarity was exceptional' },

  // Visit 9: Brik Oven (Sep 01)
  { id: 'vd-17', visitId: 'visit-9', dishId: 'dish-6', price: 540, quantity: 1, rating: 5, wouldOrderAgain: true, notes: 'Pure simplicity done right' },
  { id: 'vd-18', visitId: 'visit-9', dishId: 'dish-5', price: 650, quantity: 1, rating: 5, wouldOrderAgain: true, notes: 'Truffle burrata was super fresh' },

  // Visit 10: Olive Bar & Kitchen (Sep 12)
  { id: 'vd-19', visitId: 'visit-10', dishId: 'dish-11', price: 850, quantity: 1, rating: 4, wouldOrderAgain: true, notes: 'Good flavor profile, lovely presentation' },
  { id: 'vd-20', visitId: 'visit-10', dishId: 'dish-13', price: 520, quantity: 1, rating: 4, wouldOrderAgain: false, notes: 'A bit dry on the sponge layer' },

  // Visit 11: O Pedro (Sep 25)
  { id: 'vd-21', visitId: 'visit-11', dishId: 'dish-10', price: 820, quantity: 1, rating: 5, wouldOrderAgain: true, notes: 'Sticky, tender, finger-licking ribs' },
  { id: 'vd-22', visitId: 'visit-11', dishId: 'dish-9', price: 620, quantity: 1, rating: 4, wouldOrderAgain: true, notes: 'Still great, but slightly more oily today' },

  // Visit 12: Burma Burma (Oct 03)
  { id: 'vd-23', visitId: 'visit-12', dishId: 'dish-1', price: 680, quantity: 2, rating: 5, wouldOrderAgain: true, notes: 'Back to absolute perfection' },
  { id: 'vd-24', visitId: 'visit-12', dishId: 'dish-3', price: 410, quantity: 2, rating: 5, wouldOrderAgain: true, notes: 'Kids and adults loved the crunchy lotus root' },

  // Visit 13: Toast & Tonic (Oct 14)
  { id: 'vd-25', visitId: 'visit-13', dishId: 'dish-11', price: 790, quantity: 1, rating: 4, wouldOrderAgain: true, notes: 'Comforting on a rainy evening' },
  { id: 'vd-26', visitId: 'visit-13', dishId: 'dish-15', price: 380, quantity: 2, rating: 5, wouldOrderAgain: true, notes: 'Crisp cold brew' },

  // Visit 14: Brik Oven (Oct 22)
  { id: 'vd-27', visitId: 'visit-14', dishId: 'dish-4', price: 820, quantity: 2, rating: 5, wouldOrderAgain: true, notes: 'Crowd pleaser as always' },
  { id: 'vd-28', visitId: 'visit-14', dishId: 'dish-13', price: 450, quantity: 2, rating: 5, wouldOrderAgain: true, notes: 'Everyone wanted seconds of the tiramisu' },

  // Visit 15: Bombay Canteen (Oct 29)
  { id: 'vd-29', visitId: 'visit-15', dishId: 'dish-12', price: 650, quantity: 2, rating: 5, wouldOrderAgain: true, notes: 'Irresistible crunch and spices' },
  { id: 'vd-30', visitId: 'visit-15', dishId: 'dish-16', price: 350, quantity: 3, rating: 4, wouldOrderAgain: true, notes: 'Punchy sour-sweet beverage' },

  // Visit 16: Trishna (Nov 04)
  { id: 'vd-31', visitId: 'visit-16', dishId: 'dish-7', price: 2600, quantity: 1, rating: 5, wouldOrderAgain: true, notes: 'Crab quality was supreme' },
  { id: 'vd-32', visitId: 'visit-16', dishId: 'dish-8', price: 720, quantity: 1, rating: 5, wouldOrderAgain: true, notes: 'Rich aromatic ghee roast' },

  // Visit 17: Burma Burma (Nov 10)
  { id: 'vd-33', visitId: 'visit-17', dishId: 'dish-1', price: 680, quantity: 1, rating: 5, wouldOrderAgain: true, notes: 'Soul-soothing bowl' },
  { id: 'vd-34', visitId: 'visit-17', dishId: 'dish-2', price: 510, quantity: 1, rating: 5, wouldOrderAgain: true, notes: 'Fermented green tea leaves were bursting with umami' },

  // Visit 18: O Pedro (Nov 14)
  { id: 'vd-35', visitId: 'visit-18', dishId: 'dish-9', price: 640, quantity: 1, rating: 5, wouldOrderAgain: true, notes: 'Choriz fry was piping hot' },
  { id: 'vd-36', visitId: 'visit-18', dishId: 'dish-10', price: 860, quantity: 1, rating: 5, wouldOrderAgain: true, notes: 'Melt in your mouth ribs' },

  // Visit 19: Brik Oven (Nov 18)
  { id: 'vd-37', visitId: 'visit-19', dishId: 'dish-4', price: 820, quantity: 1, rating: 5, wouldOrderAgain: true, notes: 'Crispy blistered edge on crust' },
  { id: 'vd-38', visitId: 'visit-19', dishId: 'dish-5', price: 680, quantity: 1, rating: 5, wouldOrderAgain: true, notes: 'Burrata paired with olive oil was divine' },

  // Visit 20: Sienna Cafe (Nov 21)
  { id: 'vd-39', visitId: 'visit-20', dishId: 'dish-13', price: 460, quantity: 1, rating: 5, wouldOrderAgain: true, notes: 'Tiramisu was airy and fragrant' },
  { id: 'vd-40', visitId: 'visit-20', dishId: 'dish-15', price: 320, quantity: 2, rating: 5, wouldOrderAgain: true, notes: 'Perfect brew note' },
];

export const SEED_VISIT_FRIENDS: VisitFriend[] = [
  { id: 'vf-1', visitId: 'visit-1', friendId: 'friend-1' }, // Aarav
  { id: 'vf-2', visitId: 'visit-2', friendId: 'friend-1' }, // Aarav
  { id: 'vf-3', visitId: 'visit-2', friendId: 'friend-2' }, // Priya
  { id: 'vf-4', visitId: 'visit-3', friendId: 'friend-3' }, // Rohan
  { id: 'vf-5', visitId: 'visit-3', friendId: 'friend-4' }, // Ananya
  { id: 'vf-6', visitId: 'visit-3', friendId: 'friend-5' }, // Vikram
  { id: 'vf-7', visitId: 'visit-4', friendId: 'friend-2' }, // Priya
  { id: 'vf-8', visitId: 'visit-5', friendId: 'friend-3' }, // Rohan
  { id: 'vf-9', visitId: 'visit-5', friendId: 'friend-6' }, // Sneha
  { id: 'vf-10', visitId: 'visit-6', friendId: 'friend-4' }, // Ananya
  { id: 'vf-11', visitId: 'visit-6', friendId: 'friend-5' }, // Vikram
  { id: 'vf-12', visitId: 'visit-7', friendId: 'friend-1' }, // Aarav
  { id: 'vf-13', visitId: 'visit-7', friendId: 'friend-3' }, // Rohan
  { id: 'vf-14', visitId: 'visit-8', friendId: 'friend-4' }, // Ananya
  { id: 'vf-15', visitId: 'visit-9', friendId: 'friend-1' }, // Aarav
  { id: 'vf-16', visitId: 'visit-10', friendId: 'friend-2' }, // Priya
  { id: 'vf-17', visitId: 'visit-11', friendId: 'friend-5' }, // Vikram
  { id: 'vf-18', visitId: 'visit-12', friendId: 'friend-2' }, // Priya
  { id: 'vf-19', visitId: 'visit-12', friendId: 'friend-6' }, // Sneha
  { id: 'vf-20', visitId: 'visit-13', friendId: 'friend-2' }, // Priya
  { id: 'vf-21', visitId: 'visit-14', friendId: 'friend-1' }, // Aarav
  { id: 'vf-22', visitId: 'visit-14', friendId: 'friend-3' }, // Rohan
  { id: 'vf-23', visitId: 'visit-14', friendId: 'friend-5' }, // Vikram
  { id: 'vf-24', visitId: 'visit-15', friendId: 'friend-3' }, // Rohan
  { id: 'vf-25', visitId: 'visit-15', friendId: 'friend-4' }, // Ananya
  { id: 'vf-26', visitId: 'visit-15', friendId: 'friend-6' }, // Sneha
  { id: 'vf-27', visitId: 'visit-16', friendId: 'friend-6' }, // Sneha
  { id: 'vf-28', visitId: 'visit-17', friendId: 'friend-1' }, // Aarav
  { id: 'vf-29', visitId: 'visit-18', friendId: 'friend-3' }, // Rohan
  { id: 'vf-30', visitId: 'visit-18', friendId: 'friend-5' }, // Vikram
  { id: 'vf-31', visitId: 'visit-19', friendId: 'friend-2' }, // Priya
  { id: 'vf-32', visitId: 'visit-20', friendId: 'friend-4' }, // Ananya
];

export const SEED_ATTACHMENTS: Attachment[] = [
  {
    id: 'att-1',
    visitId: 'visit-1',
    type: 'menu',
    fileName: 'burma_burma_tea_menu.jpg',
    storagePath: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-05-20T21:40:00Z',
  },
  {
    id: 'att-2',
    visitId: 'visit-1',
    visitDishId: 'vd-1',
    type: 'food',
    fileName: 'khow_suey_bowl.jpg',
    storagePath: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-05-20T21:40:00Z',
  },
  {
    id: 'att-3',
    visitId: 'visit-2',
    visitDishId: 'vd-3',
    type: 'food',
    fileName: 'pepperoni_sourdough_pizza.jpg',
    storagePath: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-06-05T22:30:00Z',
  },
  {
    id: 'att-4',
    visitId: 'visit-2',
    visitDishId: 'vd-4',
    type: 'food',
    fileName: 'burrata_heirloom_tomatoes.jpg',
    storagePath: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-06-05T22:30:00Z',
  },
  {
    id: 'att-5',
    visitId: 'visit-7',
    visitDishId: 'vd-13',
    type: 'food',
    fileName: 'butter_garlic_crab_plate.jpg',
    storagePath: 'https://images.unsplash.com/photo-1559742811-822863ccba77?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-08-08T22:45:00Z',
  },
  {
    id: 'att-6',
    visitId: 'visit-14',
    visitDishId: 'vd-28',
    type: 'food',
    fileName: 'artisanal_tiramisu_slice.jpg',
    storagePath: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-10-22T23:15:00Z',
  },
];
