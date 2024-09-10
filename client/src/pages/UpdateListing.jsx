import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";

const USD_TO_INR = 82;

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    didcountPrice: 0,
    parking: false,
    furnished: false,
    startDate: "",
    endDate: "",
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, [params.listingId]);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 MB max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [id]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add your new condition here
    if (formData.regularPrice <= 0) {
      setError("Regular price must be greater than zero");
      return; // Exit the function if the condition is not satisfied
    }

    if (formData.imageUrls.length < 1) {
      setError("You must upload at least one image");
      return; // Exit the function if no images are uploaded
    }

    try {
      setLoading(true);
      setError(false);

      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
      } else {
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7 bg-gray-100 p-4 shadow-lg rounded-xl">
        Update Listing
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4 bg-gray-100 p-4 shadow-lg rounded-xl"
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name || ""}
          />
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="description"
            required
            onChange={handleChange}
            value={formData.description || ""}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="address"
            required
            onChange={handleChange}
            value={formData.address || ""}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking || false}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished || false}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                value={formData.bedrooms || 1}
              />
              <p>Beds</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                value={formData.bathrooms || 1}
              />
              <p>Baths</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                required
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                value={formData.regularPrice || 0}
              />
              <p>Regular Price</p>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  required
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                  value={formData.startDate || ""}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  required
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                  value={formData.endDate || ""}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
              {formData.imageUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative w-32 h-32 bg-gray-300 rounded-lg"
                >
                  <img
                    src={url}
                    alt={`Listing Image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            {imageUploadError && (
              <p className="text-red-500 text-sm">{imageUploadError}</p>
            )}
            <input
              type="file"
              multiple
              onChange={(e) => setFiles([...e.target.files])}
              className="p-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleImageSubmit}
              disabled={uploading}
              className="p-2 bg-blue-500 text-white rounded-lg"
            >
              {uploading ? "Uploading..." : "Upload Images"}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="p-3 w-full bg-green-500 text-white rounded-lg"
            >
              {loading ? "Updating..." : "Update Listing"}
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
      </form>
    </main>
  );
}
