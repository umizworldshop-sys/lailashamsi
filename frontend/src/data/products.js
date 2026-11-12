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
    count: 2
  },
  {
    id: 'female',
    name: 'Female (Women Wear)',
    subtitle: 'Luxury pret, unstitched suits & formal wear',
    image: 'https://res.cloudinary.com/jpea5mb0/image/upload/v1793740272/lailashamsi_products/varnq4zuzvt1v4fqfxtz.jpg',
    count: 2
  },
  {
    id: 'babies',
    name: 'Kids Collection',
    subtitle: 'Charming festive attire for girls & babies',
    image: 'https://res.cloudinary.com/jpea5mb0/image/upload/v1793790101/lailashamsi_products/kfbb3t86uhm5nkg5zn9q.jpg',
    count: 0
  },
  {
    id: 'unstitched',
    name: 'Unstitched Suits',
    subtitle: 'Embroidered lawn suits, raw silks & chiffons',
    image: 'https://res.cloudinary.com/jpea5mb0/image/upload/v1794487431/lailashamsi_products/azmbjy6frloeuuqj9n7n.jpg',
    count: 1
  },
  {
    id: 'stitched',
    name: 'Stitched (Ready to Wear)',
    subtitle: 'Tailored shalwar kameez & luxury pret',
    image: 'https://res.cloudinary.com/jpea5mb0/image/upload/v1793740272/lailashamsi_products/varnq4zuzvt1v4fqfxtz.jpg',
    count: 1
  }
];

export const PRODUCTS = [
  {
    id: '6aea4e1235af0193ec56e487',
    _id: '6aea4e1235af0193ec56e487',
    title: 'Noor-e-Haya Luxury Suit',
    category: 'stitched',
    categoryLabel: 'Stitched (Ready to Wear)',
    price: 120,
    originalPrice: 110,
    rawPkrPrice: 12000,
    rating: 5.0,
    reviewsCount: 1,
    tag: 'Bestseller',
    tagColor: 'bg-[#641E32] text-white',
    image: 'https://res.cloudinary.com/jpea5mb0/image/upload/v1793740272/lailashamsi_products/varnq4zuzvt1v4fqfxtz.jpg',
    images: [
      'https://res.cloudinary.com/jpea5mb0/image/upload/v1793740272/lailashamsi_products/varnq4zuzvt1v4fqfxtz.jpg',
      'https://res.cloudinary.com/jpea5mb0/image/upload/v1793740281/lailashamsi_products/pkncnb1ka9uv2egndgmm.jpg',
      'https://res.cloudinary.com/jpea5mb0/image/upload/v1793740292/lailashamsi_products/y1ubsv5jpdekxxwa5kji.jpg'
    ],
    fabric: 'Pure Silk & Handcrafted Chiffon',
    pieces: '3 Piece',
    colors: [
      { name: 'Standard', hex: '#641E32' },
      { name: 'Burgundy', hex: '#641E32' },
      { name: 'Dusty Rose', hex: '#B76E79' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Discover timeless elegance with our Noor-e-Haya Embroidered 3-Piece Suit. Designed with delicate embroidery and a sophisticated traditional touch, this outfit brings grace and beauty to your wardrobe. Perfect for festive celebrations, family gatherings, and special occasions.',
    isNew: true,
    isNewArrival: true,
    isOnSale: false,
    stock: 25
  },
  {
    id: '6af5b49e70157b8b78b13d33',
    _id: '6af5b49e70157b8b78b13d33',
    title: 'Gul-e-Noor Luxury Unstitched Suit',
    category: 'unstitched',
    categoryLabel: 'Unstitched Suits',
    price: 48,
    originalPrice: 80,
    rawPkrPrice: 4800,
    discountPercent: 40,
    tag: '40% OFF',
    tagColor: 'bg-[#641E32] text-white',
    image: 'https://res.cloudinary.com/jpea5mb0/image/upload/v1794487431/lailashamsi_products/azmbjy6frloeuuqj9n7n.jpg',
    images: [
      'https://res.cloudinary.com/jpea5mb0/image/upload/v1794487431/lailashamsi_products/azmbjy6frloeuuqj9n7n.jpg',
      'https://res.cloudinary.com/jpea5mb0/image/upload/v1794487422/lailashamsi_products/pf0g0o9bwkndqljkatut.jpg'
    ],
    fabric: 'Pure Silk & Handcrafted Chiffon',
    pieces: '3 Piece',
    colors: [
      { name: 'Burgundy', hex: '#641E32' },
      { name: 'White', hex: '#FFFFFF' }
    ],
    sizes: ['Free Size', 'Unstitched'],
    description: 'Exquisite handcrafted unstitched formal suit with intricate zari and tilla threadwork, matching chiffon dupatta and dyed silk trouser.',
    isNew: true,
    isNewArrival: true,
    isOnSale: true,
    stock: 20
  }
];

export const INSTAGRAM_POSTS = [];
