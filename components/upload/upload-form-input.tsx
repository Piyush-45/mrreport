// 'use client'

// import { Button } from "../ui/button";
// import { Input } from "../ui/input";

import { useState } from "react";
import { Upload, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface UploadFormInputProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const UploadFormInput: React.FC<UploadFormInputProps> = ({ onSubmit, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <form onSubmit={onSubmit} className="flex flex-col items-center gap-6 w-full">
      <label
        htmlFor="file"
        className="w-full flex flex-col items-center justify-center gap-3 border-2 border-dashed border-blue-300 bg-blue-50/30 hover:bg-blue-100/50 rounded-xl p-12 cursor-pointer transition-all hover:shadow-lg"
      >
        {!selectedFile ? (
          <>
            <Upload className="w-10 h-10 text-blue-500" />
            <span className="text-gray-700 font-medium">
              Drag & drop your PDF here, or click to select
            </span>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-500" />
            <div className="text-left">
              <p className="text-gray-800 font-medium">{selectedFile.name}</p>
              <p className="text-gray-500 text-sm">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        )}
        <Input
          id="file"
          name="file"
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setSelectedFile(e.target.files[0]);
            } else {
              setSelectedFile(null);
            }
          }}
        />
      </label>

      <Button
        type="submit"
        disabled={isLoading || !selectedFile}
        className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium shadow-md hover:shadow-lg transition"
      >
        {isLoading ? "Processing..." : selectedFile ? "Upload PDF" : "Select a File First"}
      </Button>
    </form>
  );
};

export default UploadFormInput;