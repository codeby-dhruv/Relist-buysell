import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, Sparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@components/ui/Button';
import { categories, conditions } from '@constants/categories';
import { copy } from '@constants/languages';
import { useAppStore } from '@store/useAppStore';

const productSchema = z.object({
  title: z.string().min(6, 'Use a descriptive title'),
  price: z.coerce.number().min(1, 'Price is required'),
  category: z.string().min(1, 'Choose a category'),
  condition: z.string().min(1, 'Choose condition'),
  location: z.string().min(2, 'Location is required'),
  description: z.string().min(30, 'Add a little more detail')
});

export type ProductFormValues = z.infer<typeof productSchema>;

export function ProductForm() {
  const [images, setImages] = useState<Array<{ file: File; url: string }>>([]);
  const language = useAppStore((state) => state.language);
  const t = copy[language];
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category: 'electronics',
      condition: 'good'
    }
  });

  function onSubmit(values: ProductFormValues) {
    console.info('Product ready for Firebase createProduct()', { ...values, images: images.map((image) => image.file.name) });
  }

  function handleImages(files: FileList | null) {
    if (!files) return;
    const nextFiles = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, 3 - images.length)
      .map((file) => ({ file, url: URL.createObjectURL(file) }));
    setImages((current) => [...current, ...nextFiles].slice(0, 3));
  }

  function removeImage(url: string) {
    setImages((current) => {
      const image = current.find((item) => item.url === url);
      if (image) URL.revokeObjectURL(image.url);
      return current.filter((item) => item.url !== url);
    });
  }

  const canUploadMore = images.length < 3;
  const progress = useMemo(() => `${images.length}/3`, [images.length]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 rounded-[30px] bg-white p-4 shadow-sm dark:bg-black md:border md:border-slate-200 md:p-6 md:dark:border-white/10 lg:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        <div>
          <label className="text-sm font-bold">Title</label>
          <input className="field mt-2" placeholder="Apple Studio Display, walnut desk, road bike..." {...register('title')} />
          <ErrorText message={errors.title?.message} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-bold">Price</label>
            <input className="field mt-2" type="number" placeholder="450" {...register('price')} />
            <ErrorText message={errors.price?.message} />
          </div>
          <div>
            <label className="text-sm font-bold">Location</label>
            <input className="field mt-2" placeholder="Brooklyn, NY" {...register('location')} />
            <ErrorText message={errors.location?.message} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-bold">Category</label>
            <select className="field mt-2" {...register('category')}>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-bold">Condition</label>
            <select className="field mt-2" {...register('condition')}>
              {conditions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-bold">Description</label>
          <textarea className="field mt-2 min-h-36 resize-none" placeholder="Tell buyers what matters: condition, included accessories, pickup options." {...register('description')} />
          <ErrorText message={errors.description?.message} />
        </div>
      </div>
      <aside className="space-y-4">
        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-black">{t.uploadPhotos}</p>
              <p className="text-xs font-semibold text-slate-500">{t.maxPhotos}</p>
            </div>
            <span className="rounded-full bg-black px-3 py-1 text-xs font-black text-white dark:bg-white dark:text-black">{progress}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {images.map((image, index) => (
              <div key={image.url} className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-200">
                <img src={image.url} alt={`Upload ${index + 1}`} className="h-full w-full object-cover" />
                {index === 0 && <span className="absolute left-1.5 top-1.5 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-black">Cover</span>}
                <button type="button" onClick={() => removeImage(image.url)} className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-black/65 text-white">
                  <X className="size-4" />
                </button>
              </div>
            ))}

            {canUploadMore && (
              <label className="grid aspect-[4/5] cursor-pointer place-items-center rounded-2xl border border-dashed border-slate-300 bg-white text-center transition active:scale-[0.98] dark:border-white/15 dark:bg-black">
                <input type="file" accept="image/*" multiple className="hidden" onChange={(event) => handleImages(event.target.files)} />
                <span>
                  <ImagePlus className="mx-auto size-8 text-slate-400" />
                  <span className="mt-2 block text-xs font-black">Add</span>
                </span>
              </label>
            )}
          </div>
        </div>

        <div className="rounded-[24px] bg-slate-50 p-4 dark:bg-white/5">
          <p className="text-sm font-black">Performance tips</p>
          <ul className="mt-2 space-y-2 text-xs font-semibold leading-5 text-slate-500">
            <li>Use bright 4:5 photos for better feed reach.</li>
            <li>Keep title short and searchable.</li>
            <li>Upload compressed images for old mobile devices.</li>
          </ul>
        </div>

        <Button className="w-full bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5]" disabled={isSubmitting} icon={<Sparkles className="size-4" />}>
          {t.publish}
        </Button>
      </aside>
    </form>
  );
}

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 text-sm font-semibold text-rose-600">{message}</p>;
}
