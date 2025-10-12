import { loadStripe } from '@stripe/stripe-js'

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export const SUBSCRIPTION_TIERS = {
  free: {
    id: 'free',
    name: 'Free',
    priceMonthly: 0,
    priceYearly: 0,
    photosPerMonth: 50,
    gifsPerMonth: 5,
    storageMB: 100,
    features: [
      'Basic filters',
      'Watermarked downloads',
      '50 photos per month',
      '5 GIFs per month',
      '100MB storage'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 9.99,
    priceYearly: 99.99,
    photosPerMonth: 500,
    gifsPerMonth: 50,
    storageMB: 5000,
    features: [
      'All filters',
      'No watermarks',
      'HD downloads',
      '500 photos per month',
      '50 GIFs per month',
      '5GB storage',
      'Priority processing'
    ]
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    priceMonthly: 19.99,
    priceYearly: 199.99,
    photosPerMonth: -1, // unlimited
    gifsPerMonth: -1, // unlimited
    storageMB: 50000,
    features: [
      'Unlimited photos',
      'Unlimited GIFs',
      'Custom branding',
      'API access',
      '50GB storage',
      'Priority support',
      'Commercial license'
    ]
  }
}
