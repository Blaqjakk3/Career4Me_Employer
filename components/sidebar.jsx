'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Home, Briefcase, User, Settings, LogOut, ChevronLeft, ChevronRight, ChartColumnIncreasing } from 'lucide-react';
import destroySession from '../app/actions/destroySession';
import getMyProfile from '../app/actions/getMyProfile';
import { toast } from 'react-toastify';
import Image from 'next/image';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const [profile, setProfile] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await getMyProfile();
        if (result.success) {
          setProfile(result.profile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    const { success, error } = await destroySession();
    if (success) {
      router.push('/signin');
    } else {
      toast.error(error);
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: <ChartColumnIncreasing className="h-5 w-5" /> },
    { name: "Jobs", href: "/jobs", icon: <Briefcase className="h-5 w-5" /> },
    { name: "Profile", href: "/profile", icon: <User className="h-5 w-5" /> },
    { name: "Settings", href: "/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  // Don't render until client-side to avoid hydration mismatch
  if (!isClient) {
    return (
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 z-50 md:w-64">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/30"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-100/20 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col h-full border-r border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br shadow-lg">
                <Image 
                  src="/icons/C4Me.png" 
                  alt="Career4Me Logo"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r text-[#5badec] bg-clip-text">
                Career4Me
              </span>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside 
      className={`
        hidden md:flex md:flex-col md:fixed md:inset-y-0 z-50
        transition-all duration-300 ease-in-out
        ${collapsed ? "md:w-20" : "md:w-64"}
      `}
    >
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/30"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-100/20 rounded-full blur-2xl"></div>
      
      <div className="relative z-10 flex flex-col h-full border-r border-gray-200 bg-white/80 backdrop-blur-sm">
        {/* Logo Section with Toggle Button */}
        <div 
          className={`
            flex items-center ${collapsed ? "justify-center" : "justify-between"} 
            h-16 px-4 border-b border-gray-200/50 cursor-pointer
            hover:bg-white/60 transition-all duration-200
          `}
          onClick={() => setCollapsed(!collapsed)}
        >
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br shadow-lg">
              <Image 
                src="/icons/C4Me.png" 
                alt="Career4Me Logo"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            {!collapsed && (
              <span className="text-xl font-bold bg-gradient-to-r text-[#5badec] bg-clip-text">
                Career4Me
              </span>
            )}
          </div>
          {!collapsed && (
            <div className="p-2 rounded-lg hover:bg-white/60 transition-colors">
              <ChevronLeft className="h-4 w-4 text-gray-500" />
            </div>
          )}
          {collapsed && (
            <div className="absolute right-2 p-2 rounded-lg hover:bg-white/60 transition-colors">
              <ChevronRight className="h-4 w-4 text-gray-500" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-3 py-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center ${collapsed ? "justify-center px-3" : "px-4"} 
                  py-3 text-sm font-semibold rounded-xl transition-all duration-200
                  transform hover:-translate-y-0.5
                  ${pathname === item.href
                    ? "text-white shadow-lg hover:shadow-xl"
                    : "text-gray-700 hover:bg-white/60 hover:text-[#5badec] hover:shadow-md"
                  }
                `}
                style={pathname === item.href ? { backgroundColor: '#5badec' } : {}}
                title={collapsed ? item.name : ""}
              >
                <div className={`
                  flex items-center justify-center w-6 h-6 ${collapsed ? "" : "mr-3"}
                  ${pathname === item.href ? "text-white" : "text-gray-600 group-hover:text-[#5badec]"}
                  transition-colors duration-200
                `}>
                  {item.icon}
                </div>
                {!collapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
                {pathname === item.href && !collapsed && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full opacity-80"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* User Profile Badge - Always show if profile exists */}
          {profile && (
            <div className="px-3 pb-4">
              {collapsed ? (
                // Collapsed state - show only avatar with tooltip
                <div 
                  className="flex justify-center"
                  title={profile.name || profile.companyName || 'User'}
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-blue-100 hover:ring-blue-200 transition-all duration-200 cursor-pointer">
                    {profile.avatar ? (
                      <img 
                        src={profile.avatar} 
                        alt={profile.companyName || 'User Avatar'}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ${profile.avatar ? 'hidden' : 'flex'}`}
                    >
                      <span className="text-white font-semibold text-lg">
                        {profile.name ? profile.name.charAt(0).toUpperCase() : 
                         profile.companyName ? profile.companyName.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                // Expanded state - show full profile card
                <div className="flex items-center px-4 py-3 bg-white/60 rounded-xl border border-gray-200/50 shadow-sm hover:bg-white/80 transition-all duration-200">
                  <div className="w-10 h-10 rounded-xl overflow-hidden mr-3 ring-2 ring-blue-100">
                    {profile.avatar ? (
                      <img 
                        src={profile.avatar} 
                        alt={profile.companyName || 'User Avatar'}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ${profile.avatar ? 'hidden' : 'flex'}`}
                    >
                      <span className="text-white font-semibold text-lg">
                        {profile.name ? profile.name.charAt(0).toUpperCase() : 
                         profile.companyName ? profile.companyName.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {profile.name || profile.companyName || 'User'}
                    </div>
                    <div className="text-xs text-gray-500">Employer</div>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="px-3 py-4 border-t border-gray-200/50">
          <button
            onClick={handleLogout}
            className={`
              group flex items-center ${collapsed ? "justify-center px-3" : "px-4"} 
              w-full py-3 text-sm font-semibold text-gray-700 rounded-xl 
              hover:bg-red-50 hover:text-red-600 transition-all duration-200
              transform hover:-translate-y-0.5 hover:shadow-md
            `}
            title={collapsed ? "Sign Out" : ""}
          >
            <div className={`
              flex items-center justify-center w-6 h-6 ${collapsed ? "" : "mr-3"}
              text-gray-600 group-hover:text-red-600 transition-colors duration-200
            `}>
              <LogOut className="h-5 w-5" />
            </div>
            {!collapsed && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;