
// GrowthPage.tsx - Growth tracking with vaccinations and milestones
import React from 'react';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle, Baby } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const VACCINATION_SCHEDULE = [
  {
    age: 'عند الولادة',
    vaccines: [
      { name: 'التهاب الكبد B' },
      { name: 'BCG (السل)' },
      { name: 'شلل الأطفال' },
    ]
  },
  {
    age: 'شهرين',
    vaccines: [
      { name: 'خماسي (DTP + Hib + التهاب الكبد B)' },
      { name: 'شلل الأطفال' },
      { name: 'المكورات الرئوية PCV13' },
      { name: 'الروتا' },
    ]
  },
  {
    age: '4 أشهر',
    vaccines: [
      { name: 'خماسي (DTP + Hib + التهاب الكبد B)' },
      { name: 'شلل الأطفال' },
      { name: 'المكورات الرئوية PCV13' },
      { name: 'الروتا' },
    ]
  },
  {
    age: '6 أشهر',
    vaccines: [
      { name: 'خماسي (DTP + Hib + التهاب الكبد B)' },
      { name: 'شلل الأطفال' },
      { name: 'المكورات الرئوية PCV13' },
      { name: 'الروتا' },
    ]
  },
  {
    age: '9 أشهر',
    vaccines: [
      { name: 'الحصبة، النكاف، الحصبة الألمانية (MMR)' },
    ]
  },
  {
    age: '12 شهر',
    vaccines: [
      { name: 'الحصبة، النكاف، الحصبة الألمانية (MMR)' },
      { name: 'جدري الماء' },
    ]
  },
  {
    age: '18 شهر',
    vaccines: [
      { name: 'خماسي (DTP + Hib + التهاب الكبد B)' },
      { name: 'شلل الأطفال' },
    ]
  }
];

const MILESTONES = [
  {
    age: '0-3 أشهر',
    physical: [
      { description: 'يرفع رأسه ورقبته عند وضعه على بطنه', achieved: true },
      { description: 'يتابع الأشياء المتحركة بعينيه', achieved: true },
      { description: 'يفتح ويغلق يديه', achieved: true },
    ],
    social: [
      { description: 'يبتسم استجابة للابتسامة', achieved: true },
      { description: 'يهدأ عند سماع صوت مألوف', achieved: true },
      { description: 'يبدأ بإصدار أصوات غير البكاء', achieved: true },
    ]
  },
  {
    age: '4-6 أشهر',
    physical: [
      { description: 'يتدحرج من الظهر إلى البطن والعكس', achieved: false },
      { description: 'يجلس بمساعدة', achieved: false },
      { description: 'يبدأ في الإمساك بالأشياء', achieved: false },
    ],
    social: [
      { description: 'يضحك بصوت عالٍ', achieved: false },
      { description: 'يظهر اهتماماً بالألعاب', achieved: false },
      { description: 'يتعرف على الوجوه المألوفة', achieved: false },
    ]
  },
  {
    age: '7-9 أشهر',
    physical: [
      { description: 'يجلس دون دعم', achieved: false },
      { description: 'يبدأ في الحبو', achieved: false },
      { description: 'يقف بمساعدة', achieved: false },
    ],
    social: [
      { description: 'يستجيب لاسمه', achieved: false },
      { description: 'يقلد أصواتاً وحركات بسيطة', achieved: false },
      { description: 'يظهر قلقاً من الغرباء', achieved: false },
    ]
  },
  {
    age: '10-12 شهر',
    physical: [
      { description: 'يقف لوحده لفترة قصيرة', achieved: false },
      { description: 'يمشي بمساعدة أو بالتشبث بالأثاث', achieved: false },
      { description: 'يلتقط أشياء صغيرة بإبهامه وسبابته', achieved: false },
    ],
    social: [
      { description: 'يقول كلمة أو كلمتين مثل "ماما" أو "بابا"', achieved: false },
      { description: 'يشير للأشياء التي يريدها', achieved: false },
      { description: 'يلعب ألعاباً بسيطة مثل "بيبو"', achieved: false },
    ]
  }
];

// ... (imports remain the same)

