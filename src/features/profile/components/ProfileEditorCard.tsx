'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Camera, KeyRound, Save } from 'lucide-react';
import { authApi } from '@/features/auth/api/auth.api';
import { profileApi } from '../api/profile.api';

type Props = {
  initialName: string;
  initialEmail: string;
  initialWhatsapp: string;
  onUpdated?: () => void;
};

export function ProfileEditorCard({ initialName, initialEmail, initialWhatsapp, onUpdated }: Props) {
  const [nombreCompleto, setNombreCompleto] = useState(initialName);
  const [correo, setCorreo] = useState(initialEmail);
  const [whatsapp, setWhatsapp] = useState(initialWhatsapp);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [profileErr, setProfileErr] = useState<string | null>(null);

  const [passwordActual, setPasswordActual] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<string | null>(null);
  const [pwdErr, setPwdErr] = useState<string | null>(null);

  async function handleSaveProfile(event: FormEvent) {
    event.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    setProfileErr(null);
    try {
      await profileApi.updateMe({ nombreCompleto, correo, whatsapp });
      setProfileMsg('Perfil actualizado correctamente.');
      onUpdated?.();
    } catch (err) {
      setProfileErr(err instanceof Error ? err.message : 'No se pudo actualizar el perfil.');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setProfileMsg(null);
    setProfileErr(null);
    try {
      await profileApi.uploadPhoto(file);
      setProfileMsg('Foto de perfil actualizada.');
      onUpdated?.();
    } catch (err) {
      setProfileErr(err instanceof Error ? err.message : 'No se pudo subir la foto.');
    }
  }

  async function handleChangePassword(event: FormEvent) {
    event.preventDefault();
    setSavingPwd(true);
    setPwdMsg(null);
    setPwdErr(null);
    try {
      const res = await authApi.changePassword(passwordActual, nuevaPassword, confirmarPassword);
      setPwdMsg(res.mensaje);
      setPasswordActual('');
      setNuevaPassword('');
      setConfirmarPassword('');
    } catch (err) {
      setPwdErr(err instanceof Error ? err.message : 'No se pudo cambiar la contraseña.');
    } finally {
      setSavingPwd(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form onSubmit={handleSaveProfile} className="sf-network-panel space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="m-0">Editar perfil</h2>
          <label className="inline-flex items-center gap-1.5 text-sm cursor-pointer opacity-80 hover:opacity-100">
            <Camera size={16} />
            <span>Cambiar foto</span>
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePhotoChange} className="hidden" />
          </label>
        </div>
        <div className="space-y-2">
          <label className="block text-sm opacity-80">Nombre completo</label>
          <input value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} required className="w-full rounded-md border px-3 py-2 bg-transparent" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm opacity-80">Correo</label>
          <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required className="w-full rounded-md border px-3 py-2 bg-transparent" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm opacity-80">WhatsApp</label>
          <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+51999888777" className="w-full rounded-md border px-3 py-2 bg-transparent" />
        </div>
        {profileMsg && <p className="text-sm text-emerald-400">{profileMsg}</p>}
        {profileErr && <p className="text-sm text-red-400">{profileErr}</p>}
        <button type="submit" disabled={savingProfile} className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50">
          <Save size={16} /> {savingProfile ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>

      <form onSubmit={handleChangePassword} className="sf-network-panel space-y-4">
        <div className="flex items-center gap-2">
          <KeyRound size={18} />
          <h2 className="m-0">Cambiar contraseña</h2>
        </div>
        <div className="space-y-2">
          <label className="block text-sm opacity-80">Contraseña actual</label>
          <input type="password" value={passwordActual} onChange={(e) => setPasswordActual(e.target.value)} required className="w-full rounded-md border px-3 py-2 bg-transparent" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm opacity-80">Nueva contraseña</label>
          <input type="password" minLength={6} value={nuevaPassword} onChange={(e) => setNuevaPassword(e.target.value)} required className="w-full rounded-md border px-3 py-2 bg-transparent" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm opacity-80">Confirmar nueva contraseña</label>
          <input type="password" minLength={6} value={confirmarPassword} onChange={(e) => setConfirmarPassword(e.target.value)} required className="w-full rounded-md border px-3 py-2 bg-transparent" />
        </div>
        {pwdMsg && <p className="text-sm text-emerald-400">{pwdMsg}</p>}
        {pwdErr && <p className="text-sm text-red-400">{pwdErr}</p>}
        <button type="submit" disabled={savingPwd} className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50">
          <KeyRound size={16} /> {savingPwd ? 'Actualizando...' : 'Actualizar contraseña'}
        </button>
      </form>
    </div>
  );
}
