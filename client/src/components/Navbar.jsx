import { Link, useNavigate } from "react-router-dom";

import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {

    const { user, logout } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleLogout = () => {

        logout();

        navigate("/login");

    };

    return (

        <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg sticky top-0 z-50">

            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                <Link to="/">

                    <h1 className="text-4xl font-extrabold text-white">

                        SolveIt

                    </h1>

                </Link>

                <div className="flex items-center gap-5 text-white">

                    <Link
                        to="/"
                        className="hover:text-gray-200 transition"
                    >
                        Home
                    </Link>

                    {
                        user && (
                            <Link
                                to="/leaderboard"
                                className="hover:text-gray-200 transition"
                            >
                                Leaderboard
                            </Link>
                        )
                    }

                    {
                        user && (

                            <>
                                <Link
                                    to="/create"
                                    className="hover:text-gray-200 transition"
                                >
                                    Post Problem
                                </Link>

                                <Link
                                    to="/profile"
                                    className="hover:text-gray-200 transition"
                                >
                                    Profile
                                </Link>
                            </>

                        )
                    }

                    {
                        user ? (

                            <div className="flex items-center gap-4">

                                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">

                                    <FaUserCircle className="text-2xl" />

                                    <div>

                                        <p className="text-sm font-semibold">

                                            {user.name}

                                        </p>

                                        <p className="text-xs">

                                            Karma:
                                            {" "}
                                            {user.karma}

                                        </p>

                                    </div>

                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="bg-white text-indigo-600 px-5 py-2 rounded-xl font-semibold hover:bg-gray-200"
                                >

                                    Logout

                                </button>

                            </div>

                        ) : (

                            <div className="flex gap-4">

                                <Link to="/login">

                                    <button className="bg-white text-indigo-600 px-5 py-2 rounded-xl font-semibold hover:bg-gray-200">

                                        Login

                                    </button>

                                </Link>

                                <Link to="/register">

                                    <button className="bg-black text-white px-5 py-2 rounded-xl font-semibold hover:bg-gray-800">

                                        Register

                                    </button>

                                </Link>

                            </div>

                        )
                    }

                </div>

            </div>

        </nav>

    )

}

export default Navbar;