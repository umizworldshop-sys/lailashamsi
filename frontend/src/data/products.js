export const CURRENCY_RATES = {
  PKR: { symbol: 'Rs. ', rate: 100 },
  USD: { symbol: '$', rate: 1 },
  GBP: { symbol: '£', rate: 0.79 },
  AED: { symbol: 'AED ', rate: 3.67 }
};

export const CATEGORIES = [
  {
    id: 'all',
    name: 'All Collections',
    count: 12
  },
  {
    id: 'female',
    name: 'Female (Women Wear)',
    subtitle: 'Luxury pret, unstitched suits & formal wear',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop',
    count: 8
  },
  {
    id: 'babies',
    name: 'Kids Collection',
    subtitle: 'Charming festive attire for girls & babies',
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=900&auto=format&fit=crop',
    count: 4
  },
  {
    id: 'unstitched',
    name: 'Unstitched Suits',
    subtitle: 'Embroidered lawn suits, raw silks & chiffons',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=900&auto=format&fit=crop',
    count: 4
  },
  {
    id: 'stitched',
    name: 'Stitched (Ready to Wear)',
    subtitle: 'Tailored shalwar kameez & luxury pret',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=900&auto=format&fit=crop',
    count: 7
  }
];

export const PRODUCTS = [
  {
    id: 1,
    title: 'Gul-e-Noor Embroidered Chiffon Suit',
    category: 'luxury-formals',
    categoryLabel: 'Festive & Formal Wear',
    price: 185,
    originalPrice: 220,
    rating: 4.9,
    reviewsCount: 38,
    tag: 'Customer Favourite',
    tagColor: 'bg-[#641E32] text-[#FAF5EC]',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop'
    ],
    fabric: 'Pure Chiffon & Handcrafted Organza',
    pieces: '3 Piece (Kameez, Slip & Dupatta)',
    colors: [
      { name: 'Deep Maroon', hex: '#641E32' },
      { name: 'Antique Gold', hex: '#B89B62' },
      { name: 'Warm Ivory', hex: '#FAF5EC' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'An elegant 3-piece Pakistani formal suit adorned with intricate threadwork, pearls, and delicate sequins, paired with scalloped organza borders and crushed silk trousers.',
    isNew: true
  },
  {
    id: 2,
    title: 'Zahra Velvet Formal Peshwas',
    category: 'luxury-formals',
    categoryLabel: 'Festive & Formal Wear',
    price: 240,
    originalPrice: 290,
    rating: 5.0,
    reviewsCount: 44,
    tag: 'Customer Favourite',
    tagColor: 'bg-[#641E32] text-[#FAF5EC]',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop'
    ],
    fabric: 'Micro Velvet 9000 & Zari Net',
    pieces: '3 Piece (Flared Peshwas, Churidar & Dupatta)',
    colors: [
      { name: 'Deep Maroon', hex: '#641E32' },
      { name: 'Emerald Green', hex: '#164B3C' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'A regal Pakistani formal ensemble crafted from rich micro velvet, embellished with authentic tilla work, dabka, and crystal detailing along the neckline and cuffs.',
    isNew: false
  },
  {
    id: 3,
    title: 'Ayat Raw Silk Luxury Pret',
    category: 'ready-to-wear',
    categoryLabel: 'Ready to Wear',
    price: 135,
    originalPrice: 160,
    rating: 4.8,
    reviewsCount: 29,
    tag: 'New Season',
    tagColor: 'bg-[#282321] text-[#FAF5EC]',
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop'
    ],
    fabric: '100% Pure Raw Silk',
    pieces: '2 Piece (A-Line Kameez & Straight Shalwar)',
    colors: [
      { name: 'Emerald Green', hex: '#164B3C' },
      { name: 'Soft Beige', hex: '#E8DCCB' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Understated Pakistani luxury pret for graceful gatherings. Tailored raw silk kameez embellished with fine resham embroidery and organza borders at the daman.',
    isNew: true
  },
  {
    id: 4,
    title: 'Mirha Embroidered Silk Suit',
    category: 'stitched',
    categoryLabel: 'Luxury Pret',
    price: 110,
    originalPrice: 130,
    rating: 4.9,
    reviewsCount: 52,
    tag: 'Customer Favourite',
    tagColor: 'bg-[#B89B62] text-white',
    images: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop'
    ],
    fabric: 'Pure Medium Silk with Organza Trim',
    pieces: '2 Piece (Embroidered Kameez & Trousers)',
    colors: [
      { name: 'Soft Beige', hex: '#E8DCCB' },
      { name: 'Dark Charcoal', hex: '#282321' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Effortlessly refined 2-piece Eastern suit crafted from breathable pure silk, designed for formal lunches, festive dinners, and seasonal celebrations.',
    isNew: false
  },
  {
    id: 5,
    title: 'Shehnai Festive Organza Angrakha',
    category: 'festive-26',
    categoryLabel: 'Eid Collection',
    price: 215,
    originalPrice: 260,
    rating: 5.0,
    reviewsCount: 61,
    tag: 'Eid Edit',
    tagColor: 'bg-[#641E32] text-[#FAF5EC]',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop'
    ],
    fabric: 'Pure Organza with Cotton Silk Slip',
    pieces: '3 Piece (Angrakha, Shalwar & Dupatta)',
    colors: [
      { name: 'Antique Gold', hex: '#B89B62' },
      { name: 'Emerald Green', hex: '#164B3C' }
    ],
    sizes: ['S', 'M', 'L'],
    description: 'Traditional Pakistani angler-cut angrakha reimagined with delicate gota kinari borders, tilla motifs, and handcrafted tassels for Eid festivities.',
    isNew: true
  },
  {
    id: 6,
    title: 'Noor-e-Jahan Hand-Worked Kalidar',
    category: 'luxury-formals',
    categoryLabel: 'Festive & Formal Wear',
    price: 275,
    originalPrice: 320,
    rating: 4.9,
    reviewsCount: 31,
    tag: 'Heritage Edition',
    tagColor: 'bg-[#641E32] text-[#FAF5EC]',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop'
    ],
    fabric: 'Pure Net with Jamawar Trousers',
    pieces: '3 Piece (Kalidar Kameez, Dupatta & Trousers)',
    colors: [
      { name: 'Warm Ivory', hex: '#FAF5EC' },
      { name: 'Deep Maroon', hex: '#641E32' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'A 16-panel kalidar featuring intricate hand-embroidery on the bodice, scalloped organza dupatta, and pure silk lining.',
    isNew: false
  },
  {
    id: 7,
    title: 'Mah-e-Nau Embroidered Lawn Suit',
    category: 'unstitched',
    categoryLabel: 'Unstitched Suits',
    stitchType: 'unstitched',
    price: 89,
    originalPrice: 110,
    rating: 4.7,
    reviewsCount: 77,
    tag: 'Unstitched Lawn',
    tagColor: 'bg-[#641E32] text-[#FAF5EC]',
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop'
    ],
    fabric: 'Pure Pakistani Fine Cotton Lawn',
    pieces: '3 Piece Unstitched (Embroidered Lawn Shirt, Chiffon Dupatta & Cambric Trouser)',
    colors: [
      { name: 'Soft Beige', hex: '#E8DCCB' },
      { name: 'Emerald Green', hex: '#164B3C' }
    ],
    sizes: ['Unstitched', 'S', 'M', 'L', 'XL'],
    description: 'Breathable, ultra-fine Pakistani lawn suit with intricate schiffli embroidery, organza borders, and a pure chiffon printed dupatta.',
    isNew: true
  },
  {
    id: 8,
    title: 'Zareen Embroidered Shalwar Kameez',
    category: 'stitched',
    categoryLabel: 'Luxury Pret',
    price: 165,
    originalPrice: 195,
    rating: 5.0,
    reviewsCount: 19,
    tag: 'Luxury Pret',
    tagColor: 'bg-[#B89B62] text-white',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop'
    ],
    fabric: 'Pure Karandi Silk & Organza',
    pieces: '3 Piece (Embroidered Kameez, Shalwar & Organza Dupatta)',
    colors: [
      { name: 'Warm Ivory', hex: '#FAF5EC' },
      { name: 'Deep Maroon', hex: '#641E32' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Classic tailored shalwar kameez featuring hand-embroidered floral motifs along the neckline and sleeves, paired with a pure organza dupatta.',
    isNew: true,
    stitchType: 'stitched'
  },
  {
    id: 9,
    title: 'Noor Festive Heirloom Angrakha',
    category: 'babies',
    categoryLabel: 'Eid Collection',
    stitchType: 'babies',
    price: 95,
    originalPrice: 120,
    rating: 5.0,
    reviewsCount: 22,
    tag: 'Festive Edit',
    tagColor: 'bg-[#641E32] text-[#FAF5EC]',
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1000&auto=format&fit=crop'
    ],
    fabric: 'Pure Crinkle Chiffon with Soft Cotton Silk Lining',
    pieces: '2 Piece (Angrakha & Soft Shalwar)',
    colors: [
      { name: 'Deep Maroon', hex: '#641E32' },
      { name: 'Antique Gold', hex: '#B89B62' }
    ],
    sizes: ['0-6M', '6-12M', '1-2Y', '2-4Y', '4-6Y'],
    description: 'Traditional festive Eastern ensemble handcrafted with soft seams and breathable cotton silk lining for comfort and grace.',
    isNew: true
  },
  {
    id: 10,
    title: 'Inaya Raw Silk Festive Suit',
    category: 'babies',
    categoryLabel: 'Eid Collection',
    stitchType: 'babies',
    price: 85,
    originalPrice: 110,
    rating: 4.9,
    reviewsCount: 31,
    tag: 'Eid Special',
    tagColor: 'bg-[#B89B62] text-white',
    images: [
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1000&auto=format&fit=crop'
    ],
    fabric: 'Pure Raw Silk with Soft Lawn Lining',
    pieces: '2 Piece (Flared Kameez & Net Dupatta)',
    colors: [
      { name: 'Soft Beige', hex: '#E8DCCB' },
      { name: 'Emerald Green', hex: '#164B3C' }
    ],
    sizes: ['6-12M', '1-2Y', '2-4Y', '4-6Y'],
    description: 'Charming Pakistani festive attire featuring handcrafted gota borders and delicate pearl tassels for memorable family celebrations.',
    isNew: true
  },
  {
    id: 11,
    title: 'Dhanak Embroidered Cotton Chiffon 3PC',
    category: 'unstitched',
    categoryLabel: 'Unstitched Suits',
    stitchType: 'unstitched',
    price: 98,
    originalPrice: 125,
    rating: 4.8,
    reviewsCount: 38,
    tag: 'Unstitched Lawn',
    tagColor: 'bg-[#641E32] text-[#FAF5EC]',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop'
    ],
    fabric: 'Fine Cotton Chiffon & Pure Lawn',
    pieces: '3 Piece Unstitched (Embroidered Shirt, Digital Chiffon Dupatta & Dyed Trouser)',
    colors: [
      { name: 'Warm Ivory', hex: '#FAF5EC' },
      { name: 'Deep Maroon', hex: '#641E32' }
    ],
    sizes: ['Unstitched', 'S', 'M', 'L', 'XL'],
    description: 'Sumptuous unstitched ensemble featuring heavy threadwork embroidery, hand-rendered lace borders, and a flowy printed chiffon dupatta.',
    isNew: true
  },
  {
    id: 12,
    title: 'Sunehri Hand-Printed Silk & Lawn 3PC',
    category: 'unstitched',
    categoryLabel: 'Unstitched Suits',
    stitchType: 'unstitched',
    price: 115,
    originalPrice: 145,
    rating: 4.9,
    reviewsCount: 46,
    tag: 'Silk Edit',
    tagColor: 'bg-[#B89B62] text-white',
    images: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop'
    ],
    fabric: 'Medium Silk & Embroidered Lawn',
    pieces: '3 Piece Unstitched (Digital Silk Dupatta, Embroidered Lawn Shirt & Cambric Trouser)',
    colors: [
      { name: 'Antique Gold', hex: '#B89B62' },
      { name: 'Deep Maroon', hex: '#641E32' }
    ],
    sizes: ['Unstitched', 'S', 'M', 'L', 'XL'],
    description: 'Elevated summer luxury with hand-embellished resham thread necklines and a pure medium silk digitally printed dupatta.',
    isNew: false
  },
  {
    id: 13,
    title: 'Bahaar Luxury Organza Jacquard 3PC',
    category: 'unstitched',
    categoryLabel: 'Unstitched Suits',
    stitchType: 'unstitched',
    price: 130,
    originalPrice: 160,
    rating: 5.0,
    reviewsCount: 29,
    tag: 'Jacquard Edit',
    tagColor: 'bg-[#641E32] text-[#FAF5EC]',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop'
    ],
    fabric: 'Organza Jacquard & Slub Silk',
    pieces: '3 Piece Unstitched (Jacquard Shirt, Slub Silk Trouser & Embroidered Organza Dupatta)',
    colors: [
      { name: 'Deep Maroon', hex: '#641E32' },
      { name: 'Soft Beige', hex: '#E8DCCB' }
    ],
    sizes: ['Unstitched', 'S', 'M', 'L', 'XL'],
    description: 'Festive unstitched three-piece made with woven gold zari jacquard motifs and intricate floral resham embroidered borders.',
    isNew: true
  },
  {
    id: 14,
    title: 'Ayzel Little Princess Embroidered Peshwas',
    category: 'babies',
    categoryLabel: 'Kids Collection',
    stitchType: 'babies',
    price: 92,
    originalPrice: 115,
    rating: 5.0,
    reviewsCount: 18,
    tag: 'Festive Baby',
    tagColor: 'bg-[#641E32] text-[#FAF5EC]',
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1000&auto=format&fit=crop'
    ],
    fabric: 'Pure Net & Soft Malmal Cotton Lining',
    pieces: '3 Piece (Embroidered Peshwas, Churidar & Net Dupatta)',
    colors: [
      { name: 'Warm Ivory', hex: '#FAF5EC' },
      { name: 'Deep Maroon', hex: '#641E32' }
    ],
    sizes: ['0-6M', '6-12M', '1-2Y', '2-4Y', '4-6Y'],
    description: 'Darling flared peshwas for young girls with gentle handcrafted tilla borders and extra-soft cotton lining that keeps them comfortable.',
    isNew: true
  },
  {
    id: 15,
    title: 'Rayan Festive Kurta Shalwar & Waistcoat',
    category: 'babies',
    categoryLabel: 'Kids Collection',
    stitchType: 'babies',
    price: 88,
    originalPrice: 110,
    rating: 4.9,
    reviewsCount: 24,
    tag: 'Boys Festive',
    tagColor: 'bg-[#B89B62] text-white',
    images: [
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1000&auto=format&fit=crop'
    ],
    fabric: 'Pure Cotton Silk & Jamawar Waistcoat',
    pieces: '3 Piece (Kurta, Shalwar & Jamawar Waistcoat)',
    colors: [
      { name: 'Deep Maroon', hex: '#641E32' },
      { name: 'Antique Gold', hex: '#B89B62' }
    ],
    sizes: ['6-12M', '1-2Y', '2-4Y', '4-6Y'],
    description: 'Handsome traditional festive set for boys featuring a classic embroidered ban collar, comfy shalwar, and royal gold jamawar waistcoat.',
    isNew: true
  },
  {
    id: 16,
    title: 'Mehak Traditional Mirror-Work Ghagra Choli',
    category: 'babies',
    categoryLabel: 'Kids Collection',
    stitchType: 'babies',
    price: 99,
    originalPrice: 125,
    rating: 5.0,
    reviewsCount: 35,
    tag: 'Eid Special',
    tagColor: 'bg-[#641E32] text-[#FAF5EC]',
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1000&auto=format&fit=crop'
    ],
    fabric: 'Pure Georgette Chiffon & Silk Cotton',
    pieces: '3 Piece (Choli, Flared Ghagra & Dupatta)',
    colors: [
      { name: 'Deep Maroon', hex: '#641E32' },
      { name: 'Antique Gold', hex: '#B89B62' }
    ],
    sizes: ['1-2Y', '2-4Y', '4-6Y'],
    description: 'Festive ghagra choli set decorated with delicate acrylic safe mirror work, gota kinari, and soft elastic waistband for effortless movement.',
    isNew: true
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Ayla Tariq',
    role: 'Verified Buyer, London',
    rating: 5,
    comment: 'The craftsmanship of the Gul-e-Noor set blew me away! The organza falls gracefully and the hand-embroidery looks like high couture. Received countless compliments at my brother\'s wedding.',
    date: '2 weeks ago',
    outfit: 'Gul-e-Noor Chiffon'
  },
  {
    id: 2,
    name: 'Zara Hameed',
    role: 'Fashion Consultant, Dubai',
    rating: 5,
    comment: 'Laila Shamsi has completely elevated eastern pret wear. The fabric weight, fine stitching, and attention to seams are unmatched. Standard of international luxury fashion houses!',
    date: '1 month ago',
    outfit: 'Zahra Velvet Rose'
  },
  {
    id: 3,
    name: 'Mahnoor Khan',
    role: 'Verified Buyer, Lahore',
    rating: 5,
    comment: 'Ordered for an evening dinner and it arrived in 48 hours in gorgeous signature rose-gold packaging with a velvet dust bag. True to size and exquisite fabric quality.',
    date: '3 weeks ago',
    outfit: 'Ayat Raw Silk Pret'
  }
];

export const INSTAGRAM_POSTS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
    handle: '@fatima_elahi',
    likes: '2.4k'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
    handle: '@sara.vogue',
    likes: '4.8k'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    handle: '@amna_stylist',
    likes: '3.1k'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
    handle: '@noor_couture',
    likes: '5.2k'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop',
    handle: '@hira_lux',
    likes: '1.9k'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop',
    handle: '@zainab_style',
    likes: '3.9k'
  }
];
