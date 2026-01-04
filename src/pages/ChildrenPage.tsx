import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Baby, Calendar, Edit2, Trash2 } from 'lucide-react';
import LoadingIndicator from '@/components/LoadingIndicator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Child {
  id: string;
  name: string;
  date_of_birth: string | null;
  gender: string | null;
  blood_type: string | null;
  allergies: string[] | null;
  medical_notes: string | null;
}

const ChildrenPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<Child[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchChildren();
    }
  }, [user]);

  const fetchChildren = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('parent_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setChildren(data || []);
    } catch (error) {
      console.error('Error fetching children:', error);
      toast.error('حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return null;

    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const years = today.getFullYear() - birthDate.getFullYear();
    const months = today.getMonth() - birthDate.getMonth();

    if (years === 0) {
      return `${months + (months < 0 ? 12 : 0)} أشهر`;
    }
    return `${years} سنة`;
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('children')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setChildren(children.filter((child) => child.id !== deleteId));
      toast.success('تم حذف الطفل بنجاح');
    } catch (error) {
      console.error('Error deleting child:', error);
      toast.error('حدث خطأ في حذف البيانات');
    } finally {
      setDeleteId(null);
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
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">أطفالي</h1>
        </div>
        <Button
          onClick={() => navigate('/profile/children/new')}
          size="sm"
          className="btn-primary"
        >
          <Plus className="h-4 w-4 ml-1" />
          إضافة
        </Button>
      </div>

      {/* Children List */}
      <div className="px-6 space-y-4">
        {children.length === 0 ? (
          <div className="glass-card rounded-3xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Baby className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">لا يوجد أطفال مسجلين</h3>
            <p className="text-muted-foreground mb-4">
              أضف بيانات طفلك للحصول على استشارات مخصصة
            </p>
            <Button
              onClick={() => navigate('/profile/children/new')}
              className="btn-secondary"
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة طفل
            </Button>
          </div>
        ) : (
          children.map((child) => (
            <div
              key={child.id}
              className="glass-card rounded-3xl p-5 flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-full gradient-secondary flex items-center justify-center flex-shrink-0">
                <Baby className="h-7 w-7 text-secondary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{child.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {child.date_of_birth && (
                    <>
                      <Calendar className="h-4 w-4" />
                      <span>{calculateAge(child.date_of_birth)}</span>
                    </>
                  )}
                  {child.gender && (
                    <span className="px-2 py-0.5 bg-muted rounded-full text-xs">
                      {child.gender === 'male' ? 'ذكر' : 'أنثى'}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/profile/children/${child.id}`)}
                  className="rounded-full hover:bg-primary/10"
                >
                  <Edit2 className="h-4 w-4 text-primary" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteId(child.id)}
                  className="rounded-full hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف بيانات الطفل نهائياً ولا يمكن استرجاعها.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 rounded-xl"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChildrenPage;
