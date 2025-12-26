-- Add admin roles and enterprise plans for the specified users
-- This works by checking if the user exists in profiles and updating them.
-- If they haven't signed up yet, this will be handled by the trigger (but we can pre-emptively whitelist them if needed)

-- Update existing admins if they already signed up
UPDATE public.profiles 
SET subscription_plan = 'enterprise'
WHERE email IN ('djoual.abdelhamid1@gmail.com', 'abdorenouni@gmail.com', 'mohammedbouzidi25@gmail.com');

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM public.profiles
WHERE email IN ('djoual.abdelhamid1@gmail.com', 'abdorenouni@gmail.com', 'mohammedbouzidi25@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;
