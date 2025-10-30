# GemBooth Agent System

This directory contains specialist agent configurations for managing different aspects of the GemBooth infrastructure.

## Available Agents

### 🎯 Full-Stack Coordinator (`fullstack-coordinator.md`)
**Master orchestrator** that coordinates all specialists and handles cross-platform tasks.

**Use when:**
- Deploying new features across multiple services
- Troubleshooting issues spanning Vercel, Supabase, and Stripe
- Conducting security audits
- Managing environment variables across platforms
- Planning end-to-end feature implementations

**Key capabilities:**
- End-to-end deployment workflows
- Cross-service debugging
- Configuration management
- Emergency response coordination

---

### 💳 Stripe Specialist (`stripe-specialist.md`)
**Payment and subscription expert** for Stripe integration.

**Use when:**
- Checkout flow issues
- Webhook configuration problems
- Customer Portal setup
- Subscription state mismatches
- Payment failures or testing

**Key capabilities:**
- Subscription lifecycle management
- Webhook debugging and configuration
- Customer Portal setup
- Test card handling
- Stripe Edge Function integration

---

### 🗄️ Supabase Specialist (`supabase-specialist.md`)
**Backend infrastructure expert** for database, auth, storage, and Edge Functions.

**Use when:**
- Database schema changes
- RLS policy errors
- Edge Function development
- Storage configuration
- Authentication issues

**Key capabilities:**
- Database migrations and optimization
- Row Level Security policies
- Edge Function deployment (Deno)
- Storage bucket management
- Auth flow troubleshooting

---

### 🚀 Vercel Specialist (`vercel-specialist.md`)
**Frontend deployment expert** for build optimization and configuration.

**Use when:**
- Build failures
- Routing issues (404s)
- Environment variable problems
- Performance optimization
- Deployment configuration

**Key capabilities:**
- Build optimization
- SPA routing configuration
- Environment variable management
- Performance monitoring
- Vercel CLI operations

---

## Quick Reference

### Common Workflows

#### Deploy New Feature
1. **Coordinator** - Plan deployment sequence
2. **Supabase** - Database migrations first
3. **Supabase** - Deploy Edge Functions
4. **Stripe** - Configure products/webhooks (if needed)
5. **Vercel** - Deploy frontend last
6. **Coordinator** - Verify end-to-end

#### Fix Payment Issue
1. **Coordinator** - Identify which service is failing
2. **Stripe** - Check webhook delivery and events
3. **Supabase** - Check Edge Function logs
4. **Vercel** - Check frontend error messages
5. **Coordinator** - Trace full request path

#### Add Subscription Tier
1. **Stripe** - Create product and price
2. **Supabase** - Add to `subscription_tiers` table
3. **Vercel** - Update pricing page
4. **Coordinator** - End-to-end test

### Environment Variables Map

| Variable | Local (.env.local) | Vercel | Supabase Secrets |
|----------|-------------------|--------|------------------|
| `VITE_SUPABASE_URL` | ✅ | ✅ | ❌ |
| `VITE_SUPABASE_ANON_KEY` | ✅ | ✅ | ❌ |
| `VITE_STRIPE_PUBLISHABLE_KEY` | ✅ | ✅ | ❌ |
| `GEMINI_API_KEY` | ✅ | ❌ | ✅ |
| `STRIPE_SECRET_KEY` | ✅ | ❌ | ✅ |
| `STRIPE_WEBHOOK_SECRET` | ❌ | ❌ | ✅ |

### Log Locations

| Service | Where to Check |
|---------|---------------|
| **Vercel Build** | Dashboard → Deployments → [deployment] → Build Logs |
| **Vercel Runtime** | Dashboard → Deployments → [deployment] → Function Logs |
| **Supabase Edge Functions** | Dashboard → Logs → Edge Functions or `supabase functions logs [name]` |
| **Supabase Database** | Dashboard → Logs → Postgres |
| **Supabase Auth** | Dashboard → Logs → Auth |
| **Stripe Webhooks** | Dashboard → Developers → Webhooks → [endpoint] → Events |
| **Stripe API** | Dashboard → Developers → Logs |

### Deployment Order

```
1. Database (Supabase)     → supabase db push
2. Edge Functions          → supabase functions deploy
3. Stripe Config           → Manual in Dashboard
4. Frontend (Vercel)       → vercel --prod
5. Verification            → End-to-end test
```

### Emergency Contacts

| Issue Type | First Responder | Backup |
|------------|----------------|---------|
| Payment broken | Stripe Specialist | Coordinator |
| Database error | Supabase Specialist | Coordinator |
| Build failure | Vercel Specialist | Coordinator |
| Multi-service | Coordinator | All specialists |
| Security breach | Coordinator | All specialists |

## Using These Agents

### For Individual Tasks
Select the appropriate specialist based on the service you're working with:
- Working on checkout? → Stripe Specialist
- Writing a migration? → Supabase Specialist
- Fixing build errors? → Vercel Specialist

### For Complex Features
Start with the Full-Stack Coordinator to:
1. Plan the deployment sequence
2. Identify which specialists to involve
3. Coordinate work across services
4. Verify integration after deployment

### For Debugging
1. **Coordinator** identifies which service is failing
2. Delegate to appropriate **Specialist** for investigation
3. **Coordinator** traces request path if cross-service
4. **Specialist** implements fix
5. **Coordinator** verifies fix works end-to-end

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│              Full-Stack Coordinator                      │
│  Orchestrates cross-platform tasks & deployments        │
└──────────┬──────────────────┬──────────────┬───────────┘
           │                  │              │
           ▼                  ▼              ▼
┌──────────────────┐ ┌────────────────┐ ┌────────────────┐
│ Stripe Specialist│ │Supabase Spec.  │ │Vercel Specialist│
│                  │ │                │ │                │
│ - Subscriptions  │ │ - Database     │ │ - Deployment   │
│ - Webhooks       │ │ - Edge Funcs   │ │ - Build        │
│ - Portal         │ │ - Auth/Storage │ │ - Env Vars     │
│ - Payments       │ │ - RLS Policies │ │ - Performance  │
└──────────────────┘ └────────────────┘ └────────────────┘
```

## Tips for Using Agents

1. **Start with the right agent** - Don't use Coordinator for simple single-service tasks
2. **Escalate when needed** - If an issue spans services, escalate to Coordinator
3. **Follow deployment order** - Always do Database → Functions → Stripe → Frontend
4. **Check logs systematically** - Each specialist knows their service's logs
5. **Coordinate for features** - Use Coordinator for planning multi-service features

## File Organization

```
.claude/agents/
├── README.md                    # This file
├── fullstack-coordinator.md     # Master orchestrator
├── stripe-specialist.md         # Payment expert
├── supabase-specialist.md       # Backend expert
└── vercel-specialist.md         # Frontend expert
```

## Quick Commands

```bash
# View all agents
ls .claude/agents/

# Read an agent
cat .claude/agents/stripe-specialist.md

# Search agents for keyword
grep -r "webhook" .claude/agents/

# Open in editor
code .claude/agents/
```

---

**Need help choosing an agent?**

Ask yourself:
- Is this a single-service task? → Use the specific **Specialist**
- Does it span multiple services? → Use the **Coordinator**
- Not sure? → Start with **Coordinator**, they'll delegate
