-- Create subscription_plan enum
CREATE TYPE public.subscription_plan AS ENUM ('starter', 'pro', 'enterprise');

-- Add subscription_plan column to profiles
ALTER TABLE public.profiles 
ADD COLUMN subscription_plan public.subscription_plan DEFAULT 'starter';

-- Update handle_new_user to include subscription_plan and auto-admin logic
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  initial_plan public.subscription_plan := 'starter';
  initial_role public.app_role := 'user';
BEGIN
  -- Auto-assign admin if email matches
  IF NEW.email IN ('djoual.abdelhamid1@gmail.com', 'abdorenouni@gmail.com', 'mohammedbouzidi25@gmail.com') THEN
    initial_plan := 'enterprise';
    initial_role := 'admin';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, subscription_plan)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', initial_plan);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, initial_role);
  
  RETURN NEW;
END;
$$;
