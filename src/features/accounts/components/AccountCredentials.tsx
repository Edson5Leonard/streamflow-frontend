'use client';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { CopyButton } from '@/components/data-display/CopyButton';
import type { Account } from '../types/accounts.types';
export function AccountCredentials({ account }: { account: Account }) { const [visible, setVisible] = useState(false); return <div className="space-y-3 rounded-xl bg-slate-50 p-4 text-sm dark:bg-white/5"><div className="flex items-center justify-between gap-3"><span className="break-all">{account.correo}</span><CopyButton value={account.correo} /></div><div className="flex items-center justify-between gap-3"><span>{visible ? account.password : '••••••••'}</span><div className="flex items-center"><button type="button" aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setVisible(!visible)} className="rounded-lg p-2 hover:bg-muted">{visible ? <EyeOff size={16} /> : <Eye size={16} />}</button><CopyButton value={account.password} /></div></div>{account.perfilPin && <p className="text-muted-foreground">Perfil / PIN: {account.perfilPin}</p>}</div>; }
