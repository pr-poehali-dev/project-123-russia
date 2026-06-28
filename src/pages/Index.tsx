import { useState } from 'react';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Привет! Я твой бот-помощник. Задай вопрос или попроси автоматизировать задачу.' },
  ]);

  const handleSaveKey = () => {
    if (!apiKey.trim()) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSend = () => {
    if (!message.trim()) return;
    setChat((c) => [...c, { role: 'user', text: message }]);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white font-sans relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-b from-indigo-500/20 to-transparent blur-3xl animate-glow" />

      <div className="relative max-w-2xl mx-auto px-6 py-16">
        <header className="flex items-center gap-3 mb-16 animate-fade-up">
          <div className="h-10 w-10 rounded-2xl bg-white text-black flex items-center justify-center">
            <Icon name="Bot" size={22} />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Бот-помощник</h1>
            <p className="text-xs text-white/40">Ответы на вопросы · Автоматизация</p>
          </div>
        </header>

        <section className="mb-10 animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <label className="block text-sm font-medium text-white/60 mb-3">API ключ</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Вставьте ваш API ключ"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 pr-12 text-sm font-mono placeholder:text-white/25 outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all"
              />
              <button
                onClick={() => setShowKey((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
              >
                <Icon name={showKey ? 'EyeOff' : 'Eye'} size={18} />
              </button>
            </div>
            <button
              onClick={handleSaveKey}
              className="bg-white text-black rounded-2xl px-5 text-sm font-semibold hover:bg-white/90 active:scale-95 transition-all flex items-center gap-2"
            >
              <Icon name={saved ? 'Check' : 'Save'} size={16} />
              {saved ? 'Сохранено' : 'Сохранить'}
            </button>
          </div>
          <p className="text-xs text-white/30 mt-2">Ключ хранится только в вашем браузере и никуда не отправляется.</p>
        </section>

        <section
          className="rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden animate-fade-up"
          style={{ animationDelay: '0.2s', opacity: 0 }}
        >
          <div className="p-5 space-y-4 min-h-[280px]">
            {chat.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-white text-black'
                      : 'bg-white/[0.06] text-white/90 border border-white/5'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 p-3 flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Напишите сообщение..."
              className="flex-1 bg-transparent px-3 text-sm placeholder:text-white/25 outline-none"
            />
            <button
              onClick={handleSend}
              className="h-10 w-10 shrink-0 rounded-xl bg-white text-black flex items-center justify-center hover:bg-white/90 active:scale-90 transition-all"
            >
              <Icon name="ArrowUp" size={18} />
            </button>
          </div>
        </section>

        <footer className="mt-8 text-center text-xs text-white/25 animate-fade-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
          Powered by вашим личным разработчиком
        </footer>
      </div>
    </div>
  );
};

export default Index;
