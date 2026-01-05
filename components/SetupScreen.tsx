'use client';

import { Database, ExternalLink } from 'lucide-react';

export function SetupScreen() {
  return (
    <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#191919]">
      <div className="max-w-lg text-center px-8">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <Database size={32} className="text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Set up Supabase
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This app needs a Supabase database to store your pages. Follow these steps to get started:
        </p>

        <div className="text-left bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
          <ol className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium">
                1
              </span>
              <div>
                <p className="font-medium">Create a Supabase account</p>
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 dark:text-green-400 hover:underline inline-flex items-center gap-1 mt-1"
                >
                  supabase.com <ExternalLink size={12} />
                </a>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium">
                2
              </span>
              <div>
                <p className="font-medium">Create a new project</p>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Choose a name and set a database password</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium">
                3
              </span>
              <div>
                <p className="font-medium">Run the SQL setup script</p>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Go to SQL Editor and run the schema from the README</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium">
                4
              </span>
              <div>
                <p className="font-medium">Add your credentials to .env.local</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded block mt-2">
                  NEXT_PUBLIC_SUPABASE_URL=your-url<br />
                  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
                </code>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium">
                5
              </span>
              <div>
                <p className="font-medium">Restart the dev server</p>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Run <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">npm run dev</code> again</p>
              </div>
            </li>
          </ol>
        </div>

        <p className="text-sm text-gray-400">
          Your Supabase credentials are in Project Settings → API
        </p>
      </div>
    </div>
  );
}
