"use client";
import { useAuthStore } from "@/store/auth.store";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SquarePlus } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function Page() {
  const { accessToken } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateTopic = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/v1/topic/create-topic",
        {
          title,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        },
      );
      console.log(response.data.data);
      setTitle("");
      setDescription("");
      toast.success("Topic created successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create topic");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-0 min-h-[80vh] w-full">
      <form className="max-w-md mx-auto mt-[10vh]" onSubmit={handleCreateTopic}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Create New Topic</FieldLegend>
            <FieldDescription>Describe your topic in a few words</FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Topic Name</FieldLabel>
                <Input
                  id="name"
                  placeholder="Eg. Cloud Burst Prediction"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <FieldDescription>Enter your topic name</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="description">Topic Description</FieldLabel>
                <Textarea
                  id="description"
                  placeholder="Add a detail description of the topic"
                  className="resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <FieldDescription>Enter your topic description in detail</FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field orientation="horizontal">
            <Button type="submit">
              <SquarePlus />
              Create New Topic
            </Button>
            <Button type="reset" variant="outline">
              Clear
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
