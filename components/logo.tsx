import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLightbulb } from "@fortawesome/free-solid-svg-icons"
import { Newspaper } from "lucide-react"

export function Logo() {
  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      {/* Newspaper background */}
      <div className="absolute inset-0 flex items-center justify-center bg-primary rounded-lg">
        <Newspaper className="w-6 h-6 text-primary-foreground" />
      </div>
      {/* Lightbulb overlay */}
      <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1 border-2 border-primary">
        <FontAwesomeIcon icon={faLightbulb} className="w-3 h-3 text-amber-900" />
      </div>
    </div>
  )
}
