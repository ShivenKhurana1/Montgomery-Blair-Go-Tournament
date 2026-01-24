const stats = [
  { label: 'Tournament Date', value: 'March 21st', change: 'Saturday' },
  { label: 'Location', value: 'Montgomery Blair HS', change: 'In Person' },
  { label: 'Registration', value: 'Open Now', change: 'Register Today' },
  { label: 'All Skill Levels', value: 'Welcome', change: 'Kyu to Dan' },
]

export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-navy-800 py-16 sm:py-20 navy-pattern">
      <div className="container-custom relative">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-3 flex items-center justify-center">
                {index % 2 === 0 ? (
                  <div className="go-stone-black h-10 w-10"></div>
                ) : (
                  <div className="go-stone-white h-10 w-10"></div>
                )}
              </div>
              <div className="text-3xl font-bold text-white drop-shadow-lg sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-medium text-white/90">
                {stat.label}
              </div>
              <div className="mt-1 text-xs font-semibold text-white">
                {stat.change}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
