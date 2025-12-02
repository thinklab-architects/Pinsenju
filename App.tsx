
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { MapPin, Menu, X, ChevronLeft, ChevronRight, Home, Sun, TreePine, Car, Phone, Mail } from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import FeatureCard from './components/ArtistCard'; // Reusing as FeatureCard
import AIChat from './components/AIChat';
import ImageGallery from './components/ImageGallery';
import { PropertyFeature } from './types';

// Images
import heroDay1 from './images/日景A1.png';
import heroNight1 from './images/夜景A1.png';
import heroNight2 from './images/夜景B1.png';
import heroDayB4 from './images/日景B4.png';

import featureGeo from './images/日景A2.png';
import featureGeoB3 from './images/日景B3.png';
import featureGarden from './images/露臺1.png';
import featureLight from './images/日景B2.png';
import featureRooftop from './images/露臺2.png';

import lifestyleNight from './images/夜景B3.png';
import nightA2 from './images/夜景A2.png';
import logo from './images/logo.png';

// Real Estate Data
const FEATURES: PropertyFeature[] = [
  {
    id: '1',
    title: '幾何美學',
    subtitle: 'Modern Geometry',
    tag: 'Exterior',
    image: featureGeoB3,
    description: '純粹的幾何線條，勾勒出當代建築的力度。白色量體與光影交織，展現極簡主義的深邃內涵。'
  },
  {
    id: '2',
    title: '層疊綠意',
    subtitle: 'Vertical Garden',
    tag: 'Nature',
    image: featureGarden,
    description: '戶戶規劃寬敞露台，將自然綠意垂直延伸。每一次呼吸，都是芬多精的洗禮。'
  },
  {
    id: '3',
    title: '極致採光',
    subtitle: 'Natural Light',
    tag: 'WIND/LIGHT',
    image: featureLight,
    description: '大面落地窗設計，引進充沛自然光線。室內外界線消弭，空間更顯開闊通透。'
  },
  {
    id: '4',
    title: '空中花園',
    subtitle: 'Rooftop Lounge',
    tag: 'Lifestyle',
    image: featureRooftop,
    description: '頂樓空中花園，盡覽城市天際線。是晨間瑜伽或夜間小酌的最佳場域。'
  }
];

const HERO_IMAGES = [
  heroDayB4,   // 日景B4
  heroNight2,  // 夜景B1
  featureLight, // 日景B2
  heroNight1   // 夜景A1
];

