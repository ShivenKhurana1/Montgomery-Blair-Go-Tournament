'use client'

import { useState } from 'react'

export default function RegistrationPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    grade: '',
    studentID: '',
    estimatedRank: '',
    agreeToTerms: false,
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [activeTab, setActiveTab] = useState<'website' | 'google'>('website')

  // ============================================
  // GOOGLE FORM CONFIGURATION
  // ============================================
  // Google Form URL: https://forms.gle/yxy8VuozNUr6i8Db6
  // 
  // INSTRUCTIONS TO GET FORM ID AND ENTRY IDs:
  // 1. Open the form in your browser: https://forms.gle/yxy8VuozNUr6i8Db6
  // 2. Right-click and select "Inspect" or press F12
  // 3. Go to the "Network" tab in DevTools
  // 4. Submit a test response to the form
  // 5. Look for a request to "formResponse" - the URL will contain the FORM_ID
  //    Example: https://docs.google.com/forms/d/e/1FAIpQLSdXXXXX/formResponse
  // 6. In the "Elements" tab, search for "entry." to find entry IDs
  //    Each field will have an entry ID like: entry.123456789
  // 7. Update GOOGLE_FORM_ID and GOOGLE_FORM_ENTRIES below with actual values
  // ============================================
  const googleFormUrl = 'https://forms.gle/irSfwnBMDgBMr9C59'

  // Form ID - Extract from the formResponse URL
  // Example: If formResponse URL is https://docs.google.com/forms/d/e/1FAIpQLSdXXXXX/formResponse
  // Then GOOGLE_FORM_ID is: 1FAIpQLSdXXXXX
  const GOOGLE_FORM_ID = '1FAIpQLSe8AeVu-ThzwMj9bSs908HcU-oMXQtjTouzs5DqqLtNNinPrw' // ⚠️ REPLACE WITH ACTUAL FORM ID

  // Entry IDs - These map to each field in your Google Form
  // Find these by inspecting the form HTML or submitting a test form and checking Network tab
  // Update these with the actual entry IDs from your Google Form
  const GOOGLE_FORM_ENTRIES = {
    fullName: 'entry.1121445374',
    email: 'emailAddress',
    grade: 'entry.1597399613',
    emergencyContactName: 'entry.243557117',
    emergencyContactNumber: 'entry.769706486',
    studentID: 'entry.1456054808',
    estimatedRank: 'entry.1509461048',
  }

  // Google Form submission URL
  const googleFormSubmitUrl = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`

  // Embed URL (for displaying the form)
  const googleFormEmbedUrl = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/viewform?embedded=true`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Map grade values to match Google Form options
      const gradeMapping: Record<string, string> = {
        'Freshman': 'Freshman',
        'Sophomore': 'Sophomore',
        'Junior': 'Junior',
        'Senior': 'Senior',
        'other': 'Other'
      }

      // Prepare form data for Google Forms submission
      const formDataToSubmit = new URLSearchParams()

      // Map website form fields to Google Form entry IDs
      if (GOOGLE_FORM_ENTRIES.fullName && formData.fullName) {
        formDataToSubmit.append(GOOGLE_FORM_ENTRIES.fullName, formData.fullName)
      }

      if (GOOGLE_FORM_ENTRIES.email && formData.email) {
        formDataToSubmit.append(GOOGLE_FORM_ENTRIES.email, formData.email)
      }

      if (GOOGLE_FORM_ENTRIES.grade && formData.grade) {
        formDataToSubmit.append(GOOGLE_FORM_ENTRIES.grade, gradeMapping[formData.grade] || formData.grade)
      }

      if (GOOGLE_FORM_ENTRIES.emergencyContactName && formData.emergencyContactName) {
        formDataToSubmit.append(GOOGLE_FORM_ENTRIES.emergencyContactName, formData.emergencyContactName)
      }

      if (GOOGLE_FORM_ENTRIES.emergencyContactNumber && formData.emergencyContactNumber) {
        formDataToSubmit.append(GOOGLE_FORM_ENTRIES.emergencyContactNumber, formData.emergencyContactNumber)
      }

      if (GOOGLE_FORM_ENTRIES.studentID && formData.studentID) {
        formDataToSubmit.append(GOOGLE_FORM_ENTRIES.studentID, formData.studentID)
      }

      // Estimated rank is optional
      if (GOOGLE_FORM_ENTRIES.estimatedRank && formData.estimatedRank) {
        formDataToSubmit.append(GOOGLE_FORM_ENTRIES.estimatedRank, formData.estimatedRank)
      }

      // Submit to Google Forms
      // Note: Google Forms doesn't return a proper response, so we check for redirect
      const response = await fetch(googleFormSubmitUrl, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Forms (CORS restriction)
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataToSubmit.toString(),
      })

      // With no-cors mode, we can't check the response, but if we get here, it likely succeeded
      // Google Forms will accept the submission even with no-cors

      console.log('Registration data submitted to Google Forms:', formData)

      // Send confirmation email via our API
      try {
        await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
          }),
        });
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // We don't alert the user here because the main registration succeeded
      }

      // Store email before resetting form
      setSubmittedEmail(formData.email)
      setIsSubmitted(true)
      setIsSubmitting(false)

      // Reset form after successful submission
      setFormData({
        fullName: '',
        email: '',
        emergencyContactName: '',
        emergencyContactNumber: '',
        grade: '',
        studentID: '',
        estimatedRank: '',
        agreeToTerms: false,
      })
    } catch (error) {
      console.error('Registration error:', error)
      alert('There was an error submitting your registration. Please try again or use the Google Form tab.')
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  return (
    <div className="container-custom py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center space-x-2">
            <div className="go-stone-black h-8 w-8"></div>
            <div className="go-stone-white h-8 w-8"></div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Tournament Registration
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Register for the Montgomery Blair Go Tournament - Saturday, March 21st, 2026
          </p>
        </div>

        {/* Success Message */}
        {isSubmitted && (
          <div className="mb-6 rounded-lg bg-green-50 border-2 border-green-200 p-6 text-center">
            <div className="mb-2 flex items-center justify-center">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-900">
              Registration Submitted Successfully!
            </h3>
            <p className="mt-2 text-sm text-green-700">
              We've received your registration. You will receive a confirmation email at{' '}
              <strong>{submittedEmail || 'your email address'}</strong> shortly.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-4 text-sm font-medium text-green-700 hover:text-green-900 underline"
            >
              Submit Another Registration
            </button>
          </div>
        )}

        {/* Website Registration Form */}
        {activeTab === 'website' && !isSubmitted && (
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-navy-700 focus:ring-navy-700"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-navy-700 focus:ring-navy-700"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Emergency Contact Fields */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="emergencyContactName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Emergency Contact Name *
                  </label>
                  <input
                    type="text"
                    id="emergencyContactName"
                    name="emergencyContactName"
                    required
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-navy-700 focus:ring-navy-700"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="emergencyContactNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Emergency Contact Number *
                  </label>
                  <input
                    type="tel"
                    id="emergencyContactNumber"
                    name="emergencyContactNumber"
                    required
                    value={formData.emergencyContactNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-navy-700 focus:ring-navy-700"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              {/* Grade and Student ID */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="grade"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Grade *
                  </label>
                  <select
                    id="grade"
                    name="grade"
                    required
                    value={formData.grade}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-navy-700 focus:ring-navy-700"
                  >
                    <option value="">Select your grade</option>
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="studentID"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Student ID *
                  </label>
                  <input
                    type="text"
                    id="studentID"
                    name="studentID"
                    required
                    value={formData.studentID}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-navy-700 focus:ring-navy-700"
                    placeholder="Enter your student ID"
                  />
                </div>
              </div>

              {/* Estimated Rank (Optional) */}
              <div>
                <label
                  htmlFor="estimatedRank"
                  className="block text-sm font-medium text-gray-700"
                >
                  What rank do you think you are? <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <select
                  id="estimatedRank"
                  name="estimatedRank"
                  value={formData.estimatedRank}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-navy-700 focus:ring-navy-700"
                >
                  <option value="">Select your estimated rank (optional)</option>
                  <option value="30k">30 kyu</option>
                  <option value="25k">25 kyu</option>
                  <option value="20k">20 kyu</option>
                  <option value="15k">15 kyu</option>
                  <option value="10k">10 kyu</option>
                  <option value="5k">5 kyu</option>
                  <option value="1k">1 kyu</option>
                  <option value="1d">1 dan</option>
                  <option value="2d">2 dan</option>
                  <option value="3d">3 dan</option>
                  <option value="4d">4 dan</option>
                  <option value="5d">5 dan</option>
                  <option value="6d+">6 dan or higher</option>
                  <option value="unknown">I don't know</option>
                </select>
              </div>



              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  required
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-navy-700 focus:ring-navy-700"
                />
                <label
                  htmlFor="agreeToTerms"
                  className="ml-3 text-sm text-gray-600"
                >
                  I agree to the tournament rules and terms of service *
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full bg-navy-900 text-white hover:bg-navy-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="mr-2 h-5 w-5 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Registration'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Google Form Section */}
        {activeTab === 'google' && (
          <div className="space-y-6">
            <div className="card">
              <div className="mb-4 text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Register via Google Form
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Complete your registration using the Google Form below or open it in a new window.
                </p>
              </div>

              {/* Google Form Embed */}
              <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
                <iframe
                  src={googleFormEmbedUrl}
                  width="100%"
                  height="1200"
                  frameBorder="0"
                  marginHeight={0}
                  marginWidth={0}
                  className="min-h-[800px] w-full"
                  title="Tournament Registration Form"
                  onError={() => {
                    // If embedding fails, show a message
                    console.log('Form embedding may not work with shortened URL. Please use the "Open in New Window" button.')
                  }}
                >
                  <p className="p-4 text-center text-gray-600">
                    Your browser does not support iframes. Please{' '}
                    <a
                      href={googleFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-navy-700 underline hover:text-navy-800"
                    >
                      click here to open the form in a new window
                    </a>
                    .
                  </p>
                </iframe>
              </div>

              {/* Note about embedding */}
              <div className="mt-4 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> If the form doesn't appear above, the shortened URL may not support embedding.
                  Please use the "Open Google Form in New Window" button below to access the form directly.
                </p>
              </div>

              {/* Alternative Link */}
              <div className="mt-6 text-center">
                <p className="mb-4 text-sm text-gray-600">
                  Prefer to open the form in a new window?
                </p>
                <a
                  href={googleFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center bg-navy-900 text-white hover:bg-navy-800"
                >
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Open Google Form in New Window
                </a>
              </div>
            </div>

            {/* Instructions */}
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-6">
              <h3 className="mb-2 text-lg font-semibold text-blue-900">
                How to use the Google Form:
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="mr-2">1.</span>
                  <span>Fill out all required fields in the form above</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2.</span>
                  <span>Click the "Submit" button at the bottom of the Google Form</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3.</span>
                  <span>You'll receive a confirmation message after successful submission</span>
                </li>
              </ul>
            </div>
          </div>
        )}


      </div>
    </div>
  )
}
