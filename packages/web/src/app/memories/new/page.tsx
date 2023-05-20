'use client'

import { MediaPicker } from '@/components/MediaPicker'
import { api } from '@/lib/api'
import { Camera, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { FormEvent } from 'react'
import Cookie from 'js-cookie'
import { useRouter } from 'next/navigation'

export default function NewMemories() {
  const router = useRouter()

  async function handleUpload(file: File) {
    const formData = new FormData()

    formData.append('file', file)

    const response = await api.post('/upload', formData)

    return response.data.fileURL
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    const fileToUpload = formData.get('coverUrl')

    let coverUrl = null

    if (fileToUpload instanceof File && fileToUpload.size > 0) {
      console.log(fileToUpload)

      coverUrl = await handleUpload(fileToUpload as File)
    }

    await api.post(
      '/memories',
      {
        coverUrl,
        content: formData.get('content'),
        isPublic: formData.get('isPublic'),
      },
      {
        headers: {
          Authorization: `Bearer ${Cookie.get('token')}`,
        },
      },
    )

    router.push('/')
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-16">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100 "
      >
        <ChevronLeft className="h-4 w-4" />
        voltar à timeline
      </Link>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-2">
        <div className="flex items-center gap-4">
          <label
            htmlFor="media"
            className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
          >
            <Camera className="h-4 w-4" />
            Anexar mídia
          </label>

          <label
            htmlFor="isPublic"
            className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
          >
            <input
              type="checkbox"
              name="isPublic"
              id="isPublic"
              value="true"
              className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500"
            />
            Tornar memorias pública
          </label>
        </div>

        <MediaPicker />

        <textarea
          name="content"
          spellCheck={false}
          className="w-full flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
        />

        <button
          type="submit"
          className="inline-block self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-green-600"
        >
          Salvar
        </button>
      </form>
    </div>
  )
}
