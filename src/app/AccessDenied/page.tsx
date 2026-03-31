
export default function AccessDenied() {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
  
          <p className="text-gray-700 mb-6">
            You don’t have permission to view this page.
            <br />
            Please contact your administrator if you believe this is a mistake.
          </p>
  
          {/* <a
            href="/"
            className="inline-block mt-2 px-5 py-3 rounded-md bg-black text-white hover:bg-gray-800 transition"
          >
            Go back home
          </a> */}
        </div>
      </main>
    );
  }