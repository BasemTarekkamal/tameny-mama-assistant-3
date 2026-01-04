import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Baby, Save, Calendar, Droplets, AlertTriangle } from 'lucide-react';
import LoadingIndicator from '@/components/LoadingIndicator';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const ChildFormPage = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date_of_birth: '',
    gender: '',
    blood_type: '',
    allergies: '',
    medical_notes: '',
  });

  useEffect(() => {
    if (isEditing && user) {
      fetchChild();
    }
  }, [id, user]);

  const fetchChild = async () => {
    if (!user || !id) return;

    try {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('id', id)
        .eq('parent_id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          name: data.name || '',
          date_of_birth: data.date_of_birth || '',
          gender: data.gender || '',
          blood_type: data.blood_type || '',
          allergies: data.allergies?.join(', ') || '',
          medical_notes: data.medical_notes || '',
        });
      }
    } catch (error) {
      console.error('Error fetching child:', error);
      toast.error('حدث خطأ في تحميل البيانات');
      navigate('/profile/children');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    if (!formData.name.trim()) {
      toast.error('يرجى إدخال اسم الطفل');
      return;
    }

    setSaving(true);

    try {
      const childData = {
        name: formData.name.trim(),
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender || null,
        blood_type: formData.blood_type || null,
        allergies: formData.allergies
          ? formData.allergies.split(',').map((a) => a.trim()).filter(Boolean)
          : null,
        medical_notes: formData.medical_notes || null,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('children')
          .update(childData)
          .eq('id', id)
          .eq('parent_id', user.id);

        if (error) throw error;
        toast.success('تم تحديث بيانات الطفل بنجاح');
      } else {
        const { error } = await supabase.from('children').insert({
          ...childData,
          parent_id: user.id,
        });

        if (error) throw error;
        toast.success('تم إضافة الطفل بنجاح');
      }

      navigate('/profile/children');
    } catch (error) {
      console.error('Error saving child:', error);
      toast.error('حدث خطأ في حفظ البيانات');
    } finally {
      setSaving(false);
    }
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
          onClick={() => navigate('/profile/children')}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">
          {isEditing ? 'تعديل بيانات الطفل' : 'إضافة طفل جديد'}
        </h1>
      </div>

      {/* Avatar */}
      <div className="flex justify-center my-6">
        <div className="w-20 h-20 rounded-full gradient-secondary flex items-center justify-center shadow-lg">
          <Baby className="h-10 w-10 text-secondary-foreground" />
        </div>
      </div>

      {/* Form */}
      <div className="px-6 space-y-6">
        {/* Basic Info */}
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <h2 className="font-semibold text-lg mb-4">البيانات الأساسية</h2>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              اسم الطفل <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="أدخل اسم الطفل"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="input-field"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob" className="text-sm font-medium">
              تاريخ الميلاد
            </Label>
            <div className="relative">
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="dob"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) =>
                  setFormData({ ...formData, date_of_birth: e.target.value })
                }
                className="pr-10 input-field"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">الجنس</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) =>
                setFormData({ ...formData, gender: value })
              }
            >
              <SelectTrigger className="input-field">
                <SelectValue placeholder="اختر الجنس" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">ذكر</SelectItem>
                <SelectItem value="female">أنثى</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Medical Info */}
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <h2 className="font-semibold text-lg mb-4">المعلومات الطبية</h2>

          <div className="space-y-2">
            <Label className="text-sm font-medium">فصيلة الدم</Label>
            <div className="relative">
              <Droplets className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
              <Select
                value={formData.blood_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, blood_type: value })
                }
              >
                <SelectTrigger className="pr-10 input-field">
                  <SelectValue placeholder="اختر فصيلة الدم" />
                </SelectTrigger>
                <SelectContent>
                  {bloodTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allergies" className="text-sm font-medium">
              الحساسية
            </Label>
            <div className="relative">
              <AlertTriangle className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="allergies"
                type="text"
                placeholder="مثال: حليب، بيض، فول سوداني"
                value={formData.allergies}
                onChange={(e) =>
                  setFormData({ ...formData, allergies: e.target.value })
                }
                className="pr-10 input-field"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              افصل بين أنواع الحساسية بفاصلة
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalNotes" className="text-sm font-medium">
              ملاحظات طبية
            </Label>
            <Textarea
              id="medicalNotes"
              placeholder="أضف أي ملاحظات طبية مهمة..."
              value={formData.medical_notes}
              onChange={(e) =>
                setFormData({ ...formData, medical_notes: e.target.value })
              }
              className="input-field min-h-[100px] resize-none"
            />
          </div>
        </div>

        {/* Save Button */}
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
              <span>{isEditing ? 'حفظ التغييرات' : 'إضافة الطفل'}</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChildFormPage;
