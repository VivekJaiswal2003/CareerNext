"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, CheckCircle2, FileCheck2, MessagesSquare, SearchCheck, Calendar } from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const workflows = [
  { icon: FileCheck2, title: "Resume Review", text: "Highlight your projects, show measurable impact, and fix common formatting issues." },
  { icon: SearchCheck, title: "ATS Analysis", text: "Detect missing keywords and suggest role-specific terms to improve recruiter matches." },
  { icon: MessagesSquare, title: "Interview Practice", text: "Practice common questions, record answers, and get targeted feedback." },
  { icon: BarChart3, title: "Application Tracking", text: "Keep applications, statuses, and next steps in one place without spreadsheets." },
  { icon: Calendar, title: "Career Planning", text: "Small weekly tasks to build projects, study topics, and apply consistently." }
];

export function LandingExperience() {
  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <MarketingNav />
      <main>
        <section className="relative border-b">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="animate-mesh absolute left-1/2 top-[-14rem] h-[32rem] w-[48rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18),rgba(148,163,184,0.10)_42%,transparent_70%)] blur-2xl" />
            <div className="absolute inset-0 dashboard-grid opacity-60" />
          </div>
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-8 lg:py-24">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col justify-center">
              <Badge className="mb-5 w-fit bg-background/80 shadow-sm">CareerNext for students</Badge>
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Improve your resume, prepare for interviews, and manage applications in one place.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                CareerNext helps students identify resume gaps, practice interviews, track applications, and stay organized throughout the job search process.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild className="pressable">
                  <Link href="/signup">Get started <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" className="pressable bg-background/70">
                  <Link href="/dashboard">Open dashboard</Link>
                </Button>
              </div>
              <div className="mt-8 grid max-w-2xl gap-3 text-sm sm:grid-cols-2">
                {[
                  ["Resume Review", "Get clear feedback on formatting, project descriptions, and career focus."],
                  ["ATS Analysis", "Spot missing role-specific keywords and make your resume easier to find."],
                  ["Interview Practice", "Prepare technical and behavioral answers with short, practical review notes."],
                  ["Application Tracking", "Track each application status, next step, and follow-up plan."],
                  ["Career Planning", "Maintain a weekly task list for applications, skills, and interview prep."]
                ].map(([value, label]) => (
                  <div key={String(value)} className="rounded-xl border bg-background/90 p-4 shadow-sm">
                    <p className="text-sm font-semibold">{value}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }} className="relative">
              <div className="animate-float-soft rounded-2xl border bg-background/90 p-3 shadow-soft backdrop-blur">
                <div className="rounded-xl border bg-background p-5">
                    <div className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-medium">Snapshot</p>
                        <p className="text-xs text-muted-foreground">A short summary of the latest resume review and next steps.</p>
                      </div>
                    </div>
                  <div className="grid gap-4 py-5 md:grid-cols-[0.9fr_1.1fr]">
                    <div className="space-y-3">
                      {["Resume review", "Interview practice", "Application tracker"].map((item, index) => (
                        <Link key={item} href={index === 0 ? "/dashboard/resume" : index === 1 ? "/dashboard/interviews" : "/dashboard/applications"} className="pressable block rounded-lg border p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{item}</p>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">Open to view recent feedback and suggested next steps.</div>
                        </Link>
                      ))}
                    </div>
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <p className="text-sm font-semibold">Insights</p>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        Quick, practical notes from your latest resume review. These are suggestions to try—not guarantees.
                      </p>
                      <div className="mt-4 space-y-2">
                        {["Add quantified project impact", "Include protocol names where relevant", "Clarify your role on projects"].map((task) => (
                          <div key={task} className="flex items-center gap-2 rounded-md bg-background px-3 py-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary" /> {task}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <Badge>Features</Badge>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">Simple tools to improve your applications</h2>
              <p className="mt-3 leading-7 text-muted-foreground">Short, practical features to improve resumes, practice interviews, and keep applications organized.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {workflows.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ delay: index * 0.05 }}
                    className="pressable rounded-lg border bg-card p-5 shadow-sm"
                  >
                    <Link href={index === 0 ? "/dashboard/resume" : index === 1 ? "/dashboard/recommendations" : index === 2 ? "/dashboard/interviews" : "/dashboard/applications"} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <Icon className="h-5 w-5 text-primary" />
                      <h3 className="mt-4 font-semibold">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.text}</p>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-t">
          <div className="mx-auto max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">How CareerNext helps you stay on track</h2>
                <p className="mt-3 leading-7 text-muted-foreground">Use focused resume feedback, targeted interview practice, and clear application tracking to move from job search to offer-ready momentum.</p>
              </div>
              <div className="space-y-3">
                {[
                  ["Upload", "Add your resume or job description to get immediate, practical feedback."],
                  ["Review", "See clear notes on keyword gaps, project impact, and recruiter focus."],
                  ["Practice", "Work through short interview questions and improve your answer flow."],
                  ["Track", "Keep each application status, deadline and next step in one workspace."]
                ].map(([title, text], index) => (
                  <div key={title} className="flex gap-4 rounded-xl border bg-background p-4 shadow-sm">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-semibold">{index + 1}</span>
                    <div>
                      <p className="font-medium">{title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight">Who is CareerNext for?</h2>
              <p className="mt-3 text-muted-foreground">A workspace built for the early stage of your career search.</p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Final-year students",
                "Internship seekers",
                "Fresh graduates",
                "Students preparing for technical interviews"
              ].map((item) => (
                <div key={item} className="rounded-2xl border bg-background p-5 shadow-sm">
                  <p className="font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
            <div className="mt-6 divide-y rounded-lg border bg-background">
              {[
                ["Does CareerNext replace career counselors?", "No. Use it to prepare questions and homework between meetings."],
                ["Can I use it without a finished resume?", "Yes. Upload a draft to get clear, practical suggestions to improve specific sections."],
                ["What happens to my data?", "Uploads are stored according to the app settings; only your account can access your documents unless you share them."],
                ["Which analysis provider does it use?", "The product can use Google Gemini for resume feedback and interview guidance, but it also works with local fallback checks."]
              ].map(([q, a]) => (
                <div key={q} className="p-5">
                  <p className="font-medium">{q}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">CareerNext. Helping students move from learning to opportunity.</footer>
    </div>
  );
}
