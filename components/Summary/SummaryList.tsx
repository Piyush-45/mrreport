"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, Calendar, ArrowRightCircle, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PdfSummary {
  id: string;
  title: string | null;
  fileName: string | null;
  originalFileUrl: string;
  createdAt: string | Date;
}

interface SummariesListProps {
  summaries: PdfSummary[];
}

const SummariesList: React.FC<SummariesListProps> = ({ summaries }) => {
  if (summaries.length === 0) {
    return (
      <div className="text-center mt-16">
        <p className="text-gray-500 text-lg">
          You haven’t uploaded any reports yet.
        </p>
        <p className="text-sm text-gray-400">
          Upload a PDF to see it appear here ✨
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {summaries.map((summary) => (
        <Card
          key={summary.id}
          className="group relative rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
          <CardContent className="p-6 flex flex-col h-full justify-between">
            {/* File Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-600">
                <FileText className="w-5 h-5" />
                <h3 className="font-semibold text-lg truncate">
                  {summary.fileName || "Untitled Report"}
                </h3>
              </div>

              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(summary.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-between gap-3">
              <Button
                asChild
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Link
                  href={summary.originalFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </Link>
              </Button>

              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-teal-500 text-white flex items-center gap-2"
              >
                <Link href={`/summary/${summary.id}`}>
                  View <ArrowRightCircle className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SummariesList;