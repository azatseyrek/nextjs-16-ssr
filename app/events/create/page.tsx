import CreateEventForm from "@/components/CreateEventForm";

const CreateEventPage = () => {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-3 bg-linear-to-r from-primary to-blue-400 bg-clip-text text-transparent">Create New Event</h1>
          <p className="text-gray-400 text-lg">Fill in the details to create your event</p>
        </div>
        <CreateEventForm />
      </div>
    </main>
  );
};

export default CreateEventPage;
