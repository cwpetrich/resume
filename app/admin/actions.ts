"use server";

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
} from "@/lib/resume";
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
