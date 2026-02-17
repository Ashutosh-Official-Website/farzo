
import React, { useState } from 'react';
import { Page, ViewType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  viewType: ViewType;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  cartCount: number;
  wishlistCount: number;
  onSearch: (query: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  viewType, 
  currentPage, 
  setCurrentPage,
  cartCount,
  wishlistCount,
  onSearch
}) => {
  const [query, setQuery] = useState('');

  const BottomNavItem = ({ page, label, icon }: { page: Page, label: string, icon: React.ReactNode }) => (
    <button 
      onClick={() => { setCurrentPage(page); window.scrollTo(0, 0); }}
      className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 flex-1 ${
        currentPage === page ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-200'
      }`}
    >
      <div className={`${currentPage === page ? 'scale-110' : 'scale-100'} transition-transform`}>
        {icon}
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50">
      {/* Top Navigation */}
      <header className="sticky top-0 z-[60] bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand - Always Left */}
          <div 
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            onClick={() => { setCurrentPage(Page.HOME); window.scrollTo(0,0); }}
          >
            <div className="w-9 h-9 md:w-11 md:h-11 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center text-slate-950 font-black italic shadow-[0_0_20px_rgba(6,182,212,0.3)] transform group-hover:rotate-12 transition-transform">
              F
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase group-hover:text-cyan-400 transition-colors hidden xs:block">FAZER</span>
          </div>

          {/* Desktop Search & Nav - Hidden on Mobile */}
          <div className="hidden lg:flex flex-1 max-w-xl items-center gap-8 mx-8">
            <nav className="flex items-center gap-8 shrink-0">
              <button onClick={() => setCurrentPage(Page.HOME)} className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${currentPage === Page.HOME ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}>Home</button>
              <button onClick={() => setCurrentPage(Page.SHOP)} className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${currentPage === Page.SHOP ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}>Shop</button>
              <button onClick={() => setCurrentPage(Page.COMPARE)} className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${currentPage === Page.COMPARE ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}>Compare</button>
            </nav>
            <div className="relative flex-1">
              <input 
                type="text" 
                value={query}
                onChange={(e) => { setQuery(e.target.value); onSearch(e.target.value); }}
                placeholder="SEARCH_ARMORY..."
                className="w-full bg-slate-900/50 border border-slate-800 text-[10px] px-10 py-2.5 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 outline-none transition-all placeholder:text-slate-700 font-black uppercase tracking-widest"
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
          </div>

          {/* Actions - Always Right */}
          <div className="flex items-center gap-1 md:gap-3">
            {/* Mobile Search Button */}
            <button className="lg:hidden p-2 text-slate-400 hover:text-cyan-400">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>

            <button onClick={() => setCurrentPage(Page.WISHLIST)} className="relative p-2 text-slate-400 hover:text-cyan-400 transition-colors hidden sm:flex">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              {wishlistCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-purple-500 border-2 border-slate-950 rounded-full" />}
            </button>

            <button onClick={() => setCurrentPage(Page.CART)} className="relative p-2 text-slate-400 hover:text-cyan-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-cyan-500 text-slate-950 text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-slate-950">{cartCount}</span>
              )}
            </button>

            <button onClick={() => setCurrentPage(Page.PROFILE)} className="flex items-center gap-3 p-1 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500 transition-all ml-2 group">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-800">
                <img src="https://picsum.photos/seed/user/100/100?grayscale" className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Profile" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest mr-2 hidden md:block">Profile</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer - Desktop */}
      <footer className="hidden md:block bg-slate-950 border-t border-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center text-slate-950 font-black italic">F</div>
              <span className="text-xl font-black tracking-tighter uppercase">FAZER</span>
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-relaxed italic">The Hardware Protocol for the Neo-Human Era. Built for Absolute Performance.</p>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">Navigation</h4>
            <nav className="flex flex-col gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <button onClick={() => setCurrentPage(Page.HOME)} className="text-left hover:text-white transition-colors">01 // Home</button>
              <button onClick={() => setCurrentPage(Page.SHOP)} className="text-left hover:text-white transition-colors">02 // Armory</button>
              <button onClick={() => setCurrentPage(Page.COMPARE)} className="text-left hover:text-white transition-colors">03 // Comparison</button>
            </nav>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">System</h4>
            <nav className="flex flex-col gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <button className="text-left hover:text-white transition-colors">Whitepaper</button>
              <button className="text-left hover:text-white transition-colors">Security Audit</button>
              <button className="text-left hover:text-white transition-colors">API Docs</button>
            </nav>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">Sync</h4>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic">Join the global mesh for updates.</p>
            <div className="flex border border-slate-800 rounded-xl p-1 bg-slate-900/50">
               <input type="text" placeholder="IDENTIFIER" className="bg-transparent border-none focus:ring-0 text-[10px] px-3 flex-1 font-mono uppercase tracking-widest" />
               <button className="bg-cyan-500 text-slate-950 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] hover:bg-cyan-400 transition-colors">CONFIRM</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 mt-20 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">
          <p>© 202X FAZER CORP // ALL TRANSMISSIONS ENCRYPTED</p>
          <div className="flex gap-8">
            <button className="hover:text-cyan-400">Privacy Protocol</button>
            <button className="hover:text-cyan-400">Legal Terms</button>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden sticky bottom-0 z-50 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/50 px-4 py-3 flex items-center justify-around">
        <BottomNavItem page={Page.HOME} label="Home" icon={<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>} />
        <BottomNavItem page={Page.SHOP} label="Shop" icon={<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>} />
        <BottomNavItem page={Page.WISHLIST} label="Saved" icon={<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>} />
        <BottomNavItem page={Page.CART} label="Queue" icon={<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>} />
      </nav>
    </div>
  );
};
