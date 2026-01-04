import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, User, Mail, Phone, LogOut, Users, Save } from 'lucide-react';
import LoadingIndicator from '@/components/LoadingIndicator';

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
}

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          email: data.email || user.email || '',
          phone: data.phone || '',
        });
      } else {
        // Create profile if doesn't exist
        const newProfile = {
          id: user.id,
          full_name: user.user_metadata?.full_name || '',
          email: user.email || '',
        };
        await supabase.from('profiles').insert(newProfile);
        setFormData({
          full_name: newProfile.full_name,
          email: newProfile.email,
          phone: '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('تم حفظ البيانات بنجاح');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('حدث خطأ في حفظ البيانات');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 pb-24">
      {/* Header */}
      <div className="p-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">الملف الشخصي</h1>
      </div>

      {/* Avatar */}
      <div className="flex justify-center my-6">
        <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center shadow-lg">
          <User className="h-12 w-12 text-primary-foreground" />
        </div>
      </div>

      {/* Form */}
      <div className="px-6 space-y-6">
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <h2 className="font-semibold text-lg mb-4">بيانات الوالد/الوالدة</h2>

          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              الاسم الكامل
            </Label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="fullName"
                type="text"
                placeholder="أدخل اسمك الكامل"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                className="pr-10 input-field"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              البريد الإلكتروني
            </Label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="pr-10 input-field bg-muted cursor-not-allowed"
                dir="ltr"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              لا يمكن تغيير البريد الإلكتروني
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              رقم الجوال
            </Label>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="05xxxxxxxx"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="pr-10 input-field"
                dir="ltr"
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            className="w-full btn-primary h-12"
            disabled={saving}
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span>جاري الحفظ...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-5 w-5" />
                <span>حفظ التغييرات</span>
              </div>
            )}
          </Button>
        </div>

        {/* Children Link */}
        <Button
          variant="outline"
          onClick={() => navigate('/profile/children')}
          className="w-full h-14 rounded-2xl border-2 border-secondary/30 hover:bg-secondary/10 flex items-center justify-between px-6"
        >
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-secondary" />
            <span className="font-medium">إدارة الأطفال</span>
          </div>
          <ArrowLeft className="h-5 w-5 text-muted-foreground rotate-180" />
        </Button>

        {/* Logout */}
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full h-12 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-2xl"
        >
          <LogOut className="h-5 w-5 ml-2" />
          <span>تسجيل الخروج</span>
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
