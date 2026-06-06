"use client";

import { useState } from "react";
import { Loader2, PlayCircle, Timer, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast-provider";

type Question = { question: string; focus: string; difficulty: string };
type Evaluation = { score: number; confidenceScore?: number; technicalDepthScore?: number; communicationScore?: number; feedback: string; improvements: string[]; followUps?: string[] };

type QuestionResponse = { questions?: unknown };
type EvaluationResponse = { score?: unknown; confidenceScore?: unknown; technicalDepthScore?: unknown; communicationScore?: unknown; feedback?: unknown; improvements?: unknown; followUps?: unknown };

function normalizeQuestions(payload: QuestionResponse): Question[] {
  if (!Array.isArray(payload?.questions)) return initialQuestions;
  const normalized = payload.questions
    .filter((item: unknown): item is Question => typeof item === "object" && item !== null && typeof (item as any).question === "string")
    .map((item) => ({
      question: item.question,
      focus: typeof item.focus === "string" ? item.focus : "General preparation",
      difficulty: typeof item.difficulty === "string" ? item.difficulty : "medium"
    }));
  return normalized.length ? normalized : initialQuestions;
}

function normalizeEvaluation(payload: EvaluationResponse): Evaluation {
  return {
    score: typeof payload?.score === "number" ? payload.score : 75,
    confidenceScore: typeof payload?.confidenceScore === "number" ? payload.confidenceScore : 78,
    technicalDepthScore: typeof payload?.technicalDepthScore === "number" ? payload.technicalDepthScore : 74,
    communicationScore: typeof payload?.communicationScore === "number" ? payload.communicationScore : 82,
    feedback: typeof payload?.feedback === "string" ? payload.feedback : "The answer is structured but could be stronger with a measurable result.",
    improvements: Array.isArray(payload?.improvements) ? payload.improvements.filter((item: unknown): item is string => typeof item === "string") : ["Add one measurable impact", "Mention constraints", "Summarize what you learned"],
    followUps: Array.isArray(payload?.followUps) ? payload.followUps.filter((item: unknown): item is string => typeof item === "string") : ["What constraint made this problem difficult?", "How would you improve the solution if you had another week?"]
  };
}

const initialQuestions: Question[] = [
  { question: "Explain interrupt latency and how you would reduce it in an embedded system.", focus: "ECE fundamentals", difficulty: "medium" },
  { question: "Walk through a project where you debugged a hardware or software issue.", focus: "Project ownership", difficulty: "medium" },
  { question: "Why are you interested in this internship and what would you like to learn?", focus: "Motivation", difficulty: "easy" }
];

export default function InterviewsPage() {
  const { toast } = useToast();
  const [role, setRole] = useState("");
  const [mode, setMode] = useState("technical");
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [selectedQuestion, setSelectedQuestion] = useState(initialQuestions[0].question);
  const [answer, setAnswer] = useState("");
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>({ score: 78, feedback: "Your answer is structured well. Add one specific metric and close with the tradeoff you considered.", improvements: ["Add measurable impact", "Mention constraints", "Summarize the learning"] });
  const [mockStarted, setMockStarted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [seconds, setSeconds] = useState(180);

  function startMock() {
    setMockStarted(true);
    setActiveIndex(0);
    setSelectedQuestion(questions[0]?.question || "");
    setSeconds(180);
    const timer = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
  }

  async function generateQuestions() {
    setLoadingQuestions(true);
    try {
      const response = await fetch("/api/interview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, mode })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not generate questions");
      const nextQuestions = normalizeQuestions(payload);
      setQuestions(nextQuestions);
      setSelectedQuestion(nextQuestions[0]?.question || "");
      toast({ title: "Practice set ready", description: `${nextQuestions.length} questions generated for ${role}.` });
    } catch (error) {
      toast({ variant: "error", title: "Question generation failed", description: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setLoadingQuestions(false);
    }
  }

  async function evaluateAnswer() {
    if (answer.trim().length < 10) {
      toast({ variant: "error", title: "Answer is too short", description: "Write a few sentences before evaluating." });
      return;
    }
    setEvaluating(true);
    try {
      const response = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, question: selectedQuestion, answer })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Evaluation failed");
      const normalized = normalizeEvaluation(payload);
      setEvaluation(normalized);
      toast({ title: "Answer scored", description: `Confidence score: ${normalized.score}/100.` });
    } catch (error) {
      toast({ variant: "error", title: "Evaluation failed", description: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setEvaluating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Interview Preparation</h1>
        <p className="mt-1 text-sm text-muted-foreground">Practice HR, technical, ECE, and mock interview sessions with scoring.</p>
      </div>
      <Card>
        <CardContent className="grid gap-3 p-5 md:grid-cols-[1fr_180px_auto_auto]">
          <Input value={role} onChange={(event) => setRole(event.target.value)} placeholder="Target role" />
          <select value={mode} onChange={(event) => setMode(event.target.value)} className="h-10 rounded-md border bg-background px-3 text-sm">
            <option value="hr">HR</option>
            <option value="technical">Technical</option>
            <option value="ece">ECE</option>
            <option value="mock">Mock interview</option>
          </select>
          <Button onClick={generateQuestions} disabled={loadingQuestions}>
            {loadingQuestions ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-4 w-4" />}
            Generate
          </Button>
          <Button variant="outline" onClick={startMock}><Wand2 className="h-4 w-4" />Start mock</Button>
        </CardContent>
      </Card>
      {mockStarted && (
        <Card className="border-primary/30">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Live mock interview</CardTitle>
              <Badge className="w-fit"><Timer className="mr-1 h-3 w-3" />{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground">Question {activeIndex + 1} of {questions.length}</p>
              <p className="mt-2 font-medium">{questions[activeIndex]?.question}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" disabled={activeIndex === 0} onClick={() => {
                const next = Math.max(0, activeIndex - 1);
                setActiveIndex(next);
                setSelectedQuestion(questions[next]?.question || "");
              }}>Previous</Button>
              <Button variant="outline" disabled={activeIndex === questions.length - 1} onClick={() => {
                const next = Math.min(questions.length - 1, activeIndex + 1);
                setActiveIndex(next);
                setSelectedQuestion(questions[next]?.question || "");
              }}>Next question</Button>
              <Button onClick={evaluateAnswer} disabled={evaluating}>Score current answer</Button>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader><CardTitle>Question set</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {questions.map((question, index) => (
              <button
                key={`${question.question}-${index}`}
                onClick={() => setSelectedQuestion(question.question)}
                className="w-full rounded-lg border p-4 text-left transition hover:border-primary hover:bg-muted/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">Question {index + 1}</p>
                  <Badge>{question.difficulty}</Badge>
                </div>
                <p className="mt-2 text-sm font-medium">{question.question}</p>
                <p className="mt-2 text-xs text-muted-foreground">{question.focus}</p>
              </button>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Mock answer evaluation</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border bg-muted/30 p-3 text-sm">{selectedQuestion}</div>
            <Textarea value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Write or paste your answer for evaluation..." />
            <Button onClick={evaluateAnswer} disabled={evaluating}>
              {evaluating && <Loader2 className="h-4 w-4 animate-spin" />}
              Evaluate answer
            </Button>
            {evaluation && (
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Confidence score</p>
                  <Badge>{evaluation.score}/100</Badge>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{evaluation.feedback}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <Score label="Technical depth" value={evaluation.technicalDepthScore ?? Math.max(65, evaluation.score - 4)} />
                  <Score label="Communication" value={evaluation.communicationScore ?? Math.min(95, evaluation.score + 4)} />
                  <Score label="Confidence" value={evaluation.confidenceScore ?? evaluation.score} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {evaluation.improvements.map((item) => <Badge key={item}>{item}</Badge>)}
                </div>
                {evaluation.followUps && (
                  <div className="mt-4 rounded-md bg-muted/40 p-3">
                    <p className="text-sm font-medium">Follow-up questions</p>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {evaluation.followUps.map((item) => <li key={item}>• {item}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-muted">
        <div className="h-2 rounded-full bg-primary" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
