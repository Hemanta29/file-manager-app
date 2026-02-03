"use client";

import React, { useState, useEffect } from "react";
import FileTreeD3 from "./FileTreeD3";

interface SearchResult {
  success?: boolean;
  message?: string;
  data?: {
    path: string;
    size: string;
  }
}

interface UploadStatus {
  success?: boolean;
  message?: string;
}

interface Node {
  key: string;
  value: unknown;
  left: Node | null;
  right: Node | null;
}

interface Tree {
  root: Node | null;
  data: unknown;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);
  const [fileStructure, setFileStructure] = useState<Tree | null>(null);

  const handleSearch = async (searchQuery: string) => {
    console.log("Searching for files with query:", searchQuery);
    // Implement file search logic here
    try {
      const result = await fetch('http://localhost:3000/search?key=' + searchQuery, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await result.json();
      setSearchResults(data);
      console.log("Search results:", data);
    }
    catch (error) {
      console.error("Error during file search:", error);
    }

  };

  const handleFileUpload = async () => {
    if (selectedFiles) {
      console.log("Uploading files...");
      // Implement file upload logic here
      const formData = new FormData();
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('files', selectedFiles[i]);
      }
      try {
        const response = await fetch('http://localhost:3000/upload', {
          method: 'POST',
          body: formData,
        });
        const data: UploadStatus = await response.json();
        setUploadStatus(data);
        console.log("Upload status:", data);
      }
      catch (error) {
        console.error("Error during file upload:", error);
      }

    }
    else {
      console.log("No files selected for upload.");
    }
  };

  useEffect(() => {
    // Fetch the file structure from the server
    const fetchFileStructure = async () => {
      try {
        const response = await fetch('http://localhost:3000/viewTree', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data: Tree = await response.json();
        setFileStructure(data);
        console.log("File structure:", data);
      }
      catch (error) {
        console.error("Error fetching file structure:", error);
      }
    };

    fetchFileStructure();
  }, []);

  return (
    <>
      <div className="flex flex-col place-items-center min-h-screen bg-gray-50">
        <div className="w-full mx-auto p-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            File Management App
          </h1>
          <p className="text-center text-gray-600">
            Manage your files with ease: search and upload files seamlessly.
          </p>
        </div>
        <div className="w-full flex gap-2 mb-8">
          <div className="w-[25%] mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
            <div className="mb-4">
              <label
                htmlFor="fileSearch"
                className="block text-gray-700 font-semibold text-left mb-2"
              >
                File Search
              </label>
              <input
                type="text"
                id="fileSearch"
                placeholder="Enter file name or keyword"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                value={query}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setQuery(event.target.value);
                }}
              />

              <button
                className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
                onClick={() => {
                  handleSearch(query);
                }}
              >
                Search
              </button>
            </div>
            {searchResults && (
              <div className="mb-4 p-4 bg-white border border-gray-300 rounded-md">
                {searchResults.success ? (
                  <div>
                    <p className="text-green-500 mb-2">
                      <span role="img" aria-label="success" className="mr-2">✅</span>
                      {searchResults.message}
                    </p>
                    <ul className="list-disc list-inside">
                      <li>Path: {searchResults.data?.path}</li>
                      <li>Size: {searchResults.data?.size} KB</li>
                    </ul>
                  </div>
                ) : (
                  <p className="text-red-500">
                    <span role="img" aria-label="info" className="mr-2">ℹ️</span>
                    {searchResults.message}
                  </p>
                )}
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="fileUpload"
                className="block text-gray-700 font-semibold text-left mb-2"
              >
                File Upload
              </label>
              <input
                type="file"
                id="fileUpload"
                className="text-sm text-stone-500 file:mr-5 file:py-1 file:px-3 file:border file:rounded-md file:border-stone-300 file:text-xs file:font-medium file:bg-stone-50 file:text-stone-700 hover:file:cursor-pointer hover:file:bg-blue-50 hover:file:text-blue-700"
                multiple
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  console.log("Selected files:", event.target.files);
                  setSelectedFiles(event.target.files);
                }}
              />

              <button
                className="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors cursor-pointer"
                onClick={handleFileUpload}
              >
                Upload
              </button>
            </div>
            {uploadStatus && (
              <div className="mb-4 p-4 bg-white border border-gray-300 rounded-md">
                {uploadStatus.success ? (
                  <p className="text-green-500">
                    <span role="img" aria-label="success" className="mr-2">✅</span>
                    {uploadStatus.message}
                  </p>
                ) : (
                  <p className="text-red-500">
                    <span role="img" aria-label="error" className="mr-2">❌</span>
                    {uploadStatus.message}
                  </p>
                )}
              </div>
            )}

          </div>
          <div className="flex-1">
            <div className="">
              <FileTreeD3 fileStructure={fileStructure as Tree} />
              {/* <pre className="bg-gray-100 p-4 rounded-md">
                <h2 className="text-lg font-semibold mb-2">File Structure</h2>
                {JSON.stringify(fileStructure && fileStructure.data, null, 2)}
              </pre> */}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
