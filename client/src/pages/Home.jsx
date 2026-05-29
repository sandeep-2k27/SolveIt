import { useEffect, useState } from "react";

import API from "../services/api";
import { Link } from "react-router-dom";

import Loader from "../components/Loader";

import {
    FaSearch,
    FaFire,
    FaCheckCircle
} from "react-icons/fa";

const Home = () => {

    const [problems, setProblems] = useState([]);
    const [filteredProblems, setFilteredProblems] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [status, setStatus] = useState("All");

    useEffect(() => {
        fetchProblems();
    }, []);

    useEffect(() => {
        filterProblems();
    }, [search, category, status, problems]);

    const fetchProblems = async () => {
        try {
            const { data } = await API.get("/problems");

            setProblems(data);
            setFilteredProblems(data);

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const filterProblems = () => {

        let updated = [...problems];

        // SEARCH
        if (search) {
            updated = updated.filter((p) =>
                (p.title || "")
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
        }

        // CATEGORY
        if (category !== "All") {
            updated = updated.filter((p) =>
                (p.category || "").toLowerCase() === category.toLowerCase()
            );
        }

        // STATUS
        if (status === "Solved") {
            updated = updated.filter((p) => p.solved);
        }

        if (status === "Unsolved") {
            updated = updated.filter((p) => !p.solved);
        }

        setFilteredProblems(updated);
    };

    const categories = [
        "All",
        "React",
        "MERN",
        "Node",
        "MongoDB",
        "DSA",
        "JavaScript",
        "Express"
    ];

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="min-h-screen bg-gray-100">

            <div className="max-w-7xl mx-auto p-6">

                {/* HERO SECTION */}
{/* HERO SECTION */}
<div className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white relative overflow-hidden py-16">

    {/* background big text */}
    <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10 text-[160px] font-black whitespace-nowrap pointer-events-none select-none">
        SolveIt
    </div>

    {/* content container */}
    <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-5xl font-extrabold leading-tight">
            Solve Problems Together
        </h1>

        <p className="mt-5 text-lg text-white/90 max-w-2xl">
            A community where developers help each other solve coding problems and earn karma rewards.
        </p>

        {/* stats */}
        <div className="flex gap-6 mt-8 flex-wrap">

            <div className="bg-white/20 px-6 py-4 rounded-2xl">
                <h2 className="text-3xl font-bold">
                    {problems.length}
                </h2>
                <p>Total Problems</p>
            </div>

            <div className="bg-white/20 px-6 py-4 rounded-2xl">
                <h2 className="text-3xl font-bold">
                    {problems.filter(p => p.solved).length}
                </h2>
                <p>Solved Problems</p>
            </div>

        </div>

    </div>
</div>
                {/* FILTER SECTION */}
                <div className="bg-white rounded-3xl shadow-lg p-6 mt-10">

                    <div className="grid md:grid-cols-4 gap-4">

                        {/* SEARCH */}
<div className="relative md:col-span-2">
    
    {/* show icon only when input is empty */}
    {search === "" && (
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-black" />
    )}

    <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search problems..."
        className="w-full border py-4 pl-4 pr-4 rounded-2xl outline-none"
    />
</div>

                        {/* CATEGORY */}
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="border p-4 rounded-2xl"
                        >
                            {categories.map((c, i) => (
                                <option key={i} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>

                        {/* STATUS */}
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="border p-4 rounded-2xl"
                        >
                            <option value="All">All Status</option>
                            <option value="Solved">Solved</option>
                            <option value="Unsolved">Unsolved</option>
                        </select>

                    </div>
                </div>

                {/* NO DATA */}
                {filteredProblems.length === 0 ? (
                    <div className="bg-white p-10 mt-10 text-center rounded-3xl shadow">
                        <h1 className="text-3xl font-bold">
                            No Problems Found
                        </h1>
                    </div>
                ) : (

                    /* PROBLEM LIST */
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 mt-10">

                        {filteredProblems.map((problem) => (

                            <div
                                key={problem._id}
                                className="bg-white p-6 rounded-3xl shadow hover:-translate-y-1 transition"
                            >

                                {/* CATEGORY + STATUS */}
                                <div className="flex justify-between">

                                    <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm">
                                        {problem.category}
                                    </span>

                                    <span className={`px-3 py-1 rounded-full text-white text-sm ${
                                        problem.solved ? "bg-green-500" : "bg-red-500"
                                    }`}>
                                        {problem.solved ? "Solved" : "Unsolved"}
                                    </span>

                                </div>

                                {/* TITLE */}
                                <h2 className="text-2xl font-bold mt-5">
                                    {problem.title}
                                </h2>

                                {/* DESCRIPTION SAFE */}
                                <p className="mt-3 text-gray-600">
                                    {(problem.description || "").length > 120
                                        ? problem.description.slice(0, 120) + "..."
                                        : problem.description}
                                </p>

                                {/* USER */}
                                <div className="flex justify-between mt-6">

                                    <div>
                                        <p className="text-sm text-gray-500">Posted By</p>
                                        <h3 className="font-bold text-indigo-600">
                                            {problem.createdBy?.name}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-2 text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                                        <FaFire />
                                        <span>{problem.createdBy?.karma}</span>
                                    </div>

                                </div>

                                {/* STATUS BADGE */}
                                {problem.solved && (
                                    <div className="flex items-center gap-2 mt-4 text-green-600">
                                        <FaCheckCircle />
                                        Solved
                                    </div>
                                )}

                                {/* BUTTON */}
                                <Link to={`/problem/${problem._id}`}>
                                    <button className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-2xl">
                                        View Details
                                    </button>
                                </Link>

                            </div>

                        ))}

                    </div>
                )}

            </div>

        </div>
    );
};

export default Home;