const GALLERY_IMAGES = [
  heroDayB4,    // 日景B4
  heroNight2,   // 夜景B1
  featureLight, // 日景B2
  heroNight1,   // 夜景A1
  heroDay1,     // 日景A1
  featureGeo,   // 日景A2
  featureGeoB3, // 日景B3
  featureGarden,// 露臺1
  featureRooftop,// 露臺2
  lifestyleNight,// 夜景B3
  nightA2       // 夜景A2
];

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<PropertyFeature | null>(null);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [currentLifestyleIndex, setCurrentLifestyleIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedFeature) {
        if (e.key === 'ArrowLeft') navigateFeature('prev');
        if (e.key === 'ArrowRight') navigateFeature('next');
        if (e.key === 'Escape') setSelectedFeature(null);
      } else {
        // Hero slider navigation when modal is closed
        if (e.key === 'ArrowLeft') prevHeroSlide();
        if (e.key === 'ArrowRight') nextHeroSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFeature]);

  // Auto-play hero slider
  useEffect(() => {
    const timer = setInterval(() => {
      nextHeroSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Auto-play lifestyle slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentLifestyleIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navigateFeature = (direction: 'next' | 'prev') => {
    if (!selectedFeature) return;
    const currentIndex = FEATURES.findIndex(a => a.id === selectedFeature.id);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % FEATURES.length;
    } else {
      nextIndex = (currentIndex - 1 + FEATURES.length) % FEATURES.length;
    }
    setSelectedFeature(FEATURES[nextIndex]);
  };

  const nextHeroSlide = () => {
    setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
  };

  const prevHeroSlide = () => {
    setCurrentHeroIndex((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  };

  return (
    <div
      className="relative min-h-screen text-gray-800 selection:bg-[#dcfce7] selection:text-green-900 cursor-auto md:cursor-none overflow-x-hidden font-serif"
      onContextMenu={(e) => e.preventDefault()}
    >
      <CustomCursor />
      <FluidBackground />
      <AIChat />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-6 bg-white/70 backdrop-blur-md border-b border-white/20">
        <a href="https://www.yuandevelopment.com/" target="_blank" rel="noopener noreferrer" className="font-heading text-xl md:text-2xl font-bold tracking-widest text-gray-900 cursor-pointer z-50 uppercase flex items-center gap-3">
          <img src={logo} alt="YUAN DEVELOPMENT" className="h-10 w-auto" />
          <span className="font-cormorant font-bold">YUAN DEVELOPMENT</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-12 text-xs font-bold tracking-[0.2em] uppercase text-gray-600">
          {['Features', 'Lifestyle', 'Contact'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item.toLowerCase())}
              className="hover:text-black transition-colors cursor-pointer bg-transparent border-none relative group"
              data-hover="true"
            >
              {item}
              <span className="absolute -bottom-2 left-0 w-0 h-px bg-black transition-all group-hover:w-full" />
            </button>
          ))}
        </div>
        <button
          onClick={() => scrollToSection('contact')}
          className="hidden md:inline-block border border-gray-900 px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-gray-900 hover:text-white transition-all duration-300 text-gray-900 cursor-pointer bg-transparent"
          data-hover="true"
        >
          預約賞屋
        </button>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-900 z-50 relative w-10 h-10 flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {['Features', 'Lifestyle', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-3xl font-serif font-medium text-gray-900 hover:text-green-800 transition-colors uppercase bg-transparent border-none"
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('contact')}
              className="mt-8 bg-gray-900 text-white px-12 py-4 text-sm font-bold tracking-widest uppercase"
            >
              預約賞屋
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <header className="relative h-[100svh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden px-4">
        {/* Carousel Background */}
        <div className="absolute inset-0 z-[-1] overflow-hidden bg-gray-200">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={currentHeroIndex}
              src={HERO_IMAGES[currentHeroIndex]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
              alt="Pin Sen Ju Atmosphere"
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-white/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/10" />
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevHeroSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-gray-900/10 flex items-center justify-center hover:bg-white/80 hover:scale-105 transition-all duration-300 backdrop-blur-sm group"
          aria-label="Previous Slide"
          data-hover="true"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:text-gray-900" />
        </button>

        <button
          onClick={nextHeroSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-gray-900/10 flex items-center justify-center hover:bg-white/80 hover:scale-105 transition-all duration-300 backdrop-blur-sm group"
          aria-label="Next Slide"
          data-hover="true"
        >
          <ChevronRight className="w-6 h-6 text-gray-700 group-hover:text-gray-900" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {HERO_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentHeroIndex(idx)}
              className={`h-1 transition-all duration-300 rounded-full ${currentHeroIndex === idx ? 'w-8 bg-gray-900' : 'w-2 bg-gray-400 hover:bg-gray-600'}`}
              data-hover="true"
            />
          ))}
        </div>

        <motion.div
          style={{ y, opacity }}
          className="z-10 text-center flex flex-col items-center w-full max-w-6xl pb-24 md:pb-20"
        >
          {/* Date / Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center gap-3 md:gap-6 text-xs md:text-sm font-serif text-gray-600 tracking-[0.2em] md:tracking-[0.3em] uppercase mb-6 bg-white/80 px-6 py-2 rounded-full backdrop-blur-md shadow-sm border border-white/50"
          >
            <span>潮州</span>
            <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
            <span>屏東</span>
          </motion.div>

          {/* Main Title */}
          <div className="relative w-full flex flex-col justify-center items-center">
            <h1 className="text-[12vw] md:text-[8vw] leading-[1] font-bold tracking-wide text-gray-900 drop-shadow-sm font-zen">
              品 森 居
            </h1>
            <p className="text-xl md:text-3xl font-light tracking-[0.5em] text-gray-700 mt-4 uppercase font-cormorant">
              PIN SEN JU
            </p>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
            className="w-24 h-1 bg-gray-900 mt-8 mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-lg md:text-xl font-serif text-gray-800 leading-loose max-w-lg mx-auto text-center"
          >
            森呼吸 · 心居所<br />
            <span className="text-sm md:text-base text-green-800 font-bold tracking-[0.2em] mt-3 block uppercase font-cormorant">
              LIVING IN THE WOODS!
            </span>
          </motion.p>
        </motion.div>


      </header>

      {/* FEATURES SECTION */}
      <section id="features" className="relative z-10 py-20 md:py-32 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 px-4 border-b border-gray-200 pb-8">
            <div>
              <span className="text-green-800 font-bold tracking-widest uppercase text-sm mb-2 block font-cormorant">Architecture & Design</span>
              <h2 className="text-4xl md:text-6xl font-zen font-medium text-gray-900">
                建築美學
              </h2>
            </div>
            <p className="max-w-md text-gray-500 mt-4 md:mt-0 leading-relaxed font-light">
              融合現代幾何與自然元素，打造會呼吸的建築。每一處細節，都體現了對生活的極致追求。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-gray-200">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.id} artist={feature} onClick={() => setSelectedFeature(feature)} />
            ))}
          </div>
        </div>
      </section>

      {/* LIFESTYLE SECTION */}
      <section id="lifestyle" className="relative z-10 py-20 md:py-32 bg-[#f3f4f6] overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white skew-x-12 translate-x-1/4 -z-10" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <span className="text-gray-500 font-bold tracking-widest uppercase text-xs mb-4 block font-cormorant">The Experience</span>
              <h2 className="text-4xl md:text-6xl font-zen font-medium mb-8 text-gray-900 leading-tight">
                生活 <br /> <GradientText text="質感體驗" className="text-5xl md:text-7xl font-zen" />
              </h2>
              <p className="text-lg text-gray-600 mb-12 font-serif leading-relaxed">
                品森居不僅是一座建築，更是一種生活態度。位於城市靜巷，隔絕喧囂，讓您在繁忙過後，回歸最純粹的寧靜。
              </p>

              <div className="space-y-8">
                {[
                  { icon: Sun, title: '自然共生', desc: '與陽光、微風、綠意共處的日常。' },
                  { icon: TreePine, title: '垂直森林', desc: '層層疊翠的陽台植栽，淨化空氣與心靈。' },
                  { icon: Home, title: '人本居住', desc: '結合自然與人性化設計的舒適空間。' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-6 group"
                  >
                    <div className="p-4 rounded-full bg-white border border-gray-100 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <h4 className="text-xl font-medium mb-2 font-zen text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 relative h-[500px] md:h-[700px] w-full order-1 lg:order-2">
              <div className="relative h-full w-full overflow-hidden shadow-2xl cursor-pointer" onClick={() => {
                setGalleryStartIndex(currentLifestyleIndex);
                setIsGalleryOpen(true);
              }}>
                <AnimatePresence mode="popLayout">
                  <motion.img
                    key={currentLifestyleIndex}
                    src={GALLERY_IMAGES[currentLifestyleIndex]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    alt="Interior Lifestyle"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2s] hover:scale-105"
                  />
                </AnimatePresence>

                <div className="absolute bottom-0 left-0 bg-white/90 backdrop-blur-md p-8 md:p-12 max-w-md z-10">
                  <p className="font-zen text-2xl italic text-gray-800">"家，是心靈的歸屬，是安放靈魂的容器。"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT / BOOKING SECTION */}
      <section id="contact" className="relative z-10 py-20 md:py-32 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-zen font-medium text-gray-900 mb-4">
              預約賞屋
            </h2>
            <p className="text-gray-500 font-cormorant uppercase tracking-widest text-sm md:text-base">
              Reserve Your Private Tour
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: '微風透天',
                type: 'Townhouse',
                features: [
                  { icon: MapPin, text: '建坪 37.65 坪' },
                  { icon: MapPin, text: '地坪 24.91 坪' },
                  { icon: Car, text: '私人雙車' },
                  { icon: TreePine, text: '景觀露台' },
                  { icon: Sun, text: '前後採光' },
                  { icon: Home, text: '即刻入住' }
                ]
              },
              {
                name: '花園別墅',
                type: 'NATURE VILLA',
                features: [
                  { icon: MapPin, text: '建坪 48.03 坪' },
                  { icon: MapPin, text: '地坪 36.83 坪' },
                  { icon: Car, text: '私人雙車' },
                  { icon: TreePine, text: '景觀大露台' },
                  { icon: Sun, text: '三面採光' },
                  { icon: Home, text: '即刻入住' }
                ]
              },
              {
                name: 'VIP 賞屋',
                type: 'Private Tour',
                features: [
                  { icon: MapPin, text: '專人導覽' },
                  { icon: Car, text: '專屬停車' },
                  { icon: TreePine, text: '深度體驗' }
                ]
              },
            ].map((plan, i) => {
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -10 }}
                  className="relative p-10 border border-gray-200 bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[400px]"
                  data-hover="true"
                >
                  <div>
                    <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2 block font-cormorant">{plan.type}</span>
                    <h3 className="text-3xl font-zen font-medium mb-6 text-gray-900">{plan.name}</h3>
                    <div className="w-12 h-px bg-gray-300 mb-8" />
                    <ul className="space-y-4 text-gray-600 font-light">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <feature.icon className="w-4 h-4 text-gray-400" />
                          {feature.text}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href="https://airtable.com/appOXggP5iMqw6b2k/pagDfvjwcVkEvbFYZ/form"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 text-sm font-bold uppercase tracking-[0.2em] border border-gray-900 transition-all duration-300 mt-10 block text-center bg-transparent text-gray-900 hover:bg-gray-900 hover:text-white"
                  >
                    立即預約
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-gray-200 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12">
          <div>
            <a href="https://www.yuandevelopment.com/" target="_blank" rel="noopener noreferrer" className="font-heading text-3xl font-bold tracking-widest mb-6 text-gray-900 flex items-center gap-3">
              <img src={logo} alt="YUAN DEVELOPMENT" className="h-10 w-auto" />
              <span className="font-cormorant">YUAN DEVELOPMENT</span>
            </a>
            <address className="not-italic text-gray-500 space-y-2 text-sm font-light">
              <p className="flex items-center gap-3">
                <MapPin className="w-4 h-4" />
                <a href="https://maps.app.goo.gl/zWFNwJdhkA6Ts2Fk7" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                  920屏東縣潮州鎮光復路一段28巷
                </a>
              </p>
              <p className="flex items-center gap-3"><Phone className="w-4 h-4" /> (08) 766-2066</p>
            </address>
          </div>

          <div className="flex gap-8">
            <a href="https://www.facebook.com/DONGYUAN.DEVELOPMENT" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 font-bold uppercase text-xs tracking-widest transition-colors font-cormorant">Facebook</a>
            <a href="https://www.instagram.com/yuandevelopment/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 font-bold uppercase text-xs tracking-widest transition-colors font-cormorant">Instagram</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-200 text-center md:text-left">
          <p className="text-xs text-gray-400 font-cormorant">© 2025 品森居 Pin Sen Ju. All rights reserved. THINKLAB ARCHITECTS DESIGN</p>
        </div>
      </footer>

      {/* Feature Detail Modal */}
      <AnimatePresence>
        {selectedFeature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedFeature(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl bg-white overflow-hidden flex flex-col md:flex-row shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedFeature(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-black/80 hover:text-white transition-colors text-black backdrop-blur-md"
                data-hover="true"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={(e) => { e.stopPropagation(); navigateFeature('prev'); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/80 hover:bg-black hover:text-white transition-colors shadow-lg"
                data-hover="true"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); navigateFeature('next'); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/80 hover:bg-black hover:text-white transition-colors shadow-lg"
                data-hover="true"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image Side */}
              <div className="w-full md:w-3/5 h-[40vh] md:h-[70vh] relative overflow-hidden bg-gray-100">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedFeature.id}
                    src={selectedFeature.image}
                    alt={selectedFeature.title}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
              </div>

              {/* Content Side */}
              <div className="w-full md:w-2/5 p-10 md:p-16 flex flex-col justify-center bg-white relative">
                <motion.div
                  key={selectedFeature.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <span className="text-green-800 font-bold tracking-[0.2em] uppercase text-xs mb-4 block font-cormorant">
                    {selectedFeature.tag}
                  </span>

                  <h3 className="text-4xl md:text-5xl font-zen font-medium mb-4 text-gray-900">
                    {selectedFeature.title}
                  </h3>

                  <p className="text-lg text-gray-400 font-light tracking-wide mb-8 uppercase font-cormorant">
                    {selectedFeature.subtitle}
                  </p>

                  <div className="h-px w-16 bg-gray-300 mb-8" />

                  <p className="text-gray-600 leading-loose text-base md:text-lg font-serif">
                    {selectedFeature.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ImageGallery
        images={GALLERY_IMAGES}
        isOpen={isGalleryOpen}
        startIndex={galleryStartIndex}
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  );
};

export default App;
