import { useMemo, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { copy } from '@constants/languages';
import { useAppStore } from '@store/useAppStore';

type Lang = 'en' | 'hi' | 'gu';

function fixMojibake(value: string) {
  // Some legacy strings were saved as UTF-8 bytes interpreted as Windows-1252 (e.g. "à¤•à¥...").
  // Detect and repair so Hindi/Gujarati render correctly.
  if (!value.includes('à') && !value.includes('â') && !value.includes('Ã')) return value;
  try {
    const cp1252Map = new Map<number, number>([
      [0x20ac, 0x80],
      [0x201a, 0x82],
      [0x0192, 0x83],
      [0x201e, 0x84],
      [0x2026, 0x85],
      [0x2020, 0x86],
      [0x2021, 0x87],
      [0x02c6, 0x88],
      [0x2030, 0x89],
      [0x0160, 0x8a],
      [0x2039, 0x8b],
      [0x0152, 0x8c],
      [0x017d, 0x8e],
      [0x2018, 0x91],
      [0x2019, 0x92],
      [0x201c, 0x93],
      [0x201d, 0x94],
      [0x2022, 0x95],
      [0x2013, 0x96],
      [0x2014, 0x97],
      [0x02dc, 0x98],
      [0x2122, 0x99],
      [0x0161, 0x9a],
      [0x203a, 0x9b],
      [0x0153, 0x9c],
      [0x017e, 0x9e],
      [0x0178, 0x9f]
    ]);

    const bytes = new Uint8Array(
      Array.from(value, (ch) => {
        const code = ch.codePointAt(0) ?? 0;
        if (code <= 0xff) return code;
        return cp1252Map.get(code) ?? (code & 0xff);
      })
    );
    const decoded = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    // If decoding didn't change the string, keep original.
    return decoded && decoded !== value ? decoded : value;
  } catch {
    return value;
  }
}

const CATEGORIES: { name: Record<Lang, string>; image: string }[] = [
  { name: { en: "All Advertisements", hi: "à¤¸à¤­à¥€ à¤µà¤¿à¤œà¥à¤žà¤¾à¤ªà¤¨", gu: "àª¤àª®àª¾àª® àªœàª¾àª¹à«‡àª°àª¾àª¤à«‹" }, image: "https://media.piplanapane.com/uploads/category/68257063c18a8.png" },
  { name: { en: "Farm Products", hi: "à¤•à¥ƒà¤·à¤¿ à¤‰à¤¤à¥à¤ªà¤¾à¤¦", gu: "àª–à«‡àª¤ àª‰àª¤à«àªªàª¾àª¦àª¨à«‹" }, image: "https://media.piplanapane.com/uploads/category/69648b5e4a5b6.png" },
  { name: { en: "Buffalo", hi: "à¤­à¥ˆà¤‚à¤¸", gu: "àª­à«‡àª‚àª¸" }, image: "https://media.piplanapane.com/uploads/category/68256672ab52c.png" },
  { name: { en: "Cow", hi: "à¤—à¤¾à¤¯", gu: "àª—àª¾àª¯" }, image: "https://media.piplanapane.com/uploads/category/696489f7a3b8b.png" },
  { name: { en: "Horses", hi: "à¤˜à¥‹à¤¡à¤¼à¥‡", gu: "àª˜à«‹àª¡àª¾" }, image: "https://media.piplanapane.com/uploads/category/682566ef12a77.png" },
  { name: { en: "Dogs and Pets", hi: "à¤•à¥à¤¤à¥à¤¤à¥‡ à¤”à¤° à¤ªà¤¾à¤²à¤¤à¥‚ à¤œà¤¾à¤¨à¤µà¤°", gu: "àª•à«‚àª¤àª°àª¾ àª…àª¨à«‡ àªªà«àª°àª¾àª£à«€àª“" }, image: "https://media.piplanapane.com/uploads/category/682566b21735e.png" },
  { name: { en: "Ox-Bulls", hi: "à¤¬à¥ˆà¤²-à¤¸à¤¾à¤‚à¤¡", gu: "àª¬àª³àª¦-àª¸àª¾àª‚àª¢" }, image: "https://media.piplanapane.com/uploads/category/684d3a0551cf6.png" },
  { name: { en: "Camel", hi: "à¤Šà¤‚à¤Ÿ", gu: "àªŠàª‚àªŸ" }, image: "https://media.piplanapane.com/uploads/category/6825671e121a0.png" },
  { name: { en: "Thresher-Opener", hi: "à¤¥à¥à¤°à¥‡à¤¶à¤°-à¤“à¤ªà¤¨à¤°", gu: "àª¥à«àª°à«‡àª¶àª°-àª“àªªàª¨àª°" }, image: "https://media.piplanapane.com/uploads/category/6888c523ca43a.png" },
  { name: { en: "Rotavator", hi: "à¤°à¥‹à¤Ÿà¤¾à¤µà¥‡à¤Ÿà¤°", gu: "àª°à«‹àªŸàª¾àªµà«‡àªŸàª°" }, image: "https://media.piplanapane.com/uploads/category/6825682e988a2.png" },
  { name: { en: "Seed Drill", hi: "à¤¸à¥€à¤¡ à¤¡à¥à¤°à¤¿à¤²", gu: "àª¸à«€àª¡ àª¡à«àª°àª¿àª²" }, image: "https://media.piplanapane.com/uploads/category/68256814ba4c2.png" },
  { name: { en: "Farm Implements", hi: "à¤•à¥ƒà¤·à¤¿ à¤‰à¤ªà¤•à¤°à¤£", gu: "àª–à«‡àª¤ àª“àªœàª¾àª°à«‹" }, image: "https://media.piplanapane.com/uploads/category/68256faadd3ac.png" },
  { name: { en: "Drip-Fountain-Pipe", hi: "à¤¡à¥à¤°à¤¿à¤ª-à¤«à¤µà¥à¤µà¤¾à¤°à¤¾-à¤ªà¤¾à¤‡à¤ª", gu: "àª¡à«àª°àª¿àªª-àª«à«àªµàª¾àª°àª¾-àªªàª¾àª‡àªª" }, image: "https://media.piplanapane.com/uploads/category/68256b7d3b0cc.png" },
  { name: { en: "Tractor", hi: "à¤Ÿà¥à¤°à¥‡à¤•à¥à¤Ÿà¤°", gu: "àªŸà«àª°à«‡àª•à«àªŸàª°" }, image: "/Catagoryicon/Tusi-%20Tractor.png" },
  { name: { en: "Mini Tractor", hi: "à¤®à¤¿à¤¨à¥€ à¤Ÿà¥à¤°à¥‡à¤•à¥à¤Ÿà¤°", gu: "àª®àª¿àª¨à«€ àªŸà«àª°à«‡àª•à«àªŸàª°" }, image: "https://media.piplanapane.com/uploads/category/682565e5c5fbe.png" },
  { name: { en: "Trolley", hi: "à¤Ÿà¥à¤°à¥‰à¤²à¥€", gu: "àªŸà«àª°à«‰àª²à«€" }, image: "/Catagoryicon/Trolley.png" },
  { name: { en: "Gadu Rekdo", hi: "à¤—à¤¾à¤¡à¥ à¤°à¥‡à¤•à¤¡à¥‹", gu: "àª—àª¾àª¡à« àª°à«‡àª•àª¡à«‹" }, image: "https://media.piplanapane.com/uploads/category/6914048892719.png" },
  { name: { en: "Saneda", hi: "à¤¸à¤¾à¤¨à¥‡à¤¡à¤¾", gu: "àª¸àª¾àª¨à«‡àª¡àª¾" }, image: "https://media.piplanapane.com/uploads/category/69648b1642a3d.png" },
  { name: { en: "Two Wheeler", hi: "à¤¦à¥‹à¤ªà¤¹à¤¿à¤¯à¤¾ à¤µà¤¾à¤¹à¤¨", gu: "àªŸà« àªµà«àª¹à«€àª²àª°" }, image: "/Catagoryicon/Tulsi-Bike.png" },
  { name: { en: "Four Wheelers/Car", hi: "à¤šà¤¾à¤° à¤ªà¤¹à¤¿à¤¯à¤¾/à¤•à¤¾à¤°", gu: "àªšàª¾àª° àªªà«ˆàª¡àª¾/àª•àª¾àª°" }, image: "/Catagoryicon/Tulshi-%20car.png" },
  { name: { en: "Sheep and Goats", hi: "à¤­à¥‡à¤¡à¤¼ à¤”à¤° à¤¬à¤•à¤°à¥€", gu: "àª˜à«‡àªŸàª¾àª‚ àª…àª¨à«‡ àª¬àª•àª°àª¾àª‚" }, image: "https://media.piplanapane.com/uploads/category/69648bec98cc6.png" },
  { name: { en: "Poultry-Pigeon Trade", hi: "à¤®à¥à¤°à¥à¤—à¥€-à¤•à¤¬à¥‚à¤¤à¤° à¤µà¥à¤¯à¤¾à¤ªà¤¾à¤°", gu: "àª®àª°àª˜àª¾àª‚-àª•àª¬à«‚àª¤àª° àªµà«àª¯àª¾àªªàª¾àª°" }, image: "https://media.piplanapane.com/uploads/category/6888c2fa9a2c5.png" },
  { name: { en: "Seeds and Fertilizers", hi: "à¤¬à¥€à¤œ à¤”à¤° à¤–à¤¾à¤¦", gu: "àª¬à«€àªœ àª…àª¨à«‡ àª–àª¾àª¤àª°" }, image: "https://media.piplanapane.com/uploads/category/68256f0f32a47.png" },
  { name: { en: "Rickshaw", hi: "à¤°à¤¿à¤•à¥à¤¶à¤¾", gu: "àª°àª¿àª•à«àª·àª¾" }, image: "/Catagoryicon/Tulshi-%20Auto%20Riksha.png" },
  { name: { en: "Chaff Cutter", hi: "à¤šà¤¾à¤°à¤¾ à¤•à¤¾à¤Ÿà¤¨à¥‡ à¤•à¥€ à¤®à¤¶à¥€à¤¨", gu: "àª˜àª¾àª¸ àª•àª¾àªªàªµàª¾àª¨à«€ àª®àª¶à«€àª¨" }, image: "https://media.piplanapane.com/uploads/category/688a0a7046f44.png" },
  { name: { en: "Other Vehicle", hi: "à¤…à¤¨à¥à¤¯ à¤µà¤¾à¤¹à¤¨", gu: "àª…àª¨à«àª¯ àªµàª¾àª¹àª¨" }, image: "https://media.piplanapane.com/uploads/category/6825701c06145.png" },
  { name: { en: "Organic Farming", hi: "à¤œà¥ˆà¤µà¤¿à¤• à¤–à¥‡à¤¤à¥€", gu: "àª“àª°à«àª—à«‡àª¨àª¿àª• àª–à«‡àª¤à«€" }, image: "https://media.piplanapane.com/uploads/category/68256f84094be.png" },
  { name: { en: "Nursery Plants", hi: "à¤¨à¤°à¥à¤¸à¤°à¥€ à¤ªà¥Œà¤§à¥‡", gu: "àª¨àª°à«àª¸àª°à«€ àª›à«‹àª¡" }, image: "https://media.piplanapane.com/uploads/category/682566236d056.png" },
  { name: { en: "Scrap", hi: "à¤•à¤¬à¤¾à¤¡à¤¼", gu: "àª­àª‚àª—àª¾àª°" }, image: "https://media.piplanapane.com/uploads/category/682569a699b7d.png" },
  { name: { en: "Mobile", hi: "à¤®à¥‹à¤¬à¤¾à¤‡à¤²", gu: "àª®à«‹àª¬àª¾àª‡àª²" }, image: "https://media.piplanapane.com/uploads/category/684d3a90a65f4.png" },
  { name: { en: "Job", hi: "à¤¨à¥Œà¤•à¤°à¥€", gu: "àª¨à«‹àª•àª°à«€" }, image: "https://media.piplanapane.com/uploads/category/68256e25b2fde.png" },
  { name: { en: "Agricultural Land", hi: "à¤•à¥ƒà¤·à¤¿ à¤­à¥‚à¤®à¤¿", gu: "àª–à«‡àª¤à«€àª¨à«€ àªœàª®à«€àª¨" }, image: "https://media.piplanapane.com/uploads/category/68256eab16405.png" },
  { name: { en: "Fruits and Vegetables", hi: "à¤«à¤² à¤”à¤° à¤¸à¤¬à¥à¤œà¤¿à¤¯à¤¾à¤‚", gu: "àª«àª³ àª…àª¨à«‡ àª¶àª¾àª•àª­àª¾àªœà«€" }, image: "https://media.piplanapane.com/uploads/category/684d3da6e5fab.png" },
  { name: { en: "Catering Services", hi: "à¤–à¤¾à¤¨à¤ªà¤¾à¤¨ à¤¸à¥‡à¤µà¤¾à¤à¤‚", gu: "àª•à«‡àªŸàª°àª¿àª‚àª— àª¸à«‡àªµàª¾àª“" }, image: "https://media.piplanapane.com/uploads/category/6825693a74af9.png" },
  { name: { en: "Taxi / Driver Services", hi: "à¤Ÿà¥ˆà¤•à¥à¤¸à¥€ / à¤¡à¥à¤°à¤¾à¤‡à¤µà¤° à¤¸à¥‡à¤µà¤¾à¤à¤‚", gu: "àªŸà«‡àª•à«àª¸à«€ / àª¡à«àª°àª¾àª‡àªµàª° àª¸à«‡àªµàª¾" }, image: "https://media.piplanapane.com/uploads/category/687b67078a111.png" },
  { name: { en: "Real Estate", hi: "à¤°à¤¿à¤¯à¤² à¤à¤¸à¥à¤Ÿà¥‡à¤Ÿ", gu: "àª°àª¿àª¯àª² àªàª¸à«àªŸà«‡àªŸ" }, image: "https://media.piplanapane.com/uploads/category/684d3c8cc16be.png" },
  { name: { en: "JCB-Pocklen", hi: "JCB-à¤ªà¥‹à¤•à¤²à¥‡à¤¨", gu: "JCB-àªªà«‰àª•à«àª²à«‡àª¨" }, image: "/Catagoryicon/JCB.png" },
  { name: { en: "Zatka-Machine-Solar", hi: "à¤œà¤Ÿà¤•à¤¾-à¤®à¤¶à¥€à¤¨-à¤¸à¥‹à¤²à¤°", gu: "àªàª¾àªŸàª•àª¾-àª®àª¶à«€àª¨-àª¸à«Œàª°" }, image: "/Catagoryicon/solar.png" },
  { name: { en: "Generator-Machine", hi: "à¤œà¤¨à¤°à¥‡à¤Ÿà¤°-à¤®à¤¶à¥€à¤¨", gu: "àªœàª¨àª°à«‡àªŸàª°-àª®àª¶à«€àª¨" }, image: "https://media.piplanapane.com/uploads/category/69e208f734816.png" },
  { name: { en: "Tyre", hi: "à¤Ÿà¤¾à¤¯à¤°", gu: "àªŸàª¾àª¯àª°" }, image: "/Catagoryicon/Tyre.png" },
  { name: { en: "Farm Tools & Vehicle Rental", hi: "à¤•à¥ƒà¤·à¤¿ à¤‰à¤ªà¤•à¤°à¤£ à¤•à¤¿à¤°à¤¾à¤¯à¤¾", gu: "àª–à«‡àª¤ àª“àªœàª¾àª° àª­àª¾àª¡àª¾" }, image: "https://media.piplanapane.com/uploads/category/68256bb1ddcd5.png" },
  { name: { en: "School-College-Training", hi: "à¤¸à¥à¤•à¥‚à¤²-à¤•à¥‰à¤²à¥‡à¤œ-à¤ªà¥à¤°à¤¶à¤¿à¤•à¥à¤·à¤£", gu: "àª¶àª¾àª³àª¾-àª•à«‰àª²à«‡àªœ-àª¤àª¾àª²à«€àª®" }, image: "https://media.piplanapane.com/uploads/category/68256974e2336.png" },
  { name: { en: "AC-Electric-Mistry-Garage", hi: "AC-à¤‡à¤²à¥‡à¤•à¥à¤Ÿà¥à¤°à¤¿à¤•-à¤®à¤¿à¤¸à¥à¤¤à¥à¤°à¥€-à¤—à¥ˆà¤°à¤¾à¤œ", gu: "AC-àª‡àª²à«‡àª•à«àªŸà«àª°àª¿àª•-àª®àª¿àª¸à«àª¤à«àª°à«€-àª—à«‡àª°à«‡àªœ" }, image: "https://media.piplanapane.com/uploads/category/6825695a5ce18.png" },
  { name: { en: "Submersible-Cable", hi: "à¤¸à¤¬à¤®à¤°à¥à¤¸à¤¿à¤¬à¤²-à¤•à¥‡à¤¬à¤²", gu: "àª¸àª¬àª®àª°à«àª¸àª¿àª¬àª²-àª•à«‡àª¬àª²" }, image: "https://media.piplanapane.com/uploads/category/69e30b57a1788.png" },
  { name: { en: "Other", hi: "à¤…à¤¨à¥à¤¯", gu: "àª…àª¨à«àª¯" }, image: "https://media.piplanapane.com/uploads/category/68256e78abc08.jpg" },
];

const NORMALIZED_CATEGORIES = CATEGORIES.map((cat) => ({
  ...cat,
  name: {
    en: cat.name.en,
    hi: fixMojibake(cat.name.hi),
    gu: fixMojibake(cat.name.gu)
  }
}));

export function CategoriesPage() {
  const [search, setSearch] = useState('');
  const language = useAppStore((state) => state.language);
  const t = copy[language];

  const filtered = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return NORMALIZED_CATEGORIES;
    return NORMALIZED_CATEGORIES.filter((c) =>
      c.name.en.toLowerCase().includes(value) ||
      c.name.hi.toLowerCase().includes(value) ||
      c.name.gu.toLowerCase().includes(value)
    );
  }, [search]);

  return (
    <div className="space-y-4 px-4 pt-4 pb-8 md:px-0 md:pt-0">

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

