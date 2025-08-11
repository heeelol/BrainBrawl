import {AnimatedBackground} from "../components/AnimatedBackground.jsx";

export function ContactUs() {
    return (
        <>
            <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900">
                <AnimatedBackground />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="bg-gray-800 bg-opacity-90 rounded-lg p-8 shadow-lg max-w-md w-full text-center">
                        <h1 className="text-5xl font-bold text-white mb-4">Contact Us</h1>
                        <p className="text-gray-300 mb-6">
                            Reach out to us anytime through our email or social media channels. We are here to help you with any questions, feedback, or support you may need!
                        </p>
                        <div className="mb-4">
                            <span className="font-semibold text-indigo-400">Email:</span>
                            <a
                                href="mailto:support@brainbrawl.com"
                                className="text-indigo-300 ml-2 underline"
                            >
                                support@brainbrawl.com
                            </a>
                        </div>
                        <div className="space-y-2">
                            <div>
                                <span className="font-semibold text-indigo-400">Twitter:</span>
                                <a
                                    href="https://twitter.com/brainbrawl"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-300 ml-2 underline"
                                >
                                    @brainbrawl
                                </a>
                            </div>
                            <div>
                                <span className="font-semibold text-indigo-400">Instagram:</span>
                                <a
                                    href="https://instagram.com/brainbrawl"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-300 ml-2 underline"
                                >
                                    @brainbrawl
                                </a>
                            </div>
                            <div>
                                <span className="font-semibold text-indigo-400">Facebook:</span>
                                <a
                                    href="https://facebook.com/brainbrawl"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-300 ml-2 underline"
                                >
                                    BrainBrawl
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}