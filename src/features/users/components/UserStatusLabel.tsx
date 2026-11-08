export function UserStatusLabel({ active }: { active: boolean }) { return <span className={active ? 'text-emerald-600' : 'text-muted-foreground'}>{active ? 'Activo' : 'Inactivo'}</span>; }
