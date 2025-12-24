"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

const CreateEventForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agendaItems, setAgendaItems] = useState<string[]>([""]);
  const [tags, setTags] = useState<string[]>([""]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    // Filter empty agenda items and tags
    const filteredAgenda = agendaItems.filter((item) => item.trim() !== "");
    const filteredTags = tags.filter((tag) => tag.trim() !== "");

    if (filteredAgenda.length === 0) {
      setError("At least one agenda item is required");
      setLoading(false);
      return;
    }

    if (filteredTags.length === 0) {
      setError("At least one tag is required");
      setLoading(false);
      return;
    }

    // Add arrays as JSON strings
    formData.set("agenda", JSON.stringify(filteredAgenda));
    formData.set("tags", JSON.stringify(filteredTags));

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create event");
      }

      // Redirect to the created event
      router.push(`/events/${data.event.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  const addAgendaItem = () => {
    setAgendaItems([...agendaItems, ""]);
  };

  const removeAgendaItem = (index: number) => {
    setAgendaItems(agendaItems.filter((_, i) => i !== index));
  };

  const updateAgendaItem = (index: number, value: string) => {
    const updated = [...agendaItems];
    updated[index] = value;
    setAgendaItems(updated);
  };

  const addTag = () => {
    setTags([...tags, ""]);
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const updateTag = (index: number, value: string) => {
    const updated = [...tags];
    updated[index] = value;
    setTags(updated);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 backdrop-blur-md bg-dark-200/80 border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl">
      {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-5 py-4 rounded-xl font-medium">{error}</div>}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-300 mb-3">
          Event Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          maxLength={100}
          className="w-full px-5 py-3.5 bg-dark-100/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-gray-500 transition-all"
          placeholder="Enter event title"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-300 mb-3">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          maxLength={1000}
          rows={4}
          className="w-full px-5 py-3.5 bg-dark-100/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-gray-500 transition-all resize-none"
          placeholder="Detailed description of the event"
        />
      </div>

      {/* Overview */}
      <div>
        <label htmlFor="overview" className="block text-sm font-semibold text-gray-300 mb-3">
          Overview *
        </label>
        <textarea
          id="overview"
          name="overview"
          required
          maxLength={500}
          rows={3}
          className="w-full px-5 py-3.5 bg-dark-100/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-gray-500 transition-all resize-none"
          placeholder="Brief overview of the event"
        />
      </div>

      {/* Image */}
      <div>
        <label htmlFor="image" className="block text-sm font-semibold text-gray-300 mb-3">
          Event Image *
        </label>
        <input
          type="file"
          id="image"
          name="image"
          required
          accept="image/*"
          className="w-full px-5 py-3.5 bg-dark-100/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground file:mr-4 file:py-2 file:px-6 file:rounded-lg file:border-0 file:bg-primary file:text-dark-100 file:font-semibold file:cursor-pointer hover:file:bg-primary/90 file:transition-all"
        />
      </div>

      {/* Venue and Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="venue" className="block text-sm font-semibold text-gray-300 mb-3">
            Venue *
          </label>
          <input
            type="text"
            id="venue"
            name="venue"
            required
            className="w-full px-5 py-3.5 bg-dark-100/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-gray-500 transition-all"
            placeholder="Venue name"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-semibold text-gray-300 mb-3">
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            required
            className="w-full px-5 py-3.5 bg-dark-100/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-gray-500 transition-all"
            placeholder="City, Country"
          />
        </div>
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="date" className="block text-sm font-semibold text-gray-300 mb-3">
            Date *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            className="w-full px-5 py-3.5 bg-dark-100/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground transition-all"
          />
        </div>

        <div>
          <label htmlFor="time" className="block text-sm font-semibold text-gray-300 mb-3">
            Time *
          </label>
          <input
            type="time"
            id="time"
            name="time"
            required
            className="w-full px-5 py-3.5 bg-dark-100/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground transition-all"
          />
        </div>
      </div>

      {/* Mode */}
      <div>
        <label htmlFor="mode" className="block text-sm font-semibold text-gray-300 mb-3">
          Mode *
        </label>
        <select
          id="mode"
          name="mode"
          required
          className="w-full px-5 py-3.5 bg-dark-100/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground transition-all"
        >
          <option value="" className="bg-dark-200">
            Select mode
          </option>
          <option value="online" className="bg-dark-200">
            Online
          </option>
          <option value="offline" className="bg-dark-200">
            Offline
          </option>
          <option value="hybrid" className="bg-dark-200">
            Hybrid
          </option>
        </select>
      </div>

      {/* Audience */}
      <div>
        <label htmlFor="audience" className="block text-sm font-semibold text-gray-300 mb-3">
          Target Audience *
        </label>
        <input
          type="text"
          id="audience"
          name="audience"
          required
          className="w-full px-5 py-3.5 bg-dark-100/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-gray-500 transition-all"
          placeholder="e.g., Developers, Designers, Students"
        />
      </div>

      {/* Organizer */}
      <div>
        <label htmlFor="organizer" className="block text-sm font-semibold text-gray-300 mb-3">
          Organizer *
        </label>
        <input
          type="text"
          id="organizer"
          name="organizer"
          required
          className="w-full px-5 py-3.5 bg-dark-100/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-gray-500 transition-all"
          placeholder="Organizer name or organization"
        />
      </div>

      {/* Agenda Items */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">Agenda Items *</label>
        <div className="space-y-3">
          {agendaItems.map((item, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                value={item}
                onChange={(e) => updateAgendaItem(index, e.target.value)}
                className="flex-1 px-5 py-3.5 bg-dark-100/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-gray-500 transition-all"
                placeholder={`Agenda item ${index + 1}`}
              />
              {agendaItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAgendaItem(index)}
                  className="px-5 py-3.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-all font-medium"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addAgendaItem}
          className="mt-4 px-6 py-3 bg-primary/10 text-primary border border-primary/30 rounded-xl hover:bg-primary/20 transition-all font-semibold"
        >
          + Add Agenda Item
        </button>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">Tags *</label>
        <div className="space-y-3">
          {tags.map((tag, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                value={tag}
                onChange={(e) => updateTag(index, e.target.value)}
                className="flex-1 px-5 py-3.5 bg-dark-100/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-gray-500 transition-all"
                placeholder={`Tag ${index + 1}`}
              />
              {tags.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="px-5 py-3.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-all font-medium"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addTag}
          className="mt-4 px-6 py-3 bg-primary/10 text-primary border border-primary/30 rounded-xl hover:bg-primary/20 transition-all font-semibold"
        >
          + Add Tag
        </button>
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full px-8 py-4 bg-linear-to-r from-primary to-primary/80 text-dark-100 rounded-xl hover:from-primary/90 hover:to-primary/70 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg shadow-primary/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating Event...
            </span>
          ) : (
            "Create Event"
          )}
        </button>
      </div>
    </form>
  );
};

export default CreateEventForm;
