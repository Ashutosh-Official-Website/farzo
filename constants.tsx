
import { Product } from './types';

export const COLORS = {
  primary: '#00F3FF',
  secondary: '#7000FF',
  background: '#020617',
  surface: '#0f172a',
  text: '#f8fafc',
  accent: '#FF00E5'
};

const MOCK_REVIEWS = [
  { id: 'r1', userName: 'Alex Chen', rating: 5, comment: 'Transformed my productivity. The neural lag is practically zero.', date: '2024-03-15' },
  { id: 'r2', userName: 'Sarah V.', rating: 4, comment: 'Sleek design, but takes some time to calibrate to your brain waves.', date: '2024-03-10' }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Neural Link X1',
    price: 2499,
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=800',
    description: 'Direct cortical interface with 10ms latency.',
    longDescription: 'The Neural Link X1 represents the pinnacle of human-computer interaction. Utilizing high-density micro-electrode arrays, it provides a seamless bridge between your conscious thought and digital environments. Engineered for professionals who require instantaneous data throughput.',
    rating: 4.9,
    reviewCount: 1240,
    isNew: true,
    isBestseller: true,
    specs: [
      { label: 'Bandwidth', value: '1.2 Tbps' },
      { label: 'Latency', value: '10ms' },
      { label: 'Battery', value: '72 Hours' },
      { label: 'Material', value: 'Liquid Titanium' }
    ],
    reviews: MOCK_REVIEWS
  },
  {
    id: '2',
    name: 'Quantum Watch',
    price: 899,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    description: 'Timekeeping powered by atomic resonance.',
    longDescription: 'Never lose a nanosecond. The Quantum Watch uses a localized cold-atom clock to maintain absolute precision. Integrated with FazerOS, it monitors your bio-metrics and atmospheric conditions in real-time.',
    rating: 4.7,
    reviewCount: 850,
    specs: [
      { label: 'Precision', value: '1e-15' },
      { label: 'Depth', value: '500m' },
      { label: 'Sync', value: 'Atomic' }
    ],
    reviews: MOCK_REVIEWS
  },
  {
    id: '3',
    name: 'Pulse Audio Buds',
    price: 349,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    description: 'Adaptive spatial audio.',
    longDescription: 'Experience sound as a physical dimension. Pulse Buds utilize sonar-mapping to adapt their soundstage to the exact geometry of your ear canal and current environment.',
    rating: 4.5,
    reviewCount: 3200,
    isNew: true,
    specs: [
      { label: 'Driver', value: 'Graphene' },
      { label: 'Noise Cancellation', value: '90dB Active' },
      { label: 'Weight', value: '4g' }
    ],
    reviews: MOCK_REVIEWS
  },
  {
    id: '4',
    name: 'Aero Glass Pro',
    price: 1599,
    category: 'Optics',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800',
    description: '8K AR overlays on a retinal level.',
    longDescription: 'The world, enhanced. Aero Glass Pro projects high-fidelity AR content directly onto your retina, eliminating the "screen door" effect of traditional headsets.',
    rating: 4.8,
    reviewCount: 520,
    specs: [
      { label: 'Resolution', value: '8K Retinal' },
      { label: 'FOV', value: '140 Degrees' },
      { label: 'Weight', value: '65g' }
    ],
    reviews: MOCK_REVIEWS
  },
  {
    id: '5',
    name: 'Titanium Shell V3',
    price: 129,
    category: 'Protection',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    description: 'Military-grade kinetic dampening.',
    longDescription: 'Ultimate protection for your tech. The Shell V3 uses non-Newtonian fluid layers that harden instantly upon impact, then return to a flexible state.',
    rating: 4.2,
    reviewCount: 45,
    specs: [
      { label: 'Impact Rating', value: 'MIL-STD-810G' },
      { label: 'Thickness', value: '1.5mm' }
    ],
    reviews: MOCK_REVIEWS
  }
];

export const CATEGORIES = ['All', 'Wearables', 'Audio', 'Optics', 'Power', 'Accessories'];
