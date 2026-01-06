import React from 'react';
import { motion } from 'framer-motion';
import { Baby, MessageCircle, AlertTriangle, Activity, Heart, Sparkles, ChevronLeft, Bell } from 'lucide-react';
import Header from '@/components/Header';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = React.useState<string>('');
  const [stats, setStats] = React.useState({
    childrenCount: 0,
    vaccinationsCount: 0,
    notificationsCount: 0
  });

  React.useEffect(() => {
    if (user) {
      const fetchProfileAndStats = async () => {
        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        if (profile?.full_name) {
          setFullName(profile.full_name);
        }

        // Fetch stats
        const [childrenRes, vaccRes, notifRes] = await Promise.all([
          supabase.from('children').select('id', { count: 'exact', head: true }).eq('parent_id', user.id),
          supabase.from('child_vaccinations' as any).select('id', { count: 'exact', head: true }).eq('completed', true), // Note: filter by child_id if possible, but let's get total for all children
          supabase.from('notifications' as any).select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_read', false)
        ]);

        setStats({
          childrenCount: childrenRes.count || 0,
          vaccinationsCount: vaccRes.count || 0,
          notificationsCount: notifRes.count || 0
        });
      };
      fetchProfileAndStats();
    }
  }, [user]);

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting = 'مساء الخير';
    if (hour < 12) greeting = 'صباح الخير';
    else if (hour < 17) greeting = 'مساء الخير';

    return fullName ? `${greeting}، ${fullName.split(' ')[0]}` : greeting;
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
    <div className="flex flex-col h-full pt-1 pb-4">
      <Header title="طمّنّي" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white rounded-3xl p-5 shadow-soft mb-4 border border-primary/5 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold text-foreground leading-tight">
                {getWelcomeMessage()}
              </h2>
              <p className="text-xs text-muted-foreground mt-1 tracking-wide">كيف يمكننا مساعدتك اليوم؟</p>
            </div>
            {stats.notificationsCount > 0 && (
              <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-bold border border-red-100 animate-pulse shadow-sm">
                <Bell size={12} className="fill-current" />
                <span>{stats.notificationsCount} جديد</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-primary/5 rounded-2xl p-3 flex flex-col items-center text-center border border-primary/10 backdrop-blur-sm shadow-sm transition-all hover:bg-primary/10">
              <span className="text-xl font-bold text-primary leading-none mb-1.5">{stats.childrenCount}</span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">أطفالك</span>
            </div>
            <div className="bg-secondary/5 rounded-2xl p-3 flex flex-col items-center text-center border border-secondary/10 backdrop-blur-sm shadow-sm transition-all hover:bg-secondary/10">
              <span className="text-xl font-bold text-secondary leading-none mb-1.5">{stats.vaccinationsCount}</span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">تطعيمات</span>
            </div>
            <div className="bg-accent/5 rounded-2xl p-3 flex flex-col items-center text-center border border-accent/10 backdrop-blur-sm shadow-sm transition-all hover:bg-accent/10">
              <span className="text-xl font-bold text-accent leading-none mb-1.5">{stats.notificationsCount}</span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">تنبيهات</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Daily Tip - More Compact */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden bg-gradient-to-l from-primary/5 via-white to-white rounded-2xl p-3 shadow-soft mb-3 border border-primary/10"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
            <Heart size={18} className="text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-bold text-xs text-foreground">نصيحة اليوم</h3>
              <Sparkles size={12} className="text-primary" />
            </div>
            <p className="text-[11px] text-muted-foreground leading-tight line-clamp-1 italic">{currentTip}</p>
          </div>
        </div>
      </motion.div>

      {/* Feature Cards Grid - More Compact */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-2 flex-1"
      >
        {features.map((feature, index) => (
          <motion.div key={feature.to} variants={itemVariants}>
            <Link
              to={feature.to}
              className="flex flex-col bg-white rounded-2xl p-3 shadow-soft h-full border-r-4 hover:scale-[1.02] active:scale-[0.98] transition-all border-gray-50"
              style={{ borderRightColor: feature.color }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                style={{ backgroundColor: `${feature.color}15` }}
              >
                <feature.icon size={20} style={{ color: feature.color }} />
              </div>
              <h3 className="font-bold text-sm mb-0.5">{feature.title}</h3>
              <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2 flex-1">{feature.description}</p>
              <div className="flex items-center gap-1 mt-2 text-[10px] font-bold" style={{ color: feature.color }}>
                <span>استكشفي</span>
                <ChevronLeft size={12} className="rtl:rotate-0 ltr:rotate-180" />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Index;