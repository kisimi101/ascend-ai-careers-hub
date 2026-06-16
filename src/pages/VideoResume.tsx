import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Video, Upload, Sparkles, CheckCircle2, AlertCircle, Mic, StopCircle } from "lucide-react";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { uploadLarge, MAX_UPLOAD_BYTES } from "@/lib/uploadLarge";

type JobStatus = "idle" | "uploading" | "queued" | "downloading" | "transcribing" | "extracting" | "completed" | "failed";

const STATUS_LABEL: Record<JobStatus, string> = {
  idle: "Ready",
  uploading: "Uploading video…",
  queued: "Queued…",
  downloading: "Loading your video…",
  transcribing: "Transcribing speech…",
  extracting: "Extracting your experience…",
  completed: "Done",
  failed: "Failed",
};

const STATUS_PROGRESS: Record<JobStatus, number> = {
  idle: 0, uploading: 15, queued: 25, downloading: 35, transcribing: 55, extracting: 80, completed: 100, failed: 0,
};

const VideoResume = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<JobStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  // recording
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);
  const videoElRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const previewUrl = file ? URL.createObjectURL(file) : null;
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  /* ---------- polling ---------- */
  useEffect(() => {
    if (!jobId) return;
    let active = true;
    const interval = setInterval(async () => {
      const { data, error: e } = await supabase
        .from("video_jobs")
        .select("status, progress, result, error")
        .eq("id", jobId)
        .maybeSingle();
      if (!active) return;
      if (e) return;
      if (!data) return;

      const s = data.status as JobStatus;
      setStatus(s);
      setProgress(Math.max(STATUS_PROGRESS[s] ?? 0, data.progress ?? 0));

      if (s === "completed" && data.result) {
        clearInterval(interval);
        // Save to localStorage so Resume Builder picks it up
        localStorage.setItem("resume-data", JSON.stringify(data.result));
        toast({ title: "Resume drafted!", description: "Opening the builder…" });
        setTimeout(() => navigate("/resume-builder"), 800);
      }
      if (s === "failed") {
        clearInterval(interval);
        setError(data.error || "Processing failed. Please try a clearer recording.");
      }
    }, 2000);
    return () => { active = false; clearInterval(interval); };
  }, [jobId, navigate, toast]);

  /* ---------- file picker ---------- */
  const onPick = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("video/")) {
      toast({ title: "Unsupported file", description: "Please upload a video (mp4, webm, mov).", variant: "destructive" });
      return;
    }
    if (f.size > MAX_UPLOAD_BYTES) {
      toast({ title: "Too large", description: "Max 50MB. Try trimming or compressing the clip.", variant: "destructive" });
      return;
    }
    setFile(f);
    setError(null);
  };

  /* ---------- recording ---------- */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoElRef.current) {
        videoElRef.current.srcObject = stream;
        videoElRef.current.muted = true;
        await videoElRef.current.play();
      }
      recordedChunksRef.current = [];
      const mr = new MediaRecorder(stream, { mimeType: "video/webm" });
      mr.ondataavailable = (e) => e.data.size && recordedChunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        const f = new File([blob], `recording-${Date.now()}.webm`, { type: "video/webm" });
        onPick(f);
        streamRef.current?.getTracks().forEach((t) => t.stop());
        if (videoElRef.current) videoElRef.current.srcObject = null;
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
    } catch (e: any) {
      toast({ title: "Camera blocked", description: e.message || "Allow camera access to record.", variant: "destructive" });
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  /* ---------- main flow ---------- */
  const generate = async () => {
    if (!file) return;
    setError(null);
    setStatus("uploading");
    setProgress(10);
    try {
      const { path } = await uploadLarge(file);
      const { data, error: e } = await supabase.functions.invoke("video-to-resume", {
        body: { storagePath: path },
      });
      if (e) throw e;
      if (data?.error) throw new Error(data.error);
      setJobId(data.jobId);
      setStatus("queued");
      setProgress(25);
    } catch (e: any) {
      setStatus("failed");
      setError(e.message || "Upload failed");
    }
  };

  const busy = ["uploading", "queued", "downloading", "transcribing", "extracting"].includes(status);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-32 md:pt-40 pb-16">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Badge variant="outline" className="mb-4"><Sparkles className="w-3 h-3 mr-1" /> AI-powered</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Video → Resume in 60 seconds</h1>
          <p className="text-lg text-muted-foreground">
            Record (or upload) a short intro about yourself. Our AI watches the video, transcribes what you say,
            and turns it into an editable, ATS-friendly resume — instantly.
          </p>
        </div>

        <div className="max-w-3xl mx-auto grid gap-6">
          {/* How it works */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How it works</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-3 gap-4 text-sm">
              <div><span className="font-semibold">1. Record / upload</span><p className="text-muted-foreground mt-1">A 1–3 minute clip of you introducing your background, skills and achievements.</p></div>
              <div><span className="font-semibold">2. AI extracts</span><p className="text-muted-foreground mt-1">Gemini transcribes speech and pulls structured experience, education and skills.</p></div>
              <div><span className="font-semibold">3. Edit & export</span><p className="text-muted-foreground mt-1">Open the result in the Resume Builder, polish, then download.</p></div>
            </CardContent>
          </Card>

          {/* Recorder / uploader */}
          <Card>
            <CardHeader>
              <CardTitle>Your video</CardTitle>
              <CardDescription>Max 50MB · mp4, webm, mov · 1–3 minutes recommended</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                {file ? (
                  <video src={previewUrl ?? undefined} controls className="w-full h-full object-cover" />
                ) : recording ? (
                  <video ref={videoElRef} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Video className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">Record now or upload a file below</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {!recording ? (
                  <Button onClick={startRecording} variant="outline" disabled={busy}>
                    <Mic className="w-4 h-4 mr-2" /> Record from camera
                  </Button>
                ) : (
                  <Button onClick={stopRecording} variant="destructive">
                    <StopCircle className="w-4 h-4 mr-2" /> Stop recording
                  </Button>
                )}
                <label>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => onPick(e.target.files?.[0] ?? null)}
                    disabled={busy || recording}
                  />
                  <span>
                    <Button asChild variant="outline" disabled={busy || recording}>
                      <span><Upload className="w-4 h-4 mr-2" /> Upload file</span>
                    </Button>
                  </span>
                </label>
                {file && (
                  <Button onClick={() => { setFile(null); setStatus("idle"); setJobId(null); setError(null); }} variant="ghost" disabled={busy}>
                    Clear
                  </Button>
                )}
              </div>

              {file && (
                <p className="text-xs text-muted-foreground text-center">
                  {file.name} · {(file.size / 1024 / 1024).toFixed(1)}MB
                </p>
              )}

              {busy && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-center text-muted-foreground">{STATUS_LABEL[status]}</p>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 rounded-md p-3">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {status === "completed" && (
                <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-500/10 rounded-md p-3">
                  <CheckCircle2 className="w-4 h-4" />
                  Resume drafted. Redirecting to the builder…
                </div>
              )}

              <Button
                onClick={generate}
                disabled={!file || busy || recording}
                className="w-full h-12 text-base"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {busy ? "Working…" : "Generate resume from video"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VideoResume;