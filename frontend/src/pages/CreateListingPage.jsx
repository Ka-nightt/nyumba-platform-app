import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { propertyApi } from "../api";
import { COUNTIES, PROPERTY_TYPES } from "../utils";
import toast from "react-hot-toast";

const schema = yup.object({
  title: yup.string().required("Title required"),
  description: yup.string().required("Description required"),
  property_type: yup.string().required(),
  listing_type: yup.string().required(),
  price: yup.number().positive().required("Price required"),
  bedrooms: yup.number().min(0).required(),
  bathrooms: yup.number().min(0).required(),
  address: yup.string().required("Address required"),
  city: yup.string().required("City required"),
  county: yup.string().required("County required"),
});

export default function CreateListingPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      bedrooms: 1,
      bathrooms: 1,
      listing_type: "rent",
      property_type: "apartment",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await propertyApi.create(data);
      toast.success("Listing created! It will be live after verification.");
      navigate(`/properties/${res.data.id}`);
    } catch (err) {
      const msg = Object.values(err.response?.data || {})
        .flat()
        .join(" ");
      toast.error(msg || "Failed to create listing");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Listing</h1>
      <div className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Title *
            </label>
            <input
              {...register("title")}
              className="input"
              placeholder="e.g. Modern 2BR Apartment in Westlands"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              {...register("description")}
              className="input resize-none"
              rows={4}
              placeholder="Describe the property..."
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select {...register("property_type")} className="input">
                {PROPERTY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Listing Type
              </label>
              <select {...register("listing_type")} className="input">
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
                <option value="bnb">BnB / Per Night</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (KES) *
              </label>
              <input
                {...register("price")}
                type="number"
                className="input"
                placeholder="25000"
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms
              </label>
              <input
                {...register("bedrooms")}
                type="number"
                min="0"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bathrooms
              </label>
              <input
                {...register("bathrooms")}
                type="number"
                min="0"
                className="input"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
            </label>
            <input
              {...register("address")}
              className="input"
              placeholder="e.g. Westlands Road, Nairobi"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">
                {errors.address.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City / Area *
              </label>
              <input
                {...register("city")}
                className="input"
                placeholder="e.g. Westlands"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                County *
              </label>
              <select {...register("county")} className="input">
                <option value="">Select county</option>
                {COUNTIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude (optional)
              </label>
              <input
                {...register("latitude")}
                type="number"
                step="any"
                className="input"
                placeholder="-1.286389"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude (optional)
              </label>
              <input
                {...register("longitude")}
                type="number"
                step="any"
                className="input"
                placeholder="36.817223"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                ["is_furnished", "Furnished"],
                ["has_parking", "Parking"],
                ["has_wifi", "WiFi"],
                ["has_gym", "Gym"],
                ["has_pool", "Swimming Pool"],
                ["has_security", "Security"],
              ].map(([k, l]) => (
                <label
                  key={k}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <input {...register(k)} type="checkbox" /> {l}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Virtual Tour URL (optional)
            </label>
            <input
              {...register("virtual_tour_url")}
              className="input"
              placeholder="https://my.matterport.com/..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1"
            >
              {isSubmitting ? "Creating..." : "Submit Listing"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
