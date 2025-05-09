import React, { useState } from 'react';
import { Pencil, Save, X, Camera, Calendar, MapPin, Briefcase, Mail, Phone } from 'lucide-react';

const initialProfile = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  company: 'DSIQ Inc.',
  role: 'Product Manager',
  location: 'San Francisco, CA',
  phone: '+1 (555) 123-4567',
  birthday: 'April 15, 1990',
  bio: 'Product Manager with 8+ years of experience in SaaS and fintech industries. Passionate about creating user-centric solutions that drive business growth.',
  profileImage: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600'
};

const Profile = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [editMode, setEditMode] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChange = (field, value) => {
    setTempProfile({ ...tempProfile, [field]: value });
  };

  const handleImageChange = (e) => {
    setTempProfile({
      ...tempProfile,
      profileImage: '/api/placeholder/400/400'
    });
  };

  const handleSave = () => {
    if (newPassword && newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setProfile(tempProfile);
    setEditMode(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setEditMode(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Your Profile</h1>
          {editMode ? (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm"
              >
                <Save size={16} /> Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-700 text-gray-200 px-4 py-2 rounded-lg hover:opacity-80 transition flex items-center gap-2 text-sm"
              >
                <X size={16} /> Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="text-blue-400 hover:opacity-80 flex items-center gap-2 text-sm font-medium"
            >
              <Pencil size={16} /> Edit Profile
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col items-center lg:border-r lg:border-gray-700 pr-0 lg:pr-6">
            <div className="relative mb-4">
              <img
                src={editMode ? tempProfile.profileImage : profile.profileImage}
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-lg"
              />
              {editMode && (
                <label className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 text-white shadow-lg">
                  <Camera size={18} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <h2 className="text-xl font-bold mt-2">{editMode ? tempProfile.name : profile.name}</h2>
            <p className="text-gray-400 mb-4">{editMode ? tempProfile.role : profile.role}</p>
          </div>

          <div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-2 text-gray-200">Bio</h3>
              {editMode ? (
                <textarea
                  value={tempProfile.bio || ''}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition h-24"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-300">{profile.bio || 'No bio available.'}</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-200">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail size={18} className="mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    {editMode ? (
                      <input
                        type="email"
                        value={tempProfile.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                      />
                    ) : (
                      <p>{profile.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={18} className="mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    {editMode ? (
                      <input
                        type="text"
                        value={tempProfile.phone || ''}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                      />
                    ) : (
                      <p>{profile.phone || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    {editMode ? (
                      <input
                        type="text"
                        value={tempProfile.location || ''}
                        onChange={(e) => handleChange('location', e.target.value)}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                      />
                    ) : (
                      <p>{profile.location || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-200">Work Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Briefcase size={18} className="mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Company</p>
                    {editMode ? (
                      <input
                        type="text"
                        value={tempProfile.company}
                        onChange={(e) => handleChange('company', e.target.value)}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                      />
                    ) : (
                      <p>{profile.company}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase size={18} className="mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Role</p>
                    {editMode ? (
                      <input
                        type="text"
                        value={tempProfile.role}
                        onChange={(e) => handleChange('role', e.target.value)}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                      />
                    ) : (
                      <p>{profile.role}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar size={18} className="mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Birthday</p>
                    {editMode ? (
                      <input
                        type="text"
                        value={tempProfile.birthday || ''}
                        onChange={(e) => handleChange('birthday', e.target.value)}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                      />
                    ) : (
                      <p>{profile.birthday || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {editMode && (
              <div className="md:col-span-2 mt-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-200">Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-6">
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
    </div>
  );
};

export default Profile;
