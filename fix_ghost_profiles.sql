-- Delete profiles that do NOT have a corresponding user in auth.users
-- This fixes the "foreign key violation" error when sending notifications.

DELETE FROM public.profiles
WHERE id NOT IN (
    SELECT id FROM auth.users
);
