import { ProductForm } from '@features/products/ProductForm';
import { copy } from '@constants/languages';
import { useAppStore } from '@store/useAppStore';

export function SellPage() {
  const language = useAppStore((state) => state.language);
  const t = copy[language];

  return (
    <div className="space-y-5 px-4 pt-4 md:px-0 md:pt-0">
      <div className="rounded-[30px] bg-gradient-to-tr from-teal-500 via-sky-500 to-indigo-600 p-5 text-white shadow-sm md:p-7">
        <p className="text-xs font-normal text-white/75">Creator studio</p>
        <h1 className="inter-copy mt-2 text-3xl font-semibold sm:text-5xl">{t.createListing}</h1>
        <p className="inter-copy mt-2 max-w-2xl text-sm font-normal text-white/78">
          Add clean photos, honest details, and pricing that helps buyers trust your listing instantly.
        </p>
      </div>
      <ProductForm />
    </div>
  );
}


