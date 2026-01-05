import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, MessageCircle, Baby, AlertTriangle, Activity } from 'lucide-react';

const navItems = [
  { to: "/", icon: Home, label: "الرئيسية", color: "primary" },
  { to: "/chat", icon: MessageCircle, label: "استشارة", color: "primary" },
  { to: "/normal", icon: Baby, label: "طبيعي؟", color: "secondary" },
  { to: "/growth", icon: Activity, label: "النمو", color: "accent" },
  { to: "/emergency", icon: AlertTriangle, label: "طوارئ", color: "destructive" },
];

const Navigation = () => {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-3 mb-2">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 px-1 py-2">
          <ul className="flex justify-around items-center">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.to;
              return (
                <motion.li
                  key={item.to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NavLink to={item.to} className="relative">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`nav-item ${isActive ? 'nav-item-active' : 'text-muted-foreground'}`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute inset-0 bg-primary/10 rounded-xl"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <item.icon
                        size={20}
                        className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-primary' : ''
                          }`}
                      />
                      <span className={`text-[10px] font-medium relative z-10 transition-colors duration-300 ${isActive ? 'text-primary' : ''
                        }`}>
                        {item.label}
                      </span>
                    </motion.div>
                  </NavLink>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
