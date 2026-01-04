import React from 'react';
import { motion } from 'framer-motion';
import { Baby, MessageCircle, AlertTriangle, Activity, Heart, Sparkles, ChevronLeft } from 'lucide-react';
import Header from '@/components/Header';
import { Link } from 'react-router-dom';

const Index = () => {
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'صباح الخير';
    if (hour < 17) return 'مساء الخير';
    return 'مساء الخير';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  const tips = [
    "تذكري أن تشربي الكثير من الماء والسوائل خصوصًا إذا كنتِ ترضعين طفلك طبيعياً",
    "النوم على الظهر هو الوضع الأكثر أماناً لطفلك",
    "تحدثي مع طفلك كثيراً، حتى الرضع يستفيدون من سماع صوتك",
  ];
  
  const [currentTip] = React.useState(() => tips[Math.floor(Math.random() * tips.length)]);

  const features = [
    {
      to: "/chat",
      title: "استشارة طبية",
      description: "استشيري المساعد الذكي",
      icon: MessageCircle,
      color: "#4E9AFF",
    },
    {
      to: "/normal",
      title: "هل هذا طبيعي؟",
      description: "الأعراض الطبيعية والغير طبيعية",
      icon: Baby,
      color: "#46C8B2",
    },
    {
      to: "/growth",
      title: "النمو والتطعيمات",
      description: "تتبعي نمو طفلك",
      icon: Activity,
      color: "#9747FF",
    },
    {
      to: "/emergency",
      title: "دليل الطوارئ",
      description: "متى تذهبين للمستشفى",
      icon: AlertTriangle,
      color: "#FF6B6B",
    },
  ];

  return (
    <div className="flex flex-col h-full pt-2">
      <Header title="طمّنّي" />
      
      {/* Welcome Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-white rounded-2xl p-5 shadow-soft mb-4"
      >
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-secondary/10 to-transparent rounded-full blur-xl translate-x-1/4 translate-y-1/4" />
        
        <div className="relative">
          <h2 className="text-2xl font-bold mb-1">
            {getWelcomeMessage()} 👋
          </h2>
          <p className="text-muted-foreground">كيف يمكننا مساعدتك اليوم؟</p>
        </div>
      </motion.div>

      {/* Daily Tip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden bg-gradient-to-l from-primary/5 via-white to-white rounded-2xl p-4 shadow-soft mb-4 border border-primary/10"
      >
        <div className="flex items-center gap-3">
          <motion.div 
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 4,
              ease: "easeInOut"
            }}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0"
          >
            <Heart size={22} className="text-white" />
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-bold text-foreground">نصيحة اليوم</h3>
              <Sparkles size={14} className="text-primary" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{currentTip}</p>
          </div>
        </div>
      </motion.div>
      
      {/* Feature Cards Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-3 flex-1"
      >
        {features.map((feature, index) => (
          <motion.div key={feature.to} variants={itemVariants} className="h-full">
            <Link 
              to={feature.to}
              className="flex flex-col bg-white rounded-2xl p-4 shadow-soft h-full border-r-4 hover:scale-[1.02] active:scale-[0.98] transition-transform"
              style={{ borderRightColor: feature.color }}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" 
                style={{ backgroundColor: `${feature.color}15` }}
              >
                <feature.icon size={24} style={{ color: feature.color }} />
              </div>
              <h3 className="font-bold text-base mb-1">{feature.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">{feature.description}</p>
              <div className="flex items-center gap-1 mt-2 text-xs font-medium" style={{ color: feature.color }}>
                <span>المزيد</span>
                <ChevronLeft size={14} />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Index;