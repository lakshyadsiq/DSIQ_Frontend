import React, { useState, useEffect } from 'react';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { ComboBox } from '@progress/kendo-react-dropdowns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerAdmin } from '../redux/slices/authSlice';
import { Eye, EyeOff } from 'lucide-react';

const countries = [ 
  { id: 'af', name: 'Afghanistan', flag: '🇦🇫' },
  { id: 'al', name: 'Albania', flag: '🇦🇱' },
  { id: 'dz', name: 'Algeria', flag: '🇩🇿' },
  { id: 'ad', name: 'Andorra', flag: '🇦🇩' },
  { id: 'ao', name: 'Angola', flag: '🇦🇴' },
  { id: 'ag', name: 'Antigua and Barbuda', flag: '🇦🇬' },
  { id: 'ar', name: 'Argentina', flag: '🇦🇷' },
  { id: 'am', name: 'Armenia', flag: '🇦🇲' },
  { id: 'au', name: 'Australia', flag: '🇦🇺' },
  { id: 'at', name: 'Austria', flag: '🇦🇹' },
  { id: 'az', name: 'Azerbaijan', flag: '🇦🇿' },
  { id: 'bs', name: 'Bahamas', flag: '🇧🇸' },
  { id: 'bh', name: 'Bahrain', flag: '🇧🇭' },
  { id: 'bd', name: 'Bangladesh', flag: '🇧🇩' },
  { id: 'bb', name: 'Barbados', flag: '🇧🇧' },
  { id: 'by', name: 'Belarus', flag: '🇧🇾' },
  { id: 'be', name: 'Belgium', flag: '🇧🇪' },
  { id: 'bz', name: 'Belize', flag: '🇧🇿' },
  { id: 'bj', name: 'Benin', flag: '🇧🇯' },
  { id: 'bt', name: 'Bhutan', flag: '🇧🇹' },
  { id: 'bo', name: 'Bolivia', flag: '🇧🇴' },
  { id: 'ba', name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
  { id: 'bw', name: 'Botswana', flag: '🇧🇼' },
  { id: 'br', name: 'Brazil', flag: '🇧🇷' },
  { id: 'bn', name: 'Brunei', flag: '🇧🇳' },
  { id: 'bg', name: 'Bulgaria', flag: '🇧🇬' },
  { id: 'bf', name: 'Burkina Faso', flag: '🇧🇫' },
  { id: 'bi', name: 'Burundi', flag: '🇧🇮' },
  { id: 'cv', name: 'Cabo Verde', flag: '🇨🇻' },
  { id: 'kh', name: 'Cambodia', flag: '🇰🇭' },
  { id: 'cm', name: 'Cameroon', flag: '🇨🇲' },
  { id: 'ca', name: 'Canada', flag: '🇨🇦' },
  { id: 'cf', name: 'Central African Republic', flag: '🇨🇫' },
  { id: 'td', name: 'Chad', flag: '🇹🇩' },
  { id: 'cl', name: 'Chile', flag: '🇨🇱' },
  { id: 'cn', name: 'China', flag: '🇨🇳' },
  { id: 'co', name: 'Colombia', flag: '🇨🇴' },
  { id: 'km', name: 'Comoros', flag: '🇰🇲' },
  { id: 'cg', name: 'Congo', flag: '🇨🇬' },
  { id: 'cd', name: 'Congo (Democratic Republic)', flag: '🇨🇩' },
  { id: 'cr', name: 'Costa Rica', flag: '🇨🇷' },
  { id: 'ci', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { id: 'hr', name: 'Croatia', flag: '🇭🇷' },
  { id: 'cu', name: 'Cuba', flag: '🇨🇺' },
  { id: 'cy', name: 'Cyprus', flag: '🇨🇾' },
  { id: 'cz', name: 'Czech Republic', flag: '🇨🇿' },
  { id: 'dk', name: 'Denmark', flag: '🇩🇰' },
  { id: 'dj', name: 'Djibouti', flag: '🇩🇯' },
  { id: 'dm', name: 'Dominica', flag: '🇩🇲' },
  { id: 'do', name: 'Dominican Republic', flag: '🇩🇴' },
  { id: 'ec', name: 'Ecuador', flag: '🇪🇨' },
  { id: 'eg', name: 'Egypt', flag: '🇪🇬' },
  { id: 'sv', name: 'El Salvador', flag: '🇸🇻' },
  { id: 'gq', name: 'Equatorial Guinea', flag: '🇬🇶' },
  { id: 'er', name: 'Eritrea', flag: '🇪🇷' },
  { id: 'ee', name: 'Estonia', flag: '🇪🇪' },
  { id: 'sz', name: 'Eswatini', flag: '🇸🇿' },
  { id: 'et', name: 'Ethiopia', flag: '🇪🇹' },
  { id: 'fj', name: 'Fiji', flag: '🇫🇯' },
  { id: 'fi', name: 'Finland', flag: '🇫🇮' },
  { id: 'fr', name: 'France', flag: '🇫🇷' },
  { id: 'ga', name: 'Gabon', flag: '🇬🇦' },
  { id: 'gm', name: 'Gambia', flag: '🇬🇲' },
  { id: 'ge', name: 'Georgia', flag: '🇬🇪' },
  { id: 'de', name: 'Germany', flag: '🇩🇪' },
  { id: 'gh', name: 'Ghana', flag: '🇬🇭' },
  { id: 'gr', name: 'Greece', flag: '🇬🇷' },
  { id: 'gd', name: 'Grenada', flag: '🇬🇩' },
  { id: 'gt', name: 'Guatemala', flag: '🇬🇹' },
  { id: 'gn', name: 'Guinea', flag: '🇬🇳' },
  { id: 'gw', name: 'Guinea-Bissau', flag: '🇬🇼' },
  { id: 'gy', name: 'Guyana', flag: '🇬🇾' },
  { id: 'ht', name: 'Haiti', flag: '🇭🇹' },
  { id: 'hn', name: 'Honduras', flag: '🇭🇳' },
  { id: 'hu', name: 'Hungary', flag: '🇭🇺' },
  { id: 'is', name: 'Iceland', flag: '🇮🇸' },
  { id: 'in', name: 'India', flag: '🇮🇳' },
  { id: 'id', name: 'Indonesia', flag: '🇮🇩' },
  { id: 'ir', name: 'Iran', flag: '🇮🇷' },
  { id: 'iq', name: 'Iraq', flag: '🇮🇶' },
  { id: 'ie', name: 'Ireland', flag: '🇮🇪' },
  { id: 'il', name: 'Israel', flag: '🇮🇱' },
  { id: 'it', name: 'Italy', flag: '🇮🇹' },
  { id: 'jm', name: 'Jamaica', flag: '🇯🇲' },
  { id: 'jp', name: 'Japan', flag: '🇯🇵' },
  { id: 'jo', name: 'Jordan', flag: '🇯🇴' },
  { id: 'kz', name: 'Kazakhstan', flag: '🇰🇿' },
  { id: 'ke', name: 'Kenya', flag: '🇰🇪' },
  { id: 'ki', name: 'Kiribati', flag: '🇰🇮' },
  { id: 'kp', name: 'North Korea', flag: '🇰🇵' },
  { id: 'kr', name: 'South Korea', flag: '🇰🇷' },
  { id: 'kw', name: 'Kuwait', flag: '🇰🇼' },
  { id: 'kg', name: 'Kyrgyzstan', flag: '🇰🇬' },
  { id: 'la', name: 'Laos', flag: '🇱🇦' },
  { id: 'lv', name: 'Latvia', flag: '🇱🇻' },
  { id: 'lb', name: 'Lebanon', flag: '🇱🇧' },
  { id: 'ls', name: 'Lesotho', flag: '🇱🇸' },
  { id: 'lr', name: 'Liberia', flag: '🇱🇷' },
  { id: 'ly', name: 'Libya', flag: '🇱🇾' },
  { id: 'li', name: 'Liechtenstein', flag: '🇱🇮' },
  { id: 'lt', name: 'Lithuania', flag: '🇱🇹' },
  { id: 'lu', name: 'Luxembourg', flag: '🇱🇺' },
  { id: 'mg', name: 'Madagascar', flag: '🇲🇬' },
  { id: 'mw', name: 'Malawi', flag: '🇲🇼' },
  { id: 'my', name: 'Malaysia', flag: '🇲🇾' },
  { id: 'mv', name: 'Maldives', flag: '🇲🇻' },
  { id: 'ml', name: 'Mali', flag: '🇲🇱' },
  { id: 'mt', name: 'Malta', flag: '🇲🇹' },
  { id: 'mh', name: 'Marshall Islands', flag: '🇲🇭' },
  { id: 'mr', name: 'Mauritania', flag: '🇲🇷' },
  { id: 'mu', name: 'Mauritius', flag: '🇲🇺' },
  { id: 'mx', name: 'Mexico', flag: '🇲🇽' },
  { id: 'fm', name: 'Micronesia', flag: '🇫🇲' },
  { id: 'md', name: 'Moldova', flag: '🇲🇩' },
  { id: 'mc', name: 'Monaco', flag: '🇲🇨' },
  { id: 'mn', name: 'Mongolia', flag: '🇲🇳' },
  { id: 'me', name: 'Montenegro', flag: '🇲🇪' },
  { id: 'ma', name: 'Morocco', flag: '🇲🇦' },
  { id: 'mz', name: 'Mozambique', flag: '🇲🇿' },
  { id: 'mm', name: 'Myanmar', flag: '🇲🇲' },
  { id: 'na', name: 'Namibia', flag: '🇳🇦' },
  { id: 'nr', name: 'Nauru', flag: '🇳🇷' },
  { id: 'np', name: 'Nepal', flag: '🇳🇵' },
  { id: 'nl', name: 'Netherlands', flag: '🇳🇱' },
  { id: 'nz', name: 'New Zealand', flag: '🇳🇿' },
  { id: 'ni', name: 'Nicaragua', flag: '🇳🇮' },
  { id: 'ne', name: 'Niger', flag: '🇳🇪' },
  { id: 'ng', name: 'Nigeria', flag: '🇳🇬' },
  { id: 'mk', name: 'North Macedonia', flag: '🇲🇰' },
  { id: 'no', name: 'Norway', flag: '🇳🇴' },
  { id: 'om', name: 'Oman', flag: '🇴🇲' },
  { id: 'pk', name: 'Pakistan', flag: '🇵🇰' },
  { id: 'pw', name: 'Palau', flag: '🇵🇼' },
  { id: 'ps', name: 'Palestine', flag: '🇵🇸' },
  { id: 'pa', name: 'Panama', flag: '🇵🇦' },
  { id: 'pg', name: 'Papua New Guinea', flag: '🇵🇬' },
  { id: 'py', name: 'Paraguay', flag: '🇵🇾' },
  { id: 'pe', name: 'Peru', flag: '🇵🇪' },
  { id: 'ph', name: 'Philippines', flag: '🇵🇭' },
  { id: 'pl', name: 'Poland', flag: '🇵🇱' },
  { id: 'pt', name: 'Portugal', flag: '🇵🇹' },
  { id: 'qa', name: 'Qatar', flag: '🇶🇦' },
  { id: 'ro', name: 'Romania', flag: '🇷🇴' },
  { id: 'ru', name: 'Russia', flag: '🇷🇺' },
  { id: 'rw', name: 'Rwanda', flag: '🇷🇼' },
  { id: 'kn', name: 'Saint Kitts and Nevis', flag: '🇰🇳' },
  { id: 'lc', name: 'Saint Lucia', flag: '🇱🇨' },
  { id: 'vc', name: 'Saint Vincent and the Grenadines', flag: '🇻🇨' },
  { id: 'ws', name: 'Samoa', flag: '🇼🇸' },
  { id: 'sm', name: 'San Marino', flag: '🇸🇲' },
  { id: 'st', name: 'Sao Tome and Principe', flag: '🇸🇹' },
  { id: 'sa', name: 'Saudi Arabia', flag: '🇸🇦' },
  { id: 'sn', name: 'Senegal', flag: '🇸🇳' },
  { id: 'rs', name: 'Serbia', flag: '🇷🇸' },
  { id: 'sc', name: 'Seychelles', flag: '🇸🇨' },
  { id: 'sl', name: 'Sierra Leone', flag: '🇸🇱' },
  { id: 'sg', name: 'Singapore', flag: '🇸🇬' },
  { id: 'sk', name: 'Slovakia', flag: '🇸🇰' },
  { id: 'si', name: 'Slovenia', flag: '🇸🇮' },
  { id: 'sb', name: 'Solomon Islands', flag: '🇸🇧' },
  { id: 'so', name: 'Somalia', flag: '🇸🇴' },
  { id: 'za', name: 'South Africa', flag: '🇿🇦' },
  { id: 'ss', name: 'South Sudan', flag: '🇸🇸' },
  { id: 'es', name: 'Spain', flag: '🇪🇸' },
  { id: 'lk', name: 'Sri Lanka', flag: '🇱🇰' },
  { id: 'sd', name: 'Sudan', flag: '🇸🇩' },
  { id: 'sr', name: 'Suriname', flag: '🇸🇷' },
  { id: 'se', name: 'Sweden', flag: '🇸🇪' },
  { id: 'ch', name: 'Switzerland', flag: '🇨🇭' },
  { id: 'sy', name: 'Syria', flag: '🇸🇾' },
  { id: 'tw', name: 'Taiwan', flag: '🇹🇼' },
  { id: 'tj', name: 'Tajikistan', flag: '🇹🇯' },
  { id: 'tz', name: 'Tanzania', flag: '🇹🇿' },
  { id: 'th', name: 'Thailand', flag: '🇹🇭' },
  { id: 'tl', name: 'Timor-Leste', flag: '🇹🇱' },
  { id: 'tg', name: 'Togo', flag: '🇹🇬' },
  { id: 'to', name: 'Tonga', flag: '🇹🇴' },
  { id: 'tt', name: 'Trinidad and Tobago', flag: '🇹🇹' },
  { id: 'tn', name: 'Tunisia', flag: '🇹🇳' },
  { id: 'tr', name: 'Turkey', flag: '🇹🇷' },
  { id: 'tm', name: 'Turkmenistan', flag: '🇹🇲' },
  { id: 'tv', name: 'Tuvalu', flag: '🇹🇻' },
  { id: 'ug', name: 'Uganda', flag: '🇺🇬' },
  { id: 'ua', name: 'Ukraine', flag: '🇺🇦' },
  { id: 'ae', name: 'United Arab Emirates', flag: '🇦🇪' },
  { id: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
  { id: 'us', name: 'United States', flag: '🇺🇸' },
  { id: 'uy', name: 'Uruguay', flag: '🇺🇾' },
  { id: 'uz', name: 'Uzbekistan', flag: '🇺🇿' },
  { id: 'vu', name: 'Vanuatu', flag: '🇻🇺' },
  { id: 'va', name: 'Vatican City', flag: '🇻🇦' },
  { id: 've', name: 'Venezuela', flag: '🇻🇪' },
  { id: 'vn', name: 'Vietnam', flag: '🇻🇳' },
  { id: 'ye', name: 'Yemen', flag: '🇾🇪' },
  { id: 'zm', name: 'Zambia', flag: '🇿🇲' },
  { id: 'zw', name: 'Zimbabwe', flag: '🇿🇼' }
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    companyEmail: '',
    password: '',
    confirmPassword: '',
    companyCode: '',
    countryId: '',
  });

  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setFormData(prev => ({ ...prev, countryId: 'us' })); // default country
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (e) => {
    const countryId = e.value && e.value.id ? e.value.id : '';
    setFormData(prev => ({ ...prev, countryId }));
  };

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, companyName, companyEmail, password, confirmPassword, companyCode, countryId } = formData;

    if (!fullName || !companyName || !companyEmail || !password || !confirmPassword || !companyCode || !countryId) {
      toast.error('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(companyEmail)) {
      toast.error('Please enter a valid company email');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      await dispatch(registerAdmin({ fullName, companyName, email: companyEmail, password, companyCode, countryId, userType: 'admin' }));
      toast.success('Admin account created successfully!');
      navigate('/workspaceCreate');
    } catch (error) {
      toast.error(error || 'Failed to register admin');
    }
  };

  const selectedCountry = countries.find(c => c.id === formData.countryId) || null;

  const handleFilterChange = (event) => {
    const value = event.filter.value || '';
    setSearchTerm(value);
    const filtered = countries.filter(
      (c) => c.name.toLowerCase().includes(value.toLowerCase()) || c.id.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCountries(filtered);
  };

  const countryItemRender = (li, itemProps) => {
    const country = itemProps.dataItem;
    return React.cloneElement(li, {
      ...li.props,
      children: (
        <div className="flex items-center gap-2 py-1">
          <span>{country.flag}</span>
          <span>{country.name}</span>
        </div>
      ),
    });
  };

  const countryValueRender = (element, value) => {
    if (!value) return element;
    return (
      <div className="flex items-center gap-2">
        <span>{value.flag}</span>
        <span>{value.name}</span>
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md transition hover:shadow-2xl">
        <div className="mb-8 text-center">
          <img src="/icon.png" alt="DSIQ Logo" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Registration</h1>
          <p className="text-gray-600">Register your company to get started</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <Input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" className="w-full" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <Input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Acme Inc." className="w-full" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Email ID</label>
          <Input type="email" name="companyEmail" value={formData.companyEmail} onChange={handleChange} placeholder="admin@acme.com" className="w-full" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <ComboBox
            data={filteredCountries}
            textField="name"
            dataItemKey="id"
            value={selectedCountry}
            onChange={handleCountryChange}
            filterable
            onFilterChange={handleFilterChange}
            itemRender={countryItemRender}
            valueRender={countryValueRender}
            placeholder="Select Country"
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Unique Code</label>
          <Input type="text" name="companyCode" value={formData.companyCode} onChange={handleChange} placeholder="e.g., ACME123" className="w-full" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full !pr-10"
            />
            <button type="button" className="absolute inset-y-0 right-0 px-3 text-gray-600" onClick={togglePasswordVisibility}>
              {showPassword ? <EyeOff className="!h-5 !w-5" /> : <Eye className="!h-5 !w-5" />}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full !pr-10"
            />
            <button type="button" className="absolute inset-y-0 right-0 px-3 text-gray-600" onClick={toggleConfirmPasswordVisibility}>
              {showConfirmPassword ? <EyeOff className="!h-5 !w-5" /> : <Eye className="!h-5 !w-5" />}
            </button>
          </div>
        </div>

        <Button primary type="submit" className="w-full !text-white !bg-indigo-600 hover:!bg-indigo-700 rounded-full">
          Register
        </Button>

        <p className="mt-5 text-center text-sm text-gray-500">
          Already registered?{' '}
          <a href="/login" className="text-indigo-600 font-medium hover:underline">
            Log in
          </a>
        </p>
      </form>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default RegisterPage;
