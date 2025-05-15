import React, { useState, useEffect } from 'react';
import { Camera, Calendar, MapPin, Briefcase, Mail, Phone, ArrowLeft } from 'lucide-react';
import Footer from './Footer';

const initialProfile = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  company: 'DSIQ Inc.',
  role: 'Admin',
  location: 'San Francisco, CA',
  phone: '+1 (555) 123-4567',
  birthday: 'April 15, 1990',
  bio: 'Product Manager with 8+ years of experience in SaaS and fintech industries. Passionate about creating user-centric solutions that drive business growth.',
  profileImage: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600'
};

const EditableField = ({ 
  value, 
  onSave, 
  type = 'text', 
  placeholder = '', 
  className = '',
  multiline = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  const handleBlur = () => {
    setIsEditing(false);
    if (value !== localValue) {
      onSave(localValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  // Update local state if value prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  if (isEditing) {
    return multiline ? (
      <textarea
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${className}`}
        placeholder={placeholder}
        autoFocus
      />
    ) : (
      <input
        type={type}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${className}`}
        placeholder={placeholder}
        autoFocus
      />
    );
  }

  return (
    <div 
      onClick={() => setIsEditing(true)} 
      className="cursor-text hover:bg-gray-700 rounded-lg p-1 transition"
    >
      {value || placeholder}
    </div>
  );
};

const Profile = ({isLoggedIn} ) => {
  // Load profile from localStorage or use initial profile
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : initialProfile;
  });

  // Load profile image from localStorage or use initial image
  const [profileImage, setProfileImage] = useState(() => {
    const savedImage = localStorage.getItem('userProfileImage');
    return savedImage || initialProfile.profileImage;
  });

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);

  // Save profile image to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userProfileImage', profileImage);
  }, [profileImage]);

  const handleGoBack = () => {
    // Simple placeholder for navigation. In a real app, 
    // this would use react-router or another navigation method
    window.history.back();
  };

  const handleSaveField = (field, value) => {
    setProfile(prev => {
      const updatedProfile = {
        ...prev,
        [field]: value
      };
      // Automatically save to localStorage
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      return updatedProfile;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = reader.result;
        setProfileImage(newImage);
        // Automatically save to localStorage
        localStorage.setItem('userProfileImage', newImage);
      };
      reader.readAsDataURL(file);
    }
  };

  // Password change handling
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    isVerified: false
  });
  
  const handlePasswordChange = (field, value) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handlePasswordChangeCombined = () => {
    const { currentPassword, newPassword, confirmPassword } = passwords;
  
    const mockCorrectPassword = 'password123'; // Replace this with actual verification logic
  
    if (currentPassword !== mockCorrectPassword) {
      alert('Current password is incorrect');
      return;
    }
  
    if (!newPassword || newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
  
    alert('Password successfully changed!');
  
    setPasswords({
      currentPassword: newPassword,
      newPassword: '',
      confirmPassword: '',
      isVerified: false
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white transition-all duration-300">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-1 py-9">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 bg-gray-800 shadow-lg p-6 mb-4">
          <div className="flex flex-col items-center lg:border-r lg:border-gray-700 pr-0 lg:pr-6">
            <div className="relative mb-4">
              <img
                src={profileImage}
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-lg"
              />
              <label className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 text-white shadow-lg">
                <Camera size={18} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <h2 className="text-xl font-bold mt-2">
              <EditableField
                value={profile.name}
                onSave={(value) => handleSaveField('name', value)}
                className="text-center"
              />
            </h2>
            <p className="text-gray-400 mb-4">
              <EditableField
                value={profile.role}
                onSave={(value) => handleSaveField('role', value)}
                className="text-center"
              />
            </p>
          </div>

          <div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-2 text-gray-200">Bio</h3>
              <EditableField
                value={profile.bio}
                onSave={(value) => handleSaveField('bio', value)}
                multiline
                placeholder="Tell us about yourself..."
                className="h-24"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-200">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail size={18} className="mt-0.5 text-gray-400" />
                  <div className="w-full">
                    <p className="text-sm text-gray-400">Email</p>
                    <EditableField
                      value={profile.email}
                      onSave={(value) => handleSaveField('email', value)}
                      type="email"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={18} className="mt-0.5 text-gray-400" />
                  <div className="w-full">
                    <p className="text-sm text-gray-400">Phone</p>
                    <EditableField
                      value={profile.phone}
                      onSave={(value) => handleSaveField('phone', value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 text-gray-400" />
                  <div className="w-full">
                    <p className="text-sm text-gray-400">Location</p>
                    <EditableField
                      value={profile.location}
                      onSave={(value) => handleSaveField('location', value)}
                      placeholder="Enter location"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-200">Work Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Briefcase size={18} className="mt-0.5 text-gray-400" />
                  <div className="w-full">
                    <p className="text-sm text-gray-400">Company</p>
                    <EditableField
                      value={profile.company}
                      onSave={(value) => handleSaveField('company', value)}
                      placeholder="Enter company name"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase size={18} className="mt-0.5 text-gray-400" />
                  <div className="w-full">
                    <p className="text-sm text-gray-400">Role</p>
                    <EditableField
                      value={profile.role}
                      onSave={(value) => handleSaveField('role', value)}
                      placeholder="Enter job role"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar size={18} className="mt-0.5 text-gray-400" />
                  <div className="w-full">
                    <p className="text-sm text-gray-400">Birthday</p>
                    <EditableField
                      value={profile.birthday}
                      onSave={(value) => handleSaveField('birthday', value)}
                      placeholder="Enter birthday"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 mt-4">
              {/* Row with 3 inputs */}
              <div className="flex flex-wrap mb-3 gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm text-gray-400 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={passwords.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    placeholder="Enter current password"
                  />
                </div>            

                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm text-gray-400 mb-1">New Password</label>
                  <input
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    placeholder="Change password"
                  />
                </div>            

                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>            
              {/* Button on the next row */}
              <div>
                <button
                  onClick={handlePasswordChangeCombined}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 shadow-lg p-4">
          <h2 className="text-xl font-bold mb-4 text-gray-100">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-start gap-3 p-3 rounded-lg bg-gray-700">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-600">
                  <Calendar size={18} className="text-gray-200" />
                </div>
                <div>
                  <p className="font-medium text-white">Completed project milestone {item}</p>
                  <p className="text-sm text-gray-400">{item} day{item > 1 ? 's' : ''} ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer isLoggedIn={isLoggedIn} />
    </div>
  );
};

export default Profile;