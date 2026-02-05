export default function AboutPage() {
  return (
    <div className="container-custom py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center space-x-2">
          <div className="go-stone-black h-8 w-8"></div>
          <div className="go-stone-white h-8 w-8"></div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          About the Tournament
        </h1>
        <div className="mt-8 space-y-6 text-lg text-gray-600">
          <p>
            The Montgomery Blair Go Tournament is a competitive Go event taking place on Saturday, March 21st
            at Montgomery Blair High School. This tournament welcomes players of all skill levels,
            from beginners to advanced dan players.
          </p>
          <p>
            Join us for a day of exciting matches, friendly competition, and the opportunity to
            test your skills against other Go enthusiasts. Whether you're new to the game or an
            experienced player, this tournament offers a great opportunity to play competitive Go
            and meet fellow players.
          </p>

          <h2 className="mt-12 text-2xl font-bold text-gray-900">
            Tournament Details
          </h2>
          <ul className="mt-4 space-y-3">
            <li className="flex items-start">
              <div className="mr-3 mt-1 flex-shrink-0">
                <div className="go-stone-black h-5 w-5 rounded-full"></div>
              </div>
              <span>
                <strong className="text-gray-900">Date:</strong> Saturday, March 21st, 2026
              </span>
            </li>
            <li className="flex items-start">
              <div className="mr-3 mt-1 flex-shrink-0">
                <div className="go-stone-white h-5 w-5 rounded-full border-2 border-gray-300"></div>
              </div>
              <span>
                <strong className="text-gray-900">Time:</strong> 10:00 AM - 5:00 PM (Check-in at 9:00 AM)
              </span>
            </li>
            <li className="flex items-start">
              <div className="mr-3 mt-1 flex-shrink-0">
                <div className="go-stone-white h-5 w-5 rounded-full border-2 border-gray-300"></div>
              </div>
              <span>
                <strong className="text-gray-900">Location:</strong> Montgomery Blair High School
              </span>
            </li>
            <li className="flex items-start">
              <div className="mr-3 mt-1 flex-shrink-0">
                <div className="go-stone-black h-5 w-5 rounded-full"></div>
              </div>
              <span>
                <strong className="text-gray-900">Format:</strong> Swiss-style tournament format
              </span>
            </li>
            <li className="flex items-start">
              <div className="mr-3 mt-1 flex-shrink-0">
                <div className="go-stone-white h-5 w-5 rounded-full border-2 border-gray-300"></div>
              </div>
              <span>
                <strong className="text-gray-900">Registration:</strong> Open now - register online to secure your spot
              </span>
            </li>
          </ul>

          <h2 className="mt-12 text-2xl font-bold text-gray-900">
            What to Expect
          </h2>
          <ul className="mt-4 space-y-3">
            <li className="flex items-start">
              <div className="mr-3 mt-1 flex-shrink-0">
                <div className="go-stone-black h-5 w-5 rounded-full"></div>
              </div>
              <span>
                <strong className="text-gray-900">Fair Play:</strong> All matches are conducted with integrity and fairness.
              </span>
            </li>
            <li className="flex items-start">
              <div className="mr-3 mt-1 flex-shrink-0">
                <div className="go-stone-white h-5 w-5 rounded-full border-2 border-gray-300"></div>
              </div>
              <span>
                <strong className="text-gray-900">Welcoming Community:</strong> A friendly environment for players of all levels.
              </span>
            </li>
            <li className="flex items-start">
              <div className="mr-3 mt-1 flex-shrink-0">
                <div className="go-stone-black h-5 w-5 rounded-full"></div>
              </div>
              <span>
                <strong className="text-gray-900">Competitive Matches:</strong> Multiple rounds ensuring everyone gets to play.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
