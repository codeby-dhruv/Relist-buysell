import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, Sparkles, X, Check } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@components/ui/Button';
import { copy } from '@constants/languages';
import { useAppStore } from '@store/useAppStore';
import { useAuthStore } from '@store/useAuthStore';
import { createProduct } from '@services/productService';
import { compressImage, fileToBase64 } from '@utils/imageUtils';

// ── Same category list as CategoriesPage ────────────────────────────────────
const CATEGORIES = [
  { name: "All Advertisements", image: "https://media.piplanapane.com/uploads/category/68257063c18a8.png" },
  { name: "Farm Products",      image: "https://media.piplanapane.com/uploads/category/69648b5e4a5b6.png" },
  { name: "Buffalo",            image: "https://media.piplanapane.com/uploads/category/68256672ab52c.png" },
  { name: "Cow",                image: "https://media.piplanapane.com/uploads/category/696489f7a3b8b.png" },
  { name: "Horses",             image: "https://media.piplanapane.com/uploads/category/682566ef12a77.png" },
  { name: "Dogs and Pets",      image: "https://media.piplanapane.com/uploads/category/682566b21735e.png" },
  { name: "Ox-Bulls",           image: "https://media.piplanapane.com/uploads/category/684d3a0551cf6.png" },
  { name: "Camel",              image: "https://media.piplanapane.com/uploads/category/6825671e121a0.png" },
  { name: "Thresher-Opener",    image: "https://media.piplanapane.com/uploads/category/6888c523ca43a.png" },
  { name: "Rotavator",          image: "https://media.piplanapane.com/uploads/category/6825682e988a2.png" },
  { name: "Seed Drill",         image: "https://media.piplanapane.com/uploads/category/68256814ba4c2.png" },
  { name: "Farm Implements",    image: "https://media.piplanapane.com/uploads/category/68256faadd3ac.png" },
  { name: "Drip-Fountain-Pipe", image: "https://media.piplanapane.com/uploads/category/68256b7d3b0cc.png" },
  { name: "Tractor",            image: "https://media.piplanapane.com/uploads/category/684d3a33db2c1.png" },
  { name: "Mini Tractor",       image: "https://media.piplanapane.com/uploads/category/682565e5c5fbe.png" },
  { name: "Trolley",            image: "https://media.piplanapane.com/uploads/category/688ae93e22502.png" },
  { name: "Gadu Rekdo",         image: "https://media.piplanapane.com/uploads/category/6914048892719.png" },
  { name: "Saneda",             image: "https://media.piplanapane.com/uploads/category/69648b1642a3d.png" },
  { name: "Two Wheeler",        image: "https://media.piplanapane.com/uploads/category/684d39f387818.png" },
  { name: "Four Wheelers/Car",  image: "https://media.piplanapane.com/uploads/category/684d3a6e3fbcf.png" },
  { name: "Sheep and Goats",    image: "https://media.piplanapane.com/uploads/category/69648bec98cc6.png" },
  { name: "Poultry-Pigeon Trade", image: "https://media.piplanapane.com/uploads/category/6888c2fa9a2c5.png" },
  { name: "Seeds and Fertilizers", image: "https://media.piplanapane.com/uploads/category/68256f0f32a47.png" },
  { name: "Rickshaw",           image: "https://media.piplanapane.com/uploads/category/687b66fccbc01.png" },
  { name: "Chaff Cutter",       image: "https://media.piplanapane.com/uploads/category/688a0a7046f44.png" },
  { name: "Other Vehicle",      image: "https://media.piplanapane.com/uploads/category/6825701c06145.png" },
  { name: "Organic Farming",    image: "https://media.piplanapane.com/uploads/category/68256f84094be.png" },
  { name: "Nursery Plants",     image: "https://media.piplanapane.com/uploads/category/682566236d056.png" },
  { name: "Scrap",              image: "https://media.piplanapane.com/uploads/category/682569a699b7d.png" },
  { name: "Mobile",             image: "https://media.piplanapane.com/uploads/category/684d3a90a65f4.png" },
  { name: "Job",                image: "https://media.piplanapane.com/uploads/category/68256e25b2fde.png" },
  { name: "Agricultural Land",  image: "https://media.piplanapane.com/uploads/category/68256eab16405.png" },
  { name: "Fruits and Vegetables", image: "https://media.piplanapane.com/uploads/category/684d3da6e5fab.png" },
  { name: "Catering Services",  image: "https://media.piplanapane.com/uploads/category/6825693a74af9.png" },
  { name: "Taxi / Driver Services", image: "https://media.piplanapane.com/uploads/category/687b67078a111.png" },
  { name: "Real Estate",        image: "https://media.piplanapane.com/uploads/category/684d3c8cc16be.png" },
  { name: "JCB-Pocklen",        image: "https://media.piplanapane.com/uploads/category/687b671360612.png" },
  { name: "Zatka-Machine-Solar",image: "https://media.piplanapane.com/uploads/category/69e1fe1dbdf6a.png" },
  { name: "Generator-Machine",  image: "https://media.piplanapane.com/uploads/category/69e208f734816.png" },
  { name: "Tyre",               image: "https://media.piplanapane.com/uploads/category/69e23099b362d.png" },
  { name: "Farm Tools & Vehicle Rental", image: "https://media.piplanapane.com/uploads/category/68256bb1ddcd5.png" },
  { name: "School-College-Training", image: "https://media.piplanapane.com/uploads/category/68256974e2336.png" },
  { name: "AC-Electric-Mistry-Garage", image: "https://media.piplanapane.com/uploads/category/6825695a5ce18.png" },
  { name: "Submersible-Cable",  image: "https://media.piplanapane.com/uploads/category/69e30b57a1788.png" },
  { name: "Other",              image: "https://media.piplanapane.com/uploads/category/68256e78abc08.jpg" },
];

