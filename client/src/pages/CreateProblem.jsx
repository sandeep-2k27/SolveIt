import { useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../services/api";

import toast from "react-hot-toast";

const CreateProblem = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            setLoading(true);

            const payload = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                category: formData.category.trim()
            };

            await API.post("/problems/create", payload);

            toast.success("Problem Posted Successfully");

            // reset form
            setFormData({
                title: "",
                description: "",
                category: ""
            });

            navigate("/");

        } catch (err) {
            toast.error(
                err.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">

            <div className="flex justify-center items-center py-20 px-4">

                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-2xl rounded-3xl w-full max-w-2xl p-8"
                >

                    <h1 className="text-5xl font-bold text-center text-indigo-600">
                        Post Your Problem
                    </h1>

                    <p className="text-center text-gray-500 mt-4">
                        Explain your issue clearly to get better help
                    </p>

                    {/* TITLE */}
                    <div className="mt-8">
                        <label className="font-semibold text-gray-700">
                            Problem Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            placeholder="Enter title"
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 p-4 rounded-xl mt-2 outline-none focus:border-indigo-500"
                        />
                    </div>

                    {/* CATEGORY */}
                    <div className="mt-5">
                        <label className="font-semibold text-gray-700">
                            Category
                        </label>

                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            placeholder="MERN, DSA, React..."
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 p-4 rounded-xl mt-2 outline-none focus:border-indigo-500"
                        />
                    </div>

                    {/* DESCRIPTION */}
                    <div className="mt-5">
                        <label className="font-semibold text-gray-700">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            placeholder="Describe your problem..."
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 p-4 rounded-xl mt-2 h-52 resize-none outline-none focus:border-indigo-500"
                        />
                    </div>

                    {/* SUBMIT */}
                    <button
                        disabled={loading}
                        className="w-full mt-8 bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition"
                    >
                        {loading ? "Posting..." : "Post Problem"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default CreateProblem;