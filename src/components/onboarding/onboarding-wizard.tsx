"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { saveOnboardingResponse, type ParqAnswers } from "@/lib/db/user-data";

const PARQ_QUESTIONS: { key: keyof ParqAnswers; text: string }[] = [
  { key: "heartCondition", text: "Has a doctor ever said you have a heart condition and that you should only do physical activity recommended by a doctor?" },
  { key: "chestPainActivity", text: "Do you feel pain in your chest when you do physical activity?" },
  { key: "chestPainRest", text: "In the past month, have you had chest pain when you were not doing physical activity?" },
  { key: "dizziness", text: "Do you lose your balance because of dizziness, or do you ever lose consciousness?" },
  { key: "boneJoint", text: "Do you have a bone or joint problem that could be made worse by a change in your physical activity?" },
  { key: "bloodPressureMeds", text: "Is a doctor currently prescribing you medication for blood pressure or a heart condition?" },
  { key: "otherReason", text: "Do you know of any other reason why you should not do physical activity?" },
];

const STEPS = ["Welcome", "Goal", "Lifestyle", "Health Screening", "Consent"] as const;

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("fat_loss");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [sleepHours, setSleepHours] = useState("7");
  const [stressLevel, setStressLevel] = useState("medium");
  const [dietPreference, setDietPreference] = useState("veg");
  const [parq, setParq] = useState<ParqAnswers>({
    heartCondition: false,
    chestPainActivity: false,
    chestPainRest: false,
    dizziness: false,
    boneJoint: false,
    bloodPressureMeds: false,
    otherReason: false,
  });
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const parqFlagged = Object.values(parq).some(Boolean);

  async function handleFinish() {
    setSubmitting(true);
    await saveOnboardingResponse({
      goal,
      activityLevel,
      sleepHours: Number(sleepHours),
      stressLevel,
      dietPreference,
      consentAccepted,
      parqAnswers: parq,
      parqFlagged,
    });
    setSubmitting(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card className="max-w-xl mx-auto">
      {/* Progress indicator */}
      <div className="flex gap-1.5 mb-8">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full ${i <= step ? "bg-crimson" : "bg-surface-2"}`}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="text-center py-6">
          <h2 className="font-display text-3xl mb-3">Welcome to FitWid 👋</h2>
          <p className="text-sm text-muted mb-8">
            Before we get you into the dashboard, we need about 3 minutes to
            set your goals, understand your lifestyle, and run a quick
            safety screening — standard practice before starting any
            training program.
          </p>
          <Button size="lg" className="w-full" onClick={() => setStep(1)}>
            Let&apos;s Get Started
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <h2 className="font-display text-2xl mb-1">What&apos;s your primary goal?</h2>
          <ToggleGroup
            label="Goal"
            value={goal}
            onChange={setGoal}
            options={[
              { value: "fat_loss", label: "Fat Loss" },
              { value: "muscle_gain", label: "Muscle Gain" },
              { value: "maintain", label: "Maintain" },
            ]}
          />
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
            <Button onClick={() => setStep(2)}>Continue</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h2 className="font-display text-2xl mb-1">Tell us about your lifestyle</h2>
          <Select label="Activity Level" value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
            <option value="sedentary">Sedentary (little to no exercise)</option>
            <option value="light">Light (1–3 days/week)</option>
            <option value="moderate">Moderate (3–5 days/week)</option>
            <option value="active">Active (6–7 days/week)</option>
            <option value="very_active">Very Active (physical job + training)</option>
          </Select>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Average Sleep (hours/night)"
              type="number"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
            />
            <ToggleGroup
              label="Stress Level"
              value={stressLevel}
              onChange={setStressLevel}
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
              ]}
            />
          </div>
          <ToggleGroup
            label="Food Preference"
            value={dietPreference}
            onChange={setDietPreference}
            options={[
              { value: "veg", label: "Vegetarian" },
              { value: "egg", label: "Eggetarian" },
              { value: "nonveg", label: "Non-Veg" },
              { value: "vegan", label: "Vegan" },
            ]}
          />
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)}>Continue</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-2xl mb-1">Health Screening (PAR-Q)</h2>
            <p className="text-xs text-muted">
              A standard pre-exercise readiness questionnaire. Answer
              honestly — a &ldquo;yes&rdquo; doesn&apos;t stop you from
              training, it just means we&apos;ll flag that you should check
              with a doctor first.
            </p>
          </div>
          <div className="space-y-4">
            {PARQ_QUESTIONS.map((q) => (
              <div key={q.key} className="flex items-start justify-between gap-4 rounded-md border border-border p-3">
                <p className="text-sm text-foreground/90 flex-1">{q.text}</p>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setParq((p) => ({ ...p, [q.key]: false }))}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium border transition ${
                      !parq[q.key] ? "border-success bg-success/15 text-success" : "border-border text-muted"
                    }`}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => setParq((p) => ({ ...p, [q.key]: true }))}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium border transition ${
                      parq[q.key] ? "border-warning bg-warning/15 text-warning" : "border-border text-muted"
                    }`}
                  >
                    Yes
                  </button>
                </div>
              </div>
            ))}
          </div>
          {parqFlagged && (
            <div className="rounded-md border border-warning/40 bg-warning/5 p-3 flex gap-2.5">
              <AlertTriangle size={16} className="text-warning shrink-0 mt-0.5" />
              <p className="text-xs text-muted">
                Based on your answers, please get clearance from a doctor
                before starting a new exercise program. You can still
                continue — we&apos;ll just flag this for your coach too.
              </p>
            </div>
          )}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button onClick={() => setStep(4)}>Continue</Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <h2 className="font-display text-2xl mb-1">Consent</h2>
          <div className="rounded-md border border-border p-4 max-h-48 overflow-y-auto text-xs text-muted space-y-2">
            <p>
              By continuing, you acknowledge that FitWid provides general
              fitness coaching and tools, not medical advice or diagnosis.
              Exercise carries inherent risk of injury, and you confirm
              you&apos;re physically able to participate in the activities
              recommended, or have consulted a doctor as advised above.
            </p>
            <p>
              You agree to our{" "}
              <a href="/terms" target="_blank" className="text-crimson underline">
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a href="/privacy" target="_blank" className="text-crimson underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consentAccepted}
              onChange={(e) => setConsentAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 accent-crimson"
            />
            <span className="text-sm text-foreground/90">
              I have read and agree to the above.
            </span>
          </label>
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
            <Button
              onClick={handleFinish}
              disabled={!consentAccepted || submitting}
            >
              <CheckCircle2 size={16} /> {submitting ? "Saving…" : "Finish & Go to Dashboard"}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
