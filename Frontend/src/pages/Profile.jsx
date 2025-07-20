import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import EditProfile from './EditProfile';
import defaultProfile from '../assets/images/profile.png'; 

const Profile = () => {
  const { user, token, logout, setUser, setToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!user || !token) {
      setLoading(false);
      setProfile(null);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');
        setProfile(data.user || data);
      } catch (error) {
        console.error('Error fetching profile:', error.message);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, token]);

  if (loading) {
    return <p className="text-center text-gray-500 mt-8 animate-pulse">Loading profile...</p>;
  }

  if (!user || !profile) {
    return (
      <p className="text-center text-gray-600 mt-8">
        Please log in to see your profile.
      </p>
    );
  }

  if (editMode) {
    return (
      <EditProfile
        profile={profile}
        token={token}
        onCancel={() => setEditMode(false)}
        onUpdated={({ user: updatedProfile, token: newToken }) => {
          setProfile(updatedProfile);
          localStorage.setItem('user', JSON.stringify(updatedProfile));
          if (typeof setUser === 'function') setUser(updatedProfile);
          if (newToken) {
            localStorage.setItem('token', newToken);
            if (typeof setToken === 'function') setToken(newToken);
          }
          setEditMode(false);
        }}
      />
    );
  }

  const imageUrl = profile.profileImage?.startsWith('http')
    ? profile.profileImage
    : profile.profileImage
    ? `http://localhost:5000${profile.profileImage}`
    : defaultProfile;

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-white shadow-xl rounded-xl border border-gray-200 p-8">
      <div className="flex flex-col items-center mb-6">
        <img
          src={imageUrl}
          onError={(e) => (e.target.src = defaultProfile)}
          alt="Profile"
          className="w-28 h-28 rounded-full border-2 border-gray-300 shadow-sm object-cover"
        />
        <h2 className="text-2xl font-bold mt-4 text-blue-700">{profile.name ?? '-'}</h2>
        <p className="text-sm text-gray-500">{profile.role?.toUpperCase() ?? '-'}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
        <div><strong>Email:</strong> {profile.email ?? '-'}</div>
        <div><strong>Phone:</strong> {profile.phone ?? '-'}</div>
        <div><strong>Address:</strong> {profile.address ?? '-'}</div>
        <div><strong>Status:</strong> {profile.isActive ? 'Active' : 'Inactive'}</div>
        {/* <div><strong>Email Verified:</strong> {profile.isEmailVerified ? 'Yes' : 'No'}</div> */}
        {/* <div><strong>Locked:</strong> {profile.isLocked ? 'Yes' : 'No'}</div>
        <div><strong>Created At:</strong> {new Date(profile.createdAt).toLocaleDateString()}</div>
        <div><strong>Updated At:</strong> {new Date(profile.updatedAt).toLocaleDateString()}</div> */}
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => setEditMode(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm shadow transition"
        >
          Edit Profile
        </button>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm shadow transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
