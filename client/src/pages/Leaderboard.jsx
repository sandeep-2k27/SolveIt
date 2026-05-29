import { useEffect, useState } from "react";
import API from "../services/api";
import Loader from "../components/Loader";

const Leaderboard = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {

        try {

            const response = await API.get("/users");

            setUsers(response.data);

        } catch (error) {

            console.log("Leaderboard Error:", error);

        } finally {

            setLoading(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10">

            <div className="max-w-5xl mx-auto px-4">

                {/* Hero Section */}

                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-10 text-center text-white shadow-lg">

                    <h1 className="text-5xl font-extrabold">
                        Leaderboard
                    </h1>

                    <p className="mt-3 text-lg text-indigo-100">
                        Top users with highest karma points
                    </p>

                </div>

                {/* Users */}

                <div className="bg-white rounded-3xl shadow-lg mt-10 overflow-hidden">

                    {users.length === 0 ? (

                        <div className="p-10 text-center text-gray-500 text-lg">
                            No users found
                        </div>

                    ) : (

                        users.map((user, index) => (

                            <div
                                key={user._id}
                                className="flex items-center justify-between p-6 border-b hover:bg-gray-50 transition"
                            >

                                <div className="flex items-center gap-5">

                                    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                                        {index + 1}
                                    </div>

                                    <div>

                                        <h2 className="text-xl font-bold text-gray-800">
                                            {user.name}
                                        </h2>

                                        <p className="text-sm text-gray-500">
                                            {user.email}
                                        </p>

                                    </div>

                                </div>

                                <div className="bg-purple-100 text-purple-700 px-5 py-2 rounded-full font-bold">
                                    {user.karma || 0} Karma
                                </div>

                            </div>

                        ))
                    )}

                </div>

            </div>

        </div>
    );
};

export default Leaderboard;