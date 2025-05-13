import { Home, User, Settings, LogOut, MessageCircleQuestion } from "lucide-react";
import { useUser } from "@/utils/queries/user/getUser";
import { useState } from "react";
import { Loading } from "./Loading";

const Sidebar = () => {
    const { user, loading, error } = useUser();
    const [isHovered, setIsHovered] = useState(false);

    if (loading) return <Loading />;
    if (!user) return null;

    const menuItems = [
        { icon: <Home size={20} className="transition-transform duration-300 group-hover:scale-110" />, label: "Application", href: "/app" },
        { icon: <User size={20} className="transition-transform duration-300 group-hover:scale-110" />, label: "Profile", href: "/profile" },
        { icon: <Settings size={20} className="transition-transform duration-300 group-hover:scale-110" />, label: "Settings", href: "/settings" },
    ];

    const bottomItems = [
        { icon: <MessageCircleQuestion size={20} className="transition-transform duration-300 group-hover:scale-110" />, label: "Help", href: "/help" },
        { icon: <LogOut size={20} className="transition-transform duration-300 group-hover:scale-110" />, label: "Logout", href: "/logout" },
    ];

    return (
        <div 
            className="sidebar fixed top-0 left-0 h-full transition-all duration-300 ease-in-out shadow-lg bg-secondary z-50"
            style={{ width: isHovered ? '200px' : '64px' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex flex-col items-center justify-between h-full py-6 border-r border-white border-opacity-20">
                <div className="w-full">
                    <div className="relative w-10 h-10 mx-auto mb-8 overflow-hidden rounded-full bg-secondary ring-2 ring-white ring-opacity-30 transition-all duration-300 hover:ring-opacity-70">
                        <img 
                            src="https://ca.slack-edge.com/T0266FRGM-U078GC2JT53-d1bd6096fcba-512" 
                            alt="Logo" 
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
                        />
                        {isHovered && (
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                <User size={16} className="text-white" />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col space-y-1 items-center px-2">
                        {menuItems.map((item, index) => (
                            <a
                                key={index}
                                href={item.href}
                                className="group flex items-center w-full px-3 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200"
                                title={item.label}
                            >
                                <div className="flex-shrink-0">{item.icon}</div>
                                <span 
                                    className={`ml-3 font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
                                        isHovered ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
                                    }`}
                                >
                                    {item.label}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>

                <div className="mt-auto flex flex-col space-y-1 items-center w-full px-2">
                    {bottomItems.map((item, index) => (
                        <a
                            key={index}
                            href={item.href}
                            className="group flex items-center w-full px-3 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200"
                            title={item.label}
                        >
                            <div className="flex-shrink-0">{item.icon}</div>
                            <span 
                                className={`ml-3 font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
                                    isHovered ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
                                }`}
                            >
                                {item.label}
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;