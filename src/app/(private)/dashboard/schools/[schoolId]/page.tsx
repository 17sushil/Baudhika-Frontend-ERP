import { notFound } from "next/navigation";
import { sampleSchools } from "@/components/super-admin-dashboard/data/sample-data";
import { SchoolDetails } from "@/components/super-admin-dashboard/sections/school-details";

export const instant = false;

export function generateStaticParams() {
  return sampleSchools.map((school) => ({ schoolId: school.id }));
}

export default async function SchoolDetailsPage({ params }: { params: Promise<{ schoolId: string }> }) {
  const { schoolId } = await params;
  const school = sampleSchools.find((item) => item.id === schoolId);
  if (!school) notFound();
  return <SchoolDetails school={school} />;
}
