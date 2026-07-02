import { useEffect, useState } from "react";
import { getArticles, getDashboardStats } from "../services/api";

export default function AdminDashboard() {

    const [stats, setStats] = useState({
        users: 0,
        articles: 0,
        feedback: 0
    });

    const [articles, setArticles] = useState([]);

    useEffect(() => {

        async function loadData() {

            const dashboard = await getDashboardStats();

            if (dashboard.success) {
                setStats(dashboard);
            }

            const articleData = await getArticles();

            if (articleData.success) {
                setArticles(articleData.articles);
            }

        }

        loadData();

    }, []);

    return (
        <div className="max-w-7xl mx-auto p-8">

            <h1 className="text-4xl font-bold mb-8">
                Admin Dashboard
            </h1>

            {/* Statistics */}

            <div className="grid grid-cols-3 gap-6 mb-10">

                <div className="bg-green-600 text-white p-6 rounded-lg">
                    <h2 className="text-xl font-bold">Users</h2>
                    <p className="text-3xl">{stats.users}</p>
                </div>

                <div className="bg-blue-600 text-white p-6 rounded-lg">
                    <h2 className="text-xl font-bold">Articles</h2>
                    <p className="text-3xl">{stats.articles}</p>
                </div>

                <div className="bg-purple-600 text-white p-6 rounded-lg">
                    <h2 className="text-xl font-bold">Feedback</h2>
                    <p className="text-3xl">{stats.feedback}</p>
                </div>

            </div>

            {/* Articles Table */}

            <table className="w-full border-collapse border">

                <thead>

                    <tr className="bg-green-700 text-white">

                        <th className="p-3">ID</th>
                        <th className="p-3">Title</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Author</th>

                    </tr>

                </thead>

                <tbody>

                    {articles.map((article: any) => (

                        <tr key={article.id}>

                            <td className="border p-3">{article.id}</td>
                            <td className="border p-3">{article.title}</td>
                            <td className="border p-3">{article.category}</td>
                            <td className="border p-3">{article.author}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );

}
<Route path="/admin" element={<AdminDashboard />} />