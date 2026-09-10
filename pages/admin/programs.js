import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Icon } from '@iconify/react';
import toast, { Toaster } from 'react-hot-toast';
import { addDays, format } from 'date-fns';

const initialForm = {
  title: '',
  slug: '',
  type: 'MULTI_DAY_CIRCUIT',
  status: 'PUBLISHED',
  description: '',
  shortDescription: '',
  highlightsText: '',
  locationFrom: '',
  locationTo: '',
  meetingPoint: '',
  destinationsText: '',
  days: 1,
  nights: 0,
  price: '',
  priceLabel: '',
  currency: 'TND',
  durationLabel: '',
  singleAddonPrice: '',
  childPrice: '',
  fromDate: '',
  toDate: '',
  isDateFlexible: false,
  display: true,
  featured: false,
  sortOrder: 0,
  phone: '',
  whatsappNumber: '',
  mapEmbedUrl: '',
  videoUrl: '',
  includesText: '',
  excludesText: '',
  generalConditionsText: '',
  paymentConditionsText: '',
  cancellationTermsText: '',
  hotels: [],
  daysDetails: [],
};

const programTypes = [
  { value: 'DAY_TRIP', label: 'Sortie 1 journee' },
  { value: 'EVENING', label: 'Soiree' },
  { value: 'WEEKEND', label: 'Weekend' },
  { value: 'MULTI_DAY_CIRCUIT', label: 'Circuit plusieurs jours' },
  { value: 'EXCURSION', label: 'Excursion' },
  { value: 'EVENT', label: 'Evenement' },
  { value: 'CUSTOM', label: 'Sur mesure' },
];

const programStatuses = [
  { value: 'PUBLISHED', label: 'Publie' },
  { value: 'DRAFT', label: 'Brouillon' },
  { value: 'ARCHIVED', label: 'Archive' },
];

const reservationStatuses = [
  { value: 'PENDING', label: 'A traiter', tone: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'CONTACTED', label: 'Contacte', tone: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'CONFIRMED', label: 'Confirme', tone: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'CANCELLED', label: 'Annule', tone: 'bg-gray-100 text-gray-600 border-gray-200' },
];

const programTypeHints = {
  DAY_TRIP: 'Sortie courte: pas de chambre, prix par personne, CTA direct.',
  EVENING: 'Soiree: formulaire court, horaire clair, pas de nuit.',
  WEEKEND: 'Weekend: chambres, supplement single et conditions visibles.',
  MULTI_DAY_CIRCUIT: 'Circuit: itineraire jour par jour et hebergement important.',
  EXCURSION: 'Excursion: programme simple, point de rendez-vous prioritaire.',
  EVENT: 'Evenement: capacite et contact rapide prioritaires.',
  CUSTOM: 'Sur mesure: garder les champs flexibles selon le besoin.',
};

const accommodationTypes = new Set(['WEEKEND', 'MULTI_DAY_CIRCUIT']);

const getProgramTypeLabel = (type) =>
  programTypes.find((item) => item.value === type)?.label || 'Programme';

const getReservationStatus = (statusValue) =>
  reservationStatuses.find((item) => item.value === statusValue) || reservationStatuses[0];

const formatMoney = (value, currency = 'TND') =>
  `${Number(value || 0).toLocaleString('fr-FR')} ${currency || 'TND'}`;

const formatDateLabel = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getWhatsAppReservationUrl = (reservation) => {
  const rawPhone = String(reservation?.phone || '').replace(/\D/g, '');
  const phone = rawPhone.length === 8 ? `216${rawPhone}` : rawPhone;
  if (!phone) return '';
  const message = encodeURIComponent(`Bonjour ${reservation?.firstName || ''}, nous vous contactons concernant votre demande de reservation Batouta Voyages.`);
  return `https://wa.me/${phone}?text=${message}`;
};

const parseCommaList = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const parseLineList = (value) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

const serializeLineList = (value) =>
  Array.isArray(value) ? value.map((item) => String(item || '').trim()).filter(Boolean).join('\n') : '';

const serializeCommaList = (value) =>
  Array.isArray(value) ? value.map((item) => String(item || '').trim()).filter(Boolean).join(',') : '';

