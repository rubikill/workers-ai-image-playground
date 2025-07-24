"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Download,
  Sparkles,
  Image as ImageIcon,
  Upload,
  X,
  FileImage,
} from "lucide-react";
import Link from "next/link";
import { Footer } from "./ui/footer";

type Model = {
  id: string;
  name: string;
};

type SchemaProperty = {
  type: string;
  description: string;
  default?: any;
  minimum?: number;
  maximum?: number;
};

type Schema = {
  input: {
    properties: Record<string, SchemaProperty>;
    required: string[];
  };
};

type UploadedImage = {
  file: File;
  preview: string;
  base64: string;
};

export default function SimpleImageGenerator() {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>(
    "@cf/black-forest-labs/flux-1-schnell"
  );
  const [schema, setSchema] = useState<Schema | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(
    null
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if current model is img2img
  const isImg2ImgModel = selectedModel.includes("img2img");

  useEffect(() => {
    fetch("/api/models")
      .then((res) => res.json())
      .then((data) => {
        const modelsData = data as Model[];
        setModels(modelsData);
        // Auto-select the first model
        if (modelsData.length > 0) {
          setSelectedModel(modelsData[0].id);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedModel) {
      fetch(`/api/schema?model=${selectedModel}`)
        .then((res) => res.json())
        .then((ns) => {
          const newSchema = ns as Schema;
          setSchema(newSchema);
          const defaultValues = Object.entries(
            newSchema.input.properties
          ).reduce((acc, [key, prop]) => {
            if (prop.default !== undefined) acc[key] = prop.default;
            if (prop.minimum !== undefined) acc[key] = prop.minimum;
            return acc;
          }, {} as Record<string, any>);
          setInputValues(defaultValues);
        })
        .catch(console.error);
    }
  }, [selectedModel]);

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix to get just the base64 data
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle file upload
  const handleFileUpload = useCallback(async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      const preview = URL.createObjectURL(file);

      setUploadedImage({
        file,
        preview,
        base64,
      });

      // Update input values with the image data
      setInputValues((prev) => ({
        ...prev,
        image_b64: base64,
      }));
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Error processing file. Please try again.");
    }
  }, []);

  // Handle file input change
  const handleFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  // Remove uploaded image
  const removeUploadedImage = useCallback(() => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage.preview);
      setUploadedImage(null);
      setInputValues((prev) => {
        const newValues = { ...prev };
        delete newValues.image_b64;
        return newValues;
      });
    }
  }, [uploadedImage]);

  // Trigger file input
  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      console.log("inputValues: ", inputValues);
      try {
        const response = await fetch("/api/generate_image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: selectedModel, ...inputValues }),
        });
        if (response.ok) {
          const result = (await response.json()) as { url: string };
          setGeneratedImage(result.url);
        } else {
          const errorData = (await response.json().catch(() => ({}))) as any;
          console.error("Error generating image:", errorData);
          alert(
            errorData.message || "Error generating image. Please try again."
          );
        }
      } catch (error) {
        console.error("Error generating image:", error);
        alert("Error generating image. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [inputValues]
  );

  const isFormValid = useCallback(() => {
    const hasRequiredFields = schema?.input.required.every(
      (field) => inputValues[field] !== undefined && inputValues[field] !== ""
    );

    // For img2img models, also check if image is uploaded
    if (isImg2ImgModel) {
      return hasRequiredFields && uploadedImage !== null;
    }

    return hasRequiredFields;
  }, [selectedModel, schema, inputValues, isImg2ImgModel, uploadedImage]);

  const handleDownload = useCallback(() => {
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = "generated-image.png";
      link.click();
    }
  }, [generatedImage]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Image Generator
          </h1>
        </div>

        <div className="mt-4">
          <Link
            href="/images"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <ImageIcon className="h-4 w-4 mr-1" />
            View all generated images
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Configuration
            </h2>
            <p className="text-gray-600">
              Choose your AI model and customize the parameters
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="model"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                AI Model
              </label>
              <Select onValueChange={setSelectedModel} value={selectedModel}>
                <SelectTrigger id="model" className="h-12 text-base">
                  <SelectValue placeholder="Select an AI model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map(({ id, name }) => (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* File Upload Section for img2img models */}
            {isImg2ImgModel && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Upload Image
                </h3>

                {!uploadedImage ? (
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      isDragOver
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Drop your image here
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      or click to browse files
                    </p>
                    <Button
                      type="button"
                      onClick={triggerFileInput}
                      variant="outline"
                      className="bg-white hover:bg-gray-50"
                    >
                      <FileImage className="h-4 w-4 mr-2" />
                      Choose Image
                    </Button>
                    <p className="text-xs text-gray-400 mt-2">
                      Supports PNG, JPEG, WebP • Max 10MB
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="relative group">
                      <Image
                        src={uploadedImage.preview}
                        alt="Uploaded"
                        className="w-full h-auto rounded-xl shadow-lg"
                        width={512}
                        height={512}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl flex items-center justify-center">
                        <Button
                          type="button"
                          onClick={removeUploadedImage}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-600 hover:bg-red-700 text-white"
                          size="sm"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {uploadedImage.file.name} (
                        {(uploadedImage.file.size / 1024 / 1024).toFixed(2)}MB)
                      </span>
                      <Button
                        type="button"
                        onClick={removeUploadedImage}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            )}

            {schema && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Parameters
                </h3>
                {Object.entries(schema.input.properties).map(([key, value]) => {
                  // Skip image fields as they're handled by file upload
                  if (key === "image" || key === "image_b64") return null;

                  return (
                    <div key={key} className="space-y-2">
                      <label
                        htmlFor={key}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {key.charAt(0).toUpperCase() +
                          key.slice(1).replace(/_/g, " ")}{" "}
                        {schema.input.required.includes(key) && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      {key.toLowerCase().includes("prompt") ? (
                        <Textarea
                          id={key}
                          placeholder={value.description}
                          value={inputValues[key] || ""}
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                          ) =>
                            setInputValues((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }))
                          }
                          required={schema.input.required.includes(key)}
                          className="min-h-[120px] text-base resize-none"
                        />
                      ) : (
                        <Input
                          id={key}
                          type={
                            value.type === "integer" || value.type === "number"
                              ? "number"
                              : "text"
                          }
                          placeholder={value.description}
                          value={inputValues[key] || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setInputValues((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }))
                          }
                          min={value.minimum}
                          max={value.maximum}
                          required={schema.input.required.includes(key)}
                          className="h-12 text-base"
                        />
                      )}
                      {value.description && (
                        <p className="text-xs text-gray-500">
                          {value.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Image
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Preview
            </h2>
            <p className="text-gray-600">
              Your generated image will appear here
            </p>
          </div>

          <div className="flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-200">
            {isLoading ? (
              <div className="text-center">
                <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">
                  Creating your masterpiece...
                </p>
              </div>
            ) : generatedImage ? (
              <div className="w-full space-y-4">
                <div className="relative group">
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="w-full h-auto rounded-xl shadow-lg"
                    width={512}
                    height={512}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl flex items-center justify-center">
                    <Button
                      onClick={handleDownload}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-gray-900 hover:bg-gray-100"
                    >
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleDownload}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl"
                >
                  <Download className="mr-2 h-4 w-4" /> Download Image
                </Button>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium text-gray-400">
                  No image generated yet
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Configure your settings and click generate
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer variant="minimal" className="mt-12" />
    </div>
  );
}
