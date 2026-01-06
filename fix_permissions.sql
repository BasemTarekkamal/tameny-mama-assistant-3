-- Enable RLS on the table (if not already enabled)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 1. Allow Authenticated Users to INSERT notifications
-- This allows any logged-in user (like your admin account) to create a notification.
DROP POLICY IF EXISTS "Allow authenticated users to insert notifications" ON public.notifications;
CREATE POLICY "Allow authenticated users to insert notifications"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK (true);

-- 2. Allow Authenticated Users to SELECT users (profiles)
-- This allows reading the list of users to send notifications to them.
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.profiles;
CREATE POLICY "Enable read access for authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (true);