const productSchema = z.object({
  title:       z.string().min(3, 'Title is required'),
  price:       z.coerce.number().min(1, 'Price is required'),
  description: z.string().min(10, 'Add a little more detail'),
  category:    z.string().min(1, 'Choose a category'),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export function ProductForm() {
  const [images, setImages]       = useState<Array<{ file: File; url: string }>>([]);
  const [publishing, setPublishing] = useState(false);
  const [publishStep, setPublishStep] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const language = useAppStore((state) => state.language);
  const t = copy[language];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const { user, profile } = useAuthStore();
  const navigate = useNavigate();

  async function onSubmit(values: ProductFormValues) {
    if (!user) { alert('Please log in to publish a product.'); return; }
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
        condition: 'used' as any,
        location: '',
        imageUrls: base64Images,
        sellerId: user.uid,
        sellerName: profile?.displayName || user.displayName || 'Unknown',
        sellerAvatar: profile?.profilePic || user.photoURL || '',
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
    const next = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, 3 - images.length)
      .map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setImages((cur) => [...cur, ...next].slice(0, 3));
  }

  function removeImage(url: string) {
    setImages((cur) => {
      const img = cur.find((i) => i.url === url);
      if (img) URL.revokeObjectURL(img.url);
      return cur.filter((i) => i.url !== url);
    });
  }

  function pickCategory(name: string) {
    setSelectedCategory(name);
    const slug = name.toLowerCase().replace(/[\s\/\-]+/g, '-');
    setValue('category', slug, { shouldValidate: true });
  }

  const canUploadMore = images.length < 3;
  const progress = useMemo(() => `${images.length}/3`, [images.length]);
  const isSuccess = publishStep === 'Published!';

  return (
    <>
      {/* Publishing overlay */}
      {publishing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/60 backdrop-blur-sm">
          <div className={`flex h-20 w-20 items-center justify-center rounded-full transition-all duration-500 ${isSuccess ? 'bg-teal-500' : 'bg-white'}`}>
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

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 rounded-[30px] bg-white p-4 shadow-sm dark:bg-black md:border md:border-slate-200 md:p-6 md:dark:border-white/10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">

          {/* Title */}
          <div>
            <label className="inter-copy text-sm font-medium">{t.title}</label>
            <input className="field mt-2" placeholder="e.g. Mahindra Tractor 575 DI, 2019" {...register('title')} />
            {errors.title && <p className="mt-1 text-sm text-rose-600">{errors.title.message}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="inter-copy text-sm font-medium">{t.price} (₹)</label>
            <input className="field mt-2" type="number" placeholder="e.g. 450000" {...register('price')} />
            {errors.price && <p className="mt-1 text-sm text-rose-600">{errors.price.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="inter-copy text-sm font-medium">{t.description}</label>
            <textarea className="field mt-2 min-h-28 resize-none" placeholder="Describe your item — condition, year, usage, included extras..." {...register('description')} />
            {errors.description && <p className="mt-1 text-sm text-rose-600">{errors.description.message}</p>}
          </div>

          {/* Category Picker */}
          <div>
            <label className="inter-copy text-sm font-medium">
              {t.category} — <span className="font-normal text-slate-500">Select your advertisement category</span>
            </label>
            {errors.category && <p className="mt-1 text-sm text-rose-600">{errors.category.message}</p>}
            <input type="hidden" {...register('category')} />
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => pickCategory(cat.name)}
                    className={`relative flex flex-col items-center rounded-2xl border p-2.5 text-center transition active:scale-95 ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-500/10'
                        : 'border-slate-100 bg-slate-50 hover:border-slate-300 dark:border-white/10 dark:bg-white/5'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-teal-500">
                        <Check className="size-2.5 text-white" />
                      </span>
                    )}
                    <img
                      src={cat.image}
                      alt={cat.name}
                      loading="lazy"
                      className="h-10 w-10 object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <span className={`mt-1.5 block text-[10px] font-semibold leading-tight line-clamp-2 ${isSelected ? 'text-teal-700 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar — Photos + Tips + Publish */}
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
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleImages(e.target.files)} />
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
            <Button
              className="w-full bg-gradient-to-tr from-teal-500 via-sky-500 to-indigo-600"
              disabled={publishing || images.length !== 3 || !selectedCategory}
              icon={<Sparkles className="size-4" />}
            >
              {publishing ? publishStep : t.publish}
            </Button>
            {images.length !== 3 && <p className="text-center text-xs font-medium text-rose-600">{t.pleaseUpload3}</p>}
            {images.length === 3 && !selectedCategory && <p className="text-center text-xs font-medium text-rose-600">Please select a category above.</p>}
          </div>
        </aside>
      </form>
    </>
  );
}
