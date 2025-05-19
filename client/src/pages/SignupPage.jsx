import React, { useState, useEffect } from 'react';
import { Input } from '@progress/kendo-react-inputs';
import { ComboBox } from '@progress/kendo-react-dropdowns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerAdmin } from '../redux/slices/authSlice';
import { Eye, EyeOff } from 'lucide-react';

const countries = [ 
  // Adding more countries with their phone codes
  { id: 'us', name: 'United States', flag: '🇺🇸', phoneCode: '+1' },
  { id: 'ca', name: 'Canada', flag: '🇨🇦', phoneCode: '+1' },
  { id: 'gb', name: 'United Kingdom', flag: '🇬🇧', phoneCode: '+44' },
  { id: 'au', name: 'Australia', flag: '🇦🇺', phoneCode: '+61' },
  { id: 'in', name: 'India', flag: '🇮🇳', phoneCode: '+91' },
  { id: 'de', name: 'Germany', flag: '🇩🇪', phoneCode: '+49' },
  { id: 'fr', name: 'France', flag: '🇫🇷', phoneCode: '+33' },
  { id: 'jp', name: 'Japan', flag: '🇯🇵', phoneCode: '+81' },
  { id: 'cn', name: 'China', flag: '🇨🇳', phoneCode: '+86' },
  { id: 'br', name: 'Brazil', flag: '🇧🇷', phoneCode: '+55' },
  { id: 'ru', name: 'Russia', flag: '🇷🇺', phoneCode: '+7' },
  { id: 'vn', name: 'Vietnam', flag: '🇻🇳', phoneCode: '+84' },
  { id: 'ye', name: 'Yemen', flag: '🇾🇪', phoneCode: '+967' },
  { id: 'zm', name: 'Zambia', flag: '🇿🇲', phoneCode: '+260' },
  { id: 'zw', name: 'Zimbabwe', flag: '🇿🇼', phoneCode: '+263' }
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    companyEmail: '',
    address: '',
    contactNumber: '',
    password: '',
    confirmPassword: '',
    countryId: '',
    });

  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Default to US (or your preferred default country)
    const defaultCountry = countries.find(c => c.id === 'us');
    setFormData(prev => ({ 
      ...prev, 
      countryId: 'us',
      contactNumber: defaultCountry ? defaultCountry.phoneCode + ' ' : ''
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.value;
    const countryId = selectedCountry && selectedCountry.id ? selectedCountry.id : '';
    
    // Update country ID in form data
    setFormData(prev => ({ 
      ...prev, 
      countryId 
    }));
    
    // Update phone code prefix in contact number if a country is selected
    if (selectedCountry && selectedCountry.phoneCode) {
      // Get current phone number without any country code
      const currentNumber = formData.contactNumber.replace(/^\+\d+\s*/, '');
      // Set new phone number with the selected country's code
      setFormData(prev => ({ 
        ...prev, 
        contactNumber: `${selectedCountry.phoneCode} ${currentNumber}`.trim() 
      }));
    }
  };

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, companyName, companyEmail, address, contactNumber, password, confirmPassword, countryId } = formData;

    if (!fullName || !companyName || !companyEmail || !address || !contactNumber || !password || !confirmPassword || !countryId) {
      toast.error('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(companyEmail)) {
      toast.error('Please enter a valid company email');
      return;
    }

    // Phone number validation - accepting country code format
    // This regex allows a plus sign, followed by digits, optional spaces, and more digits
    const phoneRegex = /^\+\d+[\s\d]{5,14}$/;
    if (!phoneRegex.test(contactNumber)) {
      toast.error('Please enter a valid contact number with country code');
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
      await dispatch(registerAdmin({ 
        fullName, 
        companyName, 
        email: companyEmail, 
        address,
        contactNumber,
        password, 
        countryId, 
        userType: 'admin' 
      }));
      toast.success('Admin account created successfully!');
      navigate('/workspaceCreate');
    } catch (error) {
      toast.error(error.message || 'Failed to register admin');
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Add ToastContainer here */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
      {/* Left Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <img src="/icon.png" alt="DSIQ Logo" className="h-12 w-auto mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Registration</h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 w-full">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Register your company to get started</h2>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <Input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123 Business St, City, State" className="w-full" />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <Input 
                type="tel" 
                name="contactNumber" 
                value={formData.contactNumber} 
                onChange={handleChange} 
                placeholder="Phone number" 
                className="w-full" 
              />
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
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button primary type="submit" className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded hover:bg-indigo-700 transition">
              Register
            </button>

            <p className="mt-5 text-center text-sm text-gray-500">
              Already registered?{' '}
              <a href="/login" className="text-indigo-600 hover:underline">
                Log in
              </a>
            </p>
          </form>
          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="text-xs text-gray-500">
              © 2025 DSIQ, Inc. All rights reserved. | Privacy
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Advertisement */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="flex flex-col justify-center items-center p-8 w-full">
          <div className="max-w-lg text-center">
            <h2 className="text-4xl font-bold mb-6">DSIQ Platform</h2>
            <div className="h-32 w-32 mx-auto mb-8 bg-white rounded-full flex items-center justify-center">
              <img src="/icon.png" alt="DSIQ Logo" className="h-24 w-auto" />
            </div>
            
            <h3 className="text-2xl font-semibold mb-4">Coming Soon</h3>
            <p className="text-lg mb-6">Our revolutionary data analytics platform will transform how your business makes decisions.</p>
          </div> 
        </div> 
      </div> 
    </div>   
  );
};

export default RegisterPage;