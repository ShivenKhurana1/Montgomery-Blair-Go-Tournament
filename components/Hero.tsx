export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-20 sm:py-32 navy-pattern">
      {/* Go stones decoration */}
      <div className="absolute top-20 left-10 hidden lg:block">
        <div className="go-stone-black h-12 w-12"></div>
      </div>
      <div className="absolute top-32 left-24 hidden lg:block">
        <div className="go-stone-white h-10 w-10"></div>
      </div>
      <div className="absolute bottom-20 right-10 hidden lg:block">
        <div className="go-stone-white h-12 w-12"></div>
      </div>
      <div className="absolute bottom-32 right-24 hidden lg:block">
        <div className="go-stone-black h-10 w-10"></div>
      </div>

      <div className="container-custom relative">
        <div className="mx-auto max-w-3xl text-center animate-slide-up">
          <div className="mb-6 flex items-center justify-center space-x-3">
            <div className="go-stone-black h-8 w-8"></div>
            <div className="go-stone-white h-8 w-8"></div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl">
            Montgomery Blair
            <span className="block text-white">Go Tournament</span>
          </h1>
          <p className="mt-4 text-2xl font-semibold text-white drop-shadow-md sm:text-3xl">
            Saturday, March 21st
          </p>
          <p className="mt-2 text-lg text-white/80 drop-shadow-md">
            Time: 9:30 AM - 5:00 PM
          </p>
          <p className="mt-2 text-lg text-white/80 drop-shadow-md">
            Registration: $20 (collected day of at the event)
          </p>
          <p className="mt-6 text-lg leading-8 text-white/90 drop-shadow-md sm:text-xl">
            Join us for an exciting Go tournament at Montgomery Blair High School.
            Register now to secure your spot in this competitive event.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="/registration" className="btn-primary bg-white text-navy-900 hover:bg-gray-100 text-lg px-8 py-4">
              Register for Tournament
            </a>
            <a href="/tournaments" className="btn-secondary border-2 border-white bg-transparent text-white hover:bg-white/20 text-lg px-8 py-4">
              Tournament Details
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
