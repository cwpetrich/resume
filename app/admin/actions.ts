"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { endSession, requireSession } from "@/lib/auth";
import {
  saveProfile,
  saveSocials,
  saveExperience,
  saveSkills,
  saveProjects,
  saveEducation,
  getResumeData,
  saveTailoredResume,
  deleteTailoredResume,
} from "@/lib/resume";
import { generateTailoredResume } from "@/lib/tailor";
import type {
  Profile,
  SocialLink,
  Job,
  SkillGroup,
  Project,
  SchoolEntry,
} from "@/lib/data";

export interface SaveResult {
  ok: boolean;
  error?: string;
}

/** Re-render the public page and the admin page after any write. */
function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin");
}

async function guard() {
  await requireSession();
}

export async function saveProfileAction(profile: Profile): Promise<SaveResult> {
  try {
    await guard();
    saveProfile(profile);
    revalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function saveSocialsAction(
  socials: SocialLink[],
): Promise<SaveResult> {
  try {
    await guard();
    saveSocials(socials);
    revalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function saveExperienceAction(jobs: Job[]): Promise<SaveResult> {
  try {
    await guard();
    saveExperience(jobs);
    revalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function saveSkillsAction(
  groups: SkillGroup[],
): Promise<SaveResult> {
  try {
    await guard();
    saveSkills(groups);
    revalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function saveProjectsAction(
  projects: Project[],
): Promise<SaveResult> {
  try {
    await guard();
    saveProjects(projects);
    revalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function saveEducationAction(
  entries: SchoolEntry[],
): Promise<SaveResult> {
  try {
    await guard();
    saveEducation(entries);
    revalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function logoutAction() {
  endSession();
  redirect("/login");
}

/* -------------------------------------------------------------------------- */
/*  Job-application tailoring                                                 */
/* -------------------------------------------------------------------------- */

export interface GenerateTailoredResult {
  ok: boolean;
  id?: string;
  error?: string;
}

export async function generateTailoredResumeAction(
  jobDescription: string,
  label: string,
): Promise<GenerateTailoredResult> {
  try {
    await guard();
    if (!jobDescription.trim()) {
      return { ok: false, error: "Paste the job description first." };
    }
    const data = getResumeData();
    const result = await generateTailoredResume(data, jobDescription);
    const id = randomUUID();
    saveTailoredResume({
      id,
      createdAt: new Date().toISOString(),
      label: label.trim() || "Untitled",
      jobDescription,
      ...result,
    });
    revalidate();
    return { ok: true, id };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteTailoredResumeAction(id: string): Promise<SaveResult> {
  try {
    await guard();
    deleteTailoredResume(id);
    revalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
