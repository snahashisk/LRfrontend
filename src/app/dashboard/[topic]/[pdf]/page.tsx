"use client";
import React, { useEffect, useState } from "react";
import { use } from "react";
import { Spinner } from "@/components/ui/spinner";
import Editor from "@/components/Editor";

import { useAuthStore } from "@/store/auth.store";
import axios from "axios";
import { toast } from "sonner";

type Props = {
  params: Promise<{
    pdf: string;
  }>;
};

type Pdf = {
  _id: string;
  title: string;
  description: string;
  user: string;
  notes: string;
  file: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
};

const Page = ({ params }: Props) => {
  const { pdf } = use(params);

  const accessToken = useAuthStore((state) => state.accessToken);
  const [pdfData, setPdfData] = useState<Pdf | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/pdf/get-pdf/" + pdf, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });
        setPdfData(response.data.data.pdf);
        setUrl(response.data.data.url);
        setNotes(response.data.data.pdf.notes);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPdf();
  }, [pdf, accessToken]);

  const handleNoteUpdate = async (content: string) => {
    setNotes(content);
    try {
      const response = await axios.put(
        "http://localhost:8000/api/v1/pdf/update-pdf/" + pdf,
        { notes: content },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        },
      );
      if (response.status === 200) {
        toast.success("Note updated successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update note");
    }
  };

  return (
    <div>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-6 w-full">
        {url ? <iframe src={url} width="100%" height="800px" className="rounded-lg bg-muted" /> : <Spinner />}
        <div>
          <Editor initialContent={notes} onChange={(content) => setNotes(content)} onSave={handleNoteUpdate} />
        </div>
      </div>
    </div>
  );
};

export default Page;
