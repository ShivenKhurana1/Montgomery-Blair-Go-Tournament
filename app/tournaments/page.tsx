import Link from 'next/link'

export default function TournamentsPage() {
  const tournaments = [
    {
      id: 1,
      name: 'Montgomery Blair Go Tournament',
      date: 'Saturday, March 21st (9:30 AM - 5:00 PM)',
      location: 'Montgomery Blair High School',
      participants: 0,
      status: 'Upcoming',
    },
  ]

  return (
    <div className="container-custom py-12">
      <div className="mb-8">
        <div className="mb-4 flex items-center space-x-2">
          <div className="go-stone-black h-6 w-6"></div>
          <div className="go-stone-white h-6 w-6"></div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Tournaments
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Browse and register for upcoming Go tournaments.
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        {tournaments.map((tournament) => (
          <div
            key={tournament.id}
            className="card relative overflow-hidden border-2 border-transparent hover:border-navy-700"
          >
            {/* Navy pattern accent */}
            <div className="absolute top-0 right-0 h-20 w-20 bg-navy-50 opacity-30"></div>

            <div className="relative mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {tournament.status === 'Upcoming' ? (
                  <div className="go-stone-black h-4 w-4"></div>
                ) : (
                  <div className="go-stone-white h-4 w-4"></div>
                )}
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${tournament.status === 'Upcoming'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                    }`}
                >
                  {tournament.status}
                </span>
              </div>
            </div>
            <h2 className="relative text-xl font-semibold text-gray-900">
              {tournament.name}
            </h2>
            <div className="relative mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-navy-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {tournament.date}
              </div>
              <div className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-navy-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {tournament.location}
              </div>
              <div className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-navy-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                {tournament.participants > 0 ? `${tournament.participants} participants` : 'Registration open'}
              </div>
            </div>
            {tournament.status === 'Upcoming' ? (
              <Link
                href="/registration"
                className="mt-6 block w-full btn-primary text-center"
              >
                Register Now
              </Link>
            ) : (
              <button className="mt-6 w-full btn-secondary">
                View Results
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
