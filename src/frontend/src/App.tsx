import { useState } from "react";
import DiceAnimation from "./components/DiceAnimation";

// Import components and views
import { Loader, ErrorDisplay } from "./components";
import { RandomGeneratorView } from "./views";

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  // ...existing code...

  return (
    <>
      <style>
        {`
          @keyframes logo-spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
      <div className="flex min-h-screen items-center justify-center bg-gray-800 text-white">
        <div className="mx-auto w-full max-w-4xl space-y-8 p-8 text-center">
          <div className="mb-8">
            <DiceAnimation />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold">
              ICP Auditable Random Number Service
            </h1>
            <h2 className="text-xl">
              Cryptographically Secure Random Numbers with Full Audit Trail
            </h2>
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
    </>
  );
}

export default App;
