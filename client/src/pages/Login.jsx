import { useState, useContext } from "react";

import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import API from "../services/api";

import toast from "react-hot-toast";

const Login = () => {

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
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

            const { data } =
                await API.post("/auth/login", {
                    email: formData.email.trim(),
                    password: formData.password
                });

            login(data.user, data.token);

            toast.success("Login Successful");

            navigate("/");

        } catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Something went wrong"
            );

        } finally {
            setLoading(false);
        }

    };

    return (

        <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">

            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-8"
            >

                <h1 className="text-4xl font-bold text-center text-indigo-600">
                    Welcome Back
                </h1>

                <p className="text-center text-gray-500 mt-3">
                    Login to continue solving problems
                </p>

                {/* EMAIL */}
                <div className="mt-8">

                    <label className="font-semibold text-gray-700">
                        Email
                    </label>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 p-4 rounded-xl mt-2 outline-none focus:border-indigo-500"
                    />

                </div>

                {/* PASSWORD */}
                <div className="mt-5">

                    <label className="font-semibold text-gray-700">
                        Password
                    </label>

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 p-4 rounded-xl mt-2 outline-none focus:border-indigo-500"
                    />

                </div>

                {/* BUTTON */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-8 bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
                >
                    {loading ? "Logging In..." : "Login"}
                </button>

                {/* LINK */}
                <p className="text-center mt-6 text-gray-600">
                    Don't have an account?
                    <Link
                        to="/register"
                        className="text-indigo-600 font-semibold ml-2"
                    >
                        Register
                    </Link>
                </p>

            </form>

        </div>

    );

};

export default Login;