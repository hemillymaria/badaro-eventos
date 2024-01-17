export const ROLE = {
  SUPER_ADMIN: 'superAdmin',
  COMMON_USER: 'commonUser'
} as const


export const ROLE_PT_BR = {
  [ROLE.SUPER_ADMIN]: 'Administrador',
  [ROLE.COMMON_USER]: 'Usuário'
}
