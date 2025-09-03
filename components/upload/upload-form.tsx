

// 'use client';

// import React, { useState } from 'react';
// import { Button } from '../ui/button';
// import { Input } from '../ui/input';
// import { z } from 'zod';
// import { useUploadThing } from '@/lib/uploadthing';
// import { toast } from 'sonner';



// import { ClientUploadedFileData } from 'uploadthing/types';

// import { generatePdfSummary, storePdfSummaryAction } from '@/actions/upload-action';
// import ReportSummary from '../Reports/ReportTable';
// import Loading from '../common/Loading';


// // Zod schema for file validation
// const schema = z.object({
//     file: z
//         .custom<File>((file) => file instanceof File, { message: 'Invalid file' })
//         .refine((file) => file.size <= 20 * 1024 * 1024, {
//             message: 'File size must be less than 20MB',
//         })
//         .refine((file) => file.type.startsWith('application/pdf'), 'File must be a PDF')
// });



// const UploadForm = () => {
//     const [isLoading, setIsLoading] = useState(false);
//     const [summaryText, setSummaryText] = useState<string | null>(null);


//     const { startUpload } = useUploadThing('pdfUploader', {
//         onClientUploadComplete: () => { toast.success("Your PDF has been uploaded successfully") },
//         onUploadError: (error: any) => {
//             toast.error('Error occurred while uploading');
//             console.error('Upload error:', error);
//         },
//         onUploadBegin: (fileName) => toast(`Uploading ${fileName}...`)
//     });

//     const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         const formData = new FormData(e.currentTarget);
//         const file = formData.get('file');

//         if (!(file instanceof File)) {
//             toast.error('Invalid file');
//             return;
//         }

//         const validatedFields = schema.safeParse({ file });
//         if (!validatedFields.success) {
//             toast.error(validatedFields.error.flatten().fieldErrors.file?.[0] ?? 'Invalid file');
//             return;
//         }

//         setIsLoading(true);
//         setSummaryText(null);

//         // Start upload process
//         const uploadToastId = toast.loading('Uploading PDF...');
//         const resp = await startUpload([file]) as [ClientUploadedFileData<{ uploadedBy: string; file: { url: string; name: string; } }>];

//         if (!resp) {
//             toast.error('Upload Failed', { id: uploadToastId });
//             setIsLoading(false);
//             return;
//         }

//         toast.success('PDF uploaded successfully!', { id: uploadToastId });

//         // Generate summary
//         const summaryToastId = toast.loading('Generating summary...');
//         const summary = await generatePdfSummary(resp);

//         if (!summary.success || !summary.data?.summary) {
//             toast.error(summary.message ?? "Summary failed", { id: summaryToastId });
//         } else {
//             toast.success("Summary generated successfully", { id: summaryToastId });

//             // Save the markdown summary text
//             const aiMarkdownSummary = summary.data.summary;
//             setSummaryText(aiMarkdownSummary);

//             // Save summary to DB
//             await storePdfSummaryAction({
//                 summary: aiMarkdownSummary,
//                 fileUrl: resp[0].serverData.file.url,
//                 fileName: resp[0].serverData.file.name,
//                 title: summary.data.title ?? "Untitled",

//             });
//         }

//         setIsLoading(false);
//     };

//     return (
//         <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
//             <UploadFormInput
//                 onSubmit={onSubmit}
//                 isLoading={isLoading}
//             />

//             {isLoading ? (
//                 <Loading />
//             ) : summaryText ? (
//                 <ReportSummary markdown={summaryText} />
//             ) : null}
//         </div>
//     );
// };

// export default UploadForm;

// // Only the file + submit input
// interface UploadFormInputProps {
//     onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
//     isLoading: boolean;
// }

// const UploadFormInput: React.FC<UploadFormInputProps> = ({ onSubmit, isLoading }) => {
//     return (
//         <form className="flex flex-col gap-6" onSubmit={onSubmit}>
//             <div className="flex justify-end items-center gap-1.5">
//                 <Input
//                     type="file"
//                     id="file"
//                     name="file"
//                     accept="application/pdf"
//                     required
//                 />
//                 <Button type="submit" disabled={isLoading}>
//                     {isLoading ? "Processing..." : "Upload your PDF"}
//                 </Button>
//             </div>
//         </form>
//     );
// };





"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { z } from "zod";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import { ClientUploadedFileData } from "uploadthing/types";
import {
  generatePdfSummary,
  storePdfSummaryAction,
} from "@/actions/upload-action";
import ReportSummary from "../Reports/ReportTable";
import Loading from "../common/Loading";
import { Upload, Loader2 } from "lucide-react";
import UploadHeader from "./upload-header";
import UploadFormInput from "./upload-form-input";

// Schema
const schema = z.object({
  file: z
    .custom<File>((file) => file instanceof File, { message: "Invalid file" })
    .refine((file) => file.size <= 20 * 1024 * 1024, {
      message: "File size must be less than 20MB",
    })
    .refine((file) => file.type.startsWith("application/pdf"), "File must be a PDF"),
});

const UploadForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [summaryText, setSummaryText] = useState<string | null>(null);

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => toast.success("Your PDF has been uploaded successfully"),
    onUploadError: (error: any) => {
      toast.error("Error occurred while uploading");
      console.error("Upload error:", error);
    },
    onUploadBegin: (fileName) => toast(`Uploading ${fileName}...`),
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file");

    if (!(file instanceof File)) {
      toast.error("Invalid file");
      return;
    }

    const validatedFields = schema.safeParse({ file });
    if (!validatedFields.success) {
      toast.error(validatedFields.error.flatten().fieldErrors.file?.[0] ?? "Invalid file");
      return;
    }

    setIsLoading(true);
    setSummaryText(null);

    const uploadToastId = toast.loading("Uploading PDF...");
    const resp = (await startUpload([file])) as [
      ClientUploadedFileData<{ uploadedBy: string; file: { url: string; name: string } }>
    ];

    if (!resp) {
      toast.error("Upload Failed", { id: uploadToastId });
      setIsLoading(false);
      return;
    }

    toast.success("PDF uploaded successfully!", { id: uploadToastId });

    // Generate summary
    const summaryToastId = toast.loading("Generating summary...");
    const summary = await generatePdfSummary(resp);

    if (!summary.success || !summary.data?.summary) {
      toast.error(summary.message ?? "Summary failed", { id: summaryToastId });
    } else {
      toast.success("Summary generated successfully", { id: summaryToastId });
      const aiMarkdownSummary = summary.data.summary;
      setSummaryText(aiMarkdownSummary);

      await storePdfSummaryAction({
        summary: aiMarkdownSummary,
        fileUrl: resp[0].serverData.file.url,
        fileName: resp[0].serverData.file.name,
        title: summary.data.title ?? "Untitled",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      {/* <UploadHeader /> */}
      <UploadFormInput onSubmit={onSubmit} isLoading={isLoading} />
      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        </div>
      ) : summaryText ? (
        <ReportSummary markdown={summaryText} />
      ) : null}
    </div>
  );
};

export default UploadForm;

// File input
interface UploadFormInputProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}