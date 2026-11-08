'use client';
import { useState } from 'react';
import { useMyMemberships } from '@/features/memberships/hooks/useMyMemberships';
import { MembershipPaymentForm } from '@/features/memberships/components/MembershipPaymentForm';
import { MembershipCard } from '@/features/memberships/components/MembershipCard';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { MEMBERSHIP_AMOUNT } from '@/features/memberships/constants/memberships.constants';
import { formatCurrency } from '@/utils/format-currency';
import { DistributorCover } from '../componentes/DistributorCover';
import { FadeIn } from '@/components/animation/FadeIn';
export default function MembershipPage() { const memberships = useMyMemberships(); const [message, setMessage] = useState(''); if (memberships.isLoading) return <LoadingState />; if (memberships.error) return <ErrorState description={memberships.error.message} onRetry={() => void memberships.refetch()} />; const pending = memberships.data?.some((item) => item.estado === 'PENDIENTE'); return <FadeIn className="space-y-6"><DistributorCover title="Membresía" description="Consulta tus solicitudes de renovación y adjunta un comprobante para su revisión." value={formatCurrency(MEMBERSHIP_AMOUNT)} label="monto de renovación" />{message && <p role="status" className="text-sm text-emerald-600">{message}</p>}<div className="grid items-start gap-5 lg:grid-cols-2">{pending ? <div className="rounded-2xl border bg-card p-5 text-sm text-muted-foreground">Ya tienes una solicitud pendiente de revisión.</div> : <MembershipPaymentForm onSuccess={() => setMessage('Comprobante enviado para revisión.')} />}<section className="sf-dist-panel"><h2 className="mb-4 text-xl font-bold">Historial de pagos</h2>{memberships.data?.length ? <div className="space-y-4">{[...memberships.data].sort((a,b) => b.fechaSolicitud.localeCompare(a.fechaSolicitud)).map((item) => <MembershipCard key={item.id} membership={item} />)}</div> : <p className="rounded-2xl border bg-card p-5 text-sm text-muted-foreground">Aún no hay pagos registrados.</p>}</section></div></FadeIn>; }
