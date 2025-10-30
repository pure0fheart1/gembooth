/**
 * Create GemBooth Products in Stripe LIVE MODE
 *
 * This script creates:
 * 1. GemBooth Pro - $9.99 AUD/month, $99.99 AUD/year
 * 2. GemBooth Premium - $19.99 AUD/month, $199.99 AUD/year
 *
 * IMPORTANT: This uses LIVE Stripe keys and will create real products
 */

import Stripe from 'stripe';

const stripe = new Stripe('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');

async function createProducts() {
  console.log('🚀 Creating products in Stripe LIVE MODE...\n');

  try {
    // ========================================
    // 1. CREATE GEMBOOTH PRO PRODUCT
    // ========================================
    console.log('📦 Creating GemBooth Pro product...');
    const proProduct = await stripe.products.create({
      name: 'GemBooth Pro',
      description: 'Professional photo booth features - 500 photos/month, 50 GIFs/month, 5GB storage, no watermarks, HD downloads, priority processing',
      metadata: {
        features: '500 photos per month, 50 GIFs per month, 5GB storage, No watermarks, HD downloads, Priority processing'
      }
    });
    console.log('✅ Pro Product created:', proProduct.id);

    // Create Pro Monthly Price ($9.99 AUD)
    console.log('💰 Creating Pro Monthly price ($9.99 AUD/month)...');
    const proMonthlyPrice = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 999, // $9.99 in cents
      currency: 'aud',
      recurring: {
        interval: 'month'
      },
      nickname: 'Pro Monthly'
    });
    console.log('✅ Pro Monthly Price created:', proMonthlyPrice.id);

    // Create Pro Yearly Price ($99.99 AUD)
    console.log('💰 Creating Pro Yearly price ($99.99 AUD/year)...');
    const proYearlyPrice = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 9999, // $99.99 in cents
      currency: 'aud',
      recurring: {
        interval: 'year'
      },
      nickname: 'Pro Yearly'
    });
    console.log('✅ Pro Yearly Price created:', proYearlyPrice.id);

    console.log('');

    // ========================================
    // 2. CREATE GEMBOOTH PREMIUM PRODUCT
    // ========================================
    console.log('📦 Creating GemBooth Premium product...');
    const premiumProduct = await stripe.products.create({
      name: 'GemBooth Premium',
      description: 'Unlimited creative power - Unlimited photos & GIFs, 50GB storage, custom branding, API access, priority support',
      metadata: {
        features: 'Unlimited photos, Unlimited GIFs, 50GB storage, Custom branding, API access, Priority support'
      }
    });
    console.log('✅ Premium Product created:', premiumProduct.id);

    // Create Premium Monthly Price ($19.99 AUD)
    console.log('💰 Creating Premium Monthly price ($19.99 AUD/month)...');
    const premiumMonthlyPrice = await stripe.prices.create({
      product: premiumProduct.id,
      unit_amount: 1999, // $19.99 in cents
      currency: 'aud',
      recurring: {
        interval: 'month'
      },
      nickname: 'Premium Monthly'
    });
    console.log('✅ Premium Monthly Price created:', premiumMonthlyPrice.id);

    // Create Premium Yearly Price ($199.99 AUD)
    console.log('💰 Creating Premium Yearly price ($199.99 AUD/year)...');
    const premiumYearlyPrice = await stripe.prices.create({
      product: premiumProduct.id,
      unit_amount: 19999, // $199.99 in cents
      currency: 'aud',
      recurring: {
        interval: 'year'
      },
      nickname: 'Premium Yearly'
    });
    console.log('✅ Premium Yearly Price created:', premiumYearlyPrice.id);

    console.log('\n========================================');
    console.log('🎉 SUCCESS! All products created in LIVE MODE');
    console.log('========================================\n');

    // ========================================
    // SUMMARY - COPY THESE PRICE IDs
    // ========================================
    console.log('📋 PRICE IDs TO UPDATE IN DATABASE:\n');
    console.log('-- GemBooth Pro');
    console.log(`UPDATE subscription_tiers`);
    console.log(`SET stripe_price_id_monthly = '${proMonthlyPrice.id}',`);
    console.log(`    stripe_price_id_yearly = '${proYearlyPrice.id}'`);
    console.log(`WHERE id = 'pro';\n`);

    console.log('-- GemBooth Premium');
    console.log(`UPDATE subscription_tiers`);
    console.log(`SET stripe_price_id_monthly = '${premiumMonthlyPrice.id}',`);
    console.log(`    stripe_price_id_yearly = '${premiumYearlyPrice.id}'`);
    console.log(`WHERE id = 'premium';\n`);

    console.log('========================================\n');
    console.log('📝 NEXT STEPS:');
    console.log('1. Copy the SQL above and run in Supabase SQL Editor');
    console.log('2. Update .env.local with live Stripe keys');
    console.log('3. Update Vercel environment variables');
    console.log('4. Update Supabase Edge Function secrets');
    console.log('5. Create new webhook endpoint in Stripe for live mode\n');

    // Return the price IDs for programmatic use
    return {
      pro: {
        product: proProduct.id,
        monthly: proMonthlyPrice.id,
        yearly: proYearlyPrice.id
      },
      premium: {
        product: premiumProduct.id,
        monthly: premiumMonthlyPrice.id,
        yearly: premiumYearlyPrice.id
      }
    };

  } catch (error) {
    console.error('❌ Error creating products:', error.message);
    throw error;
  }
}

// Run the script
createProducts()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
