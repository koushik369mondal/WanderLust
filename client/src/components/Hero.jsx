import { FaShieldAlt, FaAward, FaHeadset } from 'react-icons/fa';

const Hero = () => {
    return (
        <div className="relative min-h-150 overflow-hidden bg-linear-to-br from-blue-900 via-blue-700 to-cyan-500">
            {/* Abstract Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Hero Content */}
            <div className="relative container mx-auto px-4 pt-24 pb-32">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Main Headline */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in">
                        Every check-in is a<br />
                        <span className="bg-linear-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                            new beginning
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-blue-100 mb-12 animate-slide-up">
                        Discover your perfect destination with confidence
                    </p>

                    {/* Trust Indicators */}
                    <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-white">
                        <div className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <FaShieldAlt className="text-2xl text-cyan-300" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm uppercase tracking-wider text-blue-200">Price Match</p>
                                <p className="font-semibold">Guarantee</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <FaAward className="text-2xl text-purple-300" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm uppercase tracking-wider text-blue-200">Best Rate</p>
                                <p className="font-semibold">Promise</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <FaHeadset className="text-2xl text-cyan-300" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm uppercase tracking-wider text-blue-200">24/7 Support</p>
                                <p className="font-semibold">Always Here</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                    <path d="M0 0L60 8C120 16 240 32 360 37.3C480 43 600 37 720 32C840 27 960 21 1080 21.3C1200 21 1320 27 1380 29.3L1440 32V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white" />
                </svg>
            </div>
        </div>
    );
};

export default Hero;
