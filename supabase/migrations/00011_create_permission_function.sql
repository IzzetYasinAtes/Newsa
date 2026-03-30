-- ============================================================
-- has_permission() fonksiyonu
-- Kullanıcının belirli bir permission'a sahip olup olmadığını kontrol eder.
-- Öncelik sırası:
--   1. super_admin rolü → daima true
--   2. user_permissions override → granted değerini döndür
--   3. role_permissions → varsa true, yoksa false
-- ============================================================

CREATE OR REPLACE FUNCTION public.has_permission(
  p_user_id   UUID,
  p_permission TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_is_super_admin  BOOLEAN;
  v_user_override   BOOLEAN;
  v_role_has_perm   BOOLEAN;
BEGIN
  -- 1. super_admin kontrolü
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = p_user_id
      AND r.name = 'super_admin'
  ) INTO v_is_super_admin;

  IF v_is_super_admin THEN
    RETURN true;
  END IF;

  -- 2. Kullanıcıya özgü permission override
  SELECT up.granted
  INTO v_user_override
  FROM public.user_permissions up
  JOIN public.permissions p ON p.id = up.permission_id
  WHERE up.user_id = p_user_id
    AND p.name = p_permission
  LIMIT 1;

  IF FOUND THEN
    RETURN v_user_override;
  END IF;

  -- 3. Rol üzerinden permission kontrolü
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role_id = ur.role_id
    JOIN public.permissions perm ON perm.id = rp.permission_id
    WHERE ur.user_id = p_user_id
      AND perm.name = p_permission
  ) INTO v_role_has_perm;

  RETURN COALESCE(v_role_has_perm, false);
END;
$$;

-- Fonksiyona authenticated kullanıcıların erişimini ver
GRANT EXECUTE ON FUNCTION public.has_permission(UUID, TEXT) TO authenticated;
