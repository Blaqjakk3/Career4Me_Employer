'use client';
import { useState, useEffect, useTransition } from 'react';
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ProfileLayout from './_layout';
import getMyProfile from "../actions/getMyProfile";
import updateProfile from "../actions/updateProfile";
import uploadAvatar from "../actions/uploadAvatar";
import { motion, AnimatePresence } from 'framer-motion';
import { User, Edit3, Camera, Mail, MapPin, Globe, Briefcase, FileText, Save, X } from "lucide-react";

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarFileUrl, setAvatarFileUrl] = useState('');
  const [isPending, startTransition] = useTransition();
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const result = await getMyProfile();
        if (result.success) {
          setProfile(result.profile);
          console.log("Profile loaded:", result.profile);
          console.log("Avatar URL:", result.profile?.avatar);
          if (result.profile?.avatar) {
            setAvatarFileUrl(result.profile.avatar);
            setAvatarError(false);
          }
        } else toast.error(result.error || 'Failed to load profile');
      } catch (error) {
        console.error("Profile loading error:", error);
        toast.error('Error loading profile data');
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleAvatarChange = async (e) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImagePreview(event.target.result);
        setAvatarError(false);
      }
    };
    reader.readAsDataURL(file);

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const result = await uploadAvatar(formData);
      if (result.success) {
        console.log("Avatar uploaded, new URL:", result.fileUrl);
        setAvatarFileUrl(result.fileUrl);
        toast.success('Avatar uploaded');
      } else {
        toast.error(result.error || 'Failed to upload avatar');
        setImagePreview(null);
      }
    } catch (err) {
      console.error("Avatar upload error:", err);
      toast.error('Error uploading avatar');
      setImagePreview(null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const formValues = {
      name: e.target.name.value,
      field: e.target.field.value,
      email: e.target.email.value,
      location: e.target.location.value,
      website: e.target.website.value,
      about: e.target.about.value,
      avatar: avatarFileUrl
    };
    
    console.log("Submitting profile update with data:", formValues);
    
    startTransition(async () => {
      try {
        const result = await updateProfile(formValues);
        if (result.success) {
          toast.success('Profile updated successfully');
          setEditing(false);
          if (result.profile) {
            setProfile(result.profile);
            console.log("Profile updated, new avatar:", result.profile.avatar);
          }
        } else {
          toast.error(result.error || 'Failed to update profile');
        }
      } catch (error) {
        console.error("Profile update error:", error);
        toast.error('Error updating profile');
      }
    });
  };

  const handleImageError = () => {
    console.error("Failed to load avatar image from URL:", profile?.avatar);
    setAvatarError(true);
  };

  if (loading) {
    return (
      <ProfileLayout>
        <div className="min-h-screen bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/30"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-100/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-b-4 border-transparent"></div>
              <p className="text-gray-600">Loading your profile...</p>
            </div>
          </div>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <div className="min-h-screen bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/30"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-100/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 gap-8">
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                <User className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Profile Management</span>
              </div>
              
              {/* Title */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Your
                  <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Profile
                  </span>
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                  Manage your professional profile and showcase your company information
                </p>
              </div>
            </div>

            {!editing && (
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditing(true)} 
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-200 flex items-center"
              >
                <Edit3 className="mr-2 h-5 w-5" />
                Edit Profile
              </motion.button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!editing ? (
              <motion.div
                key="display"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
              >
                {/* Profile Header Card */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-12">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                        {profile?.avatar && !avatarError ? (
                          <img 
                            src={profile.avatar} 
                            alt={`${profile.name || "User"}'s profile avatar`} 
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-white text-gray-400">
                            <User className="h-16 w-16" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-center md:text-left text-white">
                      <h2 className="text-3xl font-bold mb-2">{profile?.name || 'Company Name'}</h2>
                      <p className="text-blue-100 text-lg mb-4">{profile?.field || 'Industry Field'}</p>
                      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                        {profile?.location && (
                          <div className="flex items-center text-blue-100">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="text-sm">{profile.location}</span>
                          </div>
                        )}
                        {profile?.email && (
                          <div className="flex items-center text-blue-100">
                            <Mail className="w-4 h-4 mr-1" />
                            <span className="text-sm">{profile.email}</span>
                          </div>
                        )}
                        {profile?.website && (
                          <div className="flex items-center text-blue-100">
                            <Globe className="w-4 h-4 mr-1" />
                            <a href={profile.website} className="text-sm hover:text-white transition-colors">{profile.website}</a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="p-8">
                  <div className="space-y-8">
                    {/* About Section */}
                    <div>
                      <div className="flex items-center mb-4">
                        <FileText className="w-5 h-5 text-blue-600 mr-2" />
                        <h3 className="text-xl font-semibold text-gray-900">About</h3>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-6">
                        <p className="text-gray-700 leading-relaxed">
                          {profile?.about || 'No information provided yet. Add a description about your company to help others understand what you do.'}
                        </p>
                      </div>
                    </div>

                    {/* Company Details Grid */}
                    <div>
                      <div className="flex items-center mb-6">
                        <Briefcase className="w-5 h-5 text-blue-600 mr-2" />
                        <h3 className="text-xl font-semibold text-gray-900">Company Details</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoCard icon={<User className="w-5 h-5" />} label="Company Name" value={profile?.name} />
                        <InfoCard icon={<Briefcase className="w-5 h-5" />} label="Industry" value={profile?.field} />
                        <InfoCard icon={<Mail className="w-5 h-5" />} label="Email" value={profile?.email} />
                        <InfoCard icon={<MapPin className="w-5 h-5" />} label="Location" value={profile?.location} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="edit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleFormSubmit}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
              >
                {/* Edit Header */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Edit Profile</h2>
                      <p className="text-blue-100">Update your company information</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(false);
                          setImagePreview(null);
                          setAvatarFileUrl(profile?.avatar || '');
                          setAvatarError(false);
                        }}
                        className="px-4 py-2 text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors flex items-center"
                        disabled={isPending}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center"
                        disabled={isPending}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isPending ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Avatar Section */}
                    <div className="lg:w-1/3">
                      <div className="text-center">
                        <div className="relative inline-block">
                          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg mx-auto">
                            {((imagePreview || profile?.avatar) && !avatarError) ? (
                              <img 
                                src={imagePreview || profile.avatar} 
                                alt="Profile preview" 
                                className="w-full h-full object-cover"
                                onError={handleImageError}
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
                                <User className="h-16 w-16" />
                              </div>
                            )}
                          </div>
                          <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200">
                            <Camera className="w-4 h-4" />
                          </label>
                        </div>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                          disabled={uploadingAvatar}
                        />
                        <p className="text-sm text-gray-500 mt-4">
                          {uploadingAvatar ? 'Uploading...' : 'Click camera icon to change avatar'}
                        </p>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="lg:w-2/3 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput 
                          label="Company Name" 
                          name="name" 
                          defaultValue={profile?.name}
                          icon={<User className="w-5 h-5" />}
                        />
                        <FormInput 
                          label="Industry Field" 
                          name="field" 
                          defaultValue={profile?.field}
                          icon={<Briefcase className="w-5 h-5" />}
                        />
                        <FormInput 
                          label="Email" 
                          name="email" 
                          type="email" 
                          defaultValue={profile?.email}
                          icon={<Mail className="w-5 h-5" />}
                        />
                        <FormInput 
                          label="Location" 
                          name="location" 
                          defaultValue={profile?.location}
                          icon={<MapPin className="w-5 h-5" />}
                        />
                      </div>
                      
                      <FormInput 
                        label="Website" 
                        name="website" 
                        type="url" 
                        defaultValue={profile?.website}
                        icon={<Globe className="w-5 h-5" />}
                      />

                      <div>
                        <label htmlFor="about" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-gray-500" />
                          About Your Company
                        </label>
                        <textarea
                          id="about"
                          name="about"
                          rows={5}
                          defaultValue={profile?.about || ''}
                          placeholder="Tell others about your company, mission, and what makes you unique..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ProfileLayout>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="flex items-center px-6 py-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 text-blue-600">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-gray-900 font-semibold truncate">{value || 'Not specified'}</p>
      </div>
    </div>
  );
}

function FormInput({ label, name, defaultValue, type = 'text', icon }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
        {icon && <span className="mr-2 text-gray-500">{icon}</span>}
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        defaultValue={defaultValue || ''}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />
    </div>
  );
}