const GrowthPage = () => {
  const { user } = useAuth();
  const [children, setChildren] = React.useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = React.useState<string>('');
  const [completedVaccines, setCompletedVaccines] = React.useState<string[]>([]);
  const [vaccineHistory, setVaccineHistory] = React.useState<any[]>([]);
  const [achievedMilestones, setAchievedMilestones] = React.useState<string[]>([]);
  const [milestoneHistory, setMilestoneHistory] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchChildren();
  }, [user]);

  React.useEffect(() => {
    if (selectedChildId) {
      fetchVaccinationStatus();
      fetchMilestoneStatus();
    }
  }, [selectedChildId]);

  const fetchChildren = async () => {
    try {
      if (!user) return;
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('parent_id', user.id);

      if (error) throw error;
      setChildren(data || []);
      if (data && data.length > 0 && !selectedChildId) {
        setSelectedChildId(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMilestoneStatus = async () => {
    const { data } = await supabase
      .from('child_milestones' as any)
      .select('*')
      .eq('child_id', selectedChildId)
      .order('achieved_at', { ascending: false });

    if (data) {
      setAchievedMilestones(data.map((m: any) => m.milestone_id));
      setMilestoneHistory(data);
    } else {
      setAchievedMilestones([]);
      setMilestoneHistory([]);
    }
  };

  const toggleMilestone = async (milestone: any, category: string, ageRange: string, index: number) => {
    if (!selectedChildId) return;

    // Create a unique ID for the milestone
    const milestoneId = `${ageRange.replace(/\s/g, '-')}_${category}_${index}`;
    const isAchieved = achievedMilestones.includes(milestoneId);

    // Optimistic update
    const newAchieved = isAchieved
      ? achievedMilestones.filter(id => id !== milestoneId)
      : [...achievedMilestones, milestoneId];

    setAchievedMilestones(newAchieved);

    try {
      if (isAchieved) {
        // Remove milestone
        const { error } = await supabase
          .from('child_milestones' as any)
          .delete()
          .eq('child_id', selectedChildId)
          .eq('milestone_id', milestoneId);

        if (error) throw error;
      } else {
        // Add milestone
        const { error } = await supabase
          .from('child_milestones' as any)
          .insert({
            child_id: selectedChildId,
            milestone_id: milestoneId,
            category,
            age_range: ageRange,
            description: milestone.description,
            achieved_at: new Date().toISOString()
          });

        if (error) throw error;
      }
      toast.success(isAchieved ? 'تم إلغاء تحديد التطور' : 'تم تسجيل التطور بنجاح');
      fetchMilestoneStatus(); // Refresh history
    } catch (err: any) {
      console.error("Error saving milestone:", err);
      toast.error(`حدث خطأ في حفظ البيانات: ${err.message || 'Error'}`);
      setAchievedMilestones(achievedMilestones); // Rollback
    }
  };

  const fetchVaccinationStatus = async () => {
    if (!selectedChildId) return;
    const { data } = await supabase
      .from('child_vaccinations' as any)
      .select('*')
      .eq('child_id', selectedChildId);

    if (data) {
      setCompletedVaccines(data.map((v: any) => v.vaccine_name));
      setVaccineHistory(data);
    }
  };

  const toggleVaccine = async (vaccineName: string) => {
    if (!selectedChildId) {
      toast.error('يرجى اختيار طفل أولاً');
      return;
    }

    const isCompleted = completedVaccines.includes(vaccineName);

    // Optimistic update
    const newCompleted = isCompleted
      ? completedVaccines.filter(v => v !== vaccineName)
      : [...completedVaccines, vaccineName];

    setCompletedVaccines(newCompleted);

    try {
      if (isCompleted) {
        // Remove vaccination
        const { error } = await supabase
          .from('child_vaccinations' as any)
          .delete()
          .eq('child_id', selectedChildId)
          .eq('vaccine_name', vaccineName);

        if (error) throw error;
      } else {
        // Add vaccination
        const { error } = await supabase
          .from('child_vaccinations' as any)
          .insert({
            child_id: selectedChildId,
            vaccine_name: vaccineName,
            completed: true,
            completed_at: new Date().toISOString()
          });

        if (error) throw error;
      }
      toast.success(isCompleted ? 'تم إلغاء تحديد التطعيم' : 'تم تسجيل التطعيم بنجاح');
      fetchVaccinationStatus(); // Refresh history
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ في حفظ البيانات');
      setCompletedVaccines(completedVaccines); // Rollback
    }
  };

  return (
    <div className="container mx-auto p-4 pb-20 max-w-2xl">
      <Header title="تتبع النمو" showBack={true} />

      <div className="mb-6">
        <Label className="mb-2 block text-sm font-medium">اختاري الطفل</Label>
        <Select value={selectedChildId} onValueChange={setSelectedChildId}>
          <SelectTrigger className="w-full bg-white border-primary/20 h-12 rounded-xl text-right flex-row-reverse">
            <SelectValue placeholder="اختاري الطفل" />
          </SelectTrigger>
          <SelectContent align="end">
            {children.map((child) => (
              <SelectItem key={child.id} value={child.id}>
                {child.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="milestones" dir="rtl" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="milestones">التطور</TabsTrigger>
          <TabsTrigger value="vaccinations">التطعيمات</TabsTrigger>
          <TabsTrigger value="history">السجل</TabsTrigger>
        </TabsList>

        <TabsContent value="milestones" className="mt-4 space-y-4">
          {!selectedChildId ? (
            <Card className="p-8 text-center rounded-3xl border-dashed border-2 border-gray-100">
              <p className="text-muted-foreground text-sm">يرجى إضافة طفل أولاً لتتبع النمو</p>
            </Card>
          ) : (
            MILESTONES.map((milestone, index) => (
              <Card key={index} className="p-4">
                <h3 className="font-bold text-lg mb-3 bg-tameny-light p-2 rounded-lg text-tameny-primary">
                  {milestone.age}
                </h3>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">التطور الجسدي</h4>
                  <ul className="space-y-2">
                    {milestone.physical.map((item, idx) => {
                      const mId = `${milestone.age.replace(/\s/g, '-')}_physical_${idx}`;
                      const isAchieved = achievedMilestones.includes(mId);
                      return (
                        <li
                          key={idx}
                          className="flex items-start gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                          onClick={() => toggleMilestone(item, 'physical', milestone.age, idx)}
                        >
                          {isAchieved ? (
                            <CheckCircle2 className="text-green-500 mt-0.5 shrink-0" size={18} />
                          ) : (
                            <Circle className="text-gray-300 mt-0.5 shrink-0" size={18} />
                          )}
                          <span className={`${isAchieved ? 'text-gray-800' : 'text-gray-500'} text-sm`}>
                            {item.description}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">التطور الاجتماعي واللغوي</h4>
                  <ul className="space-y-2">
                    {milestone.social.map((item, idx) => {
                      const mId = `${milestone.age.replace(/\s/g, '-')}_social_${idx}`;
                      const isAchieved = achievedMilestones.includes(mId);
                      return (
                        <li
                          key={idx}
                          className="flex items-start gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                          onClick={() => toggleMilestone(item, 'social', milestone.age, idx)}
                        >
                          {isAchieved ? (
                            <CheckCircle2 className="text-green-500 mt-0.5 shrink-0" size={18} />
                          ) : (
                            <Circle className="text-gray-300 mt-0.5 shrink-0" size={18} />
                          )}
                          <span className={`${isAchieved ? 'text-gray-800' : 'text-gray-500'} text-sm`}>
                            {item.description}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="vaccinations" className="space-y-4">
          {!selectedChildId ? (
            <Card className="p-8 text-center rounded-3xl border-dashed border-2 border-gray-100">
              <p className="text-muted-foreground text-sm">يرجى إضافة طفل أولاً لتتبع التطعيمات</p>
            </Card>
          ) : (
            VACCINATION_SCHEDULE.map((schedule, index) => (
              <Card key={index} className="p-5 rounded-3xl border-none shadow-soft overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1 pt-full bg-primary/10 h-full" />
                <h3 className="font-bold text-base mb-4 text-primary flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  {schedule.age}
                </h3>

                <ul className="space-y-3">
                  {schedule.vaccines.map((vaccine, idx) => {
                    const isCompleted = completedVaccines.includes(vaccine.name);
                    return (
                      <li
                        key={idx}
                        onClick={() => toggleVaccine(vaccine.name)}
                        className={`flex items-center gap-3 p-3 rounded-2xl transition-all cursor-pointer ${isCompleted ? 'bg-green-50/50 text-green-700' : 'bg-gray-50/50 hover:bg-gray-100/50'
                          }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="text-green-500" size={20} />
                        ) : (
                          <Circle className="text-gray-300" size={20} />
                        )}
                        <span className="text-sm font-medium">
                          {vaccine.name}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            ))
          )
          }
        </TabsContent >

        <TabsContent value="history" className="space-y-4">
          {!selectedChildId ? (
            <Card className="p-8 text-center rounded-3xl border-dashed border-2 border-gray-100">
              <p className="text-muted-foreground text-sm">يرجى إضافة طفل أولاً</p>
            </Card>
          ) : vaccineHistory.length > 0 ? (
            <div className="space-y-3">
              <h3 className="font-bold text-sm mr-1 mb-2">سجل التطعيمات المكتملة</h3>
              {vaccineHistory.map((item, index) => (
                <Card key={index} className="p-4 rounded-2xl border-none shadow-soft flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{item.vaccine_name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        تم التسجيل في {new Date(item.completed_at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center rounded-3xl border-dashed border-2 border-gray-100">
              <p className="text-muted-foreground text-sm">لا يوجد تاريخ تطعيمات مسجل حتى الآن</p>
            </Card>
          )}

          {selectedChildId && milestoneHistory.length > 0 && (
            <div className="space-y-3 pt-6 border-t border-gray-100">
              <h3 className="font-bold text-sm mr-1 mb-2">سجل التطور</h3>
              {milestoneHistory.map((item, index) => (
                <Card key={`milestone-${index}`} className="p-4 rounded-2xl border-none shadow-soft flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                      <Baby size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{item.description}</p>
                      <div className="flex gap-2 text-[10px] text-muted-foreground">
                        <span>{item.age_range}</span>
                        <span>•</span>
                        <span>{item.category === 'physical' ? 'تطور جسدي' : 'تطور اجتماعي'}</span>
                        <span>•</span>
                        <span>
                          {new Date(item.achieved_at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

        </TabsContent>
      </Tabs >
    </div >
  );
};

export default GrowthPage;
