import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const [showNewFeature, setShowNewFeature] = useState(false);
    useEffect(() => {
        const visited = sessionStorage.getItem("visitedHome");
        if (!visited) {
        setShowNewFeature(true); 
        sessionStorage.setItem("visitedHome", "true");
        }
      }, []);
    return (
        <>
        <div className="landing-page bg-black text-white min-h-screen">
        
        {showNewFeature && <div className="feature-card p-1 bg-gray-800 rounded-lg shadow-lg border border-purple-500 relative animate-pulse">
            <span className="absolute top-2 right-2 text-xs bg-yellow-400 text-black px-2 py-0.5 rounded font-semibold">
                NEW
            </span>
            <h3 className="text-xl font-bold text-purple-400">Real-Time Speech Highlighting</h3>
            <p className="text-gray-300 mt-2">
                Follow along as the article is read aloud with live word-by-word highlighting.
            </p>
        </div>}
        
            {/* Hero Section */}
            <section className="hero py-16 text-center">
                <div className="hero-content max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold text-purple-500">Chronicle AI : Online article sharing platform</h1>
                <p className="text-lg mt-4 text-gray-300">
                    Create, manage, and scale your articles effortlessly with the power of AI.
                </p>
                <button className="mt-8 px-6 py-3 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-700" onClick={() => navigate("/all-posts")}>
                    Get Started
                </button>
                </div>
            </section>

            {/* Features Section */}
            <section className="features py-16">
                <h2 className="text-3xl font-bold text-center text-purple-500">Features</h2>
                <div className="feature-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 max-w-6xl mx-auto">
                <div className="feature-card p-6 bg-gray-800 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-purple-400">View Real-Time Posts</h3>
                    <p className="text-gray-300 mt-2">
                    Instantly browse and interact with articles from other users in real-time.
                    </p>
                </div>
                <div className="feature-card p-6 bg-gray-800 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-purple-400">Like & Comment</h3>
                    <p className="text-gray-300 mt-2">
                    Engage with the community by liking and commenting on articles effortlessly.
                    </p>
                </div>
                <div className="feature-card p-6 bg-gray-800 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-purple-400">Bookmark articles</h3>
                    <p className="text-gray-300 mt-2">
                    Save your favorite articles for easy access anytime.
                    </p>
                </div>
                <div className="feature-card p-6 bg-gray-800 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-purple-400">Advanced Post Filtering</h3>
                    <p className="text-gray-300 mt-2">
                    Find the content you need with advanced filtering options based on categories, tags, or popularity.
                    </p>
                </div>
                <div className="feature-card p-6 bg-gray-800 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-purple-400">AI-Powered Post Generation</h3>
                    <p className="text-gray-300 mt-2">
                    Use AI to generate high-quality articles and summaries, saving you time and effort.
                    </p>
                </div>
                <div className="feature-card p-6 bg-gray-800 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-purple-400">AI-Driven Summarization</h3>
                    <p className="text-gray-300 mt-2">
                    Summarize lengthy content into concise, impactful points with AI assistance.
                    </p>
                </div>
                </div>
            </section>

            {/* Pain Points Section */}
            <section className="pain-points py-16 bg-gray-900">
                <h2 className="text-3xl font-bold text-center text-purple-500">Why Choose Chronicle AI?</h2>
                <div className="pain-point-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 max-w-6xl mx-auto">
                <div className="pain-point-card p-6 bg-gray-800 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-purple-400">Seamless Interaction</h3>
                    <p className="text-gray-300 mt-2">
                    No more delays or frustrations—enjoy instant interactions with articles and users.
                    </p>
                </div>
                <div className="pain-point-card p-6 bg-gray-800 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-purple-400">Effortless Management</h3>
                    <p className="text-gray-300 mt-2">
                    Simplify managing your articles and focus on creating great content.
                    </p>
                </div>
                <div className="pain-point-card p-6 bg-gray-800 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-purple-400">Customizable Experience</h3>
                    <p className="text-gray-300 mt-2">
                    Tailor your blog experience with features designed to meet your needs.
                    </p>
                </div>
                </div>
            </section>

            {/* How AI Helps Section */}
            <section className="ai-helps py-16">
                <h2 className="text-3xl font-bold text-center text-purple-500">What Makes Chronicle AI Special</h2>
                <div className="ai-benefits grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 max-w-6xl mx-auto">
                <div className="ai-benefit p-6 bg-gray-800 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-purple-400">Real-Time Updates</h3>
                    <p className="text-gray-300 mt-2">
                    Experience the latest articles and updates instantly, without delays.
                    </p>
                </div>
                <div className="ai-benefit p-6 bg-gray-800 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-purple-400">Community Engagement</h3>
                    <p className="text-gray-300 mt-2">
                    Build a vibrant community through seamless interactions and engagement tools.
                    </p>
                </div>
                <div className="ai-benefit p-6 bg-gray-800 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-purple-400">Smart Filters</h3>
                    <p className="text-gray-300 mt-2">
                    Discover content that matters to you with powerful filtering and sorting options.
                    </p>
                </div>
                <div className="ai-benefit p-6 bg-gray-800 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-purple-400">Cant Read long articles ?</h3>
                    <p className="text-gray-300 mt-2">
                    Enabling voice assigtants to read articles aloud, making it easier to consume content on the go.
                    </p>
                </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="py-8 bg-gray-900 text-center">
                <p className="text-gray-400">
                Explore the source code on our <a href="https://github.com/your-repo" className="text-purple-500 underline">GitHub repository</a>.
                </p>
            </footer>
        </div>
        </>
    );
}

export default Home;
