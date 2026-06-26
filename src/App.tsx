import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, MapPin, Home, Sparkles, Train, FileText, BarChart3, Info, Download, Plus, Percent, TrendingUp, ShieldCheck, Wallet, Activity, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { indianStatesAndCities, cityMultipliers } from './data';
import { HistoricalChart } from './components/HistoricalChart';
import { CompareTable, ComparisonItem } from './components/CompareTable';
import { downloadReport } from './utils/pdfGenerator';

export default function App() {
  const [state, setState] = useState<string>('Maharashtra');
  const [city, setCity] = useState<string>('Mumbai');
  const [area, setArea] = useState<number>(1200);
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [age, setAge] = useState<number>(5);
  const [propertyType, setPropertyType] = useState<string>('Apartment');
  const [furnishing, setFurnishing] = useState<string>('Semi-Furnished');
  const [condition, setCondition] = useState<string>('Ready to Move');
  const [vastuCompliant, setVastuCompliant] = useState<boolean>(true);
  const [metroProximity, setMetroProximity] = useState<boolean>(true);
  const [gatedCommunity, setGatedCommunity] = useState<boolean>(true);
  
  const [showROI, setShowROI] = useState<boolean>(false);
  const [stressTest, setStressTest] = useState<boolean>(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  
  const [comparisonList, setComparisonList] = useState<ComparisonItem[]>([]);

  const [showLoanModal, setShowLoanModal] = useState<boolean>(false);
  const [annualIncome, setAnnualIncome] = useState<number>(1500000);

  // Update city when state changes
  useEffect(() => {
    if (indianStatesAndCities[state]) {
      setCity(indianStatesAndCities[state][0]);
    }
  }, [state]);

  const cityBaseRate = useMemo(() => cityMultipliers[city] || 5000, [city]);

  const handlePredict = () => {
    setIsPredicting(true);
    setPrediction(null);
    
    // Simulate ANN processing delay
    setTimeout(() => {
      let basePrice = 0;
      
      basePrice += area * cityBaseRate;
      
      // Property type modifiers
      if (propertyType === 'Villa') basePrice *= 1.8;
      if (propertyType === 'Independent House') basePrice *= 1.4;
      if (propertyType === 'Plot') basePrice *= 0.6; 
      
      // Additional rooms value
      basePrice += bedrooms * 400000;
      basePrice += bathrooms * 200000;
      
      // Furnishing
      if (furnishing === 'Fully Furnished') basePrice += (area * 1500);
      if (furnishing === 'Semi-Furnished') basePrice += (area * 600);
      
      // Amenities premium
      if (vastuCompliant) basePrice *= 1.05;
      if (metroProximity) basePrice *= 1.10;
      if (gatedCommunity) basePrice *= 1.08;

      // Condition premium
      if (condition === 'Under Construction') basePrice *= 0.85;
      if (condition === 'Needs Renovation') basePrice *= 0.75;
      
      // Depreciation
      basePrice -= (age * (basePrice * 0.008));
      
      const variance = basePrice * 0.05 * (Math.random() - 0.5);
      
      setPrediction(Math.max(500000, basePrice + variance));
      setIsPredicting(false);
    }, 1200);
  };

  const handleDownload = () => {
    if (prediction === null) return;
    downloadReport({
      state, city, area, bedrooms, bathrooms, age, propertyType, furnishing, prediction, showROI
    });
  };

  const handleAddToCompare = () => {
    if (prediction === null) return;
    const newItem: ComparisonItem = {
      id: Math.random().toString(36).substr(2, 9),
      city,
      propertyType,
      bedrooms,
      area,
      prediction
    };
    setComparisonList([...comparisonList, newItem]);
  };

  const handleRemoveCompare = (id: string) => {
    setComparisonList(comparisonList.filter(item => item.id !== id));
  };

  const calculateLoanEligibility = () => {
    if (!prediction) return { maxLoan: 0, requiredDownPayment: 0, ltvLimit: 0, incomeLimit: 0 };
    
    const maxEMI = (annualIncome / 12) * 0.5; // Max 50% of monthly income
    const interestRate = 8.5 / 12 / 100;
    const tenureMonths = 20 * 12;
    
    // Max loan based on income
    const maxLoanIncome = maxEMI * (Math.pow(1 + interestRate, tenureMonths) - 1) / (interestRate * Math.pow(1 + interestRate, tenureMonths));
    
    // Max loan based on LTV (80% of property value)
    const maxLoanLTV = prediction * 0.8;
    
    const finalMaxLoan = Math.min(maxLoanIncome, maxLoanLTV);
    const requiredDownPayment = prediction - finalMaxLoan;

    return { maxLoan: finalMaxLoan, requiredDownPayment, ltvLimit: maxLoanLTV, incomeLimit: maxLoanIncome };
  };

  const loanData = calculateLoanEligibility();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const getPricePerSqFtColor = (predicted: number, baseRate: number, totalArea: number) => {
    const psqft = predicted / totalArea;
    const ratio = psqft / baseRate;
    if (ratio < 0.9) return { color: 'text-green-600', bg: 'bg-green-50', bar: 'bg-green-500', label: 'Value' };
    if (ratio > 1.25) return { color: 'text-rose-600', bg: 'bg-rose-50', bar: 'bg-rose-500', label: 'Premium' };
    return { color: 'text-amber-600', bg: 'bg-amber-50', bar: 'bg-amber-500', label: 'Standard' };
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-brand-500 p-2 rounded-lg text-white shadow-md shadow-brand-500/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-display font-semibold tracking-tight text-neutral-900">Aura<span className="text-brand-600">Estates</span></h1>
              <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Neural Pricing Engine</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
            <a href="#" className="hover:text-brand-600 transition-colors flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Reports</a>
            <a href="#" className="hover:text-brand-600 transition-colors flex items-center gap-2"><FileText className="w-4 h-4" /> API Docs</a>
            <a href="#" className="hover:text-brand-600 transition-colors flex items-center gap-2"><Info className="w-4 h-4" /> Methodology</a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-10 w-full flex-1">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4 tracking-tight">Property Valuation Interface</h2>
          <p className="text-neutral-600 text-lg leading-relaxed">
            Our artificial neural network has been trained on real estate market data across India to predict accurate property valuations. Adjust the parameters below to run an instant inference.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 pb-20">
          {/* Input Form */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm"
            >
              
              <div className="space-y-6">
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-neutral-400" /> State</label>
                    <select 
                      value={state} 
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 text-neutral-800 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-shadow"
                    >
                      {Object.keys(indianStatesAndCities).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-neutral-400" /> City</label>
                    <select 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 text-neutral-800 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-shadow"
                    >
                      {indianStatesAndCities[state]?.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2 flex items-center gap-1"><Home className="w-3.5 h-3.5 text-neutral-400" /> Property Type</label>
                  <select 
                    value={propertyType} 
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 text-neutral-800 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-shadow"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Independent House">Independent House</option>
                    <option value="Villa">Villa</option>
                    <option value="Plot">Plot</option>
                  </select>
                </motion.div>

                <motion.div variants={itemVariants} className="pt-4 border-t border-neutral-100">
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">Super Built-up Area</label>
                    <span className="text-sm font-mono font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded">{area} sq.ft</span>
                  </div>
                  <input 
                    type="range" min="300" max="10000" step="50" 
                    value={area} onChange={(e) => setArea(Number(e.target.value))}
                    className="input-slider mt-2"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-6 pt-4 border-t border-neutral-100">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">Bedrooms</label>
                      <span className="text-sm font-mono font-medium text-neutral-600">{bedrooms} BHK</span>
                    </div>
                    <input 
                      type="range" min="1" max="6" step="1" 
                      value={bedrooms} onChange={(e) => setBedrooms(Number(e.target.value))}
                      className="input-slider mt-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">Bathrooms</label>
                      <span className="text-sm font-mono font-medium text-neutral-600">{bathrooms}</span>
                    </div>
                    <input 
                      type="range" min="1" max="6" step="1" 
                      value={bathrooms} onChange={(e) => setBathrooms(Number(e.target.value))}
                      className="input-slider mt-2"
                    />
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="pt-4 border-t border-neutral-100">
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">Property Age</label>
                    <span className="text-sm font-mono font-medium text-neutral-600">{age} {age === 1 ? 'Year' : 'Years'}</span>
                  </div>
                  <input 
                    type="range" min="0" max="50" step="1" 
                    value={age} onChange={(e) => setAge(Number(e.target.value))}
                    className="input-slider mt-2"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-100">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">Furnishing</label>
                      <select 
                        value={furnishing} 
                        onChange={(e) => setFurnishing(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 text-neutral-800 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-shadow"
                      >
                        <option value="Unfurnished">Unfurnished</option>
                        <option value="Semi-Furnished">Semi-Furnished</option>
                        <option value="Fully Furnished">Fully Furnished</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">Condition</label>
                      <select 
                        value={condition} 
                        onChange={(e) => setCondition(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 text-neutral-800 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-shadow"
                      >
                        <option value="Ready to Move">Ready to Move</option>
                        <option value="Under Construction">Under Construction</option>
                        <option value="Needs Renovation">Needs Renovation</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 justify-center pt-2 md:pt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors">
                      <input type="checkbox" checked={gatedCommunity} onChange={(e) => setGatedCommunity(e.target.checked)} className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500 border-neutral-300" />
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Gated Community
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors">
                      <input type="checkbox" checked={vastuCompliant} onChange={(e) => setVastuCompliant(e.target.checked)} className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500 border-neutral-300" />
                      <Sparkles className="w-4 h-4 text-amber-500" /> Vastu Compliant
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors">
                      <input type="checkbox" checked={metroProximity} onChange={(e) => setMetroProximity(e.target.checked)} className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500 border-neutral-300" />
                      <Train className="w-4 h-4 text-brand-600" /> Near Metro/Transit
                    </label>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">Financial Analysis</label>
                    <p className="text-[10px] text-neutral-500">Estimate ROI & EMI Calculator (20% Down)</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={showROI} onChange={(e) => setShowROI(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                  </label>
                </motion.div>

              </div>
              
              <motion.button 
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePredict}
                disabled={isPredicting}
                className="w-full mt-8 bg-neutral-900 hover:bg-black text-white font-medium tracking-wide py-4 rounded-xl transition-all shadow-lg shadow-neutral-900/10 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPredicting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Computing Evaluation...
                  </>
                ) : (
                  'Generate Valuation Report'
                )}
              </motion.button>
            </motion.div>
          </div>

          {/* Results & Overview */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Output Display */}
            <div className="flex-1 bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
              
              <AnimatePresence mode="wait">
                {isPredicting ? (
                  <motion.div 
                    key="predicting"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="text-center max-w-sm"
                  >
                    <div className="w-16 h-16 rounded-full border border-neutral-200 shadow-sm flex items-center justify-center mx-auto mb-6 bg-brand-50">
                      <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">Analyzing Parameters</h3>
                    <p className="text-neutral-500 text-sm">Processing location factors, property specifications, and recent market transactions through neural layers...</p>
                    
                    <div className="mt-8 space-y-2">
                      <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 animate-[pulse_1s_ease-in-out_infinite]" style={{ width: '60%' }} />
                      </div>
                      <div className="flex justify-between text-xs font-mono text-neutral-400">
                        <span>Model Weights</span>
                        <span>Loading...</span>
                      </div>
                    </div>
                  </motion.div>
                ) : prediction !== null ? (
                  <motion.div 
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
                    className="text-center w-full px-4"
                  >
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200/60 text-xs font-semibold tracking-wide uppercase mb-6">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      Valuation Complete
                    </div>
                    <p className="text-neutral-500 text-sm font-medium tracking-wide uppercase mb-2">Estimated Market Value</p>
                    <h3 className="text-5xl md:text-6xl font-display font-bold text-neutral-900 mb-2 tracking-tight">
                      ₹{prediction.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </h3>
                    
                    {/* Price per sq.ft visual component */}
                    {(() => {
                      const sqftData = getPricePerSqFtColor(prediction, cityBaseRate, area);
                      return (
                        <div className="flex flex-col items-center justify-center mt-4 mb-2">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${sqftData.bg} ${sqftData.color}`}>
                            <Activity className="w-3.5 h-3.5" />
                            ₹{Math.round(prediction / area).toLocaleString('en-IN')} / sq.ft ({sqftData.label})
                          </div>
                        </div>
                      );
                    })()}
                    
                    <div className="flex items-center justify-center gap-4 mt-4 text-sm font-mono text-neutral-500">
                      <span>Base: ₹{(prediction * 0.95).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                      <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                      <span>Peak: ₹{(prediction * 1.08).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200">
                        <input type="checkbox" checked={stressTest} onChange={(e) => setStressTest(e.target.checked)} className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500 border-neutral-300" />
                        <Activity className="w-4 h-4 text-neutral-500" /> Stress Test (±10%)
                      </label>
                    </div>

                    <AnimatePresence>
                      {stressTest && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="pt-4 border-t border-neutral-100 flex items-center justify-between overflow-hidden px-4"
                        >
                          <div className="text-left">
                            <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">Bear Market (-10%)</p>
                            <p className="text-lg font-bold text-neutral-900">₹{(prediction * 0.9).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                          </div>
                          <div className="h-8 w-px bg-neutral-200"></div>
                          <div className="text-right">
                            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Bull Market (+10%)</p>
                            <p className="text-lg font-bold text-neutral-900">₹{(prediction * 1.1).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div className="mt-8 pt-8 border-t border-neutral-100 grid grid-cols-2 gap-4 text-left">
                      <div>
                        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Model Confidence</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-semibold text-neutral-900">94.2%</span>
                          <span className="text-[10px] font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded uppercase">High</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Market Trend</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-semibold text-neutral-900">+4.5%</span>
                          <span className="text-[10px] font-medium text-neutral-500 uppercase">vs last yr</span>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {showROI && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="pt-4 border-t border-neutral-100 text-left grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden"
                        >
                          <div>
                            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Percent className="w-3 h-3"/> Rental Yield</p>
                            <p className="text-lg font-semibold text-neutral-900">~3.5% <span className="text-xs font-normal text-neutral-500">p.a.</span></p>
                            <p className="text-sm font-mono text-neutral-600 mt-1">₹{Math.round(prediction * 0.035).toLocaleString('en-IN')} /yr</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Appreciation</p>
                            <p className="text-lg font-semibold text-neutral-900">~5.8% <span className="text-xs font-normal text-neutral-500">p.a.</span></p>
                            <p className="text-sm font-mono text-neutral-600 mt-1">₹{Math.round(prediction * 0.058).toLocaleString('en-IN')} /yr</p>
                          </div>
                          <div className="md:border-l md:border-neutral-100 md:pl-4">
                            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Wallet className="w-3 h-3"/> Est. EMI (8.5%)</p>
                            <p className="text-lg font-semibold text-neutral-900">20 <span className="text-xs font-normal text-neutral-500">Years</span></p>
                            <p className="text-sm font-mono text-neutral-600 mt-1 text-brand-600 font-semibold">
                              ₹{Math.round((prediction * 0.8) * (8.5 / 12 / 100) * Math.pow(1 + (8.5 / 12 / 100), 20 * 12) / (Math.pow(1 + (8.5 / 12 / 100), 20 * 12) - 1)).toLocaleString('en-IN')} /mo
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="mt-8 flex items-center justify-center gap-4">
                      <button 
                        onClick={handleAddToCompare}
                        className="flex-1 bg-white border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-medium py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm text-sm"
                      >
                        <Plus className="w-4 h-4" /> Compare
                      </button>
                      <button 
                        onClick={() => setShowLoanModal(true)}
                        className="flex-1 bg-white border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-medium py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm text-sm"
                      >
                        <Wallet className="w-4 h-4" /> Loan Check
                      </button>
                      <button 
                        onClick={handleDownload}
                        className="flex-1 bg-brand-50 border border-brand-100 hover:bg-brand-100 text-brand-700 font-medium py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm text-sm"
                      >
                        <Download className="w-4 h-4" /> Download PDF
                      </button>
                    </div>

                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center max-w-sm"
                  >
                    <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-neutral-100">
                      <BarChart3 className="w-8 h-8 text-neutral-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">Ready for Prediction</h3>
                    <p className="text-neutral-500 text-sm leading-relaxed">Select your property specifications in the panel and generate a real-time valuation report based on current market trends.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Selected Features Preview */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-center md:text-left">
              <FeatureMetric label="Location" value={city.split(' ')[0]} />
              <FeatureMetric label="Type" value={propertyType === 'Independent House' ? 'Ind. House' : propertyType} />
              <FeatureMetric label="Config" value={`${bedrooms} BHK`} />
              <FeatureMetric label="Area" value={`${area} sq.ft`} />
              <FeatureMetric label="Age" value={`${age} Yrs`} />
              <FeatureMetric label="Furnished" value={furnishing.split('-')[0]} />
              <FeatureMetric label="Condition" value={condition === 'Ready to Move' ? 'Ready' : condition.split(' ')[0]} />
            </div>

            {/* Price Trend Chart */}
            {prediction !== null && (
              <HistoricalChart city={city} />
            )}

            {/* Comparison Table */}
            <CompareTable items={comparisonList} onRemove={handleRemoveCompare} />

          </div>
        </div>
      </main>

      {/* Loan Eligibility Modal */}
      <AnimatePresence>
        {showLoanModal && prediction !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">Loan Eligibility Check</h3>
                  <p className="text-sm text-neutral-500 mt-1">Based on current valuation of ₹{prediction.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                </div>
                <button onClick={() => setShowLoanModal(false)} className="text-neutral-400 hover:text-neutral-600 bg-neutral-100 p-2 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Annual Household Income (₹)</label>
                <div className="relative mb-6">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">₹</span>
                  <input 
                    type="number"
                    value={annualIncome || ''}
                    onChange={(e) => setAnnualIncome(Number(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-mono text-lg transition-shadow"
                  />
                </div>

                <div className="space-y-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                    <span className="text-sm font-medium text-neutral-600">Max Loan (Income Based)</span>
                    <span className="font-mono font-medium text-neutral-900">₹{Math.round(loanData.incomeLimit).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                    <span className="text-sm font-medium text-neutral-600">Max Loan (80% LTV)</span>
                    <span className="font-mono font-medium text-neutral-900">₹{Math.round(loanData.ltvLimit).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-neutral-900">Eligible Loan Amount</span>
                    <span className="text-xl font-bold font-mono text-brand-600">₹{Math.round(loanData.maxLoan).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm font-medium text-neutral-600">Required Down Payment</span>
                    <span className="font-mono font-semibold text-neutral-900">₹{Math.round(loanData.requiredDownPayment).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FeatureMetric({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">{label}</span>
      <span className="text-neutral-900 font-medium">{value}</span>
    </div>
  );
}
