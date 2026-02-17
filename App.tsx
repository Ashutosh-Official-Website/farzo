
import React, { useState, useEffect, useMemo } from 'react';
import { Page, ViewType, Product, CartItem } from './types';
import { MOCK_PRODUCTS, CATEGORIES } from './constants';
import { Layout } from './components/Layout';
import { GlassCard } from './components/GlassCard';

export default function App() {
  const [viewType, setViewType] = useState<ViewType>('WEB');
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'rating' | 'price-asc' | 'price-desc'>('rating');

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  // Helpers
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleCompare = (id: string) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const filteredProducts = useMemo(() => {
    let list = MOCK_PRODUCTS.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortOption === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sortOption === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sortOption === 'rating') list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [activeCategory, searchQuery, sortOption]);

  const totalCartPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Components
  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <GlassCard className="group cursor-pointer flex flex-col h-full" onClick={() => { setSelectedProduct(product); setCurrentPage(Page.PRODUCT); window.scrollTo(0,0); }}>
      <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden bg-slate-950">
        <img src={product.image} className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" alt={product.name} />
        
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
          <button 
            onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
            className={`w-9 h-9 md:w-10 md:h-10 rounded-xl backdrop-blur-md flex items-center justify-center border transition-all ${wishlist.includes(product.id) ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-slate-950/60 text-white border-slate-800 hover:border-cyan-500/50'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </button>
        </div>

        <div className="absolute bottom-3 left-3 right-3 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20 hidden md:block">
           <button 
             onClick={(e) => { e.stopPropagation(); addToCart(product); }}
             className="w-full py-3 bg-white text-slate-950 font-black uppercase text-[10px] tracking-widest rounded-lg hover:bg-cyan-400 transition-colors shadow-2xl"
           >
             Equip Module
           </button>
        </div>

        {product.isNew && <span className="absolute top-3 left-3 px-2 py-0.5 bg-cyan-500 text-slate-950 text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded shadow-lg">New_Iter</span>}
      </div>
      <div className="p-4 md:p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2 md:mb-3 gap-2">
          <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter leading-tight italic">{product.name}</h3>
          <span className="font-mono text-cyan-400 font-bold text-base md:text-lg shrink-0">${product.price}</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-1 md:w-1.5 h-1 md:h-1.5 rounded-full ${i < Math.floor(product.rating) ? 'bg-cyan-500 shadow-[0_0_5px_cyan]' : 'bg-slate-800'}`} />
            ))}
          </div>
          <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{product.reviewCount} Reports</span>
        </div>
        <p className="text-slate-500 text-[10px] md:text-xs font-medium leading-relaxed mb-6 line-clamp-2 uppercase italic">{product.description}</p>
        
        {/* Mobile-only CTA */}
        <button 
          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
          className="md:hidden w-full py-3 bg-slate-900 border border-slate-800 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-cyan-500 hover:text-slate-950 transition-all mb-4"
        >
          Add to Queue
        </button>

        <div className="mt-auto flex justify-between items-center text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-slate-700 border-t border-slate-900 pt-4">
           <span>{product.category}</span>
           <span className="text-cyan-500/30">Verified_Iter_4.2</span>
        </div>
      </div>
    </GlassCard>
  );

  // Views
  const HomeView = () => (
    <div className={`space-y-12 md:space-y-24 pb-20 transition-all duration-700 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
      <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center justify-center px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center opacity-25 blur-sm scale-110" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/70 to-slate-950" />
        
        <div className="relative z-10 text-center max-w-5xl space-y-8 pt-12 md:pt-20">
          <div className="inline-block px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] animate-pulse">System_Protocol: Operational</div>
          <h1 className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.85] italic">
            EYE ON THE <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-600">FUTURE.</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-xl max-w-2xl mx-auto font-medium leading-relaxed px-4 italic">
            Fazer bridges the gap between biological potential and technological brilliance. 
            Experience the next iteration of the human interface.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4 px-8 sm:px-0">
            <button onClick={() => setCurrentPage(Page.SHOP)} className="px-10 py-4 md:py-5 bg-white text-slate-950 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs rounded-xl hover:bg-cyan-400 transition-all shadow-[0_15px_40px_rgba(6,182,212,0.3)] transform hover:-translate-y-1">Catalog Registry</button>
            <button className="px-10 py-4 md:py-5 bg-slate-900/50 border border-slate-800 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs rounded-xl hover:text-white transition-all backdrop-blur-sm">Manifesto</button>
          </div>
        </div>
      </section>

      {/* Featured Grid */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic">Current Meta</h2>
            <p className="text-slate-600 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] italic">Standard Gear for Early Adopters</p>
          </div>
          <button onClick={() => setCurrentPage(Page.SHOP)} className="text-cyan-400 text-[10px] font-black uppercase tracking-widest border-b-2 border-cyan-500/20 pb-1 hover:border-cyan-400 transition-all">Expand Protocol</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {MOCK_PRODUCTS.slice(0, 3).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Info Cards - Fluid Layout */}
      <section className="bg-slate-900/40 border-y border-slate-900 py-20 md:py-32">
        <div className="px-4 md:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
          <div className="space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-black text-xl italic shadow-[0_0_15px_rgba(6,182,212,0.1)]">01</div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Profile Sync</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium uppercase italic">Connect your neural mesh for seamless biometric data transfer and instant hardware calibration.</p>
          </div>
          <div className="space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/5 border border-purple-500/20 flex items-center justify-center text-purple-400 font-black text-xl italic shadow-[0_0_15px_rgba(168,85,247,0.1)]">02</div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Armory Loadout</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium uppercase italic">Select mission-critical gear. Utilize AR-reticle projection to verify spatial compatibility.</p>
          </div>
          <div className="space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-pink-500/5 border border-pink-500/20 flex items-center justify-center text-pink-400 font-black text-xl italic shadow-[0_0_15px_rgba(236,72,153,0.1)]">03</div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Quantum Ops</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium uppercase italic">Secure deployment via distributed ledger. Global logistics arrival within 24 standard cycles.</p>
          </div>
        </div>
      </section>

      {/* Lab Banner - Responsive */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto py-12">
        <div className="relative rounded-[40px] overflow-hidden bg-slate-900 border border-slate-800 min-h-[450px] md:min-h-[550px] flex items-center p-6 sm:p-12 md:p-24 group">
          <div className="absolute inset-0 z-0">
             <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1920" className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-[7s]" alt="Labs" />
             <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          </div>
          <div className="relative z-10 max-w-2xl space-y-8">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] italic">FAZER <br/> LABS <span className="text-cyan-400">0.2_PROT</span></h2>
            <p className="text-slate-400 text-base md:text-xl leading-relaxed font-medium italic max-w-lg">Advanced research in collaborative bio-digital architecture. Join the feedback loop.</p>
            <button className="px-10 py-4 border-2 border-cyan-500 text-cyan-400 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs rounded-xl hover:bg-cyan-400 hover:text-slate-950 transition-all shadow-[0_0_40px_rgba(6,182,212,0.2)]">Engage_Prototype</button>
          </div>
        </div>
      </section>
    </div>
  );

  const ShopView = () => (
    <div className="pb-20">
      <div className="bg-slate-900/30 border-b border-slate-800/50 py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div className="space-y-10">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter italic leading-none">The_Armory</h1>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 ${
                    activeCategory === cat ? 'bg-cyan-500 border-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-white hover:border-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Protocol_Order:</span>
            <div className="relative w-full sm:w-64">
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl px-6 py-4 outline-none focus:border-cyan-500 appearance-none cursor-pointer pr-12"
              >
                <option value="rating">Rating_Desc</option>
                <option value="price-asc">Price_Asc</option>
                <option value="price-desc">Price_Desc</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 py-12 max-w-7xl mx-auto">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="py-40 text-center space-y-6">
            <h3 className="text-3xl md:text-4xl font-black uppercase text-slate-800 italic">No Registry Data</h3>
            <button onClick={() => { setActiveCategory('All'); setSearchQuery(''); }} className="text-cyan-500 text-[10px] font-black uppercase tracking-widest border-b-2 border-cyan-500/20 hover:border-cyan-500 pb-1">Reset_Registry_Filter</button>
          </div>
        )}
      </div>
    </div>
  );

  const ProductDetailView = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews'>('overview');
    if (!selectedProduct) return null;

    return (
      <div className="px-4 md:px-8 py-8 md:py-16 max-w-7xl mx-auto space-y-16 md:space-y-32">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          {/* Images */}
          <div className="lg:col-span-7 space-y-6">
            <GlassCard className="aspect-square bg-slate-950 border-slate-800 shadow-2xl overflow-hidden group">
              <img src={selectedProduct.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" alt={selectedProduct.name} />
            </GlassCard>
            <div className="grid grid-cols-4 gap-3 md:gap-6">
              {[1, 2, 3, 4].map(i => (
                <GlassCard key={i} className="aspect-square cursor-pointer hover:border-cyan-500 transition-all group overflow-hidden">
                  <img src={`https://picsum.photos/seed/${selectedProduct.id}${i}/400/400?grayscale`} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" alt="thumb" />
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-5 flex flex-col pt-0 lg:pt-8 space-y-8 md:space-y-12">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 italic">{selectedProduct.category}</span>
                {selectedProduct.isBestseller && <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] italic">Standard_Meta</span>}
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] italic">{selectedProduct.name}</h1>
              <div className="flex flex-wrap items-center gap-6 py-6 border-y border-slate-900">
                <span className="text-4xl font-mono font-bold text-white tracking-tighter">${selectedProduct.price}</span>
                <div className="flex items-center gap-3">
                   <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < Math.floor(selectedProduct.rating) ? 'bg-cyan-500 shadow-[0_0_10px_cyan]' : 'bg-slate-800'}`} />
                      ))}
                   </div>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{selectedProduct.rating} // {selectedProduct.reviewCount} Reports</span>
                </div>
              </div>
            </div>

            <p className="text-slate-400 text-lg leading-relaxed font-medium italic">{selectedProduct.longDescription}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => addToCart(selectedProduct)} className="bg-cyan-500 text-slate-950 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-cyan-400 transition-all transform active:scale-95 shadow-[0_20px_40px_rgba(6,182,212,0.2)]">Add_To_Loadout</button>
              <button onClick={() => toggleWishlist(selectedProduct.id)} className={`py-5 border-2 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] md:text-xs transition-all ${wishlist.includes(selectedProduct.id) ? 'bg-slate-900 text-cyan-400 border-cyan-500' : 'border-slate-800 text-slate-500 hover:text-white hover:border-slate-600'}`}>
                {wishlist.includes(selectedProduct.id) ? 'Reserved' : 'Reserve_Unit'}
              </button>
            </div>

            <div className="p-8 bg-slate-900/20 rounded-3xl border border-slate-800/50 space-y-8">
              <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 shadow-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-cyan-400"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </div>
                <div>
                  <span className="text-slate-600">Availability_Status:</span><br/>
                  <span className="text-white">IMMEDIATE_DEPLOYMENT_ACTIVE</span>
                </div>
              </div>
              <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 shadow-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-cyan-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                </div>
                <div>
                  <span className="text-slate-600">Secure_Protocol:</span><br/>
                  <span className="text-white">QUANTUM_AES_PROTECTION_V3</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Tabs */}
        <div className="space-y-16">
          <div className="flex border-b border-slate-900 overflow-x-auto no-scrollbar">
            {['overview', 'specs', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-10 md:px-14 py-6 text-[10px] font-black uppercase tracking-[0.4em] transition-all relative whitespace-nowrap ${
                  activeTab === tab ? 'text-cyan-400' : 'text-slate-600 hover:text-white'
                }`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_cyan]" />}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
                <div className="space-y-10">
                  <h4 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter">Mission_Critical_Spec</h4>
                  <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed italic border-l-4 border-cyan-500/20 pl-8 md:pl-12">
                    "Every component in the {selectedProduct.name} ecosystem has been vetted in high-interference zones. Built for the modern operator."
                  </p>
                  <div className="space-y-6 pt-4">
                    <div className="flex items-center gap-6 group">
                      <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_15px_cyan] group-hover:scale-125 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Neural_Sync_Ready (99% Stability)</span>
                    </div>
                    <div className="flex items-center gap-6 group">
                      <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_15px_cyan] group-hover:scale-125 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Biometric_Adaptation_Enabled</span>
                    </div>
                  </div>
                </div>
                <GlassCard className="p-8 aspect-video bg-slate-950 flex items-center justify-center border-slate-800">
                  <div className="text-center space-y-8">
                     <div className="w-28 h-28 rounded-full border-2 border-dashed border-cyan-500/20 flex items-center justify-center mx-auto animate-[spin_15s_linear_infinite]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-cyan-400"><path d="M12 2v20"/><path d="m17 17-5 5-5-5"/><path d="m7 7 5-5 5 5"/></svg>
                     </div>
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700 italic">Streaming_Live_Calib_Feed...</p>
                  </div>
                </GlassCard>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 md:gap-x-32 gap-y-4">
                {selectedProduct.specs.map((spec, i) => (
                  <div key={i} className="flex justify-between py-6 border-b border-slate-900 group transition-all hover:bg-slate-900/20 px-4 rounded-xl">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 group-hover:text-cyan-400">{spec.label}</span>
                    <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                   <GlassCard className="p-12 text-center bg-cyan-500/5 border-cyan-500/10">
                      <h5 className="text-7xl font-black uppercase tracking-tighter mb-2 italic shadow-cyan-400">{selectedProduct.rating}</h5>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Telemetry_Average</p>
                   </GlassCard>
                   <div className="lg:col-span-2 flex flex-col md:flex-row items-center justify-between p-10 bg-slate-950 border border-slate-900 rounded-[32px] gap-10">
                      <div className="space-y-4 flex-1 w-full">
                         {[5,4,3,2,1].map(r => (
                           <div key={r} className="flex items-center gap-6">
                              <span className="text-[10px] font-black text-slate-700 w-4">{r}</span>
                              <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                                 <div className="h-full bg-cyan-500 shadow-[0_0_10px_cyan]" style={{ width: `${r === 5 ? '80' : r === 4 ? '15' : '2'}%` }} />
                              </div>
                           </div>
                         ))}
                      </div>
                      <button className="whitespace-nowrap px-10 py-4 border-2 border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-cyan-500 hover:text-cyan-400 transition-all">Submit_Report</button>
                   </div>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {selectedProduct.reviews.map(review => (
                    <GlassCard key={review.id} className="p-8 md:p-10 border-slate-900">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
                             <img src={`https://picsum.photos/seed/${review.userName}/100/100?grayscale`} alt="avatar" />
                          </div>
                          <div>
                            <h6 className="text-base font-black uppercase italic tracking-widest">{review.userName}</h6>
                            <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.4em] mt-1">ID: OP_{review.id}</p>
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full ${i < review.rating ? 'bg-cyan-500 shadow-[0_0_5px_cyan]' : 'bg-slate-900'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-400 text-lg md:text-xl leading-relaxed italic font-medium">"{review.comment}"</p>
                      <div className="mt-8 flex justify-end">
                         <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-700">Recv_Date: {review.date}</span>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Associated */}
        <section className="pt-24 border-t border-slate-900">
           <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-16">Compatible_Loadout_Modules</h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {MOCK_PRODUCTS.filter(p => p.id !== selectedProduct.id).slice(0, 4).map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
           </div>
        </section>
      </div>
    );
  };

  const CompareView = () => {
    const productsToCompare = MOCK_PRODUCTS.filter(p => compareList.includes(p.id));
    
    return (
      <div className="px-4 md:px-8 py-12 md:py-24 max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter mb-20 leading-none">Telemetry_Compare</h1>
        {productsToCompare.length === 0 ? (
          <div className="text-center py-40 space-y-12 bg-slate-900/10 rounded-[48px] border-2 border-dashed border-slate-900">
            <h2 className="text-2xl md:text-3xl text-slate-700 font-black uppercase italic tracking-widest px-8">No Modules Assigned for Telemetry</h2>
            <button onClick={() => setCurrentPage(Page.SHOP)} className="px-12 py-6 bg-cyan-500 text-slate-950 font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl hover:bg-cyan-400 transform hover:-translate-y-1 transition-all">Registry_Access</button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[40px] border border-slate-900 shadow-2xl no-scrollbar">
            <table className="w-full text-left border-collapse bg-slate-950/20 backdrop-blur-xl min-w-[900px]">
               <thead>
                  <tr>
                     <th className="p-12 border-b border-slate-900 w-[20%] md:w-[25%] bg-slate-900/30"></th>
                     {productsToCompare.map(p => (
                       <th key={p.id} className="p-12 border-b border-slate-900 text-center">
                          <div className="space-y-8 flex flex-col items-center">
                             <img src={p.image} className="w-48 h-48 rounded-[32px] object-cover grayscale border border-slate-900 shadow-2xl" alt={p.name} />
                             <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none">{p.name}</h3>
                             <button onClick={() => toggleCompare(p.id)} className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500 hover:text-red-400 transition-colors">Eject_Module</button>
                          </div>
                       </th>
                     ))}
                  </tr>
               </thead>
               <tbody>
                  <tr className="group">
                     <td className="p-12 border-b border-slate-900 text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] bg-slate-900/10 italic">Valuation_Index</td>
                     {productsToCompare.map(p => <td key={p.id} className="p-12 border-b border-slate-900 font-mono font-bold text-white text-2xl text-center">${p.price}</td>)}
                  </tr>
                  <tr className="group">
                     <td className="p-12 border-b border-slate-900 text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] bg-slate-900/10 italic">Layer_Class</td>
                     {productsToCompare.map(p => <td key={p.id} className="p-12 border-b border-slate-900 text-xs uppercase font-black tracking-widest text-slate-300 text-center">{p.category}</td>)}
                  </tr>
                  <tr className="group">
                     <td className="p-12 border-b border-slate-900 text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] bg-slate-900/10 italic">Report_Metrics</td>
                     {productsToCompare.map(p => <td key={p.id} className="p-12 border-b border-slate-900 text-xs font-black text-cyan-400 tracking-widest text-center">{p.rating} // STABLE</td>)}
                  </tr>
                  <tr className="group">
                     <td className="p-12 border-b border-slate-900 text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] bg-slate-900/10 italic">Protocol_Brief</td>
                     {productsToCompare.map(p => <td key={p.id} className="p-12 border-b border-slate-900 text-[11px] text-slate-400 leading-relaxed font-medium italic text-center max-w-[300px]">{p.description}</td>)}
                  </tr>
                  <tr>
                     <td className="p-12 border-b border-slate-900 bg-slate-900/10"></td>
                     {productsToCompare.map(p => (
                       <td key={p.id} className="p-12 border-b border-slate-900 text-center">
                          <button onClick={() => addToCart(p)} className="w-full max-w-[200px] mx-auto py-5 bg-white text-slate-950 text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-cyan-400 transition-all shadow-xl">Equip_Mod</button>
                       </td>
                     ))}
                  </tr>
               </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const WishlistView = () => {
    const items = MOCK_PRODUCTS.filter(p => wishlist.includes(p.id));
    return (
      <div className="px-4 md:px-8 py-12 md:py-24 max-w-7xl mx-auto">
         <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter mb-20 leading-none">Saved_Transmissions</h1>
         {items.length === 0 ? (
           <div className="text-center py-40 italic text-slate-700 font-black uppercase tracking-[0.4em] border-2 border-dashed border-slate-900 rounded-[48px] px-8">Wishlist Registry Is Offline...</div>
         ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {items.map(p => <ProductCard key={p.id} product={p} />)}
           </div>
         )}
      </div>
    );
  };

  const CheckoutView = () => (
    <div className="px-4 md:px-8 py-12 md:py-24 max-w-7xl mx-auto">
       <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-20 italic leading-none text-center md:text-left">Secure_Deploy</h1>
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <div className="lg:col-span-7 space-y-16">
             {/* Dest */}
             <div className="space-y-8">
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 rounded-2xl bg-cyan-500/5 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black italic shadow-xl">01</div>
                   <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-cyan-500 italic">Target_Drop_Zone</h3>
                </div>
                <GlassCard className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 border-slate-900">
                   <div className="md:col-span-2">
                     <input placeholder="NEURAL_OPERATOR_HASH" className="w-full bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] outline-none focus:border-cyan-500 placeholder:text-slate-800" />
                   </div>
                   <div className="md:col-span-2">
                     <input placeholder="SECTOR_COORDINATES" className="w-full bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] outline-none focus:border-cyan-500 placeholder:text-slate-800" />
                   </div>
                   <div>
                     <input placeholder="HASH_ZIP" className="w-full bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] outline-none focus:border-cyan-500 placeholder:text-slate-800" />
                   </div>
                   <div>
                     <input placeholder="CITY_GRID_ID" className="w-full bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] outline-none focus:border-cyan-500 placeholder:text-slate-800" />
                   </div>
                </GlassCard>
             </div>
             {/* Payment */}
             <div className="space-y-8">
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 rounded-2xl bg-cyan-500/5 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black italic shadow-xl">02</div>
                   <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-cyan-500 italic">Transfer_Protocol</h3>
                </div>
                <GlassCard className="p-8 md:p-10 space-y-4 bg-slate-950 border-slate-900">
                   <div className="flex items-center justify-between p-6 md:p-8 border-2 border-cyan-500/40 bg-cyan-500/5 rounded-[24px] cursor-pointer shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                      <div className="flex items-center gap-6">
                         <div className="w-4 h-4 rounded-full bg-cyan-500 shadow-[0_0_15px_cyan]" />
                         <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-white">FAZER_PAY // QUANTUM_LNK</span>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-cyan-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                   </div>
                   <div className="flex items-center justify-between p-6 md:p-8 border border-slate-900 rounded-[24px] cursor-pointer hover:border-slate-700 transition-colors">
                      <div className="flex items-center gap-6">
                         <div className="w-4 h-4 rounded-full border-2 border-slate-800" />
                         <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-slate-600">CRYPTO_MESH_AUTH</span>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-800"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
                   </div>
                </GlassCard>
             </div>
          </div>

          {/* Sidebar Manifest */}
          <div className="lg:col-span-5">
             <div className="sticky top-28 space-y-8">
               <GlassCard className="p-10 md:p-12 space-y-10 bg-slate-950 border-2 border-slate-900 shadow-[0_30px_60px_rgba(0,0,0,0.5)] rounded-[48px]">
                  <h4 className="text-2xl font-black uppercase tracking-tight border-b border-slate-900 pb-8 italic">Cargo_Manifest</h4>
                  <div className="space-y-6 max-h-[350px] overflow-y-auto pr-4 custom-scrollbar">
                     {cart.map(item => (
                       <div key={item.id} className="flex justify-between items-center py-2 group">
                          <div className="flex items-center gap-5">
                             <div className="w-14 h-14 rounded-2xl grayscale border border-slate-900 overflow-hidden shrink-0 shadow-lg">
                               <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                             </div>
                             <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white group-hover:text-cyan-400 transition-colors">{item.name}</span>
                                <span className="text-[9px] font-bold text-slate-600 uppercase mt-1">Units: {item.quantity}</span>
                             </div>
                          </div>
                          <span className="font-mono text-sm font-bold text-slate-400 shrink-0">${item.price * item.quantity}</span>
                       </div>
                     ))}
                  </div>
                  <div className="space-y-6 pt-8 border-t border-slate-900">
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-600">
                        <span>Logistics_Deployment</span>
                        <span className="text-cyan-400">FREE_SYNC</span>
                     </div>
                     <div className="flex justify-between font-black uppercase tracking-tighter text-4xl italic pt-4">
                        <span className="text-slate-400">Total</span>
                        <span className="text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">${totalCartPrice}</span>
                     </div>
                  </div>
                  <button className="w-full py-6 md:py-8 bg-white text-slate-950 font-black uppercase tracking-[0.4em] rounded-[24px] hover:bg-cyan-400 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] active:scale-95 text-xs">Execute_Command</button>
                  <p className="text-[8px] text-center font-black uppercase tracking-[0.5em] text-slate-800 italic">Auth implies acceptance of Fazer Protocol V_7.2</p>
               </GlassCard>
             </div>
          </div>
       </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-50 selection:bg-cyan-500 selection:text-slate-950 antialiased overflow-x-hidden">
      <Layout 
        viewType={viewType} 
        currentPage={currentPage} 
        setCurrentPage={(p) => { setCurrentPage(p); window.scrollTo(0,0); }}
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        wishlistCount={wishlist.length}
        onSearch={setSearchQuery}
      >
        <div className="transition-all duration-500 w-full">
          {currentPage === Page.HOME && <HomeView />}
          {currentPage === Page.SHOP && <ShopView />}
          {currentPage === Page.PRODUCT && <ProductDetailView />}
          {currentPage === Page.CART && (
            <div className="px-4 md:px-8 py-12 md:py-24 max-w-5xl mx-auto">
              <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-20 italic text-center md:text-left">Cargo_Queue</h1>
              {cart.length > 0 ? (
                <div className="space-y-12">
                  <div className="space-y-6">
                    {cart.map(item => (
                      <GlassCard key={item.id} className="p-6 md:p-10 flex flex-col sm:flex-row items-center gap-8 md:gap-12 border-slate-900/50 hover:border-cyan-500/20 transition-all">
                        <div className="w-32 h-32 md:w-48 md:h-48 rounded-[32px] overflow-hidden grayscale border border-slate-900 shrink-0 shadow-2xl">
                          <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                        </div>
                        <div className="flex-1 text-center sm:text-left space-y-4">
                          <div className="space-y-1">
                            <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic leading-none">{item.name}</h3>
                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em]">{item.category}</p>
                          </div>
                          <div className="flex items-center justify-center sm:justify-start gap-8 bg-slate-950 p-3 md:p-4 rounded-[16px] border border-slate-900 inline-flex shadow-xl">
                            <button onClick={() => addToCart({ ...item, quantity: -2 } as any)} className="text-slate-500 hover:text-cyan-400 font-black text-lg transition-colors">－</button>
                            <span className="font-mono font-black text-white w-10 text-center text-lg">{item.quantity}</span>
                            <button onClick={() => addToCart(item)} className="text-slate-500 hover:text-cyan-400 font-black text-lg transition-colors">＋</button>
                          </div>
                        </div>
                        <div className="text-center sm:text-right space-y-4 shrink-0">
                          <p className="text-3xl md:text-4xl font-mono font-bold text-cyan-400 tracking-tighter">${item.price * item.quantity}</p>
                          <button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500 hover:text-red-400 hover:underline block w-full sm:w-auto">Eject_Module</button>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                  <div className="pt-16 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="text-center md:text-left space-y-2">
                      <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] italic">Aggregate_Market_Value</p>
                      <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">TOTAL: <span className="text-cyan-400">${totalCartPrice}</span></h3>
                    </div>
                    <button onClick={() => setCurrentPage(Page.CHECKOUT)} className="w-full md:w-auto px-20 py-7 md:py-8 bg-cyan-500 text-slate-950 font-black uppercase tracking-[0.3em] text-xs md:text-sm rounded-[24px] shadow-[0_25px_60px_rgba(6,182,212,0.4)] hover:bg-cyan-400 transform hover:-translate-y-1 transition-all">Begin_Deployment</button>
                  </div>
                </div>
              ) : (
                <div className="py-40 text-center space-y-10 bg-slate-900/10 border-2 border-dashed border-slate-900 rounded-[64px] px-8">
                  <h3 className="text-3xl md:text-4xl font-black uppercase text-slate-700 italic tracking-widest">Queue Is Depleted</h3>
                  <button onClick={() => setCurrentPage(Page.SHOP)} className="px-14 py-6 bg-white text-slate-950 font-black uppercase tracking-[0.3em] text-xs rounded-2xl shadow-2xl hover:bg-cyan-400 transition-all">Registry_Access</button>
                </div>
              )}
            </div>
          )}
          {currentPage === Page.WISHLIST && <WishlistView />}
          {currentPage === Page.COMPARE && <CompareView />}
          {currentPage === Page.CHECKOUT && <CheckoutView />}
          {currentPage === Page.PROFILE && (
            <div className="px-6 py-24 md:py-48 text-center max-w-4xl mx-auto space-y-12">
              <div className="w-40 h-40 md:w-64 md:h-64 rounded-[64px] bg-gradient-to-br from-cyan-400 to-purple-600 mx-auto p-1.5 shadow-[0_40px_100px_rgba(6,182,212,0.3)] group cursor-pointer">
                 <div className="w-full h-full bg-slate-950 rounded-[60px] flex items-center justify-center overflow-hidden">
                    <img src="https://picsum.photos/seed/profile/400/400?grayscale" className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform" alt="Operator" />
                 </div>
              </div>
              <div className="space-y-6">
                <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">Operator: 9214</h1>
                <p className="text-cyan-400 text-xs font-black uppercase tracking-[0.6em] italic">Class_4_Clearance_Validated</p>
              </div>
              <p className="text-slate-500 text-lg md:text-xl font-medium italic max-w-2xl mx-auto leading-relaxed">Encrypted transaction logs and neural history access requires active physical sync via the Fazer Link mesh hardware.</p>
              <div className="pt-10">
                <button className="px-14 py-6 border-2 border-slate-900 rounded-[24px] text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 hover:border-cyan-500 hover:text-white transition-all">Request_BioAuth_Key</button>
              </div>
            </div>
          )}
        </div>
      </Layout>

      {/* Floating HUD - Desktop Only */}
      <div className="fixed bottom-10 right-10 z-50 pointer-events-none opacity-40 hidden lg:block">
         <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.3em] leading-relaxed text-right border-r-2 border-cyan-500/50 pr-6">
            LNK: STABLE_99<br/>
            CRYPTO: AES_V4<br/>
            POS: 35.68 N / 139.69 E<br/>
            <span className="animate-pulse">RECV_FEED_ACTIVE</span>
         </div>
      </div>
    </div>
  );
}
