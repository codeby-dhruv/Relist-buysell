import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, Sparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@components/ui/Button';
import { categories, conditions } from '@constants/categories';
import { copy } from '@constants/languages';
import { useAppStore } from '@store/useAppStore';
import { useAuthStore } from '@store/useAuthStore';
import { createProduct } from '@services/productService';
import { compressImage, fileToBase64 } from '@utils/imageUtils';

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
  const [publishing, setPublishing] = useState(false);
  const [publishStep, setPublishStep] = useState('');
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
  const { user, profile } = useAuthStore();
  const navigate = useNavigate();

  async function onSubmit(values: ProductFormValues) {
    if (!user) {
      alert('Please log in to publish a product.');
      return;
    }

    setPublishing(true);
    try {
      setPublishStep('Compressing photos...');
      const base64Images = await Promise.all(
        images.map(async (img) => {
          const compressed = await compressImage(img.file);
          return fileToBase64(compressed);
        })
      );

      setPublishStep('Saving to database...');
      await createProduct({
        ...values,
        category: values.category as any,
        condition: values.condition as any,
        imageUrls: base64Images,
        sellerId: user.uid,
        sellerName: profile?.displayName || user.displayName || 'Unknown',
        sellerAvatar: profile?.profilePic || user.photoURL || ""
      });

      setPublishStep('Published!');
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      console.error('Failed to publish product', err);
      setPublishing(false);
      setPublishStep('');
      alert('Failed to publish product. Please try again.');
    }
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

  const isSuccess = publishStep === 'Published!';

  return (
    <>
      {/* Publishing overlay */}
      {publishing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/60 backdrop-blur-sm">
          <div className={`flex h-20 w-20 items-center justify-center rounded-full transition-all duration-500 ${
            isSuccess ? 'bg-teal-500' : 'bg-white'
          }`}>
            {isSuccess ? (
              <svg className="size-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <div className="size-10 animate-spin rounded-full border-4 border-slate-200 border-t-teal-500" />
            )}
          </div>
          <p className="text-lg font-bold text-white">{publishStep}</p>
          {!isSuccess && <p className="text-sm text-white/60">Please wait, don&apos;t close the app</p>}
        </div>
      )}
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 rounded-[30px] bg-white p-4 shadow-sm dark:bg-black md:border md:border-slate-200 md:p-6 md:dark:border-white/10 lg:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        <div>
          <label className="inter-copy text-sm font-medium">{t.title}</label>
          <input className="field mt-2" placeholder={t.titlePlaceholder} {...register('title')} />
          <ErrorText message={errors.title?.message} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="inter-copy text-sm font-medium">{t.price}</label>
            <input className="field mt-2" type="number" placeholder="450" {...register('price')} />
            <ErrorText message={errors.price?.message} />
          </div>
          <div>
            <label className="inter-copy text-sm font-medium">{t.location}</label>
            <input className="field mt-2" placeholder={t.locationPlaceholder} {...register('location')} />
            <ErrorText message={errors.location?.message} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="inter-copy text-sm font-medium">{t.category}</label>
            <select className="field mt-2" {...register('category')}>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="inter-copy text-sm font-medium">{t.condition}</label>
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
          <label className="inter-copy text-sm font-medium">{t.description}</label>
          <textarea className="field mt-2 min-h-36 resize-none" placeholder={t.descriptionPlaceholder} {...register('description')} />
          <ErrorText message={errors.description?.message} />
        </div>
      </div>
      <aside className="space-y-4">
        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="inter-copy text-sm font-medium">{t.uploadPhotos}</p>
              <p className="text-xs font-normal text-slate-500">{t.maxPhotos}</p>
            </div>
            <span className="rounded-full bg-black px-3 py-1 text-xs font-normal text-white dark:bg-white dark:text-black">{progress}</span>
          </div>

          <div className="flex snap-x gap-2 overflow-x-auto pb-1">
            {images.map((image, index) => (
              <div key={image.url} className="relative aspect-[4/5] w-28 shrink-0 snap-start overflow-hidden rounded-2xl bg-slate-200">
                <img src={image.url} alt={`Upload ${index + 1}`} className="h-full w-full object-cover" />
                {index === 0 && <span className="absolute left-1.5 top-1.5 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-normal">{t.cover}</span>}
                <button type="button" onClick={() => removeImage(image.url)} className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-black/65 text-white">
                  <X className="size-4" />
                </button>
              </div>
            ))}

            {canUploadMore && (
              <label className="grid aspect-[4/5] w-28 shrink-0 cursor-pointer snap-start place-items-center rounded-2xl border border-dashed border-slate-300 bg-white text-center transition active:scale-[0.98] dark:border-white/15 dark:bg-black">
                <input type="file" accept="image/*" multiple className="hidden" onChange={(event) => handleImages(event.target.files)} />
                <span>
                  <ImagePlus className="mx-auto size-8 text-slate-400" />
                  <span className="mt-2 block text-xs font-normal">{t.add}</span>
                </span>
              </label>
            )}
          </div>
        </div>

        <div className="rounded-[24px] bg-slate-50 p-4 dark:bg-white/5">
          <p className="inter-copy text-sm font-medium">{t.performanceTips}</p>
          <ul className="mt-2 space-y-2 text-xs font-normal leading-5 text-slate-500">
            <li>{t.tip1}</li>
            <li>{t.tip2}</li>
            <li>{t.tip3}</li>
          </ul>
        </div>

        <div className="space-y-2">
          <Button className="w-full bg-gradient-to-tr from-teal-500 via-sky-500 to-indigo-600" disabled={isSubmitting || publishing || images.length !== 3} icon={<Sparkles className="size-4" />}>
            {publishing ? publishStep : t.publish}
          </Button>
          {images.length !== 3 && <p className="text-center text-xs font-medium text-rose-600">{t.pleaseUpload3}</p>}
        </div>
      </aside>
    </form>
    </>
  );
}

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 text-sm font-semibold text-rose-600">{message}</p>;
}
