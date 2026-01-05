import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Heart, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email('البريد الإلكتروني غير صالح');
const passwordSchema = z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
const nameSchema = z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل');

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; name?: string } = {};

    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }

    try {
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }

    if (!isLogin) {
      try {
        nameSchema.parse(fullName);
      } catch (e) {
        if (e instanceof z.ZodError) {
          newErrors.name = e.errors[0].message;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('تم تسجيل الدخول بنجاح');
          navigate(from, { replace: true });
        }
      } else {
        console.log('Attempting signup for email:', email);
        const { error } = await signUp(email, password, fullName);
        if (error) {
          console.error('Signup error details:', error);
          if (error.message.includes('already registered') || error.message.includes('User already exists')) {
            toast.error('هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول بدلاً من ذلك.');
            setIsLogin(true); // Suggest logging in
          } else {
            toast.error(error.message);
          }
        } else {
          console.log('Signup successful, profile should be created.');
          toast.success('تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن');
          setIsLogin(true);
        }
      }
    } catch (error) {
      toast.error('حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 flex flex-col">
      {/* Header */}
      <div className="p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl gradient-primary flex items-center justify-center shadow-lg">
            <Heart className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">طمني</h1>
          <p className="text-muted-foreground mt-2">
            {isLogin ? 'مرحباً بعودتك' : 'انضم إلينا اليوم'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                الاسم الكامل
              </Label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="أدخل اسمك"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pr-10 input-field"
                />
              </div>
              {errors.name && (
                <p className="text-destructive text-sm">{errors.name}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              البريد الإلكتروني
            </Label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pr-10 input-field"
                dir="ltr"
              />
            </div>
            {errors.email && (
              <p className="text-destructive text-sm">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              كلمة المرور
            </Label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 input-field"
              />
            </div>
            {errors.password && (
              <p className="text-destructive text-sm">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full btn-primary h-12 text-base"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span>جاري التحميل...</span>
              </div>
            ) : isLogin ? (
              'تسجيل الدخول'
            ) : (
              'إنشاء حساب'
            )}
          </Button>

          {/* Biometric Login */}
          <div className="pt-2">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-2xl border-dashed flex items-center justify-center gap-3 text-muted-foreground hover:text-primary transition-all group"
              onClick={() => toast.info('بصمة الإصبع ستتوفر قريباً في إصدار التطبيق!')}
            >
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-current">
                  <path d="M12 2C9.52285 2 7.22285 3.00736 5.53553 4.69467C3.84822 6.38198 2.84087 8.68198 2.84087 11.1591" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12V15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15V12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 9V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M15 12V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M9 12V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M21.1591 11.1591C21.1591 8.68198 20.1517 6.38198 18.4644 4.69467C16.9602 3.19045 14.9458 2.22687 12.7212 2.03154" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M5.5 18C6.9 20.4 9.3 22 12 22C14.7 22 17.1 20.4 18.5 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-sm font-medium">تسجيل الدخول بالبصمة</span>
            </Button>
          </div>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
              }}
              className="mr-2 text-primary font-semibold hover:underline"
            >
              {isLogin ? 'إنشاء حساب' : 'تسجيل الدخول'}
            </button>
          </p>
        </div>

        {/* Info */}
        <p className="mt-8 text-xs text-muted-foreground text-center max-w-xs">
          نحن نهتم بخصوصيتك وببيانات طفلك. جميع البيانات مشفرة وآمنة تماماً.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
