import { supabase } from "@/lib/supabaseClient";

export const COURSE_UI_DATA: Record<string, { icon: string, color: string, bgColor: string }> = {
  "autocad-2d-3d-design": {
    icon: "architecture",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  "java-programming": {
    icon: "code",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  "python-data-science-ai": {
    icon: "data_object",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  "matlab-scientific-computing": {
    icon: "functions",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  "android-ios-mobile-development": {
    icon: "smartphone",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  "iot-embedded": {
    icon: "settings_input_antenna",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  "revit-bim": {
    icon: "domain",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
  "solidworks": {
    icon: "precision_manufacturing",
    color: "text-cyan-600",
    bgColor: "bg-cyan-100",
  },
  "catia": {
    icon: "engineering",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
  "3dsmax-vray": {
    icon: "3d_rotation",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  "sketchup": {
    icon: "view_in_ar",
    color: "text-lime-600",
    bgColor: "bg-lime-100",
  },
  "etabs": {
    icon: "apartment",
    color: "text-slate-600",
    bgColor: "bg-slate-100",
  },
  "data-science": {
    icon: "analytics",
    color: "text-teal-600",
    bgColor: "bg-teal-100",
  },
  "artificial-intelligence": {
    icon: "psychology",
    color: "text-violet-600",
    bgColor: "bg-violet-100",
  },
  "cpp-programming": {
    icon: "terminal",
    color: "text-sky-600",
    bgColor: "bg-sky-100",
  },
  "ansys": {
    icon: "science",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  "primavera-p6": {
    icon: "schedule",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  "coreldraw": {
    icon: "palette",
    color: "text-rose-600",
    bgColor: "bg-rose-100",
  },
  "autocad-advance": {
    icon: "architecture",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
  },
  "autocad-electrical": {
    icon: "electrical_services",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
  },
  "autocad-mechanical": {
    icon: "build",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
};

export async function fetchCourses() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("is_legacy_pricing", false)
    .order("created_at", { ascending: true });
  
  if (error) {
    console.error("Error fetching courses from Supabase:", error);
    return [];
  }
  return data || [];
}
