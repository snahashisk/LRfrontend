"use client";
import React, { useEffect, useState } from "react";
import { use } from "react";
import { Spinner } from "@/components/ui/spinner";

import { useAuthStore } from "@/store/auth.store";
import axios from "axios";

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
      } catch (error) {
        console.log(error);
      }
    };
    fetchPdf();
  }, [pdf, accessToken]);

  return (
    <div>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-6 w-full">
        {url ? <iframe src={url} width="100%" height="800px" className="rounded-lg bg-muted" /> : <Spinner />}
        <div>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Accusantium alias voluptates, fuga suscipit
          voluptatibus assumenda ad, mollitia deserunt hic sit illum distinctio excepturi, natus quod error quia quasi
          repudiandae asperiores similique. Numquam similique obcaecati adipisci reiciendis dolore itaque incidunt
          doloribus nobis assumenda eius! Neque dolorem nobis voluptatibus quisquam, eos quos?
        </div>
      </div>
    </div>
  );
};

export default Page;
