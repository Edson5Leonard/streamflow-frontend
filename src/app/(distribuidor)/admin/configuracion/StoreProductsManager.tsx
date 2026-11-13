'use client';

import { useMemo, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { Eye, LoaderCircle, Pencil, Plus, Search, Trash2, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useServices } from '@/features/services/hooks/useServices';
import type { Service } from '@/features/services/types/services.types';
import { getStoreImageSrc } from '@/features/stores/utils/stores.utils';
import { storesService } from '@/features/stores/services/stores.service';
import { useStoreSettingsMutation } from '@/features/stores/hooks/useStoreSettingsMutation';
import type { StoreProduct } from '@/features/stores/types/stores.types';
import { formatCurrency } from '@/utils/format-currency';

type ProductInput = Pick<StoreProduct, 'precio' | 'descripcion' | 'imagenUrl'>;

export function StoreProductsManager({ products }: { products: StoreProduct[] }) {
  const services = useServices(true);
  const mutation = useStoreSettingsMutation();
  const [search, setSearch] = useState('');
  const [editor, setEditor] = useState<{ mode: 'create' } | { mode: 'edit'; product: StoreProduct } | null>(null);
  const [details, setDetails] = useState<StoreProduct | null>(null);
  const [deleting, setDeleting] = useState<StoreProduct | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const visibleServiceIds = useMemo(() => new Set(products.map((product) => product.servicioId)), [products]);
  const availableServices = (services.data ?? []).filter((service) => !visibleServiceIds.has(service.id));
  const filteredProducts = products.filter((product) => {
    const text = `${product.nombre} ${product.categoria} ${product.plataforma ?? ''}`.toLocaleLowerCase();
    return text.includes(search.trim().toLocaleLowerCase());
  });

  async function saveProduct(serviceId: string, input: ProductInput) {
    setError('');
    setMessage('');
    try {
      await mutation.mutateAsync(() => editor?.mode === 'edit'
        ? storesService.updateProduct(serviceId, input)
        : storesService.createProduct(serviceId, input));
      setEditor(null);
      setMessage(editor?.mode === 'edit' ? 'Producto actualizado.' : 'Producto agregado al catálogo.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo guardar el producto.');
      throw reason;
    }
  }

  async function removeProduct() {
    if (!deleting) return;
    setError('');
    setMessage('');
    try {
      await mutation.mutateAsync(() => storesService.deleteProduct(deleting.servicioId));
      setMessage('Producto retirado del catálogo de tu tienda.');
      setDeleting(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo retirar el producto.');
    }
  }

  return (
    <section className="space-y-4 rounded-2xl border bg-card p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Catálogo de productos</h2>
          <p className="text-sm text-muted-foreground">Administra los productos que aparecen en tu tienda pública.</p>
        </div>
        <button
          type="button"
          disabled={services.isLoading || availableServices.length === 0}
          onClick={() => { setError(''); setEditor({ mode: 'create' }); }}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white disabled:opacity-50"
        >
          <Plus size={16} /> Agregar producto
        </button>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="pointer-events-none absolute left-3 top-3 text-muted-foreground" />
        <input
          aria-label="Buscar productos"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por producto o plataforma..."
          className="h-10 w-full rounded-xl border bg-background pl-9 pr-3 text-sm"
        />
      </div>

      {message && <p role="status" className="text-sm text-emerald-600">{message}</p>}
      {error && !editor && !deleting && <p role="alert" className="text-sm text-red-500">{error}</p>}
      {services.error && <p role="alert" className="text-sm text-red-500">{services.error.message}</p>}
      {services.isLoading ? (
        <p role="status" className="text-sm text-muted-foreground">Cargando servicios...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="rounded-xl border p-5 text-sm text-muted-foreground">
          {products.length === 0 ? 'Aún no agregas productos a tu tienda.' : 'No hay productos que coincidan con la búsqueda.'}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3">Producto</th>
                <th scope="col" className="px-4 py-3">Tipo</th>
                <th scope="col" className="px-4 py-3">Stock</th>
                <th scope="col" className="px-4 py-3">Precio de venta</th>
                <th scope="col" className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.map((product) => (
                <tr key={product.servicioId}>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{product.nombre}</p>
                    <p className="text-xs text-muted-foreground">{product.plataforma ?? product.categoria}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {product.tipoPlan ?? 'Sin tipo'}{product.duracionMeses ? ` · ${product.duracionMeses} mes(es)` : ''}
                  </td>
                  <td className="px-4 py-3">{product.stockDisponible}</td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(product.precio)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button type="button" aria-label={`Ver ${product.nombre}`} onClick={() => setDetails(product)} className="rounded-lg border p-2"><Eye size={15} /></button>
                      <button type="button" aria-label={`Editar ${product.nombre}`} onClick={() => { setError(''); setEditor({ mode: 'edit', product }); }} className="rounded-lg border p-2"><Pencil size={15} /></button>
                      <button type="button" aria-label={`Retirar ${product.nombre}`} onClick={() => { setError(''); setDeleting(product); }} className="rounded-lg border border-red-500/30 p-2 text-red-500"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {availableServices.length === 0 && !services.isLoading && products.length > 0 && (
        <p className="text-xs text-muted-foreground">No hay otros servicios activos para agregar. Los servicios retirados pueden volver a agregarse.</p>
      )}

      <Dialog open={editor !== null} onOpenChange={(open) => { if (!open && !mutation.isPending) setEditor(null); }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          {editor && (
            <ProductEditorForm
              key={editor.mode === 'edit' ? editor.product.servicioId : 'create'}
              mode={editor.mode}
              product={editor.mode === 'edit' ? editor.product : undefined}
              services={services.data ?? []}
              availableServices={availableServices}
              saving={mutation.isPending}
              onCancel={() => setEditor(null)}
              onSave={saveProduct}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={details !== null} onOpenChange={(open) => { if (!open) setDetails(null); }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {details && <ProductDetails product={details} />}
        </DialogContent>
      </Dialog>

      <Dialog open={deleting !== null} onOpenChange={(open) => { if (!open && !mutation.isPending) setDeleting(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Retirar producto</DialogTitle>
          <DialogDescription>
            {deleting ? `${deleting.nombre} dejará de aparecer en tu tienda. El servicio global y el inventario no se borrarán.` : ''}
          </DialogDescription>
          {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setDeleting(null)} className="rounded-lg border px-3 py-2 text-sm">Cancelar</button>
            <button type="button" disabled={mutation.isPending} onClick={() => void removeProduct()} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">
              {mutation.isPending ? 'Retirando...' : 'Retirar de mi tienda'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function ProductEditorForm({
  mode,
  product,
  services,
  availableServices,
  saving,
  onCancel,
  onSave,
}: {
  mode: 'create' | 'edit';
  product?: StoreProduct;
  services: Service[];
  availableServices: Service[];
  saving: boolean;
  onCancel: () => void;
  onSave: (serviceId: string, input: ProductInput) => Promise<void>;
}) {
  const options = mode === 'create' ? availableServices : services;
  const [serviceId, setServiceId] = useState(product?.servicioId ?? availableServices[0]?.id ?? '');
  const selectedService = services.find((service) => service.id === serviceId)
    ?? availableServices.find((service) => service.id === serviceId);
  const defaultPrice = selectedService
    ? Math.max(selectedService.precioMayorista, selectedService.precioMinimoVenta ?? 0)
    : 0;
  const [price, setPrice] = useState(product ? String(product.precio) : defaultPrice.toFixed(2));
  const [description, setDescription] = useState(product?.descripcion ?? selectedService?.descripcion ?? '');
  const [imageUrl, setImageUrl] = useState(product?.imagenUrl ?? null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  function changeService(id: string) {
    setServiceId(id);
    const service = availableServices.find((item) => item.id === id);
    if (!service) return;
    setPrice(Math.max(service.precioMayorista, service.precioMinimoVenta ?? 0).toFixed(2));
    setDescription(service.descripcion ?? '');
    setImageUrl(null);
  }

  async function upload(file?: File) {
    if (!file || !serviceId) return;
    setError('');
    setUploading(true);
    try {
      setImageUrl(await storesService.uploadImage(file, 'producto', serviceId));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo subir la imagen.');
    } finally {
      setUploading(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    try {
      await onSave(serviceId, {
        precio: Number(price),
        descripcion: description.trim() || null,
        imagenUrl: imageUrl,
      });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo guardar el producto.');
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <DialogTitle>{mode === 'create' ? 'Agregar producto a la tienda' : 'Editar producto'}</DialogTitle>
      <DialogDescription>Configura el precio y la información que verá el comprador.</DialogDescription>
      <label className="block space-y-1 text-sm font-medium">
        Servicio del catálogo
        <select required disabled={mode === 'edit' || options.length === 0} value={serviceId} onChange={(event) => changeService(event.target.value)} className="h-10 w-full rounded-xl border bg-background px-3">
          <option value="" disabled>Selecciona un servicio</option>
          {options.map((service) => <option key={service.id} value={service.id}>{service.nombre} · {service.plataforma ?? service.categoria}</option>)}
        </select>
      </label>
      {mode === 'create' && options.length === 0 && <p className="text-sm text-muted-foreground">No hay servicios activos disponibles para agregar.</p>}
      <label className="block space-y-1 text-sm font-medium">
        Precio de venta (S/)
        <input required type="number" min={selectedService?.precioMinimoVenta ?? 0.01} step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} className="h-10 w-full rounded-xl border bg-background px-3" />
      </label>
      {selectedService?.precioMinimoVenta != null && <p className="-mt-3 text-xs text-muted-foreground">Mínimo permitido: S/ {selectedService.precioMinimoVenta.toFixed(2)}.</p>}
      <label className="block space-y-1 text-sm font-medium">
        Descripción breve
        <textarea maxLength={1000} value={description} onChange={(event) => setDescription(event.target.value)} className="min-h-24 w-full rounded-xl border bg-background px-3 py-2" />
      </label>
      <div className="space-y-2 text-sm font-medium">
        <span>Imagen del producto</span>
        <div className="flex flex-wrap items-center gap-3">
          <ProductImage url={imageUrl} alt="Imagen del producto" />
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold">
            {uploading ? <LoaderCircle size={14} className="animate-spin" /> : <Upload size={14} />} Subir imagen
            <input hidden type="file" accept="image/png,image/jpeg,image/webp" disabled={uploading || !serviceId} onChange={(event) => void upload(event.target.files?.[0])} />
          </label>
          {imageUrl && <button type="button" className="text-xs underline" onClick={() => setImageUrl(null)}>Quitar imagen</button>}
        </div>
        <p className="text-xs font-normal text-muted-foreground">PNG, JPG o WEBP, máximo 5 MB.</p>
      </div>
      {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-lg border px-3 py-2 text-sm">Cancelar</button>
        <button type="submit" disabled={saving || uploading || !serviceId} className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
          {saving ? 'Guardando...' : mode === 'create' ? 'Agregar producto' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  );
}

function ProductDetails({ product }: { product: StoreProduct }) {
  return (
    <>
      <DialogTitle>{product.nombre}</DialogTitle>
      <DialogDescription>Información del producto en tu tienda.</DialogDescription>
      <ProductImage url={product.imagenUrl} alt={`Imagen de ${product.nombre}`} />
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <Detail label="Plataforma" value={product.plataforma ?? product.categoria} />
        <Detail label="Tipo" value={product.tipoPlan ?? 'No especificado'} />
        <Detail label="Duración" value={product.duracionMeses ? `${product.duracionMeses} mes(es)` : 'No especificada'} />
        <Detail label="Stock disponible" value={String(product.stockDisponible)} />
        <Detail label="Precio de venta" value={formatCurrency(product.precio)} />
        <Detail label="Dispositivos" value={product.cantidadDispositivos == null ? 'No especificado' : String(product.cantidadDispositivos)} />
        <Detail label="Perfiles" value={product.cantidadPerfiles == null ? 'No especificado' : String(product.cantidadPerfiles)} />
        <div className="sm:col-span-2"><dt className="text-muted-foreground">Descripción</dt><dd className="mt-1 whitespace-pre-wrap">{product.descripcion || 'Sin descripción.'}</dd></div>
      </dl>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-muted-foreground">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div>;
}

function ProductImage({ url, alt }: { url: string | null; alt: string }) {
  const src = getStoreImageSrc(url);
  return src ? <Image unoptimized src={src} alt={alt} width={192} height={144} className="max-h-36 max-w-48 rounded-xl border object-contain" /> : null;
}
