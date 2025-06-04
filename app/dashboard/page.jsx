'use client';
import DashboardLayout from "./_layout";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-4xl font-extrabold text-blue-800 tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your job postings performance</p>
      </div>
    </DashboardLayout>
  );
}