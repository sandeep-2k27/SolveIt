import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const ProblemDetails = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [problem, setProblem] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [commentLoading, setCommentLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [problemRes, commentRes] = await Promise.all([
                API.get(`/problems/${id}`),
                API.get(`/comments/${id}`)
            ]);

            setProblem(problemRes.data);
            setComments(commentRes.data);

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();

        if (!commentText.trim() || commentLoading) return;

        try {
            setCommentLoading(true);

            await API.post("/comments/create", {
                text: commentText.trim(),
                problemId: id
            });

            toast.success("Comment Added");
            setCommentText("");
            fetchData();

        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setCommentLoading(false);
        }
    };

    const deleteProblem = async () => {
        try {
            await API.delete(`/problems/${id}`);
            toast.success("Problem Deleted");
            navigate("/");
        } catch (err) {
            toast.error("Delete Failed");
        }
    };

    // 🔒 ONLY OWNER CAN MARK SOLVED
    const markSolved = async () => {
        try {
            if (!user || user._id !== problem?.createdBy?._id) {
                return toast.error("Only owner can mark solved");
            }

            await API.put(`/problems/solve/${id}`);

            toast.success("Marked as Solved");
            fetchData();

        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        }
    };

    if (loading || !problem) return <Loader />;

    const isOwner = user && user._id === problem?.createdBy?._id;

    return (
        <div className="min-h-screen bg-gray-100">

            <div className="max-w-5xl mx-auto p-6">

                <div className="bg-white rounded-3xl shadow-xl p-8 mt-10">

                    <div className="flex justify-between items-center flex-wrap gap-5">

                        <h1 className="text-4xl font-bold text-indigo-600">
                            {problem.title}
                        </h1>

                        <span className={`px-5 py-2 rounded-full text-white ${
                            problem.solved ? "bg-green-500" : "bg-red-500"
                        }`}>
                            {problem.solved ? "Solved" : "Unsolved"}
                        </span>

                    </div>

                    <p className="mt-6 text-lg text-gray-700 leading-8">
                        {problem.description}
                    </p>

                    <div className="mt-6 flex gap-4 flex-wrap">
                        <span className="bg-indigo-100 text-indigo-600 px-5 py-2 rounded-full">
                            {problem.category}
                        </span>

                        <span className="bg-purple-100 text-purple-600 px-5 py-2 rounded-full">
                            Karma: {problem.createdBy?.karma}
                        </span>
                    </div>

                    <h2 className="mt-6 text-lg font-semibold text-gray-700">
                        Posted By: {problem.createdBy?.name}
                    </h2>

                    {/* ACTIONS */}
                    <div className="flex gap-4 mt-8 flex-wrap">

                        {/* ONLY OWNER CAN MARK SOLVED */}
                        {!problem.solved && isOwner && (
                            <button
                                onClick={markSolved}
                                className="bg-green-500 text-white px-6 py-3 rounded-xl"
                            >
                                Mark Solved
                            </button>
                        )}

                        {/* OWNER ONLY EDIT/DELETE */}
                        {isOwner && (
                            <>
                                <Link to={`/edit/${problem._id}`}>
                                    <button className="bg-yellow-500 text-white px-6 py-3 rounded-xl">
                                        Edit
                                    </button>
                                </Link>

                                <button
                                    onClick={deleteProblem}
                                    className="bg-red-500 text-white px-6 py-3 rounded-xl"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* COMMENTS */}
                <div className="bg-white rounded-3xl shadow-xl p-8 mt-10">

                    <h1 className="text-3xl font-bold text-gray-700">
                        Comments
                    </h1>

                    {user && (
                        <form onSubmit={handleComment} className="mt-6">

                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write your comment..."
                                className="w-full border p-4 rounded-2xl h-32"
                                required
                            />

                            <button
                                disabled={commentLoading}
                                className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-xl disabled:opacity-50"
                            >
                                {commentLoading ? "Posting..." : "Add Comment"}
                            </button>

                        </form>
                    )}

                    <div className="mt-8 space-y-5">

                        {comments.length === 0 ? (
                            <p className="text-gray-500 text-center">
                                No comments yet
                            </p>
                        ) : (
                            comments.map((c) => (
                                <div key={c._id} className="bg-gray-100 p-5 rounded-2xl">

                                    <div className="flex justify-between">
                                        <h2 className="font-bold text-indigo-600">
                                            {c.user?.name}
                                        </h2>

                                        <span className="text-sm text-gray-500">
                                            {new Date(c.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <p className="mt-3 text-gray-700">
                                        {c.text}
                                    </p>

                                </div>
                            ))
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProblemDetails;