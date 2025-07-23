"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/ui/footer";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Image as ImageIcon,
  Calendar,
  Download,
  Sparkles,
  Grid3X3,
  Share2,
  User,
  MessageSquare,
  Zap,
  Copy,
  Check,
  ExternalLink,
  Users,
  Lock,
} from "lucide-react";

type R2Image = {
  key: string;
  uploaded: string;
  publicURL: string;
  metadata?: {
    prompt?: string;
    model?: string;
    userEmail?: string;
    generatedAt?: string;
  };
};

const imageLoader = ({ src }: { src: string }) => {
  return src;
};

export default function ImageListing() {
  const [images, setImages] = useState<R2Image[]>([]);
  const [publicImages, setPublicImages] = useState<R2Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<R2Image | null>(null);
  const [promptPopup, setPromptPopup] = useState<{
    image: R2Image;
    visible: boolean;
  } | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState<"my-gallery" | "public-gallery">(
    "my-gallery"
  );

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const currentUrl = new URL(window.location.href);

        // Fetch user's private images
        const privateData = await fetch(`${currentUrl.origin}/api/images`);
        const privateImageData = await privateData.json<R2Image[]>();
        setImages(privateImageData);

        // Fetch public images (all images from all users)
        const publicData = await fetch(
          `${currentUrl.origin}/api/images/public`
        );
        const publicImageData = await publicData.json<R2Image[]>();
        setPublicImages(publicImageData);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownload = (image: R2Image) => {
    const link = document.createElement("a");
    link.href = `/api/image?key=${image.key}`;
    link.download = image.key;
    link.click();
  };

  const handleImageClick = (image: R2Image) => {
    setSelectedImage(image);
  };

  const handleShare = async (image: R2Image) => {
    const imageUrl = `${window.location.origin}/api/image?key=${image.key}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "AI Generated Image",
          text: image.metadata?.prompt || "Check out this AI-generated image!",
          url: imageUrl,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(imageUrl);
        alert("Image URL copied to clipboard!");
      } catch (error) {
        console.log("Error copying to clipboard:", error);
      }
    }
  };

  const handlePromptClick = (image: R2Image, e: React.MouseEvent) => {
    e.stopPropagation();
    setPromptPopup({ image, visible: true });
  };

  const handleCopyPrompt = async () => {
    if (promptPopup?.image.metadata?.prompt) {
      try {
        await navigator.clipboard.writeText(promptPopup.image.metadata.prompt);
        setCopiedPrompt(true);
        setTimeout(() => setCopiedPrompt(false), 2000);
      } catch (error) {
        console.log("Error copying prompt:", error);
      }
    }
  };

  const getModelDisplayName = (model: string) => {
    const modelMap: Record<string, string> = {
      "@cf/black-forest-labs/flux-1-schnell": "Flux 1 Schnell",
      "@cf/black-forest-labs/flux-1": "Flux 1",
      "@cf/black-forest-labs/flux-2": "Flux 2",
      "@cf/black-forest-labs/flux-2-schnell": "Flux 2 Schnell",
    };
    return modelMap[model] || model;
  };

  const getCurrentImages = () => {
    return activeTab === "my-gallery" ? images : publicImages;
  };

  const getCurrentImageCount = () => {
    return activeTab === "my-gallery" ? images.length : publicImages.length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Grid3X3 className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Gallery
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-1 border border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("my-gallery")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === "my-gallery"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Lock className="h-4 w-4" />
                  My Gallery
                  <span className="bg-white bg-opacity-20 text-xs px-2 py-1 rounded-full">
                    {images.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("public-gallery")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === "public-gallery"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  Public Gallery
                  <span className="bg-white bg-opacity-20 text-xs px-2 py-1 rounded-full">
                    {publicImages.length}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Loading gallery...
              </h3>
              <p className="text-gray-600">Fetching AI-generated images</p>
            </div>
          ) : !getCurrentImages() || getCurrentImages().length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <ImageIcon className="h-20 w-20 mx-auto mb-6 text-gray-300" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {activeTab === "my-gallery"
                  ? "No images yet"
                  : "No public images yet"}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {activeTab === "my-gallery"
                  ? "Start creating amazing images with our AI generator. Your gallery will be filled with stunning AI-generated artwork."
                  : "Be the first to create amazing AI-generated images and share them with the community!"}
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-8 py-3 text-base font-semibold"
              >
                <Link href="/">
                  <Sparkles className="mr-2 h-5 w-5" />
                  {activeTab === "my-gallery"
                    ? "Create Your First Image"
                    : "Create Your First Image"}
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Stats and Actions */}
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                      {activeTab === "my-gallery"
                        ? "Your Gallery"
                        : "Public Gallery"}
                    </h2>
                    <p className="text-gray-600">
                      {getCurrentImageCount()} AI-generated masterpiece
                      {getCurrentImageCount() !== 1 ? "s" : ""} • Latest:{" "}
                      {formatDate(getCurrentImages()[0]?.uploaded || "")}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <Button
                      asChild
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl"
                    >
                      <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Generator
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Image Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getCurrentImages().map((image) => (
                  <div
                    key={image.key}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-200 group cursor-pointer"
                    onClick={() => handleImageClick(image)}
                  >
                    <div className="relative">
                      <Image
                        loader={imageLoader}
                        src={image.publicURL}
                        width={400}
                        height={400}
                        alt={image.publicURL}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(image);
                          }}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(image);
                          }}
                        >
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                      </div>
                      <div className="absolute top-3 right-3">
                        <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                          AI Generated
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      {/* Prompt */}
                      {image.metadata?.prompt && (
                        <div className="mb-3">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p
                              className="text-sm text-gray-700 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                              onClick={(e) => handlePromptClick(image, e)}
                              title="Click to view full prompt"
                            >
                              {image.metadata.prompt}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Model */}
                      {image.metadata?.model && (
                        <div className="mb-3">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-purple-600" />
                            <span className="text-xs font-medium text-gray-600">
                              {getModelDisplayName(image.metadata.model)}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* User Email */}
                      {image.metadata?.userEmail && (
                        <div className="mb-3">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-green-600" />
                            <span className="text-xs text-gray-500">
                              {image.metadata.userEmail}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Date */}
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(image.uploaded)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More or Create More */}
              <div className="text-center mt-12">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                  <Sparkles className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Create More Magic
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Ready to create more stunning AI-generated images? Explore
                    different models and prompts to unlock your creativity.
                  </p>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-8 py-3 text-base font-semibold"
                  >
                    <Link href="/">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate New Image
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <Footer variant="minimal" className="mt-12" />
      </div>

      {/* Prompt Popup */}
      {promptPopup?.visible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
          onClick={() => setPromptPopup(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                AI Prompt
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setPromptPopup(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </Button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-800 whitespace-pre-wrap">
                {promptPopup.image.metadata?.prompt}
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                onClick={handleCopyPrompt}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Prompt
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPromptPopup(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Image
                loader={imageLoader}
                src={selectedImage.publicURL}
                width={800}
                height={800}
                alt={selectedImage.publicURL}
                className="w-full h-auto"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="sm"
                  className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg backdrop-blur-sm"
                  onClick={() => handleDownload(selectedImage)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button
                  size="sm"
                  className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg backdrop-blur-sm"
                  onClick={() => handleShare(selectedImage)}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button
                  size="sm"
                  className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg backdrop-blur-sm"
                  onClick={() => setSelectedImage(null)}
                >
                  ×
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {/* Prompt */}
              {selectedImage.metadata?.prompt && (
                <div>
                  <div className="flex items-start gap-2 mb-2">
                    <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <h4 className="text-sm font-semibold text-gray-900">
                      Prompt
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 ml-7">
                    {selectedImage.metadata.prompt}
                  </p>
                </div>
              )}

              {/* Model */}
              {selectedImage.metadata?.model && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-purple-600" />
                    <h4 className="text-sm font-semibold text-gray-900">
                      Model
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 ml-7">
                    {getModelDisplayName(selectedImage.metadata.model)}
                  </p>
                </div>
              )}

              {/* User Email */}
              {selectedImage.metadata?.userEmail && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-5 w-5 text-green-600" />
                    <h4 className="text-sm font-semibold text-gray-900">
                      Created by
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 ml-7">
                    {selectedImage.metadata.userEmail}
                  </p>
                </div>
              )}

              {/* Date */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <h4 className="text-sm font-semibold text-gray-900">
                    Generated
                  </h4>
                </div>
                <p className="text-sm text-gray-700 ml-7">
                  {formatDate(selectedImage.uploaded)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