const LocalProgramAdminPage = () => {
  const { status } = useSession();
  const router = useRouter();

  const [programs, setPrograms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [programSearch, setProgramSearch] = useState('');
  const [programStatusFilter, setProgramStatusFilter] = useState('all');
  const [reservationStatusFilter, setReservationStatusFilter] = useState('PENDING');

  const needsAccommodation = useMemo(() => {
    return accommodationTypes.has(formData.type) || Number(formData.nights || 0) > 0;
  }, [formData.type, formData.nights]);

  const programMetrics = useMemo(() => {
    const published = programs.filter((program) => program.display && program.status === 'PUBLISHED').length;
    const drafts = programs.filter((program) => !program.display || program.status === 'DRAFT').length;
    const featured = programs.filter((program) => program.featured).length;

    return [
      { label: 'Total programmes', value: programs.length, icon: 'mdi:map-marker-path', tone: 'bg-gray-900 text-white' },
      { label: 'Publies', value: published, icon: 'mdi:eye-check-outline', tone: 'bg-emerald-600 text-white' },
      { label: 'Brouillons', value: drafts, icon: 'mdi:file-document-edit-outline', tone: 'bg-amber-500 text-white' },
      { label: 'Mis en avant', value: featured, icon: 'mdi:star-outline', tone: 'bg-orange-500 text-white' },
    ];
  }, [programs]);

  const reservationMetrics = useMemo(() => {
    return reservationStatuses.map((statusOption) => ({
      ...statusOption,
      count: reservations.filter((reservation) => reservation.status === statusOption.value).length,
    }));
  }, [reservations]);

  const reservationCountByProgram = useMemo(() => {
    return reservations.reduce((acc, reservation) => {
      const programId = reservation.program?.id || reservation.programId;
      if (!programId) return acc;
      acc[programId] = (acc[programId] || 0) + 1;
      return acc;
    }, {});
  }, [reservations]);

  const filteredPrograms = useMemo(() => {
    const search = programSearch.trim().toLowerCase();

    return programs.filter((program) => {
      const storedStatus = program.status || 'DRAFT';
      const publicationStatus = !program.display && storedStatus === 'PUBLISHED' ? 'DRAFT' : storedStatus;
      const statusMatch = programStatusFilter === 'all' || publicationStatus === programStatusFilter;
      const searchMatch = !search || [program.title, program.slug, program.location_from, program.location_to]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(search);

      return statusMatch && searchMatch;
    });
  }, [programs, programSearch, programStatusFilter]);

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) =>
      reservationStatusFilter === 'all' || reservation.status === reservationStatusFilter
    );
  }, [reservations, reservationStatusFilter]);

  const generatedDays = useMemo(() => {
    if (!formData.fromDate || !formData.days) return [];

    const totalDays = Number(formData.days);
    if (!Number.isFinite(totalDays) || totalDays <= 0) return [];

    const startDate = new Date(formData.fromDate);
    if (Number.isNaN(startDate.getTime())) return [];

    return Array.from({ length: totalDays }, (_, index) => {
      const currentDate = addDays(startDate, index);
      const existing = formData.daysDetails[index];

      return {
        dayNumber: existing?.dayNumber || index + 1,
        title: existing?.title || `Jour ${index + 1}`,
        route: existing?.route || '',
        summary: existing?.summary || '',
        highlight: existing?.highlight || '',
        hotel: existing?.hotel || '',
        mealsText: existing?.mealsText || '',
        tagsText: existing?.tagsText || '',
        date: format(currentDate, 'yyyy-MM-dd'),
        order: existing?.order || index + 1,
        activities: Array.isArray(existing?.activities) && existing.activities.length > 0
          ? existing.activities
          : [{ time: '', title: '', description: '', type: '', location: '', order: 1 }],
      };
    });
  // daysDetails is intentionally read without being a dependency so manual day edits are not regenerated on each keystroke.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.fromDate, formData.days]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin');
    }
  }, [status, router]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      nights: Math.max(Number(prev.days) - 1, 0),
      daysDetails: generatedDays,
      toDate: generatedDays.length > 0 ? generatedDays[generatedDays.length - 1].date : '',
    }));
  }, [generatedDays]);

  const fetchPrograms = async () => {
    try {
      setLoadingList(true);
      const res = await fetch('/api/locals');
      if (!res.ok) throw new Error('Impossible de charger les programmes en Tunisie');
      const data = await res.json();
      setPrograms(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || 'Erreur de chargement');
      setPrograms([]);
    } finally {
      setLoadingList(false);
    }
  };

  const fetchReservations = async () => {
    try {
      setLoadingReservations(true);
      const res = await fetch('/api/programme-reservations');
      if (!res.ok) throw new Error('Impossible de charger les demandes');
      const data = await res.json();
      setReservations(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || 'Erreur de chargement des demandes');
      setReservations([]);
    } finally {
      setLoadingReservations(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
    fetchReservations();
  }, []);

  const updateReservationStatus = async (id, statusValue) => {
    try {
      const response = await fetch('/api/programme-reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: statusValue }),
      });
      if (!response.ok) throw new Error('Mise a jour impossible');
      fetchReservations();
    } catch (error) {
      toast.error(error.message || 'Erreur statut');
    }
  };

  useEffect(() => {
    const editId = router.query.edit;
    if (!editId || loadingList || programs.length === 0) return;
    const match = programs.find((program) => program.id === editId || program.slug === editId);
    if (match) {
      startEditProgram(match);
    }
  }, [router.query.edit, programs, loadingList]);

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateDayField = (index, name, value) => {
    setFormData((prev) => {
      const next = [...prev.daysDetails];
      next[index] = { ...(next[index] || {}), [name]: value };
      return { ...prev, daysDetails: next };
    });
  };

  const updateActivityField = (dayIndex, activityIndex, name, value) => {
    setFormData((prev) => {
      const daysDetails = [...prev.daysDetails];
      const day = { ...daysDetails[dayIndex] };
      const activities = Array.isArray(day.activities) ? [...day.activities] : [];
      activities[activityIndex] = { ...(activities[activityIndex] || {}), [name]: value };
      day.activities = activities;
      daysDetails[dayIndex] = day;
      return { ...prev, daysDetails };
    });
  };

  const addActivity = (dayIndex) => {
    setFormData((prev) => {
      const daysDetails = [...prev.daysDetails];
      const day = { ...daysDetails[dayIndex] };
      const activities = Array.isArray(day.activities) ? [...day.activities] : [];
      activities.push({ time: '', title: '', description: '', type: '', location: '', order: activities.length + 1 });
      day.activities = activities;
      daysDetails[dayIndex] = day;
      return { ...prev, daysDetails };
    });
  };

  const removeActivity = (dayIndex, activityIndex) => {
    setFormData((prev) => {
      const daysDetails = [...prev.daysDetails];
      const day = { ...daysDetails[dayIndex] };
      const activities = Array.isArray(day.activities) ? [...day.activities] : [];
      activities.splice(activityIndex, 1);
      day.activities = activities.length > 0 ? activities : [{ time: '', title: '', description: '', type: '', location: '', order: 1 }];
      daysDetails[dayIndex] = day;
      return { ...prev, daysDetails };
    });
  };

  const handleImagesUpload = (event) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setImages((prev) => [...prev, ...files]);
    event.target.value = '';
  };

  const validate = () => {
    if (!formData.title || !formData.description || !formData.locationFrom || !formData.locationTo) {
      toast.error('Veuillez remplir les champs obligatoires');
      return false;
    }

    if (!formData.fromDate || !formData.toDate) {
      toast.error('Veuillez choisir une date de depart');
      return false;
    }

    const days = Number(formData.days);
    if (!Number.isFinite(days) || days <= 0) {
      toast.error('Le nombre de jours doit etre superieur a 0');
      return false;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      toast.error('Veuillez entrer un prix valide');
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialForm);
    setImages([]);
  };

  const startEditProgram = (program) => {
    setEditingId(program.id);
    setImages([]);
    setFormData({
      title: program.title || '',
      slug: program.slug || '',
      type: program.type || 'MULTI_DAY_CIRCUIT',
      status: program.status || (program.display ? 'PUBLISHED' : 'DRAFT'),
      description: program.description || '',
      shortDescription: program.shortDescription || '',
      highlightsText: serializeLineList(program.highlights),
      locationFrom: program.location_from || '',
      locationTo: program.location_to || '',
      meetingPoint: program.meetingPoint || '',
      destinationsText: serializeCommaList(program.destinations),
      days: Number(program.days || 1),
      nights: Number(program.nights || 0),
      price: program.price ?? '',
      priceLabel: program.priceLabel || '',
      currency: program.currency || 'TND',
      durationLabel: program.durationLabel || '',
      singleAddonPrice: program.singleAddonPrice ?? '',
      childPrice: program.childPrice ?? '',
      fromDate: program.from_date ? String(program.from_date).slice(0, 10) : '',
      toDate: program.to_date ? String(program.to_date).slice(0, 10) : '',
      isDateFlexible: Boolean(program.isDateFlexible),
      display: program.display ?? true,
      featured: Boolean(program.featured),
      sortOrder: Number(program.sortOrder || 0),
      phone: program.phone || '',
      whatsappNumber: program.whatsappNumber || '',
      mapEmbedUrl: program.mapEmbedUrl || '',
      videoUrl: program.videoUrl || '',
      includesText: serializeLineList(program.includes),
      excludesText: serializeLineList(program.excludes),
      generalConditionsText: serializeLineList(program.generalConditions),
      paymentConditionsText: serializeLineList(program.paymentConditions),
      cancellationTermsText: serializeLineList(program.cancellationTerms),
      hotels: Array.isArray(program.hotels)
        ? program.hotels.map((h) => ({
            name: h.name || '',
            stars: h.stars != null ? String(h.stars) : '',
            website: h.website || '',
          }))
        : [],
      daysDetails: Array.isArray(program.daysDetails)
        ? program.daysDetails.map((day, dayIndex) => ({
            dayNumber: Number(day.dayNumber || dayIndex + 1),
            title: day.title || `Jour ${dayIndex + 1}`,
            route: day.route || '',
            summary: day.summary || '',
            highlight: day.highlight || '',
            hotel: day.hotel || '',
            mealsText: serializeCommaList(day.meals),
            tagsText: serializeCommaList(day.tags),
            date: '',
            order: Number(day.order || dayIndex + 1),
            activities: Array.isArray(day.activities) && day.activities.length > 0
              ? day.activities.map((activity, activityIndex) => ({
                  time: activity.time || '',
                  title: activity.title || '',
                  description: activity.description || '',
                  type: activity.type || '',
                  location: activity.location || '',
                  order: Number(activity.order || activityIndex + 1),
                }))
          : [{ time: '', title: '', description: '', type: '', location: '', order: 1 }],
          }))
        : [],
    });
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        document.getElementById('program-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  const submitProgram = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const multipart = new FormData();

      const payload = {
        title: formData.title,
        slug: formData.slug,
        type: formData.type,
        status: formData.status,
        description: formData.description,
        shortDescription: formData.shortDescription,
        highlights: parseLineList(formData.highlightsText),
        locationFrom: formData.locationFrom,
        locationTo: formData.locationTo,
        meetingPoint: formData.meetingPoint,
        destinations: parseCommaList(formData.destinationsText || ''),
        days: Number(formData.days),
        nights: Number(formData.nights),
        price: Number(formData.price),
        priceLabel: formData.priceLabel,
        currency: formData.currency || 'TND',
        durationLabel: formData.durationLabel,
        singleAddonPrice: needsAccommodation && formData.singleAddonPrice ? Number(formData.singleAddonPrice) : null,
        childPrice: formData.childPrice ? Number(formData.childPrice) : null,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        isDateFlexible: formData.isDateFlexible,
        display: formData.display,
        featured: formData.featured,
        sortOrder: Number(formData.sortOrder || 0),
        phone: formData.phone,
        whatsappNumber: formData.whatsappNumber,
        mapEmbedUrl: formData.mapEmbedUrl,
        videoUrl: formData.videoUrl,
        includes: parseLineList(formData.includesText),
        excludes: parseLineList(formData.excludesText),
        generalConditions: parseLineList(formData.generalConditionsText),
        paymentConditions: parseLineList(formData.paymentConditionsText),
        cancellationTerms: parseLineList(formData.cancellationTermsText),
        hotels: Array.isArray(formData.hotels)
          ? formData.hotels
              .filter((h) => h.name && h.name.trim())
              .map((h) => ({
                name: h.name.trim(),
                stars: h.stars !== '' && h.stars != null ? Number(h.stars) : null,
                website: h.website ? h.website.trim() : null,
              }))
          : [],
        daysDetails: formData.daysDetails.map((day, dayIndex) => ({
          dayNumber: Number(day.dayNumber || dayIndex + 1),
          title: day.title,
          route: day.route,
          summary: day.summary,
          highlight: day.highlight,
          hotel: needsAccommodation ? day.hotel : '',
          meals: parseCommaList(day.mealsText || ''),
          tags: parseCommaList(day.tagsText || ''),
          order: Number(day.order || dayIndex + 1),
          activities: (day.activities || [])
            .filter((activity) => activity.title)
            .map((activity, index) => ({
              time: activity.time,
              title: activity.title,
              description: activity.description,
              type: activity.type,
              location: activity.location,
              order: Number(activity.order || index + 1),
            })),
        })),
      };

      multipart.append('programData', JSON.stringify(payload));
      images.forEach((file) => multipart.append('program_images', file));

      const endpoint = editingId ? `/api/locals?id=${editingId}` : '/api/locals';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        body: multipart,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Creation echouee');
      }

      toast.success(editingId ? 'Programme mis a jour avec succes' : 'Programme cree avec succes');
      resetForm();
      fetchPrograms();
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la creation');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProgram = async (id) => {
    if (!window.confirm('Supprimer ce programme en Tunisie ?')) return;

    try {
      const response = await fetch(`/api/locals?id=${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Suppression impossible');
      }
      toast.success('Programme supprime');
      fetchPrograms();
    } catch (error) {
      toast.error(error.message || 'Erreur suppression');
    }
  };

  if (status === 'loading') {
    return <div className="p-8">Chargement...</div>;
  }

  return (
    <div className="p-6 md:p-8">
      <Toaster position="top-right" />

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programme en Tunisie - Admin</h1>
          <p className="text-sm text-gray-600">Gestion des sorties, soirees, weekends et circuits en Tunisie.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              resetForm();
              document.getElementById('program-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
          >
            <Icon icon="mdi:plus" className="h-4 w-4" /> Nouveau programme
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/dashboard')}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Icon icon="mdi:arrow-left" className="h-4 w-4" /> Retour dashboard
          </button>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {programMetrics.map((metric) => (
          <div key={metric.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${metric.tone}`}>
              <Icon icon={metric.icon} className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-gray-500">{metric.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-950">{metric.value}</p>
          </div>
        ))}
      </div>

      <section className="mb-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Programmes existants</h2>
            <p className="text-sm text-gray-500">{filteredPrograms.length} resultat{filteredPrograms.length > 1 ? 's' : ''} visible{filteredPrograms.length > 1 ? 's' : ''}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Icon icon="mdi:magnify" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={programSearch}
                onChange={(event) => setProgramSearch(event.target.value)}
                className="h-10 w-full rounded-lg border border-gray-300 pl-9 pr-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 sm:w-72"
                placeholder="Rechercher titre, ville, slug"
              />
            </div>
            <select
              value={programStatusFilter}
              onChange={(event) => setProgramStatusFilter(event.target.value)}
              className="h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
            >
              <option value="all">Tous les statuts</option>
              {programStatuses.map((statusOption) => (
                <option key={statusOption.value} value={statusOption.value}>{statusOption.label}</option>
              ))}
            </select>
          </div>
        </div>

        {loadingList ? (
          <div className="py-10 text-center text-gray-500">Chargement des programmes...</div>
        ) : programs.length === 0 ? (
          <div className="py-10 text-center text-gray-500">Aucun programme en Tunisie pour le moment.</div>
        ) : filteredPrograms.length === 0 ? (
          <div className="py-10 text-center text-gray-500">Aucun programme ne correspond aux filtres.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredPrograms.map((program) => (
              <article key={program.id} className="rounded-xl border border-gray-200 p-4 transition hover:border-orange-200 hover:shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="line-clamp-2 text-base font-semibold text-gray-900">{program.title}</h3>
                    <p className="mt-1 text-xs text-gray-500">/{program.slug}</p>
                  </div>
                  {reservationCountByProgram[program.id] > 0 && (
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                      {reservationCountByProgram[program.id]} demande{reservationCountByProgram[program.id] > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <p className="inline-flex rounded-full bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700">{getProgramTypeLabel(program.type)}</p>
                  {program.featured && <p className="inline-flex rounded-full bg-yellow-50 px-2 py-1 text-xs font-semibold text-yellow-700">A la une</p>}
                </div>
                <p className="mt-3 text-sm text-gray-600">{program.location_from} - {program.location_to}</p>
                <p className="mt-1 text-sm text-gray-600">{program.durationLabel || `${program.days} jours / ${program.nights} nuits`} - {formatMoney(program.price, program.currency)}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {program.isDateFlexible ? 'Date flexible' : `${formatDateLabel(program.from_date)} - ${formatDateLabel(program.to_date)}`}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${program.display && program.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {program.display && program.status === 'PUBLISHED' ? 'Publie' : program.status || 'Brouillon'}
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={`/programmes-en-tunisie/${program.slug || program.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Icon icon="mdi:open-in-new" className="h-4 w-4" /> Voir
                    </a>
                    <button
                      onClick={() => startEditProgram(program)}
                      className="inline-flex items-center gap-1 rounded-md border border-blue-200 px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                    >
                      <Icon icon="mdi:pencil-outline" className="h-4 w-4" /> Modifier
                    </button>
                    <button
                      onClick={() => deleteProgram(program.id)}
                      className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      <Icon icon="mdi:trash-can-outline" className="h-4 w-4" /> Supprimer
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mb-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Demandes de reservation</h2>
            <p className="text-sm text-gray-500">{filteredReservations.length} demande{filteredReservations.length > 1 ? 's' : ''} dans cette vue</p>
          </div>
          <button
            type="button"
            onClick={fetchReservations}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Icon icon="mdi:refresh" className="h-4 w-4" /> Actualiser
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setReservationStatusFilter('all')}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${reservationStatusFilter === 'all' ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            Toutes ({reservations.length})
          </button>
          {reservationMetrics.map((statusOption) => (
            <button
              key={statusOption.value}
              type="button"
              onClick={() => setReservationStatusFilter(statusOption.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${reservationStatusFilter === statusOption.value ? statusOption.tone : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              {statusOption.label} ({statusOption.count})
            </button>
          ))}
        </div>

        {loadingReservations ? (
          <div className="py-8 text-center text-gray-500">Chargement des demandes...</div>
        ) : reservations.length === 0 ? (
          <div className="py-8 text-center text-gray-500">Aucune demande pour le moment.</div>
        ) : filteredReservations.length === 0 ? (
          <div className="py-8 text-center text-gray-500">Aucune demande dans ce statut.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-3">Client</th>
                  <th className="px-3 py-3">Programme</th>
                  <th className="px-3 py-3">Personnes</th>
                  <th className="px-3 py-3">Total</th>
                  <th className="px-3 py-3">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td className="px-3 py-3">
                      <p className="font-semibold text-gray-900">{reservation.firstName} {reservation.lastName}</p>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs">
                        {getWhatsAppReservationUrl(reservation) && (
                          <a className="font-medium text-emerald-700 hover:underline" href={getWhatsAppReservationUrl(reservation)} target="_blank" rel="noreferrer">
                            WhatsApp
                          </a>
                        )}
                        <a className="font-medium text-blue-700 hover:underline" href={`tel:${reservation.phone}`}>
                          {reservation.phone}
                        </a>
                        <a className="font-medium text-gray-500 hover:underline" href={`mailto:${reservation.email}`}>
                          {reservation.email}
                        </a>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-medium text-gray-900">{reservation.program?.title || 'Programme supprime'}</p>
                      <p className="text-xs text-gray-500">{reservation.preferredDate || '-'}</p>
                      <p className="text-xs text-gray-400">{formatDateLabel(reservation.createdAt)}</p>
                    </td>
                    <td className="px-3 py-3 text-gray-700">{reservation.numberOfPersons}</td>
                    <td className="px-3 py-3 text-gray-700">{formatMoney(reservation.totalPrice)}</td>
                    <td className="px-3 py-3">
                      <select
                        className={`rounded-lg border px-2 py-1 text-xs font-medium ${getReservationStatus(reservation.status).tone}`}
                        value={reservation.status}
                        onChange={(event) => updateReservationStatus(reservation.id, event.target.value)}
                      >
                        {reservationStatuses.map((statusOption) => (
                          <option key={statusOption.value} value={statusOption.value}>{statusOption.label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section id="program-editor" className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Modifier le programme' : 'Creer un nouveau programme'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{programTypeHints[formData.type] || programTypeHints.CUSTOM}</p>
          </div>
          <div className="rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-800">
            <p className="font-semibold">{needsAccommodation ? 'Programme avec hebergement' : 'Programme sans hebergement'}</p>
            <p className="text-xs">{needsAccommodation ? 'Les chambres, hotels et supplements single sont utiles.' : 'Les champs chambre/hotel sont masques pour garder la saisie courte.'}</p>
          </div>
        </div>

        <form onSubmit={submitProgram} className="space-y-6">
          <div className="rounded-xl border border-gray-200 p-4">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Essentiel commercial</h3>
            <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-lg border border-gray-300 px-3 py-2" placeholder="Titre*" value={formData.title} onChange={(e) => updateField('title', e.target.value)} />
            <input className="rounded-lg border border-gray-300 px-3 py-2" placeholder="Slug (optionnel)" value={formData.slug} onChange={(e) => updateField('slug', e.target.value)} />
            <select className="rounded-lg border border-gray-300 px-3 py-2" value={formData.type} onChange={(e) => updateField('type', e.target.value)}>
              {programTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            <select className="rounded-lg border border-gray-300 px-3 py-2" value={formData.status} onChange={(e) => updateField('status', e.target.value)}>
              {programStatuses.map((statusOption) => (
                <option key={statusOption.value} value={statusOption.value}>{statusOption.label}</option>
              ))}
            </select>
            <input className="rounded-lg border border-gray-300 px-3 py-2" placeholder="Depart*" value={formData.locationFrom} onChange={(e) => updateField('locationFrom', e.target.value)} />
            <input className="rounded-lg border border-gray-300 px-3 py-2" placeholder="Destination*" value={formData.locationTo} onChange={(e) => updateField('locationTo', e.target.value)} />
            <input className="rounded-lg border border-gray-300 px-3 py-2" placeholder="Point de rendez-vous" value={formData.meetingPoint} onChange={(e) => updateField('meetingPoint', e.target.value)} />
            <input className="rounded-lg border border-gray-300 px-3 py-2" placeholder="Destinations (Tunis, Bizerte, ...)" value={formData.destinationsText} onChange={(e) => updateField('destinationsText', e.target.value)} />
            <input type="number" min="1" className="rounded-lg border border-gray-300 px-3 py-2" placeholder="Jours*" value={formData.days} onChange={(e) => updateField('days', e.target.value)} />
            <input type="number" min="0" className="rounded-lg border border-gray-300 px-3 py-2 bg-gray-50" placeholder="Nuits" value={formData.nights} readOnly />
            <input type="number" min="1" className="rounded-lg border border-gray-300 px-3 py-2" placeholder="Prix*" value={formData.price} onChange={(e) => updateField('price', e.target.value)} />
            <input className="rounded-lg border border-gray-300 px-3 py-2" placeholder="Libelle prix (ex: A partir de)" value={formData.priceLabel} onChange={(e) => updateField('priceLabel', e.target.value)} />
            <input className="rounded-lg border border-gray-300 px-3 py-2" placeholder="Devise" value={formData.currency} onChange={(e) => updateField('currency', e.target.value)} />
            <input className="rounded-lg border border-gray-300 px-3 py-2" placeholder="Duree affichee (ex: 1 journee, 3 jours / 2 nuits)" value={formData.durationLabel} onChange={(e) => updateField('durationLabel', e.target.value)} />
            {needsAccommodation && (
              <input type="number" min="0" className="rounded-lg border border-gray-300 px-3 py-2" placeholder="Supplement single" value={formData.singleAddonPrice} onChange={(e) => updateField('singleAddonPrice', e.target.value)} />
            )}
            <input type="number" min="0" className="rounded-lg border border-gray-300 px-3 py-2" placeholder="Prix enfant" value={formData.childPrice} onChange={(e) => updateField('childPrice', e.target.value)} />
            <input type="date" className="rounded-lg border border-gray-300 px-3 py-2" value={formData.fromDate} onChange={(e) => updateField('fromDate', e.target.value)} />
            <input type="date" className="rounded-lg border border-gray-300 px-3 py-2 bg-gray-50" value={formData.toDate} readOnly />
            <input className="rounded-lg border border-gray-300 px-3 py-2" placeholder="Telephone" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} />
            <input className="rounded-lg border border-gray-300 px-3 py-2" placeholder="WhatsApp" value={formData.whatsappNumber} onChange={(e) => updateField('whatsappNumber', e.target.value)} />
            <input className="rounded-lg border border-gray-300 px-3 py-2 md:col-span-2" placeholder="Google Map Embed URL" value={formData.mapEmbedUrl} onChange={(e) => updateField('mapEmbedUrl', e.target.value)} />
            <input className="rounded-lg border border-gray-300 px-3 py-2 md:col-span-2" placeholder="Video URL (YouTube, Vimeo ou MP4)" value={formData.videoUrl} onChange={(e) => updateField('videoUrl', e.target.value)} />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Publication</h3>
            <div className="flex flex-wrap gap-5">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
              <input type="checkbox" checked={formData.display} onChange={(e) => updateField('display', e.target.checked)} />
              Afficher ce programme sur le site
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
              <input type="checkbox" checked={formData.featured} onChange={(e) => updateField('featured', e.target.checked)} />
              Mettre en avant
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
              <input type="checkbox" checked={formData.isDateFlexible} onChange={(e) => updateField('isDateFlexible', e.target.checked)} />
              Date flexible
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
              Ordre
              <input type="number" className="w-24 rounded-lg border border-gray-300 px-3 py-2" value={formData.sortOrder} onChange={(e) => updateField('sortOrder', e.target.value)} />
            </label>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Argumentaire de vente</h3>
            <div className="space-y-4">
              <textarea className="min-h-[120px] w-full rounded-lg border border-gray-300 px-3 py-2" placeholder="Description*" value={formData.description} onChange={(e) => updateField('description', e.target.value)} />
              <textarea className="min-h-[90px] w-full rounded-lg border border-gray-300 px-3 py-2" placeholder="Description courte (cartes)" value={formData.shortDescription} onChange={(e) => updateField('shortDescription', e.target.value)} />
              <textarea className="min-h-[90px] w-full rounded-lg border border-gray-300 px-3 py-2" placeholder="Points forts (une ligne par point)" value={formData.highlightsText} onChange={(e) => updateField('highlightsText', e.target.value)} />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Inclus, exclusions et conditions</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <textarea className="min-h-[120px] w-full rounded-lg border border-gray-300 px-3 py-2" placeholder="Inclus (une ligne par element)" value={formData.includesText} onChange={(e) => updateField('includesText', e.target.value)} />
              <textarea className="min-h-[120px] w-full rounded-lg border border-gray-300 px-3 py-2" placeholder="Exclus (une ligne par element)" value={formData.excludesText} onChange={(e) => updateField('excludesText', e.target.value)} />
              <textarea className="min-h-[120px] w-full rounded-lg border border-gray-300 px-3 py-2" placeholder="Conditions generales (une ligne par element)" value={formData.generalConditionsText} onChange={(e) => updateField('generalConditionsText', e.target.value)} />
              <textarea className="min-h-[120px] w-full rounded-lg border border-gray-300 px-3 py-2" placeholder="Conditions de paiement (une ligne par element)" value={formData.paymentConditionsText} onChange={(e) => updateField('paymentConditionsText', e.target.value)} />
            </div>
            <textarea className="mt-4 min-h-[120px] w-full rounded-lg border border-gray-300 px-3 py-2" placeholder="Conditions d'annulation (une ligne par element)" value={formData.cancellationTermsText} onChange={(e) => updateField('cancellationTermsText', e.target.value)} />
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Hôtels & Hébergements</h3>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, hotels: [...(prev.hotels || []), { name: '', stars: '', website: '' }] }))}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  + Ajouter un hôtel
                </button>
              </div>
              {(!formData.hotels || formData.hotels.length === 0) ? (
                <p className="text-sm text-gray-400 italic">Aucun hôtel ajouté. Cliquez sur "Ajouter un hôtel" pour commencer.</p>
              ) : (
                <div className="space-y-3">
                  {formData.hotels.map((hotel, hi) => (
                    <div key={hi} className="flex gap-2 items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <input
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        placeholder="Nom de l'hôtel *"
                        value={hotel.name}
                        onChange={(e) => {
                          const next = [...formData.hotels];
                          next[hi] = { ...next[hi], name: e.target.value };
                          updateField('hotels', next);
                        }}
                      />
                      <input
                        type="number"
                        min="0"
                        max="5"
                        className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        placeholder="★"
                        value={hotel.stars}
                        onChange={(e) => {
                          const next = [...formData.hotels];
                          next[hi] = { ...next[hi], stars: e.target.value };
                          updateField('hotels', next);
                        }}
                      />
                      <input
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        placeholder="Site web (https://...)"
                        value={hotel.website}
                        onChange={(e) => {
                          const next = [...formData.hotels];
                          next[hi] = { ...next[hi], website: e.target.value };
                          updateField('hotels', next);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = formData.hotels.filter((_, i) => i !== hi);
                          updateField('hotels', next);
                        }}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                        title="Supprimer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Images du programme</p>
            <input type="file" accept="image/*" multiple onChange={handleImagesUpload} />
            {images.length > 0 && (
              <p className="mt-2 text-xs text-gray-600">{images.length} image(s) selectionnee(s)</p>
            )}
          </div>

          <div className="space-y-4 rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800">Jours du programme</h3>
            {formData.daysDetails.length === 0 ? (
              <p className="text-sm text-gray-500">Choisissez la date de depart et le nombre de jours pour generer les jours.</p>
            ) : (
              formData.daysDetails.map((day, dayIndex) => (
                <div key={dayIndex} className="rounded-lg border border-gray-200 p-3 space-y-2">
                  <p className="text-xs font-semibold uppercase text-gray-500">Jour {dayIndex + 1} - {day.date}</p>
                  <input className="w-full rounded-lg border border-gray-300 px-3 py-2" value={day.title} onChange={(e) => updateDayField(dayIndex, 'title', e.target.value)} placeholder="Titre du jour" />
                  <input className="w-full rounded-lg border border-gray-300 px-3 py-2" value={day.route} onChange={(e) => updateDayField(dayIndex, 'route', e.target.value)} placeholder="Route (Tunis → Bizerte → ...)" />
                  <textarea className="min-h-[70px] w-full rounded-lg border border-gray-300 px-3 py-2" value={day.summary} onChange={(e) => updateDayField(dayIndex, 'summary', e.target.value)} placeholder="Resume" />
                  <input className="w-full rounded-lg border border-gray-300 px-3 py-2" value={day.highlight} onChange={(e) => updateDayField(dayIndex, 'highlight', e.target.value)} placeholder="Highlight" />
                  {needsAccommodation && (
                    <input className="w-full rounded-lg border border-gray-300 px-3 py-2" value={day.hotel} onChange={(e) => updateDayField(dayIndex, 'hotel', e.target.value)} placeholder="Hotel" />
                  )}
                  <input className="w-full rounded-lg border border-gray-300 px-3 py-2" value={day.mealsText} onChange={(e) => updateDayField(dayIndex, 'mealsText', e.target.value)} placeholder="Repas (separes par virgule: petit dejeuner, dejeuner)" />
                  <input className="w-full rounded-lg border border-gray-300 px-3 py-2" value={day.tagsText} onChange={(e) => updateDayField(dayIndex, 'tagsText', e.target.value)} placeholder="Tags (separes par virgule: culture, nature)" />

                  <div className="rounded-lg border border-gray-100 p-3 space-y-3">
                    <p className="text-xs font-semibold uppercase text-gray-500">Activites</p>
                    {(day.activities || []).map((activity, activityIndex) => (
                      <div key={activityIndex} className="grid gap-2 md:grid-cols-2 bg-gray-50 p-2 rounded-lg">
                        <input className="rounded border border-gray-300 px-2 py-1" value={activity.time} onChange={(e) => updateActivityField(dayIndex, activityIndex, 'time', e.target.value)} placeholder="08:00" />
                        <select className="rounded border border-gray-300 px-2 py-1 bg-white text-sm" value={activity.type} onChange={(e) => updateActivityField(dayIndex, activityIndex, 'type', e.target.value)}>
                          <option value="">Type d'activité</option>
                          <option value="transport">Transport</option>
                          <option value="visite">Visite / Monument</option>
                          <option value="repas">Repas</option>
                          <option value="balade">Balade / Promenade</option>
                          <option value="photo">Photo</option>
                          <option value="plage">Plage / Mer</option>
                          <option value="départ">Départ</option>
                          <option value="retour">Retour</option>
                          <option value="libre">Temps libre</option>
                        </select>
                        <input className="rounded border border-gray-300 px-2 py-1 md:col-span-2" value={activity.title} onChange={(e) => updateActivityField(dayIndex, activityIndex, 'title', e.target.value)} placeholder="Titre activite" />
                        <input className="rounded border border-gray-300 px-2 py-1 md:col-span-2" value={activity.location} onChange={(e) => updateActivityField(dayIndex, activityIndex, 'location', e.target.value)} placeholder="Location" />
                        <textarea className="rounded border border-gray-300 px-2 py-1 md:col-span-2 min-h-[56px]" value={activity.description} onChange={(e) => updateActivityField(dayIndex, activityIndex, 'description', e.target.value)} placeholder="Description" />
                        <button type="button" onClick={() => removeActivity(dayIndex, activityIndex)} className="text-xs text-red-600 font-medium">Supprimer activite</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addActivity(dayIndex)} className="text-xs text-blue-600 font-medium">+ Ajouter activite</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? <Icon icon="mdi:loading" className="h-4 w-4 animate-spin" /> : <Icon icon="mdi:content-save" className="h-4 w-4" />}
              {submitting ? 'Enregistrement...' : editingId ? 'Mettre a jour le programme' : 'Creer le programme'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {editingId ? 'Annuler la modification' : 'Reinitialiser'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default LocalProgramAdminPage;
