export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-16 sm:py-20 navy-pattern">
      <div className="container-custom relative">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 flex items-center justify-center space-x-2">
            <div className="go-stone-white h-6 w-6"></div>
            <div className="go-stone-black h-6 w-6"></div>
          </div>
          <h2 className="text-3xl font-extrabold text-white drop-shadow-lg sm:text-4xl">
            Ready to Compete?
          </h2>
          <p className="mt-4 text-lg text-white/90 drop-shadow-md">
            Don't miss out on the Montgomery Blair Go Tournament on Saturday, March 21st. Register now to secure your spot!
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="/registration" className="btn-primary bg-white text-navy-900 hover:bg-gray-100 text-lg px-8 py-4">
              Register Now
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
