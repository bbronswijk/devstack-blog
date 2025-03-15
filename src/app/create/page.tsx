import { Form } from "@/app/create/form";
import { ContentSection } from "@/components/section";

export const maxDuration = 60; // This function can run for a maximum of 60 seconds

export default function Page() {
  return (
    <ContentSection>
      <Form />
    </ContentSection>
  );
}
