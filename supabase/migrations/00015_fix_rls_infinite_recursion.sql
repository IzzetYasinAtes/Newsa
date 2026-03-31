-- ============================================================
-- Fix RLS infinite recursion on user_roles, roles, audit_logs
-- Root cause: user_roles and roles policies reference each other
-- causing infinite recursion when Supabase client queries with joins
-- ============================================================

-- 1. Create a SECURITY DEFINER function to check admin status
--    This bypasses RLS entirely, breaking the recursion chain
CREATE OR REPLACE FUNCTION public.is_admin_user(check_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = check_user_id
    AND role IN ('admin', 'super_admin', 'editor')
  )
$$;

-- 2. Fix user_roles policies (self-referencing: user_roles policy queried user_roles+roles)
DROP POLICY IF EXISTS "user_roles_admin_write" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_select_own" ON public.user_roles;

CREATE POLICY "user_roles_select_own" ON public.user_roles
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR is_admin_user()
  );

CREATE POLICY "user_roles_admin_write" ON public.user_roles
  FOR ALL
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- 3. Fix roles policies (self-referencing: roles policy queried user_roles+roles)
DROP POLICY IF EXISTS "roles_admin_write" ON public.roles;
DROP POLICY IF EXISTS "roles_select_all" ON public.roles;

CREATE POLICY "roles_select_all" ON public.roles
  FOR SELECT
  USING (true);

CREATE POLICY "roles_admin_write" ON public.roles
  FOR ALL
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- 4. Fix profiles ALL policy (used get_my_role() which queries profiles = recursion risk)
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL
  USING (
    auth.uid() IS NOT NULL
    AND is_admin_user()
  )
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND is_admin_user()
  );

-- 5. Fix audit_logs SELECT policy (used get_my_role() which could fail)
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;

CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND is_admin_user()
  );

-- 6. Add real user (iyasin.ates@gmail.com) to user_roles table
INSERT INTO public.user_roles (user_id, role_id, assigned_by)
SELECT
  'b165fcad-fd06-4ab8-9baa-eaf2014e7248',
  r.id,
  'b165fcad-fd06-4ab8-9baa-eaf2014e7248'
FROM public.roles r
WHERE r.name = 'admin'
ON CONFLICT DO NOTHING;
