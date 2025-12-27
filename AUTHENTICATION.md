# Authentication & Access Control

## How It Works

### Special Admin Emails (Free Full Access)
These 3 emails have **unrestricted access** to all 4 test types without payment:
- `djoual.abdelhamid1@gmail.com`
- `abdorenouni@gmail.com`
- `mohammedbouzidi25@gmail.com`

### Regular Users (Subscription Required)

#### Starter Plan (Free)
- ✅ **Initial Test** - Basic AI analysis via Supabase function
- ❌ Fast UI Test - Requires Pro or Enterprise
- ❌ Security Test - Requires Pro or Enterprise  
- ❌ Enterprise Pro - Requires Enterprise

#### Pro Plan
- ✅ **Initial Test**
- ✅ **Fast UI Test** - AI-powered UI stability analysis
- ✅ **Security Test** - Vulnerability scanning
- ❌ Enterprise Pro - Requires Enterprise

#### Enterprise Plan
- ✅ **All 4 Tests** - Full access to everything

## Access Logic

```typescript
const hasAccess = isAdmin || isSpecialAdmin || (
  (testType === "initial") ||
  ((testType === "fast" || testType === "security") && (plan === "pro" || plan === "enterprise")) ||
  (testType === "pro" && plan === "enterprise")
);
```

### Special Admin Check
```typescript
const specialEmails = [
  'djoual.abdelhamid1@gmail.com',
  'abdorenouni@gmail.com',
  'mohammedbouzidi25@gmail.com'
];
const isSpecialAdmin = user?.email && specialEmails.includes(user.email.toLowerCase());
```

## Supabase Configuration Required

For this to work, users need:
1. **Supabase Project** - With authentication enabled
2. **Environment Variables** - Supabase URL and anon key in `.env`
3. **Database Tables**:
   - `profiles` - User subscription plans
   - `user_roles` - Admin role assignments
   - `test_results` - Test history

## For Your Friends

Your friends will need to:
1. **Sign up** for an account on your deployed site
2. **Subscribe** to a paid plan (Pro or Enterprise) to use the 3 premium tests
3. OR you can manually upgrade their account in Supabase to `pro` or `enterprise` plan

## Admin Privileges

The 3 special emails automatically get:
- `isAdmin = true`
- `plan = "enterprise"`
- Full access to all tests
- No payment required
- Access persists even if database says otherwise (hardcoded fallback)
