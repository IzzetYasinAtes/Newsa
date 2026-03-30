-- ============================================================
-- RBAC Tables: roles, permissions, role_permissions, user_roles, user_permissions
-- ============================================================

-- Roles tablosu
CREATE TABLE IF NOT EXISTS public.roles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL UNIQUE,
  display_name    TEXT NOT NULL,
  description     TEXT,
  is_system       BOOLEAN NOT NULL DEFAULT false,
  hierarchy_level INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Permissions tablosu
CREATE TABLE IF NOT EXISTS public.permissions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description  TEXT,
  module       TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Role - Permission ilişki tablosu
CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id       UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- Kullanıcı - Rol ilişki tablosu
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id     UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

-- Kullanıcı - Permission override tablosu
CREATE TABLE IF NOT EXISTS public.user_permissions (
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  granted       BOOLEAN NOT NULL DEFAULT true,
  assigned_by   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, permission_id)
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id       ON public.role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON public.role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id             ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id             ON public.user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id       ON public.user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_permissions_module             ON public.permissions(module);

-- ============================================================
-- updated_at trigger for roles
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_roles_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS roles_updated_at ON public.roles;
CREATE TRIGGER roles_updated_at
  BEFORE UPDATE ON public.roles
  FOR EACH ROW EXECUTE FUNCTION public.update_roles_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE public.roles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions  ENABLE ROW LEVEL SECURITY;

-- roles: herkes okuyabilir, sadece adminler yazabilir
CREATE POLICY "roles_select_all" ON public.roles
  FOR SELECT USING (true);

CREATE POLICY "roles_admin_write" ON public.roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
        AND r.name IN ('super_admin', 'admin')
    )
  );

-- permissions: herkes okuyabilir, sadece adminler yazabilir
CREATE POLICY "permissions_select_all" ON public.permissions
  FOR SELECT USING (true);

CREATE POLICY "permissions_admin_write" ON public.permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
        AND r.name IN ('super_admin', 'admin')
    )
  );

-- role_permissions: herkes okuyabilir, adminler yazabilir
CREATE POLICY "role_permissions_select_all" ON public.role_permissions
  FOR SELECT USING (true);

CREATE POLICY "role_permissions_admin_write" ON public.role_permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
        AND r.name IN ('super_admin', 'admin')
    )
  );

-- user_roles: kullanıcı kendi rollerini görebilir, adminler tümünü yönetebilir
CREATE POLICY "user_roles_select_own" ON public.user_roles
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
        AND r.name IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "user_roles_admin_write" ON public.user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
        AND r.name IN ('super_admin', 'admin')
    )
  );

-- user_permissions: kullanıcı kendi permission overridelerini görebilir, adminler tümünü yönetebilir
CREATE POLICY "user_permissions_select_own" ON public.user_permissions
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
        AND r.name IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "user_permissions_admin_write" ON public.user_permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
        AND r.name IN ('super_admin', 'admin')
    )
  );
