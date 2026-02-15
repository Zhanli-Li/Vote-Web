"use client";

import { SubmissionForm } from "@/components/submission/submission-form";

export default function SubmitPage() {
  return (
    <div className="min-h-dvh pb-20 md:pb-8 pt-4 md:pt-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">投稿</h1>
        <p className="text-muted-foreground mb-6">
          填写你的背景信息，让大家帮你定位
        </p>
        <SubmissionForm />
      </div>
    </div>
  );
}
