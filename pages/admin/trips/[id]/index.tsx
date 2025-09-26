/* --------------------------------------------------------------------------
   app/(admin)/programs/[id]/EditProgram.tsx
   -------------------------------------------------------------------------- */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { format, addDays } from "date-fns";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
interface TimelineItem {
  title: string;
  description: string;
  date: string;
  image: string;
}
interface FormData {
  title: string;
  metadata: string;
  description: string;
  locationFrom: string;
  locationTo: string;
  days: string;
  price: string;
  singleAdon: string;
  fromDate: string;
  toDate: string;
  timeline: TimelineItem[];
  display: boolean;
  priceInclude: string;
  generalConditions: string;
  existingImages: string[];
  phone: string;
}

/* ------------------------------------------------------------------ */
/* Dynamic WYSIWYG (React-Quill)                                      */
/* ------------------------------------------------------------------ */
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
export default function EditProgram() {
  const { status } = useSession();               /* auth state           */
  const router = useRouter();
  const { id } = router.query;                   /* program id (slug)    */

  /* ------------------------- Form state ------------------------- */
  const [formData, setFormData] = useState<FormData>({
    title: "",
    metadata: "",
    description: "",
    locationFrom: "",
    locationTo: "",
    days: "",
    price: "",
    singleAdon: "",
    fromDate: "",
    toDate: "",
    timeline: [],
    display: true,
    priceInclude: "",
    generalConditions: "",
    existingImages: [],
    phone: "",
  });

  /* program-level gallery */
  const [keptImages,    setKeptImages]    = useState<string[]>([]);
  const [newImages,     setNewImages]     = useState<File[]>([]);

  /* timeline replacement images keyed by day index */
  const [timelineImages, setTimelineImages] = useState<Record<number, File>>({});
  /* track which timeline days should get new images */
  const [timelineImageReplacements, setTimelineImageReplacements] = useState<Record<number, boolean>>({});

  const [submitting, setSubmitting] = useState(false);

  /* ------------------------------------------------------------------
     1. Fetch program on mount
     ------------------------------------------------------------------ */
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await fetch(`/api/programs.controller?id=${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();

        setFormData({
          title:             data.title            ?? "",
          metadata:          data.metadata         ?? "",
          description:       data.description      ?? "",
          locationFrom:      data.location_from    ?? "",
          locationTo:        data.location_to      ?? "",
          days:              data.days?.toString() ?? "",
          price:             data.price?.toString()?? "",
          singleAdon:        data.singleAdon?.toString() ?? "",
          fromDate:          data.from_date?.split("T")[0] ?? "",
          toDate:            data.to_date?.split("T")[0]   ?? "",
          timeline: (data.timeline || []).map((t: any) => ({
            title: t.title,
            description: t.description,
            date: t.date?.split("T")[0],
            image: t.image ?? "",
          })),
          display:           !!data.display,
          priceInclude:      data.priceInclude ?? "",
          generalConditions: data.generalConditions ?? "",
          existingImages:    data.images ?? [],
          phone:             data.phone  ?? "",
        });

        setKeptImages(data.images ?? []);
      } catch {
        toast.error("Unable to load program data");
      }
    })();
  }, [id]);

  /* ------------------------------------------------------------------
     2. Auth redirect
     ------------------------------------------------------------------ */
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
    }
  }, [status, router]);

  /* ------------------------------------------------------------------
     3. Recalculate toDate whenever fromDate or days change
     ------------------------------------------------------------------ */
  useEffect(() => {
    const d = parseInt(formData.days);
    if (formData.fromDate && d > 0) {
      setFormData(p => ({
        ...p,
        toDate: format(addDays(new Date(formData.fromDate), d - 1), "yyyy-MM-dd"),
      }));
    }
  }, [formData.fromDate, formData.days]);

  /* ------------------------------------------------------------------
     4. Handlers
     ------------------------------------------------------------------ */
  const onSimpleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /* WYSIWYG */
  const setDescription       = (v: string) => setFormData(p => ({ ...p, description: v }));
  const setPriceInclude      = (v: string) => setFormData(p => ({ ...p, priceInclude: v }));
  const setGeneralConditions = (v: string) => setFormData(p => ({ ...p, generalConditions: v }));

  /* timeline title / desc */
  const setTlTitle = (idx: number, v: string) => setFormData(p => {
    const t = [...p.timeline]; t[idx].title = v; return { ...p, timeline: t };
  });
  const setTlDesc  = (idx: number, v: string) => setFormData(p => {
    const t = [...p.timeline]; t[idx].description = v; return { ...p, timeline: t };
  });

  /* image pickers */
  const handleImagePick = (
    e: React.ChangeEvent<HTMLInputElement>,
    isTimeline = false,
    tlIdx?: number,
  ) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    e.target.value = "";
    if (!files.length) return;

    const valid = files.filter(f => {
      if (!f.type.startsWith("image/")) {
        toast.error(`${f.name} is not an image`); return false;
      }
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`${f.name} is >5 MB`); return false;
      }
      return true;
    });
    if (!valid.length) return;

    if (isTimeline && tlIdx !== undefined) {
      const file = valid[0];
      setTimelineImages(prev => ({ ...prev, [tlIdx]: file }));
      setTimelineImageReplacements(prev => ({ ...prev, [tlIdx]: true }));
      setFormData(prev => {
        const t = [...prev.timeline];
        t[tlIdx].image = URL.createObjectURL(file);  /* preview blob */
        return { ...prev, timeline: t };
      });
    } else {
      setNewImages(prev => [...prev, ...valid]);
    }
  };

  /* remove pictures locally */
  const removeExisting = (url: string) => {
    setKeptImages(prev => prev.filter(u => u !== url));
    setFormData(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter(u => u !== url),
    }));
  };
  const removeNew = (idx: number, isTimeline = false, tlIdx?: number) => {
    if (isTimeline && tlIdx !== undefined) {
      setTimelineImages(p => { const c = { ...p }; delete c[tlIdx]; return c; });
      setTimelineImageReplacements(prev => ({ ...prev, [tlIdx]: false }));
      setFormData(p => { const t = [...p.timeline]; t[tlIdx].image = ""; return { ...p, timeline: t }; });
    } else {
      setNewImages(p => p.filter((_, i) => i !== idx));
    }
  };

  /* ------------------------------------------------------------------
     5. Validation & submit
     ------------------------------------------------------------------ */
  const validate = () => {
    if (!formData.title || !formData.description)
      return toast.error("Title and description required"), false;
    if (!formData.locationFrom || !formData.locationTo)
      return toast.error("Locations required"), false;
    if (parseInt(formData.days) <= 0)
      return toast.error("Days must be > 0"), false;
    if (!formData.fromDate)
      return toast.error("Pick a start date"), false;
    return true;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate() || !id) return;

  setSubmitting(true);
  try {
    const fd = new FormData();

    /* Append scalar program data */
    fd.append("programData", JSON.stringify({
      ...formData,
      location_from: formData.locationFrom,
      location_to: formData.locationTo,
      days: parseInt(formData.days),
      price: parseFloat(formData.price),
      singleAdon: parseInt(formData.singleAdon) || 0,
      from_date: formData.fromDate,
      to_date: formData.toDate,
      timeline: formData.timeline.map((item, idx) => ({
        ...item,
        sortOrder: idx + 1,
      })),
    }));

    /* New gallery images */
    newImages.forEach(f => fd.append("program_images", f));

    /* Timeline replacement images in order */
    const sortedIndices = Object.keys(timelineImages)
      .map(Number)
      .sort((a, b) => a - b);
    sortedIndices.forEach(idx => fd.append("timeline_images", timelineImages[idx]));

    /* Gallery state the user wants to keep */
    fd.append("keptImages", JSON.stringify(keptImages));

    /* Timeline image replacement mapping */
    fd.append("timelineImageReplacements", JSON.stringify(timelineImageReplacements));

    /* PUT request */
    const res = await fetch(`/api/programs.controller?id=${id}`, {
      method: "PUT",
      body: fd,
    });

    if (res.ok) {
      toast.success("Program updated");
      router.push("/admin/dashboard");
    } else {
      const err = await res.json();
      toast.error(err.message || "Update failed");
    }
  } catch {
    toast.error("Network / server error");
  } finally {
    setSubmitting(false);
  }
};

  /* ------------------------------------------------------------------
     6. Auth loading spinner
     ------------------------------------------------------------------ */
  if (status === "loading")
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-32 w-32 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin" />
      </div>
    );

  /* ------------------------------------------------------------------
     7. JSX
     ------------------------------------------------------------------ */
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Toaster position="top-right" />

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <header className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Icon icon="mdi:pencil" className="mr-3" /> Edit Program
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {/* -------------------------------------------------- */}
          {/*  BASIC FIELDS                                     */}
          {/* -------------------------------------------------- */}
          <section className="grid md:grid-cols-2 gap-8">
            {/* Left column */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block mb-2 font-medium">Program Title*</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={onSimpleChange}
                  className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 font-medium">Description*</label>
                <ReactQuill value={formData.description} onChange={setDescription} />
              </div>

              {/* Phone */}
              <div>
                <label className="block mb-2 font-medium">Phone</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={onSimpleChange}
                  className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Locations */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">From*</label>
                  <input
                    name="locationFrom"
                    value={formData.locationFrom}
                    onChange={onSimpleChange}
                    className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">To*</label>
                  <input
                    name="locationTo"
                    value={formData.locationTo}
                    onChange={onSimpleChange}
                    className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Days / Price / Single */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2 font-medium">Days*</label>
                  <input
                    type="number"
                    name="days"
                    value={formData.days}
                    min={1}
                    onChange={onSimpleChange}
                    className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Price*</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    min={0}
                    step="0.01"
                    onChange={onSimpleChange}
                    className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Single Add-on</label>
                  <input
                    type="number"
                    name="singleAdon"
                    value={formData.singleAdon}
                    min={0}
                    onChange={onSimpleChange}
                    className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">From Date*</label>
                  <input
                    type="date"
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={onSimpleChange}
                    className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">To Date</label>
                  <input
                    type="date"
                    name="toDate"
                    value={formData.toDate}
                    readOnly
                    className="w-full rounded-lg border px-4 py-2 bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* -------------------------------------------------- */}
          {/*  Metadata                                          */}
          {/* -------------------------------------------------- */}
          <section>
            <label className="block mb-2 font-medium">Metadata</label>
            <textarea
              name="metadata"
              rows={3}
              value={formData.metadata}
              onChange={onSimpleChange}
              className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </section>

          {/* -------------------------------------------------- */}
          {/*  Existing gallery (deletable)                      */}
          {/* -------------------------------------------------- */}
          {formData.existingImages.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-2">Existing Images</h2>
              <p className="text-sm text-gray-500 mb-3">Click ❌ to remove.</p>
              <div className="flex flex-wrap gap-4">
                {formData.existingImages.map(url => (
                  <div key={url} className="relative">
                    <Image
                      src={url}
                      alt="existing"
                      width={100}
                      height={100}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExisting(url)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <Icon icon="mdi:close" className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* -------------------------------------------------- */}
          {/*  Add / replace gallery images                      */}
          {/* -------------------------------------------------- */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Add / Replace Images</h2>
            <div className="flex flex-wrap gap-4">
              {newImages.map((file, i) => (
                <div key={i} className="relative">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`new-${i}`}
                    width={100}
                    height={100}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeNew(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <Icon icon="mdi:close" className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={e => handleImagePick(e)}
                  className="hidden"
                />
                <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center hover:bg-gray-100">
                  <Icon icon="mdi:plus" className="w-8 h-8 text-gray-400" />
                </div>
              </label>
            </div>
          </section>

          {/* -------------------------------------------------- */}
          {/*  Timeline                                          */}
          {/* -------------------------------------------------- */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Program Timeline</h2>
            {formData.timeline.map((item, idx) => (
              <div key={idx} className="mb-8 p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-medium mb-4">
                  Day {idx + 1} — {item.date}
                </h3>

                {/* title */}
                <input
                  value={item.title}
                  onChange={e => setTlTitle(idx, e.target.value)}
                  placeholder="Day title"
                  className="w-full mb-4 rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />

                {/* description */}
                <ReactQuill
                  value={item.description}
                  onChange={v => setTlDesc(idx, v)}
                />

                {/* day image picker */}
                <div className="mt-4">
                  <label className="block font-medium mb-2">Day Image</label>
                  <div className="flex gap-4 items-center">
                    {item.image && (
                      <div className="relative">
                        <Image
                          src={item.image}
                          alt={`day-${idx}`}
                          width={100}
                          height={100}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeNew(0, true, idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <Icon icon="mdi:close" className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImagePick(e, true, idx)}
                        className="hidden"
                      />
                      <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center hover:bg-gray-100">
                        <Icon icon="mdi:plus" className="w-8 h-8 text-gray-400" />
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* -------------------------------------------------- */}
          {/*  Price include & general conditions                */}
          {/* -------------------------------------------------- */}
          <section>
            <label className="block mb-2 font-medium">What&lsquo;s included</label>
            <ReactQuill value={formData.priceInclude} onChange={setPriceInclude} />
          </section>

          <section>
            <label className="block mb-2 font-medium">General conditions</label>
            <ReactQuill value={formData.generalConditions} onChange={setGeneralConditions} />
          </section>

          {/* -------------------------------------------------- */}
          {/*  Display switch                                    */}
          {/* -------------------------------------------------- */}
          <div className="flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.display}
                onChange={(e) => setFormData(prev => ({ ...prev, display: e.target.checked }))}
                className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-700">Display on website</span>
            </label>
          </div>


          {/* -------------------------------------------------- */}
          {/*  Action buttons                                    */}
          {/* -------------------------------------------------- */}
          <footer className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.push("/admin/dashboard")}
              className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue black rounded-lg hover:bg-blue-700 "
            >
              {submitting ? (
                <span className="flex items-center">
                  <Icon icon="mdi:loading" className="animate-spin mr-2" /> Updating…
                </span>
              ) : (
                "Update Program"
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
