import { useState } from "react";
import Logo from "../public/android-chrome-512x512.png";

// Import components and views
import { Loader, ErrorDisplay } from "./components";
import { RandomGeneratorView } from "./views";

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white">
      <div className="mx-auto w-full max-w-4xl rounded-xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-sm">
        <div>
          <img
            src={Logo}
            className="logo-spin bounce-gentle mx-auto h-32 p-6 will-change-[filter] hover:drop-shadow-[0_0_2em_#ec4899aa] motion-reduce:animate-none"
            alt="AiPricePulse logo"
          />
        </div>

        <div className="space-y-4">
          <h1 className="bg-gradient-to-r from-pink-400 via-red-400 to-blue-400 bg-clip-text text-4xl font-bold text-transparent">
            AiPricePulse
          </h1>
          <h2 className="text-xl text-gray-300">
            Intelligent Price Analysis & Random Number Generation
          </h2>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Random Number Generator Section */}
          <RandomGeneratorView
            onError={handleError}
            setLoading={setLoading}
            loading={loading}
          />
        </div>

        {/* Error States */}
        {!!error && <ErrorDisplay message={error} />}
      </div>
    </div>
  );
}

export default App;
