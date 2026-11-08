'use client';

import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export type CommandOption = { label: string; value: string; keywords?: string[] };
export function Command({ open, onOpenChange, options, onSelect, placeholder = 'Escribe para buscar…' }: { open: boolean; onOpenChange: (open: boolean) => void; options: CommandOption[]; onSelect: (option: CommandOption) => void; placeholder?: string }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => options.filter((option) => `${option.label} ${option.keywords?.join(' ') ?? ''}`.toLowerCase().includes(query.toLowerCase())), [options, query]);
  return <Dialog open={open} onOpenChange={(next) => { onOpenChange(next); if (!next) setQuery(''); }}><DialogContent className="top-[20%] translate-y-0 p-0 sm:max-w-xl"><DialogTitle className="sr-only">Buscar</DialogTitle><div className="flex items-center gap-3 border-b px-4"><Search size={18} className="text-muted-foreground" /><Input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} className="border-0 shadow-none focus-visible:ring-0" /></div><div role="listbox" className="max-h-80 overflow-y-auto p-2">{filtered.length ? filtered.map((option) => <button type="button" role="option" key={option.value} onClick={() => { onSelect(option); onOpenChange(false); }} className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted">{option.label}</button>) : <p className="p-6 text-center text-sm text-muted-foreground">Sin resultados.</p>}</div></DialogContent></Dialog>;
}
