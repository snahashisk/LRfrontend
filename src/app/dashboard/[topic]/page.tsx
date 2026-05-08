"use client";
import { use } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { formatDate } from "@/lib/formatDate";

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
  createdAt: string;
  updatedAt: string;
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

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("pdf", file!);
      const response = await axios.post("http://localhost:8000/api/v1/pdf/upload-pdf/" + decodedTopic, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      console.log(response.data.data);
      setTitle("");
      setFile(null);
      setOpen(false);
      toast.success("PDF uploaded successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:px-4 flex flex-col">
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
        <div>
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">{topicData?.title}</h2>
          <p className="leading-7">{topicData?.description}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">
              <Upload />
              Upload Related PDF
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <form onSubmit={handleUpload} className="contents">
              <DialogHeader>
                <DialogTitle>Upload PDF</DialogTitle>
                <DialogDescription>
                  Upload a new PDF related to this topic. Click save when you&apos;re done.
                </DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <Label htmlFor="name-1">PDF Title</Label>
                  <Input
                    id="name-1"
                    name="title"
                    placeholder="Enter the title of the PDF"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Field>
                <Field>
                  <Label htmlFor="username-1">PDF File</Label>
                  <Input
                    id="username-1"
                    name="file"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="w-full p-2 flex flex-wrap">
        {pdfs &&
          pdfs.map((pdf) => (
            <div key={pdf._id} className="w-28 rounded-md hover:bg-muted p-2">
              <HoverCard openDelay={10} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <Link
                    href={`/dashboard/${topic}/${pdf._id}`}
                    className="cursor-pointer text-center text-muted-foreground text-sm"
                  >
                    <Image src="/pdfred.png" width={100} height={100} alt="Event cover" />
                    <p className="line-clamp-3 break-all text-sm text-muted-foreground text-center pt-1">{pdf.title}</p>
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent className="flex w-52 flex-col gap-0.5">
                  <div className="font-medium text-sm break-all text-wrap">{pdf.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">created on: {formatDate(pdf.createdAt)}</div>
                  <div className="text-xs text-muted-foreground">Last updated on: {formatDate(pdf.updatedAt)}</div>
                </HoverCardContent>
              </HoverCard>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Page;
