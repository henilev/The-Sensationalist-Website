import { PublicationForm } from "../publication-form";
import { createPublication } from "../actions";

export default function NewPublicationPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">New Publication</h1>
      <div className="mt-6">
        <PublicationForm action={createPublication} />
      </div>
    </div>
  );
}
