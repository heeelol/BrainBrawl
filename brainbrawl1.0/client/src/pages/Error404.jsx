import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <section className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 flex items-center justify-center">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">404</h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-white md:text-4xl">Something's missing.</p>
                    <p className="mb-8 text-lg font-light text-gray-400">Sorry, we can't find that page. You'll find lots to explore on the home page.</p>
                    <Link 
                        to="/"
                        className="inline-flex items-center px-6 py-3 text-lg font-medium text-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 transition-all duration-300 hover:scale-105"
                    >
                       &larr; Return Home
                    </Link>
                </div>   
            </div>
        </section>
    );
}