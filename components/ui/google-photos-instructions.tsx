import { Camera, Link, Smartphone } from 'lucide-react'

export function GooglePhotosInstructions() {
  return (
    <div className="rounded-lg border bg-blue-50 p-4 text-sm">
      <h3 className="mb-2 font-semibold">How to import from Google Photos:</h3>
      <ol className="space-y-2">
        <li className="flex items-start gap-2">
          <Smartphone className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
          <span>Open Google Photos on your phone or computer</span>
        </li>
        <li className="flex items-start gap-2">
          <Camera className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
          <span>Select the photo you want to use</span>
        </li>
        <li className="flex items-start gap-2">
          <Link className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
          <span>
            Tap the share button and choose "Create link" or "Copy link"
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            4
          </span>
          <span>Paste the link in the URL field above</span>
        </li>
      </ol>
      <p className="mt-3 text-xs text-gray-600">
        Note: Make sure the photo is shared publicly or with link access
      </p>
    </div>
  )
}