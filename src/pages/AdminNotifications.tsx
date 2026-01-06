
import React from 'react';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Send, Users, ShieldCheck } from 'lucide-react';

const AdminNotifications = () => {
    const [title, setTitle] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleSendToAll = async () => {
        if (!title || !message) {
            toast.error('يرجى إدخال العنوان والرسالة');
            return;
        }

        setLoading(true);
        try {
            // 1. Fetch all profiles
            const { data: profiles, error: fetchError } = await supabase
                .from('profiles')
                .select('id');

            if (fetchError) throw fetchError;

            if (profiles && profiles.length > 0) {
                // 2. Insert notifications for each user
                const newNotifications = profiles.map(profile => ({
                    user_id: profile.id,
                    title,
                    message,
                    is_read: false,
                }));

                const { error: insertError } = await supabase
                    .from('notifications' as any)
                    .insert(newNotifications as any);

                if (insertError) throw insertError;

                // 3. Call Edge Function to send Push Notification
                const { error: pushError } = await supabase.functions.invoke('push', {
                    body: {
                        title: title,
                        message: message,
                    },
                });

                if (pushError) {
                    console.error('Edge Function Error:', pushError);
                    toast.warning('تم الحفظ، ولكن فشل إرسال الإشعار للهواتف');
                } else {
                    toast.success(`تم إرسال التنبيه إلى ${profiles.length} مستخدم`);
                }
                console.log(`Successfully sent notifications to ${profiles.length} users`);
                setTitle('');
                setMessage('');
            }
        } catch (error: any) {
            console.error('Full Error sending notifications:', error);
            toast.error(`حدث خطأ: ${error.message || 'فشل الإرسال'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 pb-24">
            <Header title="لوحة التحكم" showBack onBack={() => window.history.back()} />

            <div className="px-4 space-y-6">
                <div className="bg-primary/5 rounded-3xl p-6 flex items-center gap-4 border border-primary/10">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">إدارة التنبيهات</h2>
                        <p className="text-xs text-muted-foreground">أرسل تنبيهات مباشرة لجميع المستخدمين</p>
                    </div>
                </div>

                <Card className="p-6 rounded-3xl border-none shadow-soft space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="mr-1">عنوان التنبيه</Label>
                        <Input
                            id="title"
                            placeholder="مثال: تحديث جديد متوفر"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="rounded-2xl border-gray-100 focus:ring-primary h-12"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message" className="mr-1">نص الرسالة</Label>
                        <Textarea
                            id="message"
                            placeholder="اكتب رسالتك هنا..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="rounded-2xl border-gray-100 focus:ring-primary min-h-[120px]"
                        />
                    </div>

                    <Button
                        onClick={handleSendToAll}
                        disabled={loading}
                        className="w-full h-14 rounded-2xl font-bold gap-2 text-base shadow-lg shadow-primary/20"
                    >
                        {loading ? 'جاري الإرسال...' : (
                            <>
                                <Send size={20} />
                                إرسال للجميع
                            </>
                        )}
                    </Button>

                    <div className="pt-4 flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
                        <Users size={12} />
                        <span>سيتم إرسال هذا التنبيه لجميع الحسابات المسجلة حالياً</span>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminNotifications;
