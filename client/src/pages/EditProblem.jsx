import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import API from "../services/api";

import Loader from "../components/Loader";

import toast from "react-hot-toast";

const EditProblem = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: ""
    });

    useEffect(() => {
        fetchProblem();
    }, [id]);

    const fetchProblem = async () => {

        try {

            const { data } = await API.get(`/problems/${id}`);

            if (!data) {
                toast.error("Problem not found");
                return;
            }

            setFormData({
                title: data.title || "",
                description: data.description || "",
                category: data.category || ""
            });

        } catch (err) {
            console.log(err);
            toast.error("Failed to load problem");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            setUpdating(true);

            const payload = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                category: formData.category.trim()
            };

            await API.put(`/problems/${id}`, payload);

            toast.success("Problem Updated");

            navigate(`/problem/${id}`);

        } catch (err) {
            toast.error(
                err.response?.data?.message || "Something went wrong"
            );
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="min-h-screen bg-gray-100">

            <div className="max-w-4xl mx-auto p-6">

                <div className="bg-white rounded-[35px] shadow-2xl p-10 mt-10">

                    {/* HEADER */}
                    <div className="text-center">
                        <h1 className="text-5xl font-extrabold text-indigo-600">
                            Edit Problem
                        </h1>
                        <p className="text-gray-500 mt-4 text-lg">
                            Update your problem details properly
                        </p>
                    </div>

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="mt-10">

                        {/* TITLE */}
                        <div>
                            <label className="text-lg font-semibold text-gray-700">
                                Problem Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full mt-3 border border-gray-300 rounded-2xl p-5 outline-none focus:border-indigo-500"
                            />
                        </div>

                        {/* CATEGORY */}
                        <div className="mt-8">
                            <label className="text-lg font-semibold text-gray-700">
                                Category
                            </label>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full mt-3 border border-gray-300 rounded-2xl p-5 outline-none focus:border-indigo-500"
                            >
                                <option value="">Select Category</option>
                                <option value="React">React</option>
                                <option value="MERN">MERN</option>
                                <option value="Node">Node</option>
                                <option value="MongoDB">MongoDB</option>
                                <option value="JavaScript">JavaScript</option>
                                <option value="DSA">DSA</option>
                                <option value="Express">Express</option>
                            </select>
                        </div>

                        {/* DESCRIPTION */}
                        <div className="mt-8">
                            <label className="text-lg font-semibold text-gray-700">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                className="w-full mt-3 border border-gray-300 rounded-2xl p-5 h-56 resize-none outline-none focus:border-indigo-500"
                            />
                        </div>

                        {/* SUBMIT */}
                        <button
                            disabled={updating}
                            className="w-full mt-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 rounded-2xl font-bold text-lg hover:opacity-90 transition"
                        >
                            {updating ? "Updating..." : "Update Problem"}
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
};

export default EditProblem;