// Deployment Timestamp: 2026-01-07T13:50:00Z
import React, { useState, useEffect } from "react";
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, CheckCircle2, Clock, Calendar, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { arEG } from 'date-fns/locale';

const RemindersPage = () => {
    const [reminders, setReminders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReminders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('reminders' as any)
            .select('*')
            .order('due_date', { ascending: true }); // Soonest first

        if (error) {
            console.error('Error fetching reminders:', error);
            toast.error('حدث خطأ في جلب التنبيهات');
        } else {
            setReminders(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchReminders();
    }, []);

    const handleMarkComplete = async (id: string) => {
        const { error } = await supabase
            .from('reminders' as any)
            .update({ is_completed: true, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            toast.error('حدث خطأ في تحديث الحالة');
        } else {
            toast.success('تم إكمال التنبيه بنجاح');
            fetchReminders(); // Refresh list
        }
    };

    const activeReminders = reminders.filter(r => !r.is_completed);
    const completedReminders = reminders.filter(r => r.is_completed); // Sort by most recent? DB returns sorted by due_date asc

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 pb-24">
            <Header title="التنبيهات" showBack onBack={() => window.history.back()} />

            <div className="px-4 mt-6">
                <Tabs defaultValue="active" dir="rtl" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="active">الحالية ({activeReminders.length})</TabsTrigger>
                        <TabsTrigger value="history">السجل</TabsTrigger>
                    </TabsList>

                    <TabsContent value="active" className="space-y-4">
                        {loading ? (
                            <p className="text-center text-muted-foreground mt-8">جاري التحميل...</p>
                        ) : activeReminders.length === 0 ? (
                            <Card className="p-8 text-center rounded-3xl border-dashed border-2 border-gray-100 flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                                    <CheckCircle2 size={32} />
                                </div>
                                <p className="text-muted-foreground font-medium">لا توجد تنبيهات حالية. أنت رائعة!</p>
                            </Card>
                        ) : (
                            activeReminders.map((reminder) => {
                                const isOverdue = new Date(reminder.due_date) < new Date();
                                return (
                                    <Card key={reminder.id} className={`p-5 rounded-2xl border-none shadow-soft relative overflow-hidden ${isOverdue ? 'border-r-4 border-r-red-400' : ''}`}>
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isOverdue ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-primary'}`}>
                                                {isOverdue ? <AlertCircle size={24} /> : <Bell size={24} />}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-gray-800 mb-1">{reminder.title}</h3>
                                                {reminder.description && <p className="text-sm text-gray-500 mb-3">{reminder.description}</p>}

                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                                                    <Calendar size={14} />
                                                    <span>
                                                        {format(new Date(reminder.due_date), 'PPP', { locale: arEG })}
                                                    </span>
                                                    <span className="mx-1">•</span>
                                                    <Clock size={14} />
                                                    <span>
                                                        {format(new Date(reminder.due_date), 'p', { locale: arEG })}
                                                    </span>
                                                    {isOverdue && <span className="text-red-500 font-bold mr-2">(متأخر)</span>}
                                                </div>

                                                <Button
                                                    onClick={() => handleMarkComplete(reminder.id)}
                                                    className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-100 shadow-sm rounded-xl h-10 text-sm"
                                                >
                                                    <CheckCircle2 size={16} className="ml-2 text-green-500" />
                                                    تم الإنجاز
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })
                        )}
                    </TabsContent>

                    <TabsContent value="history" className="space-y-4">
                        {loading ? (
                            <p className="text-center text-muted-foreground mt-8">جاري التحميل...</p>
                        ) : completedReminders.length === 0 ? (
                            <p className="text-center text-muted-foreground mt-8">لا يوجد سجل تنبيهات سابقة</p>
                        ) : (
                            completedReminders.map((reminder) => (
                                <Card key={reminder.id} className="p-4 rounded-xl border border-gray-50 shadow-none bg-gray-50/50 opacity-70">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-700 line-through decoration-gray-400">{reminder.title}</h3>
                                            <p className="text-xs text-muted-foreground">
                                                {format(new Date(reminder.due_date), 'PPP', { locale: arEG })}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default RemindersPage;
