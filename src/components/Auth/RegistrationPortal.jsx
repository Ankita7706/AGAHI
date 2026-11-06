import React, { useState } from 'react';
import { 
  Shield, 
  Video, 
  Activity, 
  MapPin, 
  User, 
  Mail, 
  Lock, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle,
  Eye,
  EyeOff,
  Sparkles,
  Building2,
  Zap,
  Check
} from 'lucide-react';
import { JUNCTIONS } from '../../data/mockTrafficData';

export default function RegistrationPortal({ onAuthenticate }) {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states - preserved
  const [formData, setFormData] = useState({
    name: 'Er. Ananya Patnaik',
    email: 'ananya.patnaik@smartcitybhubaneswar.gov.in',
    agency: 'Bhubaneswar Smart City Ltd (BSCL - ICCC)',
    role: 'Senior Traffic Safety Engineer',
    junction: 'jayadev-vihar',
    password: 'password123',
    confirmPassword: 'password123',
    agreedToTerms: true
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all required credentials.');
      return;
    }
    if (isRegister) {
      if (!formData.name) {
        setError('Please enter your full official name.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (!formData.agreedToTerms) {
        setError('Please accept the Road Safety Data Compliance terms.');
        return;
      }
    }

    onAuthenticate({
      name: formData.name || 'Officer In-Charge',
      email: formData.email,
      agency: formData.agency,
      role: formData.role,
      junction: formData.junction,
      token: 'AGAHI-SECURE-TOKEN-' + Math.floor(Math.random() * 899999 + 100000)
    });
  };

  const handleQuickDemo = (roleType = 'Safety Engineer') => {
    onAuthenticate({
      name: roleType === 'Safety Engineer' ? 'Er. Priyabrata Mohapatra' : 'Inspector S. Nayak',
      email: 'p.mohapatra@smartcitybhubaneswar.gov.in',
      agency: 'Bhubaneswar Smart City Limited (ICCC)',
      role: roleType === 'Safety Engineer' ? 'Senior Traffic Safety Engineer' : 'Traffic Enforcement Lead',
      junction: 'jayadev-vihar',
      token: 'AGAHI-DEMO-AUTH-2026'
    });
  };

  return (
    <div className="min-h-screen bg-[#0c6366] text-[#000000] flex flex-col justify-between font-sans selection:bg-[#000000] selection:text-[#efddcc]">
      
      {/* 1. Fixed Navigation Header in Dark Cyan #0c6366 */}
      <header className="sticky top-0 z-50 w-full h-20 bg-[#0c6366] border-b-2 border-black px-6 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          
          {/* Left: Brand Logo in a 10x10 black square container + Name in Cabinet Grotesk */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-lg border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000000]">
              <Zap className="w-5 h-5 text-[#efddcc] fill-[#efddcc]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-2xl tracking-tighter text-white uppercase">
                  AGAHI
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#efddcc] border-2 border-black text-black shadow-[2px_2px_0px_0px_#000000]">
                  VISION ZERO
                </span>
              </div>
              <p className="text-[10px] font-bold text-[#efddcc]/90 uppercase tracking-wide">
                Bhubaneswar Smart City · Proactive AI Safety Portal
              </p>
            </div>
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#efddcc] border-2 border-black shadow-[2px_2px_0px_0px_#000000] text-xs font-bold text-black">
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840] border border-black" />
              <span>Smart City ICCC: 1,420 Active Feeds</span>
            </div>

            <button
              onClick={() => handleQuickDemo('Safety Engineer')}
              className="neo-button-primary text-xs py-2 px-4 shadow-[4px_4px_0px_0px_#000000]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#efddcc]" />
              <span>Instant Demo Access</span>
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section on Solid Dark Cyan */}
      <main className="max-w-7xl mx-auto w-full px-6 py-12 flex-1 flex flex-col lg:flex-row items-center gap-12">
        
        {/* Left Column: Hero Headline, Pill Badge & Metrics */}
        <div className="flex-1 space-y-6">
          
          {/* Pill Badge: Light Orange #efddcc background, 2px black border */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#efddcc] border-2 border-black shadow-[3px_3px_0px_0px_#000000] text-xs font-bold tracking-wide text-black">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] border border-black" />
            <span>CIVIC INTELLIGENCE INITIATIVE · ODISHA</span>
          </div>

          {/* Headline: Crisp White with Light Orange stroke effect */}
          <h1 className="font-heading font-black text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tighter text-white">
            SEE THE <span className="neo-stroke-text">RISK</span> BEFORE THE CRASH.
          </h1>

          <p className="text-[#efddcc] font-medium text-base sm:text-lg max-w-xl leading-relaxed">
            AGAHI upgrades existing CCTV video cameras into high-frequency proactive collision intelligence. Powered by <strong>RF-DETR</strong> vision transformers and sub-second <strong>Time-to-Collision (TTC)</strong> kinetics to eliminate road fatalities.
          </p>

          {/* Action Group */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => handleQuickDemo('Safety Engineer')}
              className="neo-button-primary-lg text-sm"
            >
              <span>Launch Live Jayadev Vihar Feed</span>
              <ArrowRight className="w-4 h-4 text-[#efddcc]" />
            </button>
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="neo-button-secondary text-sm"
            >
              {isRegister ? 'Already Registered? Sign In' : 'Create Agency Account'}
            </button>
          </div>

          {/* 4 Metrics Highlight Cards in Neo-Brutalist Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="p-4 rounded-xl bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000]">
              <div className="font-heading font-black text-3xl text-black">100%</div>
              <div className="text-[11px] font-bold text-black uppercase tracking-wider mt-0.5">Existing CCTV</div>
              <div className="text-[10px] text-black/70 font-semibold">Zero Capex burden</div>
            </div>

            <div className="p-4 rounded-xl bg-[#b7c6c2] border-2 border-black shadow-[4px_4px_0px_0px_#000000]">
              <div className="font-heading font-black text-3xl text-black">&lt; 1.5s</div>
              <div className="text-[11px] font-bold text-black uppercase tracking-wider mt-0.5">TTC Alerting</div>
              <div className="text-[10px] text-black/70 font-semibold">Critical near-miss barrier</div>
            </div>

            <div className="p-4 rounded-xl bg-[#efddcc] border-2 border-black shadow-[4px_4px_0px_0px_#000000]">
              <div className="font-heading font-black text-3xl text-black">88%</div>
              <div className="text-[11px] font-bold text-black uppercase tracking-wider mt-0.5">VRU Protection</div>
              <div className="text-[10px] text-black/70 font-semibold">Bikes & pedestrians</div>
            </div>

            <div className="p-4 rounded-xl bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000]">
              <div className="font-heading font-black text-3xl text-black">32 ms</div>
              <div className="text-[11px] font-bold text-black uppercase tracking-wider mt-0.5">Edge Latency</div>
              <div className="text-[10px] text-black/70 font-semibold">RF-DETR + ByteTrack</div>
            </div>
          </div>

          {/* Value props */}
          <div className="space-y-2 pt-2 text-xs font-semibold text-[#efddcc]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-black text-[#efddcc] flex items-center justify-center font-bold shrink-0">✓</span>
              <span><strong>Real-Time Video Preview:</strong> Interactive top-right CCTV viewer with live bounding boxes & TTC trajectory vectors.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-black text-[#efddcc] flex items-center justify-center font-bold shrink-0">✓</span>
              <span><strong>Kinetic Surrogate Charts:</strong> Instantaneous Time-to-Collision & Post-Encroachment Time danger line visualization.</span>
            </div>
          </div>

        </div>

        {/* Right Column: Neo-Brutalist Browser Mockup Registration Card */}
        <div className="w-full lg:w-[480px] shrink-0">
          <div className="neo-browser-frame-xl">
            
            {/* Browser Header Bar */}
            <div className="neo-browser-header justify-between">
              <div className="flex items-center gap-1.5">
                <span className="mockup-dot-red" />
                <span className="mockup-dot-yellow" />
                <span className="mockup-dot-green" />
              </div>
              <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                AGAHI_PORTAL_AUTH.EXE
              </span>
              <div className="w-12" />
            </div>

            {/* Browser Content Interior */}
            <div className="p-6 sm:p-8 bg-white">
              
              {/* Tab Switcher in Light Orange #efddcc */}
              <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-[#efddcc] border-2 border-black shadow-[3px_3px_0px_0px_#000000] mb-6">
                <button
                  type="button"
                  onClick={() => { setIsRegister(false); setError(''); }}
                  className={`py-2 text-xs font-heading font-bold rounded-lg border-2 transition-all ${
                    !isRegister
                      ? 'bg-black text-[#efddcc] border-black shadow-[2px_2px_0px_0px_#000000]'
                      : 'bg-white text-black border-transparent hover:border-black'
                  }`}
                >
                  Officer Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setIsRegister(true); setError(''); }}
                  className={`py-2 text-xs font-heading font-bold rounded-lg border-2 transition-all ${
                    isRegister
                      ? 'bg-black text-[#efddcc] border-black shadow-[2px_2px_0px_0px_#000000]'
                      : 'bg-white text-black border-transparent hover:border-black'
                  }`}
                >
                  Register Access
                </button>
              </div>

              {/* Title */}
              <div className="mb-5">
                <h2 className="font-heading font-black text-2xl text-black">
                  {isRegister ? 'Register Agency Credentials' : 'Sign In to Vision Zero'}
                </h2>
                <p className="text-xs font-medium text-black/70 mt-1">
                  {isRegister 
                    ? 'Request credential access for municipal safety audits and live CCTV feeds.'
                    : 'Enter your agency credentials to open the live video intelligence interface.'}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-[#ff5f57]/20 border-2 border-black text-black text-xs font-bold flex items-center gap-2 shadow-[2px_2px_0px_0px_#000000]">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-[#ff5f57]" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {isRegister && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-black mb-1">
                        Full Name & Title <span className="text-[#ff5f57]">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-black absolute left-3 top-3.5" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Er. Priyabrata Mohapatra"
                          className="w-full bg-white border-2 border-black rounded-lg pl-9 pr-3 py-2.5 text-xs text-black font-medium placeholder-black/40 focus:outline-none focus:bg-[#fbf4ee] focus:ring-2 focus:ring-black shadow-[2px_2px_0px_0px_#000000] transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-black mb-1">
                        Department / Agency <span className="text-[#ff5f57]">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-black absolute left-3 top-3.5" />
                        <select
                          name="agency"
                          value={formData.agency}
                          onChange={handleChange}
                          className="w-full bg-white border-2 border-black rounded-lg pl-9 pr-3 py-2.5 text-xs text-black font-bold focus:outline-none focus:bg-[#fbf4ee] focus:ring-2 focus:ring-black shadow-[2px_2px_0px_0px_#000000] transition"
                        >
                          <option value="Bhubaneswar Smart City Ltd (BSCL - ICCC)">Bhubaneswar Smart City Ltd (BSCL - ICCC)</option>
                          <option value="Commissionerate Police Bhubaneswar-Cuttack">Commissionerate Police (Traffic Wing)</option>
                          <option value="Works Dept / Bhubaneswar Municipal Corp (BMC)">Works Dept / BMC Engineering</option>
                          <option value="Capital Region Urban Transport (CRUT - Mo Bus)">CRUT (Mo Bus Operations)</option>
                          <option value="Academic & Road Safety Research Auditor">Academic / IIT Transport Lab Auditor</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-black mb-1">
                        Assigned Junction Corridor <span className="text-[#ff5f57]">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-black absolute left-3 top-3.5" />
                        <select
                          name="junction"
                          value={formData.junction}
                          onChange={handleChange}
                          className="w-full bg-white border-2 border-black rounded-lg pl-9 pr-3 py-2.5 text-xs text-black font-bold focus:outline-none focus:bg-[#fbf4ee] focus:ring-2 focus:ring-black shadow-[2px_2px_0px_0px_#000000] transition"
                        >
                          {JUNCTIONS.map(j => (
                            <option key={j.id} value={j.id}>{j.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-black mb-1">
                    Official Email Address <span className="text-[#ff5f57]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-black absolute left-3 top-3.5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="officer@smartcitybhubaneswar.gov.in"
                      className="w-full bg-white border-2 border-black rounded-lg pl-9 pr-3 py-2.5 text-xs text-black font-medium placeholder-black/40 focus:outline-none focus:bg-[#fbf4ee] focus:ring-2 focus:ring-black shadow-[2px_2px_0px_0px_#000000] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">
                    Access Password <span className="text-[#ff5f57]">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-black absolute left-3 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••••••"
                      className="w-full bg-white border-2 border-black rounded-lg pl-9 pr-10 py-2.5 text-xs text-black font-medium placeholder-black/40 focus:outline-none focus:bg-[#fbf4ee] focus:ring-2 focus:ring-black shadow-[2px_2px_0px_0px_#000000] transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-black/60 hover:text-black"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isRegister && (
                  <div>
                    <label className="block text-xs font-bold text-black mb-1">
                      Confirm Password <span className="text-[#ff5f57]">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-black absolute left-3 top-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••••••"
                        className="w-full bg-white border-2 border-black rounded-lg pl-9 pr-3 py-2.5 text-xs text-black font-medium placeholder-black/40 focus:outline-none focus:bg-[#fbf4ee] focus:ring-2 focus:ring-black shadow-[2px_2px_0px_0px_#000000] transition"
                      />
                    </div>
                  </div>
                )}

                {isRegister && (
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="agreedToTerms"
                      name="agreedToTerms"
                      checked={formData.agreedToTerms}
                      onChange={handleChange}
                      className="mt-0.5 rounded border-2 border-black text-black focus:ring-black"
                    />
                    <label htmlFor="agreedToTerms" className="text-[11px] font-medium text-black/80 leading-tight">
                      I agree to the National Road Safety Data Security & CCTV Analytics Guidelines (ICCC-Odisha protocol).
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  className="neo-button-primary-lg w-full text-sm mt-3"
                >
                  <span>{isRegister ? 'Register & Open Interface' : 'Open Video Analytics Interface'}</span>
                  <ArrowRight className="w-4 h-4 text-[#efddcc]" />
                </button>
              </form>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-black" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-black">
                  <span className="bg-white px-2 border-x-2 border-black">or fast bypass</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleQuickDemo('Safety Engineer')}
                className="neo-button-secondary w-full text-xs shadow-[3px_3px_0px_0px_#000000]"
              >
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>Launch Pre-configured Demo (Jayadev Vihar Feed)</span>
              </button>

            </div>
          </div>
        </div>

      </main>

      {/* 3. Continuous Social Proof Marquee */}
      <section className="bg-[#171e19] border-y-2 border-black py-4 overflow-hidden select-none">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee font-heading font-black text-sm tracking-wider uppercase text-[#efddcc]/80">
          <span>BHUBANESWAR SMART CITY LIMITED</span>
          <span>✦</span>
          <span>COMMISSIONERATE POLICE TRAFFIC WING</span>
          <span>✦</span>
          <span>VISION ZERO ODISHA</span>
          <span>✦</span>
          <span>RF-DETR TRANSFORMER 2.0</span>
          <span>✦</span>
          <span>BYTETRACK PERSISTENT MOT</span>
          <span>✦</span>
          <span>SURROGATE SAFETY TTC / PET</span>
          <span>✦</span>
          <span>CRUT MO BUS TRANSIT AUDIT</span>
          <span>✦</span>
          <span>IIT BHUBANESWAR TRANSPORT LAB</span>
          <span>✦</span>
          <span>100% EXISTING CCTV REUSE</span>
        </div>
      </section>

      {/* 9. Final Footer */}
      <footer className="bg-[#171e19] text-[#efddcc] border-t-2 border-black px-6 py-6 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#efddcc] text-black font-heading font-black text-xs rounded border border-black flex items-center justify-center">
              AG
            </div>
            <span>Odisha State Road Safety Society · Bhubaneswar Smart City ICCC Integration</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono font-bold text-white">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#28c840]" />
              <span>AES-256 CCTV Stream</span>
            </span>
            <span>·</span>
            <span>RF-DETR Model v2.4</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
