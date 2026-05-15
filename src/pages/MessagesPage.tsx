import { MoreVertical, Paperclip, Phone, Search, Send, Smile } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { chats } from '@services/mockData';

export function MessagesPage() {
  return (
    <div className="px-4 pt-4 md:px-0 md:pt-0">
      <div className="grid min-h-[calc(100vh-180px)] overflow-hidden rounded-[30px] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:bg-slate-950 md:min-h-[70vh] md:border md:border-slate-200 md:dark:border-white/10 lg:grid-cols-[340px_1fr]">
        <aside className="border-b border-slate-100 dark:border-white/10 lg:border-b-0 lg:border-r">
          <div className="space-y-4 p-4 md:p-5">
            <div className="hidden items-center justify-between md:flex">
              <h1 className="text-2xl font-extrabold">Chat</h1>
              <button className="grid size-10 place-items-center rounded-full bg-slate-100 dark:bg-white/10">
                <MoreVertical className="size-5" />
              </button>
            </div>
            <label className="flex h-12 items-center gap-3 rounded-2xl bg-slate-50 px-4 dark:bg-white/5">
              <Search className="size-4 text-slate-400" />
              <input className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Search chat..." />
            </label>
          </div>
          <div className="space-y-1 px-3 pb-3">
            {chats.map((chat, index) => (
              <button
                key={chat.id}
                className={`flex w-full items-center gap-3 rounded-3xl p-3 text-left transition ${index === 0 ? 'bg-[#5b2ee5]/10' : 'hover:bg-slate-100 dark:hover:bg-white/10'}`}
              >
                <img src={chat.participantAvatar ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80'} alt="" className="size-14 rounded-[22px] object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate font-extrabold">{chat.participantName}</span>
                    <span className="shrink-0 text-[11px] font-bold text-slate-400">Now</span>
                  </span>
                  <span className="mt-1 block truncate text-sm text-slate-500">{chat.lastMessage}</span>
                </span>
                {chat.unreadCount > 0 && <span className="grid size-6 place-items-center rounded-full bg-[#5b2ee5] text-xs font-bold text-white">{chat.unreadCount}</span>}
              </button>
            ))}
          </div>
        </aside>

        <section className="flex min-h-[560px] flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-white/10">
            <div className="flex items-center gap-3">
              <img src={chats[0].participantAvatar} alt="" className="size-11 rounded-2xl object-cover" />
              <div>
                <p className="font-extrabold">Mina Lee</p>
                <p className="text-xs font-semibold text-emerald-500">Online · MacBook Pro 14</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="grid size-10 place-items-center rounded-full bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300">
                <Phone className="size-4" />
              </button>
              <button className="grid size-10 place-items-center rounded-full bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300">
                <MoreVertical className="size-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/70 p-4 dark:bg-white/[0.03] md:p-5">
            <DayPill>Today</DayPill>
            <Bubble mine={false}>Still available? I can pick it up today.</Bubble>
            <Bubble mine>Yes, it is. I can meet near Ferry Building after 5.</Bubble>
            <Bubble mine={false}>Perfect. Would you take $1,620?</Bubble>
            <Bubble mine>That works if you can confirm pickup by evening.</Bubble>
          </div>
          <div className="border-t border-slate-100 bg-white p-3 dark:border-white/10 dark:bg-slate-950">
            <div className="flex items-center gap-2 rounded-[22px] bg-slate-100 p-2 dark:bg-white/10">
              <button className="grid size-10 place-items-center rounded-full text-slate-500">
                <Paperclip className="size-5" />
              </button>
              <input className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none" placeholder="Write a message..." />
              <button className="grid size-10 place-items-center rounded-full text-slate-500">
                <Smile className="size-5" />
              </button>
              <Button className="size-11 rounded-full bg-[#5b2ee5] p-0" aria-label="Send" icon={<Send className="size-4" />} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function DayPill({ children }: { children: string }) {
  return <p className="mx-auto w-fit rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-slate-400 shadow-sm dark:bg-white/10">{children}</p>;
}

function Bubble({ children, mine }: { children: string; mine?: boolean }) {
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <p className={`max-w-[78%] rounded-[24px] px-4 py-3 text-sm leading-6 shadow-sm ${mine ? 'rounded-br-md bg-[#5b2ee5] text-white' : 'rounded-bl-md bg-white text-slate-700 dark:bg-white/10 dark:text-slate-200'}`}>
        {children}
      </p>
    </div>
  );
}
