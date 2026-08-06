import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getDoctors, bookAppointment } from '../api/api.js';
import Loader from '../components/Loader.jsx';
import Toast from '../components/Toast.jsx';
import {
  MapPin, Activity, Calendar, ShieldCheck, HeartPulse, UserCheck, 
  Clock, Lock, Star, ChevronDown, Heart, LayoutGrid, List, Search,
  RefreshCw, Users, Video, Building
} from 'lucide-react';
import './DoctorDirectoryPage.css';

const defaultFilters = {
  specialty: '',
  state: '',
  city: '',
  language: '',
  maxFee: '',
  availability: 'Any time',
  isOnline: false,
  isInClinic: false,
  sortBy: 'Relevance'
};

const indiaLocations = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati"],
  "Arunachal Pradesh": ["Itanagar", "Tawang", "Naharlagun"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "West Delhi"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Rohtak"],
  "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad"],
  "Manipur": ["Imphal"],
  "Meghalaya": ["Shillong", "Tura"],
  "Mizoram": ["Aizawl"],
  "Nagaland": ["Kohima", "Dimapur"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Puri"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Chandigarh"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"],
  "Sikkim": ["Gangtok"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  "Tripura": ["Agartala"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Noida"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Rishikesh"],
  "West Bengal": ["Kolkata", "Howrah", "Darjeeling", "Siliguri", "Asansol"]
};

const specialties = ['Cardiologist', 'Dermatologist', 'Neurologist', 'Pediatrician', 'Orthopedic'];
const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi', 'Mandarin', 'Spanish'];
const maxFees = [500, 1000, 1500, 2000, 5000];
const sortOptions = ['Relevance', 'Rating', 'Fee: Low to High', 'Fee: High to Low', 'Experience'];

const HEALTH_TIPS = [
  "Walking 30 minutes daily can reduce the risk of heart disease and improve your mental well-being.",
  "Drink at least 8 glasses of water a day to keep your body hydrated and maintain energy levels.",
  "Aim for 7-9 hours of quality sleep each night to allow your body and mind to recover.",
  "Include a source of protein in every meal to help maintain muscle mass and keep you feeling full.",
  "Take short breaks every hour to stretch and rest your eyes if you work at a computer.",
  "Eating a rainbow of fruits and vegetables ensures you get a wide variety of essential vitamins.",
  "Practice deep breathing for just 5 minutes a day to significantly lower stress levels.",
  "Limit added sugars to protect against inflammation, weight gain, and chronic diseases.",
  "Regular handwashing is one of the most effective ways to prevent the spread of infections.",
  "Incorporate strength training at least twice a week to build bone density and metabolic health.",
  "Substitute refined grains with whole grains to increase your daily fiber intake.",
  "Chew your food slowly to improve digestion and recognize when you are full.",
  "Spend time outdoors daily; sunlight helps your body produce Vitamin D for bone health.",
  "Minimize screen time at least one hour before bed for a better night's sleep.",
  "Laughing reduces stress hormones and increases immune cells and infection-fighting antibodies.",
  "Nuts and seeds are excellent sources of healthy fats that protect your heart and brain.",
  "Avoid skipping meals to maintain steady blood sugar levels throughout the day.",
  "Practice good posture to prevent back and neck pain, especially while sitting.",
  "Stay socially connected; strong relationships contribute to a longer, healthier life.",
  "Use sunscreen daily to protect your skin from harmful UV rays and prevent premature aging."
];

function DoctorDirectoryPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [activeTab, setActiveTab] = useState('Find Doctors');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    const saved = localStorage.getItem('bookmarkedDoctors');
    return saved ? JSON.parse(saved) : [];
  });

  const tipsRef = useRef([...HEALTH_TIPS].sort(() => Math.random() - 0.5));
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => {
        if (prev + 1 >= tipsRef.current.length) {
          tipsRef.current = [...HEALTH_TIPS].sort(() => Math.random() - 0.5);
          return 0;
        }
        return prev + 1;
      });
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const apiFilters = { ...filters, location: filters.city || filters.state };
      const response = await getDoctors(apiFilters);
      setDoctors(response.data.doctors);
    } catch {
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []); // Only run on mount, rest is via manual trigger if needed, or we can run on dependencies

  const handleSearch = () => {
    loadDoctors();
  };

  const handleClear = () => {
    setFilters(defaultFilters);
    setTimeout(() => {
      getDoctors({...defaultFilters, location: ''}).then(res => setDoctors(res.data.doctors));
    }, 0);
  };

  const handleBook = async (doctor) => {
    setToast('');
    try {
      await bookAppointment({ doctorId: doctor.id, doctorName: doctor.name, specialty: doctor.specialty, date: '2026-07-22', time: '10:00' });
      setToast(`Viewing profile for ${doctor.name}. Booking modal opened.`);
    } catch {
      setToast('Unable to process request right now.');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFilters(prev => ({ ...prev, [name]: val }));
  };

  const handleToggle = (field) => {
    setFilters(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setFilters(prev => ({ ...prev, sortBy: newSort }));
    // trigger sort immediately
    const apiFilters = { ...filters, sortBy: newSort, location: filters.city || filters.state };
    getDoctors(apiFilters).then(res => setDoctors(res.data.doctors));
  };

  const toggleBookmark = (id) => {
    setBookmarkedIds(prev => {
      const newBookmarks = prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id];
      localStorage.setItem('bookmarkedDoctors', JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  };

  let displayedDoctors = doctors;
  if (activeTab === 'Bookmarked') {
    displayedDoctors = doctors.filter(doc => bookmarkedIds.includes(doc.id));
  } else if (activeTab === 'Past Consultations') {
    // Mocking past consultations with specific IDs (e.g. 2 and 4, or just a few if they exist in the current list)
    displayedDoctors = doctors.filter(doc => [2, 4].includes(doc.id) || doc.name.includes("Priya"));
  }

  return (
    <div className="doc-page-container">
      <Toast message={toast} onClose={() => setToast('')} />

      {/* Main Content Area */}
      <div className="doc-main-content">
        
        {/* Hero Section */}
        <section className="doc-hero">
          <div className="doc-hero-text">
            <h4>DOCTOR DIRECTORY</h4>
            <h1>Find the right doctor for your health.</h1>
            <p>Connect with verified specialists based on your needs. Book appointments instantly and get expert care.</p>
          </div>
          <div className="doc-hero-graphics">
            <div className="doc-graphic doc-graphic-1">
              <Activity className="doc-hero-icon" size={32} />
            </div>
            <div className="doc-graphic doc-graphic-2">
              <ShieldCheck className="doc-hero-icon" size={28} />
            </div>
            <div className="doc-graphic doc-graphic-3">
              <HeartPulse className="doc-hero-icon" size={36} />
            </div>
          </div>
        </section>

        {/* Filter Container */}
        <section className="doc-filters-container">
          <div className="doc-tabs">
            <button className={`doc-tab ${activeTab === 'Find Doctors' ? 'active' : ''}`} onClick={() => setActiveTab('Find Doctors')}>Find Doctors</button>
            <button className={`doc-tab ${activeTab === 'Bookmarked' ? 'active' : ''}`} onClick={() => setActiveTab('Bookmarked')}>Bookmarked</button>
            <button className={`doc-tab ${activeTab === 'Past Consultations' ? 'active' : ''}`} onClick={() => setActiveTab('Past Consultations')}>Past Consultations</button>
          </div>

          {activeTab === 'Find Doctors' && (
            <>
              <div className="doc-filters-grid">
                <div className="doc-filter-item">
                  <label>Specialty</label>
                  <div className="doc-filter-input">
                    <select name="specialty" value={filters.specialty} onChange={handleChange}>
                      <option value="">Select specialty</option>
                      {specialties.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                    </select>
                  </div>
                </div>

                <div className="doc-filter-item">
                  <label>State</label>
                  <div className="doc-filter-input">
                    <MapPin size={16} className="doc-filter-icon" />
                    <select 
                      name="state" 
                      value={filters.state} 
                      onChange={(e) => {
                        // When state changes, reset city
                        setFilters(prev => ({ ...prev, state: e.target.value, city: '' }));
                      }} 
                      style={{marginLeft: '8px'}}
                    >
                      <option value="">Select state</option>
                      {Object.keys(indiaLocations).map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="doc-filter-item">
                  <label>City</label>
                  <div className="doc-filter-input">
                    <MapPin size={16} className="doc-filter-icon" />
                    <select 
                      name="city" 
                      value={filters.city} 
                      onChange={handleChange} 
                      style={{marginLeft: '8px'}}
                      disabled={!filters.state}
                    >
                      <option value="">Select city</option>
                      {filters.state && indiaLocations[filters.state].map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

            <div className="doc-filter-item">
              <label>Language</label>
              <div className="doc-filter-input">
                <select name="language" value={filters.language} onChange={handleChange}>
                  <option value="">Select language</option>
                  {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                </select>
              </div>
            </div>

            <div className="doc-filter-item">
              <label>Max Fee</label>
              <div className="doc-filter-input">
                <select name="maxFee" value={filters.maxFee} onChange={handleChange}>
                  <option value="">Any fee</option>
                  {maxFees.map(fee => <option key={fee} value={fee}>Up to ₹{fee}</option>)}
                </select>
              </div>
            </div>

            <div className="doc-filter-item">
              <label>Availability</label>
              <div className="doc-filter-input">
                <select name="availability" value={filters.availability} onChange={handleChange}>
                  <option value="Any time">Any time</option>
                  <option value="Today">Today</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="This week">This week</option>
                </select>
              </div>
            </div>
              </div>

              <div className="doc-filters-actions">
                <div className="doc-toggle-group">
                  <button 
                    type="button" 
                    className={`doc-toggle-btn ${filters.isOnline ? 'active' : ''}`}
                    onClick={() => handleToggle('isOnline')}
                  >
                    <Video size={16} /> Online Consultation
                  </button>
                  <button 
                    type="button" 
                    className={`doc-toggle-btn ${filters.isInClinic ? 'active' : ''}`}
                    onClick={() => handleToggle('isInClinic')}
                  >
                    <Building size={16} /> In-clinic Available
                  </button>
                </div>
                
                <div className="doc-action-btns">
                  <button type="button" className="doc-clear-btn" onClick={handleClear}>
                    <RefreshCw size={14} /> Clear Filters
                  </button>
                  <button type="button" className="doc-search-btn" onClick={handleSearch}>
                    <Search size={16} /> Search Doctors
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Results Header */}
        <div className="doc-results-header">
          <div className="doc-results-count">{displayedDoctors.length} doctors found</div>
          <div className="doc-results-controls">
            <div className="doc-sort">
              Sort by: 
              <select value={filters.sortBy} onChange={handleSortChange}>
                {sortOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div className="doc-view-toggles">
              <button className={`doc-view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
                <LayoutGrid size={16} />
              </button>
              <button className={`doc-view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Doctor Grid */}
        {loading ? (
          <Loader label="Loading doctors…" />
        ) : displayedDoctors.length > 0 ? (
          <div className="doc-grid">
            {displayedDoctors.map(doctor => (
              <div key={doctor.id} className="doc-card">
                <div className="doc-card-top">
                  <div className={`doc-badge-status ${doctor.badge === 'Online' ? 'blue' : ''}`}>
                    {doctor.badge === 'Available Now' ? <Activity size={12}/> : (doctor.badge === 'Online' ? <Video size={12}/> : <Building size={12}/>)}
                    {doctor.badge}
                  </div>
                  <Heart 
                    className={`doc-bookmark ${bookmarkedIds.includes(doctor.id) ? 'active' : ''}`} 
                    size={20} 
                    onClick={() => toggleBookmark(doctor.id)}
                    fill={bookmarkedIds.includes(doctor.id) ? '#f43f5e' : 'none'}
                    color={bookmarkedIds.includes(doctor.id) ? '#f43f5e' : 'currentColor'}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                
                <div className="doc-photo-wrapper">
                  <img src={doctor.photo} alt={doctor.name} className="doc-photo" />
                </div>
                
                <div className="doc-info">
                  <h3>{doctor.name}</h3>
                  <p className="doc-specialty">{doctor.specialty}</p>
                  
                  <div className="doc-rating">
                    <Star className="doc-star" size={14} fill="#fbbf24" />
                    <span>{doctor.rating}</span>
                    <span className="doc-reviews">({doctor.reviewsCount} reviews)</span>
                  </div>
                </div>
                
                <div className="doc-details">
                  <div className="doc-detail-row">
                    <Clock size={14} className="doc-detail-icon" />
                    <span>{doctor.experience}+ yrs exp.</span>
                    <span style={{margin: '0 4px', color: '#64748b'}}>•</span>
                    <span>{doctor.languages.join(', ')}</span>
                  </div>
                  <div className="doc-detail-row">
                    <MapPin size={14} className="doc-detail-icon" />
                    <span>{doctor.area}, {doctor.city}</span>
                  </div>
                </div>

                <div className="doc-fee">
                  <span>₹{doctor.fee}</span> <small>Consultation fee</small>
                </div>

                <div className="doc-card-badges">
                  {doctor.isOnline && (
                    <span className="doc-tag active"><Video size={12}/> Video Consult</span>
                  )}
                  {doctor.isInClinic && (
                    <span className="doc-tag active blue"><Building size={12}/> In-clinic</span>
                  )}
                </div>

                <button className="doc-view-profile-btn" onClick={() => handleBook(doctor)}>
                  View Profile
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{textAlign: 'center', color: '#94a3b8', padding: '2rem'}}>
            {activeTab === 'Bookmarked' ? 'You have no bookmarked doctors yet.' : 
             activeTab === 'Past Consultations' ? 'No past consultations found.' : 
             'No doctors found matching your criteria. Try adjusting your filters.'}
          </p>
        )}

        {displayedDoctors.length > 0 && (
          <div className="doc-load-more">
            <button type="button">Load More Doctors &darr;</button>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <aside className="doc-sidebar">
        
        {/* Why Choose Our Doctors Panel */}
        <div className="doc-sidebar-panel">
          <h3>Why Choose Our Doctors?</h3>
          <div className="doc-why-list">
            <div className="doc-why-item">
              <div className="doc-why-icon"><ShieldCheck size={20} /></div>
              <div className="doc-why-text">
                <h4>Verified & Trusted</h4>
                <p>All doctors are verified and background checked.</p>
              </div>
            </div>
            <div className="doc-why-item">
              <div className="doc-why-icon"><UserCheck size={20} /></div>
              <div className="doc-why-text">
                <h4>Experienced Experts</h4>
                <p>Connect with specialists with years of experience.</p>
              </div>
            </div>
            <div className="doc-why-item">
              <div className="doc-why-icon"><Calendar size={20} /></div>
              <div className="doc-why-text">
                <h4>Easy Appointments</h4>
                <p>Book appointments online in just a few clicks.</p>
              </div>
            </div>
            <div className="doc-why-item">
              <div className="doc-why-icon"><Lock size={20} /></div>
              <div className="doc-why-text">
                <h4>Secure & Private</h4>
                <p>Your data is safe and always protected.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Specialties Panel */}
        <div className="doc-sidebar-panel">
          <h3>Popular Specialties</h3>
          <div className="doc-spec-list">
            <div className="doc-spec-item">
              <div className="doc-spec-info"><HeartPulse size={16} /> Cardiologist</div>
              <div className="doc-spec-count">25+ Doctors</div>
            </div>
            <div className="doc-spec-item">
              <div className="doc-spec-info"><Activity size={16} /> Dermatologist</div>
              <div className="doc-spec-count">18+ Doctors</div>
            </div>
            <div className="doc-spec-item">
              <div className="doc-spec-info"><Activity size={16} /> Neurologist</div>
              <div className="doc-spec-count">20+ Doctors</div>
            </div>
            <div className="doc-spec-item">
              <div className="doc-spec-info"><Activity size={16} /> Pediatrician</div>
              <div className="doc-spec-count">15+ Doctors</div>
            </div>
            <div className="doc-spec-item">
              <div className="doc-spec-info"><Activity size={16} /> Orthopedic</div>
              <div className="doc-spec-count">22+ Doctors</div>
            </div>
          </div>
        </div>

        {/* Health Tip Panel */}
        <div className="doc-sidebar-panel">
          <h3>Health Tip of the Day</h3>
          <p className="doc-tip-quote">
            {tipsRef.current[tipIndex]}
          </p>
          <div className="doc-tip-author">- Vitalis Health Team</div>
          <div className="doc-tip-graphic">
            {/* Using an inline SVG to represent the meditating person graphic from the screenshot */}
            <svg width="100" height="80" viewBox="0 0 100 100" fill="none">
              <path d="M50 70C50 70 38 56 38 44C38 37.3726 43.3726 32 50 32C56.6274 32 62 37.3726 62 44C62 56 50 70 50 70Z" fill="#10B981" fillOpacity="0.5"/>
              <circle cx="50" cy="50" r="30" fill="#3b82f6" fillOpacity="0.2" />
              <path d="M45 42C45 42 48 38 52 40C56 42 54 48 50 50C46 52 46 56 50 58" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </aside>

    </div>
  );
}

export default DoctorDirectoryPage;
