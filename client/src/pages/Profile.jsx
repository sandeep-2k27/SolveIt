import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

import {
    FaFire,
    FaCheckCircle,
    FaClock,
    FaUserEdit
} from "react-icons/fa";

const Profile = () => {

    const { user, loading: authLoading, refreshUser } = useContext(AuthContext);

    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔥 FETCH USER + PROBLEMS
    useEffect(() => {
        const loadData = async () => {
            try {
                if (user?._id) {

                    // refresh latest user (IMPORTANT FIX for karma)
                    if (refreshUser) {
                        await refreshUser();
                    }

                    const { data } = await API.get("/problems");

                    const filtered = data.filter(
                        (p) => p.createdBy?._id === user?._id
                    );

                    setProblems(filtered);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user?._id]);

    const solvedProblems = problems.filter(p => p.solved).length;
    const unsolvedProblems = problems.filter(p => !p.solved).length;

    if (loading || authLoading) {
        return <Loader />;
    }

    return (
        <div className="min-h-screen bg-gray-100">

            <div className="max-w-7xl mx-auto p-6">

                {/* PROFILE HEADER */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-[40px] p-10 text-white">

                    <div className="flex flex-col lg:flex-row justify-between gap-10">

                        <div>

                            <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center text-5xl font-bold">
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </div>

                            <h1 className="text-5xl font-extrabold mt-6">
                                {user?.name}
                            </h1>

                            <p className="text-lg mt-2 text-white/90">
                                {user?.email}
                            </p>

                            <button className="mt-6 bg-white text-indigo-600 px-6 py-3 rounded-2xl font-semibold flex items-center gap-2">
                                <FaUserEdit />
                                Edit Profile
                            </button>

                        </div>

                        {/* STATS */}
                        <div className="grid grid-cols-2 gap-5">

                            <div className="bg-white/20 p-6 rounded-3xl w-[200px]">
                                <FaFire className="text-3xl" />
                                <h1 className="text-4xl font-bold mt-4">
                                    {user?.karma}
                                </h1>
                                <p>Karma</p>
                            </div>

                            <div className="bg-white/20 p-6 rounded-3xl w-[200px]">
                                <FaCheckCircle className="text-3xl" />
                                <h1 className="text-4xl font-bold mt-4">
                                    {solvedProblems}
                                </h1>
                                <p>Solved</p>
                            </div>

                            <div className="bg-white/20 p-6 rounded-3xl w-[200px]">
                                <FaClock className="text-3xl" />
                                <h1 className="text-4xl font-bold mt-4">
                                    {unsolvedProblems}
                                </h1>
                                <p>Pending</p>
                            </div>

                            <div className="bg-white/20 p-6 rounded-3xl w-[200px]">
                                <FaFire className="text-3xl" />
                                <h1 className="text-4xl font-bold mt-4">
                                    {problems.length}
                                </h1>
                                <p>Posts</p>
                            </div>

                        </div>

                    </div>
                </div>

                {/* POSTS */}
                <div className="mt-12">

                    <h1 className="text-3xl font-bold">
                        Your Problems
                    </h1>

                    {problems.length === 0 ? (
                        <div className="bg-white p-10 mt-8 text-center rounded-3xl">
                            <h1 className="text-3xl font-bold">
                                No Problems Posted
                            </h1>

                            <Link to="/create">
                                <button className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-xl">
                                    Post Problem
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 mt-10">

                            {problems.map((problem) => (
                                <div
                                    key={problem._id}
                                    className="bg-white p-6 rounded-3xl shadow"
                                >

                                    <div className="flex justify-between">

                                        <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
                                            {problem.category}
                                        </span>

                                        <span className={`px-3 py-1 rounded-full text-white ${
                                            problem.solved ? "bg-green-500" : "bg-red-500"
                                        }`}>
                                            {problem.solved ? "Solved" : "Unsolved"}
                                        </span>

                                    </div>

                                    <h2 className="text-2xl font-bold mt-4">
                                        {problem.title}
                                    </h2>

                                    <p className="mt-3 text-gray-600">
                                        {(problem.description || "").slice(0,120)}
                                    </p>

                                    {problem.solved && (
                                        <div className="mt-4 text-green-600 flex items-center gap-2">
                                            <FaCheckCircle />
                                            Solved
                                        </div>
                                    )}

                                    <Link to={`/problem/${problem._id}`}>
                                        <button className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl">
                                            View Details
                                        </button>
                                    </Link>

                                </div>
                            ))}

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
};

export default Profile;