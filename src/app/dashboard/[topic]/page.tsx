"use client";
import { use } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: Promise<{
    topic: string;
  }>;
};

type Topic = {
  _id: string;
  title: string;
  description: string;
  user: string;
};

type Pdf = {
  _id: string;
  title: string;
  description: string;
  user: string;
  notes: string;
  file: string;
  isFavorite: boolean;
};

const Page = ({ params }: Props) => {
  const { topic } = use<{ topic: string }>(params);
  const decodedTopic = decodeURIComponent(topic);
  const [loading, setLoading] = useState(false);
  const [topicData, setTopicData] = useState<Topic | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const [pdfs, setPdfs] = useState<Pdf[]>([]);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/api/v1/topic/" + decodedTopic, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });
        console.log(response.data.data);
        setTopicData(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAllPdfs = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/api/v1/pdf/get-all-pdfs/" + decodedTopic, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });
        console.log(response.data.data);
        setPdfs(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopic();
    fetchAllPdfs();
  }, [user]);

  return (
    <div className="md:px-4 flex flex-col">
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
        <div>
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">{topicData?.title}</h2>
          <p className="leading-7">{topicData?.description}</p>
        </div>
        <Button className="cursor-pointer">
          <Upload />
          Upload Related PDF
        </Button>
      </div>
      <div className="w-full p-2 flex flex-wrap">
        {pdfs &&
          pdfs.map((pdf) => (
            <div key={pdf._id} className="w-28 rounded-md hover:bg-muted p-2">
              <Link
                href={`/dashboard/${topic}/${pdf._id}`}
                className="cursor-pointer text-center text-muted-foreground text-sm"
              >
                <Image src="/pdfred.png" width={100} height={100} alt="Event cover" />
                <p className="line-clamp-3 break-all text-sm text-muted-foreground text-center pt-1">
                  {pdf.description}
                </p>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Page;
