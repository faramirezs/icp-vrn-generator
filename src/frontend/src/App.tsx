import { useState } from "react";
import ReactIcon from "../assets/React-icon.webp";

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
    <div className="flex min-h-screen items-center justify-center bg-gray-800 text-white">
      <div className="mx-auto w-full max-w-4xl space-y-8 p-8 text-center">
        <div className="mb-8">
          <a href="https://reactjs.org" target="_blank" rel="noreferrer">
            <img
              src={ReactIcon}
              className="logo-spin mx-auto h-24 p-6 will-change-[filter] hover:drop-shadow-[0_0_2em_#61dafbaa] motion-reduce:animate-none"
              alt="React logo"
            />
          </a>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Vibe Coding Template</h1>
          <h2 className="text-xl">React + Rust + Internet Computer</h2>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Random Number Generator Section */}
          <RandomGeneratorView
            onError={handleError}
            setLoading={setLoading}
          />
        </div>

        {/* Loading and Error States */}
        {loading && !error && <Loader />}
        {!!error && <ErrorDisplay message={error} />}
      </div>
    </div>
  );
}

export default App;
