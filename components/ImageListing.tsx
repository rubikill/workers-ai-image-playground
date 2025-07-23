'use client'

import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from 'react'
import { ArrowLeft, Image as ImageIcon, Calendar, Download, Sparkles, Grid3X3 } from "lucide-react"

type R2Image = {
  key: string
  uploaded: string
}

const imageLoader = ({ src }: { src: string }) => {
  return `/api/image?key=${src}`;
}

export default function ImageListing() {
  const [images, setImages] = useState<R2Image[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<R2Image | null>(null)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const currentUrl = new URL(window.location.href)
        const data = await fetch(`${currentUrl.origin}/api/images`)
        const imageData = await data.json<R2Image[]>()
        setImages(imageData)
      } catch (error) {
        console.error('Error fetching images:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchImages()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDownload = (image: R2Image) => {
    const link = document.createElement('a')
    link.href = `/api/image?key=${image.key}`
    link.download = image.key
    link.click()
  }

  const handleImageClick = (image: R2Image) => {
    setSelectedImage(image)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Grid3X3 className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your AI Gallery
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse all your AI-generated masterpieces created with{" "}
            <a
              href="https://developers.cloudflare.com/workers-ai"
              className="text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Cloudflare Workers AI
            </a>
            . Create more amazing images with the{" "}
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium underline">
              Image Generator
            </Link>
            .
          </p>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading your gallery...</h3>
              <p className="text-gray-600">Fetching your AI-generated images</p>
            </div>
          ) : !images || images.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <ImageIcon className="h-20 w-20 mx-auto mb-6 text-gray-300" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No images yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start creating amazing images with our AI generator. Your gallery will be filled with stunning AI-generated artwork.
              </p>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-8 py-3 text-base font-semibold">
                <Link href="/">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Create Your First Image
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
                      Your Gallery
                    </h2>
                    <p className="text-gray-600">
                      {images.length} AI-generated masterpiece{images.length !== 1 ? 's' : ''} •
                      Latest: {formatDate(images[0]?.uploaded || '')}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl">
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
                {images.map(image => (
                  <div
                    key={image.key}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-200 group cursor-pointer"
                    onClick={() => handleImageClick(image)}
                  >
                    <div className="relative">
                      <Image
                        loader={imageLoader}
                        src={image.key}
                        width={400}
                        height={400}
                        alt={image.key}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                        <Button
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDownload(image)
                          }}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                      <div className="absolute top-3 right-3">
                        <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                          AI Generated
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-medium text-gray-900 truncate mb-2">
                        {image.key.replace(/\.(png|jpg|jpeg)$/i, '').replace(/_/g, ' ')}
                      </p>
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Create More Magic</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Ready to create more stunning AI-generated images?
                    Explore different models and prompts to unlock your creativity.
                  </p>
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-8 py-3 text-base font-semibold">
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
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>
            Powered by{" "}
            <a
              href="https://developers.cloudflare.com/workers-ai"
              className="text-blue-600 hover:underline"
            >
              Cloudflare Workers AI
            </a>
            . Source code available on{" "}
            <a
              href="https://github.com/kristianfreeman/workers-ai-image-playground"
              className="text-blue-600 hover:underline"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="relative">
              <Image
                loader={imageLoader}
                src={selectedImage.key}
                width={800}
                height={800}
                alt={selectedImage.key}
                className="w-full h-auto"
              />
              <Button
                size="sm"
                className="absolute top-4 right-4 bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                onClick={() => handleDownload(selectedImage)}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button
                size="sm"
                className="absolute top-4 left-4 bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                onClick={() => setSelectedImage(null)}
              >
                ×
              </Button>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {selectedImage.key.replace(/\.(png|jpg|jpeg)$/i, '').replace(/_/g, ' ')}
              </h3>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(selectedImage.uploaded)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
