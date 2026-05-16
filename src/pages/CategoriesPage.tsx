import { useMemo, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { copy } from '@constants/languages';
import { useAppStore } from '@store/useAppStore';

type Lang = 'en' | 'hi' | 'gu';

const CATEGORIES: { name: Record<Lang, string>; image: string }[] = [
  { name: { en: "All Advertisements", hi: "सभी विज्ञापन", gu: "તમામ જાહેરાતો" }, image: "https://media.piplanapane.com/uploads/category/68257063c18a8.png" },
  { name: { en: "Farm Products", hi: "कृषि उत्पाद", gu: "ખેત ઉત્પાદનો" }, image: "https://media.piplanapane.com/uploads/category/69648b5e4a5b6.png" },
  { name: { en: "Buffalo", hi: "भैंस", gu: "ભેંસ" }, image: "https://media.piplanapane.com/uploads/category/68256672ab52c.png" },
  { name: { en: "Cow", hi: "गाय", gu: "ગાય" }, image: "https://media.piplanapane.com/uploads/category/696489f7a3b8b.png" },
  { name: { en: "Horses", hi: "घोड़े", gu: "ઘોડા" }, image: "https://media.piplanapane.com/uploads/category/682566ef12a77.png" },
  { name: { en: "Dogs and Pets", hi: "कुत्ते और पालतू जानवर", gu: "કૂતરા અને પ્રાણીઓ" }, image: "https://media.piplanapane.com/uploads/category/682566b21735e.png" },
  { name: { en: "Ox-Bulls", hi: "बैल-सांड", gu: "બળદ-સાંઢ" }, image: "https://media.piplanapane.com/uploads/category/684d3a0551cf6.png" },
  { name: { en: "Camel", hi: "ऊंट", gu: "ઊંટ" }, image: "https://media.piplanapane.com/uploads/category/6825671e121a0.png" },
  { name: { en: "Thresher-Opener", hi: "थ्रेशर-ओपनर", gu: "થ્રેશર-ઓપનર" }, image: "https://media.piplanapane.com/uploads/category/6888c523ca43a.png" },
  { name: { en: "Rotavator", hi: "रोटावेटर", gu: "રોટાવેટર" }, image: "https://media.piplanapane.com/uploads/category/6825682e988a2.png" },
  { name: { en: "Seed Drill", hi: "सीड ड्रिल", gu: "સીડ ડ્રિલ" }, image: "https://media.piplanapane.com/uploads/category/68256814ba4c2.png" },
  { name: { en: "Farm Implements", hi: "कृषि उपकरण", gu: "ખેત ઓજારો" }, image: "https://media.piplanapane.com/uploads/category/68256faadd3ac.png" },
  { name: { en: "Drip-Fountain-Pipe", hi: "ड्रिप-फव्वारा-पाइप", gu: "ડ્રિપ-ફુવારા-પાઇપ" }, image: "https://media.piplanapane.com/uploads/category/68256b7d3b0cc.png" },
  { name: { en: "Tractor", hi: "ट्रेक्टर", gu: "ટ્રેક્ટર" }, image: "https://media.piplanapane.com/uploads/category/684d3a33db2c1.png" },
  { name: { en: "Mini Tractor", hi: "मिनी ट्रेक्टर", gu: "મિની ટ્રેક્ટર" }, image: "https://media.piplanapane.com/uploads/category/682565e5c5fbe.png" },
  { name: { en: "Trolley", hi: "ट्रॉली", gu: "ટ્રૉલી" }, image: "https://media.piplanapane.com/uploads/category/688ae93e22502.png" },
  { name: { en: "Gadu Rekdo", hi: "गाडु रेकडो", gu: "ગાડુ રેકડો" }, image: "https://media.piplanapane.com/uploads/category/6914048892719.png" },
  { name: { en: "Saneda", hi: "सानेडा", gu: "સાનેડા" }, image: "https://media.piplanapane.com/uploads/category/69648b1642a3d.png" },
  { name: { en: "Two Wheeler", hi: "दोपहिया वाहन", gu: "ટુ વ્હીલર" }, image: "https://media.piplanapane.com/uploads/category/684d39f387818.png" },
  { name: { en: "Four Wheelers/Car", hi: "चार पहिया/कार", gu: "ચાર પૈડા/કાર" }, image: "https://media.piplanapane.com/uploads/category/684d3a6e3fbcf.png" },
  { name: { en: "Sheep and Goats", hi: "भेड़ और बकरी", gu: "ઘેટાં અને બકરાં" }, image: "https://media.piplanapane.com/uploads/category/69648bec98cc6.png" },
  { name: { en: "Poultry-Pigeon Trade", hi: "मुर्गी-कबूतर व्यापार", gu: "મરઘાં-કબૂતર વ્યાપાર" }, image: "https://media.piplanapane.com/uploads/category/6888c2fa9a2c5.png" },
  { name: { en: "Seeds and Fertilizers", hi: "बीज और खाद", gu: "બીજ અને ખાતર" }, image: "https://media.piplanapane.com/uploads/category/68256f0f32a47.png" },
  { name: { en: "Rickshaw", hi: "रिक्शा", gu: "રિક્ષા" }, image: "https://media.piplanapane.com/uploads/category/687b66fccbc01.png" },
  { name: { en: "Chaff Cutter", hi: "चारा काटने की मशीन", gu: "ઘાસ કાપવાની મશીન" }, image: "https://media.piplanapane.com/uploads/category/688a0a7046f44.png" },
  { name: { en: "Other Vehicle", hi: "अन्य वाहन", gu: "અન્ય વાહન" }, image: "https://media.piplanapane.com/uploads/category/6825701c06145.png" },
  { name: { en: "Organic Farming", hi: "जैविक खेती", gu: "ઓર્ગેનિક ખેતી" }, image: "https://media.piplanapane.com/uploads/category/68256f84094be.png" },
  { name: { en: "Nursery Plants", hi: "नर्सरी पौधे", gu: "નર્સરી છોડ" }, image: "https://media.piplanapane.com/uploads/category/682566236d056.png" },
  { name: { en: "Scrap", hi: "कबाड़", gu: "ભંગાર" }, image: "https://media.piplanapane.com/uploads/category/682569a699b7d.png" },
  { name: { en: "Mobile", hi: "मोबाइल", gu: "મોબાઇલ" }, image: "https://media.piplanapane.com/uploads/category/684d3a90a65f4.png" },
  { name: { en: "Job", hi: "नौकरी", gu: "નોકરી" }, image: "https://media.piplanapane.com/uploads/category/68256e25b2fde.png" },
  { name: { en: "Agricultural Land", hi: "कृषि भूमि", gu: "ખેતીની જમીન" }, image: "https://media.piplanapane.com/uploads/category/68256eab16405.png" },
  { name: { en: "Fruits and Vegetables", hi: "फल और सब्जियां", gu: "ફળ અને શાકભાજી" }, image: "https://media.piplanapane.com/uploads/category/684d3da6e5fab.png" },
  { name: { en: "Catering Services", hi: "खानपान सेवाएं", gu: "કેટરિંગ સેવાઓ" }, image: "https://media.piplanapane.com/uploads/category/6825693a74af9.png" },
  { name: { en: "Taxi / Driver Services", hi: "टैक्सी / ड्राइवर सेवाएं", gu: "ટેક્સી / ડ્રાઇવર સેવા" }, image: "https://media.piplanapane.com/uploads/category/687b67078a111.png" },
  { name: { en: "Real Estate", hi: "रियल एस्टेट", gu: "રિયલ એસ્ટેટ" }, image: "https://media.piplanapane.com/uploads/category/684d3c8cc16be.png" },
  { name: { en: "JCB-Pocklen", hi: "JCB-पोकलेन", gu: "JCB-પૉક્લેન" }, image: "https://media.piplanapane.com/uploads/category/687b671360612.png" },
  { name: { en: "Zatka-Machine-Solar", hi: "जटका-मशीन-सोलर", gu: "ઝાટકા-મશીન-સૌર" }, image: "https://media.piplanapane.com/uploads/category/69e1fe1dbdf6a.png" },
  { name: { en: "Generator-Machine", hi: "जनरेटर-मशीन", gu: "જનરેટર-મશીન" }, image: "https://media.piplanapane.com/uploads/category/69e208f734816.png" },
  { name: { en: "Tyre", hi: "टायर", gu: "ટાયર" }, image: "https://media.piplanapane.com/uploads/category/69e23099b362d.png" },
  { name: { en: "Farm Tools & Vehicle Rental", hi: "कृषि उपकरण किराया", gu: "ખેત ઓજાર ભાડા" }, image: "https://media.piplanapane.com/uploads/category/68256bb1ddcd5.png" },
  { name: { en: "School-College-Training", hi: "स्कूल-कॉलेज-प्रशिक्षण", gu: "શાળા-કૉલેજ-તાલીમ" }, image: "https://media.piplanapane.com/uploads/category/68256974e2336.png" },
  { name: { en: "AC-Electric-Mistry-Garage", hi: "AC-इलेक्ट्रिक-मिस्त्री-गैराज", gu: "AC-ઇલેક્ટ્રિક-મિસ્ત્રી-ગેરેજ" }, image: "https://media.piplanapane.com/uploads/category/6825695a5ce18.png" },
  { name: { en: "Submersible-Cable", hi: "सबमर्सिबल-केबल", gu: "સબમર્સિબલ-કેબલ" }, image: "https://media.piplanapane.com/uploads/category/69e30b57a1788.png" },
  { name: { en: "Other", hi: "अन्य", gu: "અન્ય" }, image: "https://media.piplanapane.com/uploads/category/68256e78abc08.jpg" },
];

export function CategoriesPage() {
  const [search, setSearch] = useState('');
  const language = useAppStore((state) => state.language);
  const t = copy[language];

  const filtered = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return CATEGORIES;
    return CATEGORIES.filter((c) =>
      c.name.en.toLowerCase().includes(value) ||
      c.name.hi.toLowerCase().includes(value) ||
      c.name.gu.toLowerCase().includes(value)
    );
  }, [search]);

  return (
    <div className="space-y-5 px-4 pt-4 pb-8 md:px-0 md:pt-0">
      {/* Header Card */}
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-950">
        <div className="grid gap-5 p-5 md:grid-cols-[1fr_auto] md:items-end md:p-6">
          <div>
            <p className="text-xs font-normal text-slate-500">{t.categoryDirectory}</p>
            <h1 className="mt-2 text-3xl font-semibold md:text-5xl">{t.allCategories}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              {t.categoriesDesc}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:w-72">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
              <p className="text-2xl font-semibold">{CATEGORIES.length}</p>
              <p className="mt-1 text-xs font-normal text-slate-500">{t.sections}</p>
            </div>
            <Link to="/sell" className="group rounded-2xl bg-gradient-to-tr from-teal-500 via-sky-500 to-indigo-600 p-4 text-white">
              <span className="block text-sm font-medium">{t.listAnItem}</span>
              <ArrowRight className="mt-3 size-5 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Search */}
      <label className="sticky top-[73px] z-20 flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/95 md:top-20">
        <Search className="size-5 text-slate-400 shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none"
          placeholder={t.searchCategories}
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-xs text-slate-400 hover:text-slate-600 shrink-0">
            Clear
          </button>
        )}
      </label>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-slate-400">
          <Search className="size-12 opacity-30" />
          <p className="text-sm font-medium">No categories found for "{search}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
          {filtered.map((cat) => {
            const slug = cat.name.en.toLowerCase().replace(/[\s\/\-]+/g, '-');
            return (
              <Link
                key={cat.name.en}
                to={`/?category=${slug}`}
                className="group flex flex-col items-center rounded-[20px] border border-slate-100 bg-white p-3 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md active:scale-[0.97] dark:border-white/10 dark:bg-slate-950"
              >
                {/* Image bubble */}
                <div className="relative mb-2.5 flex size-16 items-center justify-center overflow-hidden rounded-2xl bg-slate-50 dark:bg-white/5">
                  <img
                    src={cat.image}
                    alt={cat.name[language]}
                    loading="lazy"
                    className="h-12 w-12 object-contain transition duration-300 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                {/* Label */}
                <span className="block text-[11px] font-semibold leading-tight text-slate-800 dark:text-slate-200 line-clamp-2">
                  {cat.name[language]}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
