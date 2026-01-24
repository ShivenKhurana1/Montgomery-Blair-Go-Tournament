import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center space-x-0.5">
                  <div className="go-stone-black h-3 w-3"></div>
                  <div className="go-stone-white h-3 w-3"></div>
                </div>
              </div>
              <span className="text-xl font-bold text-white">
                Montgomery Blair Go Tournament
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Go tournament at Montgomery Blair High School
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/tournaments"
                  className="text-sm transition-colors hover:text-white"
                >
                  Tournaments
                </Link>
              </li>
              <li>
                <Link
                  href="/registration"
                  className="text-sm transition-colors hover:text-white"
                >
                  Registration
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm transition-colors hover:text-white"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>Designed by Shiven Khurana with ❤️</p>
        </div>
      </div>
    </footer>
  )
}
