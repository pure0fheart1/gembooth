/**
 * Script to fetch Stripe product prices and generate SQL update statements
 * Run with: node get-stripe-prices.js
 */

import Stripe from 'stripe';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env.local') });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function getStripePrices() {
  console.log('\n🔍 Fetching Stripe products and prices...\n');

  try {
    // Fetch all products with their prices
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    });

    const priceMap = {
      pro: { monthly: null, yearly: null },
      premium: { monthly: null, yearly: null }
    };

    // Fetch prices for each product
    for (const product of products.data) {
      console.log(`📦 Product: ${product.name}`);

      const prices = await stripe.prices.list({
        product: product.id,
        active: true,
      });

      prices.data.forEach(price => {
        const amount = (price.unit_amount / 100).toFixed(2);
        const interval = price.recurring?.interval || 'one-time';

        console.log(`   💰 ${amount} ${price.currency.toUpperCase()} per ${interval}`);
        console.log(`   🔑 Price ID: ${price.id}`);
        console.log('');

        // Map to tier based on product name and interval
        const productName = product.name.toLowerCase();

        if (productName.includes('pro') && !productName.includes('premium')) {
          if (interval === 'month') {
            priceMap.pro.monthly = price.id;
          } else if (interval === 'year') {
            priceMap.pro.yearly = price.id;
          }
        } else if (productName.includes('premium')) {
          if (interval === 'month') {
            priceMap.premium.monthly = price.id;
          } else if (interval === 'year') {
            priceMap.premium.yearly = price.id;
          }
        }
      });
    }

    console.log('─'.repeat(80));
    console.log('\n✅ Price IDs identified:\n');

    console.log('Pro Plan:');
    console.log(`  Monthly: ${priceMap.pro.monthly || '❌ NOT FOUND'}`);
    console.log(`  Yearly:  ${priceMap.pro.yearly || '❌ NOT FOUND'}`);

    console.log('\nPremium Plan:');
    console.log(`  Monthly: ${priceMap.premium.monthly || '❌ NOT FOUND'}`);
    console.log(`  Yearly:  ${priceMap.premium.yearly || '❌ NOT FOUND'}`);

    console.log('\n─'.repeat(80));
    console.log('\n📋 SQL UPDATE STATEMENTS:\n');
    console.log('Copy and paste this into Supabase SQL Editor:\n');
    console.log('─'.repeat(80));
    console.log(`
-- Update Pro tier price IDs
UPDATE subscription_tiers
SET
  stripe_price_id_monthly = '${priceMap.pro.monthly}',
  stripe_price_id_yearly = '${priceMap.pro.yearly}'
WHERE id = 'pro';

-- Update Premium tier price IDs
UPDATE subscription_tiers
SET
  stripe_price_id_monthly = '${priceMap.premium.monthly}',
  stripe_price_id_yearly = '${priceMap.premium.yearly}'
WHERE id = 'premium';

-- Verify the updates
SELECT id, name, stripe_price_id_monthly, stripe_price_id_yearly
FROM subscription_tiers;
    `);
    console.log('─'.repeat(80));
    console.log('\n✅ Done! Copy the SQL above and run it in Supabase.\n');

  } catch (error) {
    console.error('❌ Error fetching Stripe data:', error.message);

    if (error.type === 'StripeAuthenticationError') {
      console.error('\n💡 Make sure your STRIPE_SECRET_KEY is set correctly in .env.local');
    }
  }
}

getStripePrices();
