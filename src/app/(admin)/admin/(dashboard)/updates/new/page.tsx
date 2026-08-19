import { UpdateForm } from "../update-form";
import { createUpdate } from "../actions";

export default function NewUpdatePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">New Update</h1>
      <div className="mt-6">
        <UpdateForm action={createUpdate} />
      </div>
    </div>
  );
}
