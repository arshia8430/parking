import { useState } from "react";
import { ArrowRight, Upload, Check, Shield, Phone, User, FileText, Building, Hash, AlertCircle, CheckCircle, ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";

interface OwnerVerificationProps {
  onBack: () => void;
  onComplete: () => void;
}

type Step = 1 | 2 | 3;

export default function OwnerVerification({ onBack, onComplete }: OwnerVerificationProps) {
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);

  const [form1, setForm1] = useState({ name: "", national: "", phone: "", email: "" });
  const [form2, setForm2] = useState({ address: "", parkingNum: "", ownerName: "", type: "iot", capacity: "" });
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [iotMode, setIotMode] = useState(true);

  const STEPS = [
    { num: 1, title: "اطلاعات شخصی", icon: <User size={15} /> },
    { num: 2, title: "مدارک ملک", icon: <FileText size={15} /> },
    { num: 3, title: "تأیید نهایی", icon: <CheckCircle size={15} /> },
  ];

  const mockUpload = (name: string) => {
    setUploadedDocs((prev) => [...prev, name]);
  };

  if (submitted) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center px-4" style={{ background: "#060c1a", fontFamily: "'Vazirmatn', Tahoma, sans-serif" }}>
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: "rgba(245,158,11,0.12)", border: "2px solid rgba(245,158,11,0.3)" }}>
            <AlertCircle size={44} style={{ color: "#f59e0b" }} />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f1f5f9", marginBottom: "8px" }}>درخواست ثبت شد</h2>
          <p style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.8, marginBottom: "24px" }}>
            مدارک شما در حال بررسی است. تیم پارک‌یار ظرف ۴۸ ساعت کاری با شما تماس خواهد گرفت.
          </p>
          <div className="p-4 rounded-2xl mb-6" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
            <div style={{ color: "#f59e0b", fontWeight: 600, marginBottom: "8px", fontSize: "0.85rem" }}>وضعیت: در حال بررسی</div>
            <div style={{ color: "#94a3b8", fontSize: "0.78rem" }}>شناسه پرونده: VRF-{Date.now().toString().slice(-6)}</div>
          </div>
          <div className="space-y-2 mb-6">
            {["احراز هویت مالک", "تطابق سند با مشخصات", "بازدید حضوری (در صورت نیاز)"].map((step, i) => (
              <div key={step} className="flex items-center gap-3 text-right" style={{ fontSize: "0.8rem" }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: i === 0 ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)", color: i === 0 ? "#10b981" : "#475569", fontSize: "0.65rem", shrink: 0 }}>
                  {i === 0 ? "✓" : i + 1}
                </div>
                <span style={{ color: i === 0 ? "#94a3b8" : "#475569" }}>{step}</span>
              </div>
            ))}
          </div>
          <Button className="w-full h-11 rounded-xl font-bold" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }} onClick={onComplete}>
            بازگشت به پورتال
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen py-8 px-4" style={{ background: "#060c1a", fontFamily: "'Vazirmatn', Tahoma, sans-serif" }}>
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <button onClick={onBack} className="flex items-center gap-2 mb-6 text-sm" style={{ color: "#94a3b8" }}>
          <ArrowRight size={16} />
          بازگشت
        </button>

        <div className="mb-8">
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f1f5f9", marginBottom: "6px" }}>ثبت پارکینگ جدید</h1>
          <p style={{ color: "#64748b", fontSize: "0.85rem" }}>برای ثبت پارکینگ، مدارک مالکیت و اطلاعات شما اعتبارسنجی می‌شود</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all" style={{
                  background: step === s.num ? "rgba(59,130,246,0.2)" : step > s.num ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.04)",
                  border: `2px solid ${step === s.num ? "#3b82f6" : step > s.num ? "#10b981" : "rgba(255,255,255,0.1)"}`,
                  color: step === s.num ? "#3b82f6" : step > s.num ? "#10b981" : "#475569",
                }}>
                  {step > s.num ? <Check size={16} /> : s.icon}
                </div>
                <span style={{ fontSize: "0.7rem", color: step === s.num ? "#3b82f6" : step > s.num ? "#10b981" : "#475569", whiteSpace: "nowrap" }}>{s.title}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mb-5" style={{ background: step > s.num ? "#10b981" : "rgba(255,255,255,0.07)" }} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="rounded-2xl p-6" style={{ background: "rgba(13,24,48,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h2 style={{ color: "#e2e8f0", fontWeight: 700, marginBottom: "20px", fontSize: "1rem" }}>اطلاعات شخصی مالک</h2>
            <div className="space-y-4">
              {[
                { key: "name", label: "نام و نام خانوادگی", icon: <User size={14} />, placeholder: "نام مطابق مدارک" },
                { key: "national", label: "کد ملی", icon: <Hash size={14} />, placeholder: "کد ملی" },
                { key: "phone", label: "شماره تماس (ضروری)", icon: <Phone size={14} />, placeholder: "شماره موبایل" },
                { key: "email", label: "ایمیل", icon: <FileText size={14} />, placeholder: "example@email.com" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="flex items-center gap-2 mb-2" style={{ color: "#94a3b8", fontSize: "0.78rem" }}>
                    <span style={{ color: "#64748b" }}>{f.icon}</span>
                    {f.label}
                  </label>
                  <input
                    value={(form1 as any)[f.key]}
                    onChange={(e) => setForm1((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0" }}
                  />
                </div>
              ))}
            </div>
            <Button className="w-full h-12 mt-6 rounded-xl font-bold" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }} onClick={() => setStep(2)}>
              مرحله بعد
              <ChevronLeft size={18} className="mr-2" />
            </Button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="rounded-2xl p-6" style={{ background: "rgba(13,24,48,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h2 style={{ color: "#e2e8f0", fontWeight: 700, marginBottom: "20px", fontSize: "1rem" }}>مشخصات پارکینگ و مدارک</h2>
            <div className="space-y-4">
              {[
                { key: "address", label: "آدرس کامل پارکینگ", placeholder: "آدرس کامل" },
                { key: "parkingNum", label: "شماره پارکینگ (طبق سند)", placeholder: "شماره درج‌شده در سند" },
                { key: "ownerName", label: "نام مالک روی سند", placeholder: "نام مطابق مدارک" },
                { key: "capacity", label: "ظرفیت (تعداد جا)", placeholder: "تعداد جای پارک" },
              ].map((f) => (
                <div key={f.key}>
                  <label style={{ color: "#94a3b8", fontSize: "0.78rem", display: "block", marginBottom: "6px" }}>{f.label}</label>
                  <input value={(form2 as any)[f.key]} onChange={(e) => setForm2((p) => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0" }} />
                </div>
              ))}

              {/* IoT / Manual selection */}
              <div>
                <label style={{ color: "#94a3b8", fontSize: "0.78rem", display: "block", marginBottom: "8px" }}>نوع سیستم مدیریت</label>
                <div className="grid grid-cols-2 gap-3">
                  {[{ id: true, label: "IoT هوشمند", desc: "دوربین + باز شدن خودکار", icon: <Shield size={16} /> }, { id: false, label: "مدیریت دستی", desc: "تأیید توسط نگهبان", icon: <User size={16} /> }].map((opt) => (
                    <div key={String(opt.id)} onClick={() => setIotMode(opt.id)} className="p-4 rounded-xl cursor-pointer transition-all" style={{ background: iotMode === opt.id ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${iotMode === opt.id ? "rgba(59,130,246,0.35)" : "rgba(255,255,255,0.07)"}` }}>
                      <div style={{ color: iotMode === opt.id ? "#3b82f6" : "#64748b", marginBottom: "6px" }}>{opt.icon}</div>
                      <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: "0.85rem" }}>{opt.label}</div>
                      <div style={{ color: "#64748b", fontSize: "0.72rem" }}>{opt.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload docs */}
              <div>
                <label style={{ color: "#94a3b8", fontSize: "0.78rem", display: "block", marginBottom: "8px" }}>بارگذاری مدارک (ضروری)</label>
                <div className="space-y-2">
                  {["سند یا بنچاق ملک", "کارت ملی مالک", "عکس از پارکینگ"].map((doc) => (
                    <div key={doc} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <div className="flex items-center gap-2" style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                        <FileText size={14} style={{ color: "#64748b" }} />
                        {doc}
                      </div>
                      {uploadedDocs.includes(doc) ? (
                        <div className="flex items-center gap-1.5" style={{ color: "#10b981", fontSize: "0.75rem" }}>
                          <Check size={13} />
                          بارگذاری شد
                        </div>
                      ) : (
                        <button onClick={() => mockUpload(doc)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs" style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#3b82f6" }}>
                          <Upload size={12} />
                          آپلود
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12 rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", background: "transparent" }}>
                <ArrowRight size={16} className="ml-2" />
                قبلی
              </Button>
              <Button className="flex-1 h-12 rounded-xl font-bold" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }} onClick={() => setStep(3)}>
                مرحله بعد
                <ChevronLeft size={18} className="mr-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="rounded-2xl p-6" style={{ background: "rgba(13,24,48,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h2 style={{ color: "#e2e8f0", fontWeight: 700, marginBottom: "20px", fontSize: "1rem" }}>بررسی و تأیید نهایی</h2>

            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ color: "#64748b", fontSize: "0.72rem", marginBottom: "8px", textTransform: "uppercase" }}>اطلاعات مالک</div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(form1).map(([k, v]) => (
                    <div key={k} style={{ fontSize: "0.8rem" }}>
                      <span style={{ color: "#64748b" }}>{k === "name" ? "نام" : k === "national" ? "کد ملی" : k === "phone" ? "تلفن" : "ایمیل"}: </span>
                      <span style={{ color: "#e2e8f0" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ color: "#64748b", fontSize: "0.72rem", marginBottom: "8px" }}>مشخصات پارکینگ</div>
                <div className="space-y-1">
                  <div style={{ fontSize: "0.8rem", color: "#e2e8f0" }}>{form2.address}</div>
                  <div className="flex gap-4" style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                    <span>شماره: {form2.parkingNum}</span>
                    <span>ظرفیت: {form2.capacity} جا</span>
                    <span>نوع: {iotMode ? "IoT" : "دستی"}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl" style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)" }}>
                <div style={{ color: "#64748b", fontSize: "0.72rem", marginBottom: "6px" }}>مدارک بارگذاری شده</div>
                <div className="flex flex-wrap gap-2">
                  {uploadedDocs.map((d) => (
                    <div key={d} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: "rgba(16,185,129,0.1)", color: "#34d399", fontSize: "0.75rem" }}>
                      <Check size={11} />{d}
                    </div>
                  ))}
                  {uploadedDocs.length === 0 && <span style={{ color: "#ef4444", fontSize: "0.78rem" }}>مدرکی بارگذاری نشده</span>}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl mb-6" style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)" }}>
              <div style={{ color: "#93c5fd", fontSize: "0.8rem", lineHeight: 1.8 }}>
                با ارسال این درخواست، تأیید می‌کنم که اطلاعات ارائه شده صحیح است و سند به نام اینجانب می‌باشد. در صورت مغایرت، پارک‌یار حق رد درخواست را دارد.
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-12 rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", background: "transparent" }}>
                <ArrowRight size={16} className="ml-2" />
                قبلی
              </Button>
              <Button className="flex-1 h-12 rounded-xl font-bold" style={{ background: "linear-gradient(135deg, #10b981, #059669)" }} onClick={() => setSubmitted(true)}>
                ارسال درخواست
                <ChevronLeft size={18} className="mr-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
