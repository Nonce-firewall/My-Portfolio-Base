import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Send, CheckCircle, RotateCcw } from 'lucide-react'
import { useForm } from '@formspree/react'

interface JoinTeamModalProps {
  isOpen: boolean
  onClose: () => void
}

const JoinTeamModal: React.FC<JoinTeamModalProps> = ({ isOpen, onClose }) => {
  const [state, handleSubmit, reset] = useForm("mldbqpgy")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')
  const [showExperienceModal, setShowExperienceModal] = useState(false)
  const [selectedExperience, setSelectedExperience] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    experience: '',
    portfolio: '',
    message: ''
  })

  const roleOptions = [
    'Frontend Developer',
    'Backend Developer',
    'Full-Stack Developer',
    'UI/UX Designer',
    'Project Manager',
    'Content Writer',
    'Digital Marketer',
    'Other'
  ]

  const experienceOptions = [
    'Less than 1 year',
    '1-2 years',
    '2-5 years',
    '5+ years',
    'Student/Entry Level'
  ]

  useEffect(() => {
    if (state.succeeded) {
      setShowSuccessModal(true)
      setCountdown(5)
    }
  }, [state.succeeded])

  // --- MODIFICATION #2 START ---
  // The countdown useEffect is updated to call onClose directly.
  useEffect(() => {
    if (!showSuccessModal) return

    const timer = setTimeout(() => {
      if (countdown > 0) {
        setCountdown(prev => prev - 1)
      } else if (countdown === 0) {
        resetForm()
        onClose() // Call onClose here after resetting state.
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, showSuccessModal, onClose]) // Added onClose to dependency array.
  // --- MODIFICATION #2 END ---

  useEffect(() => {
    if (isOpen || showSuccessModal || showRoleModal || showExperienceModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, showSuccessModal, showRoleModal, showExperienceModal])

  // --- MODIFICATION #1 START ---
  // The onClose() call is removed from the resetForm function.
  const resetForm = () => {
    setShowSuccessModal(false)
    reset()
    setFormData({
      name: '',
      email: '',
      role: '',
      experience: '',
      portfolio: '',
      message: ''
    })
    setSelectedRole('')
    setSelectedExperience('')
    setCountdown(5)
    // The problematic onClose() call has been removed from here.
  }
  // --- MODIFICATION #1 END ---


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleRoleSelect = (option: string) => {
    setSelectedRole(option)
    setFormData(f => ({ ...f, role: option }))
    setShowRoleModal(false)
  }

  const handleExperienceSelect = (option: string) => {
    setSelectedExperience(option)
    setFormData(f => ({ ...f, experience: option }))
    setShowExperienceModal(false)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const submissionData = {
      ...formData,
      subject: 'Join Team Application',
      role: selectedRole,
      experience: selectedExperience
    }
    await handleSubmit(submissionData)
  }

  if (!isOpen && !showSuccessModal) return null

  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 max-w-xs sm:max-w-md w-full mx-4 relative overflow-hidden animate-scale-in">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 opacity-60"></div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-4 left-4 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
          <div className="absolute top-8 right-8 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
          <div className="absolute bottom-4 right-4 w-1 h-1 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 text-center">
          <div className="relative mx-auto mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto animate-scale-in">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-bounce-slow" />
            </div>
            <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 bg-green-400 rounded-full animate-ping opacity-20"></div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 animate-slide-up">
            Application Submitted Successfully!
          </h2>

          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Thank you for your interest in joining our team! We'll review your application and get back to you soon.
          </p>

          <div className="mb-4 sm:mb-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4">
              <svg className="w-16 h-16 sm:w-20 sm:h-20 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - ((5 - countdown) / 5))}`}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  key={countdown}
                  className="text-lg sm:text-xl font-bold text-gray-900 animate-pulse"
                >
                  {countdown}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-500 animate-fade-in">
              Auto-close in {countdown} second{countdown !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="space-y-2 sm:space-y-3 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            {/* --- MODIFICATION #3 START --- */}
            {/* The onClick handler for the close button is updated. */}
            <button
              onClick={() => {
                resetForm()
                onClose()
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg transform hover:scale-105 active:scale-95 flex items-center justify-center text-sm"
            >
              <RotateCcw size={16} className="mr-2 animate-spin-slow" />
              Close
            </button>
            {/* --- MODIFICATION #3 END --- */}
          </div>

          <div className="mt-4 sm:mt-6 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(
    <>
      {showSuccessModal ? (
        <SuccessModal />
      ) : (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999] p-4 animate-modal-fade-in" onClick={onClose}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out animate-modal-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Join Our Team</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                We're always looking for talented individuals to join our team. Fill out the form below and let's create something amazing together!
              </p>
            </div>

            <div className="p-4 sm:p-6">
              {state.errors && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm sm:text-base">There was an error submitting your application. Please try again.</p>
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 text-sm sm:text-base"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 text-sm sm:text-base"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                  <button
                    type="button"
                    onClick={() => setShowRoleModal(true)}
                    className="w-full px-4 py-2 border rounded-lg flex justify-between items-center hover:bg-gray-50 text-left"
                    aria-haspopup="listbox"
                    aria-expanded={showRoleModal}
                  >
                    <span className={selectedRole ? 'text-gray-900' : 'text-gray-400'}>
                      {selectedRole || 'Select your desired role'}
                    </span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level *</label>
                  <button
                    type="button"
                    onClick={() => setShowExperienceModal(true)}
                    className="w-full px-4 py-2 border rounded-lg flex justify-between items-center hover:bg-gray-50 text-left"
                    aria-haspopup="listbox"
                    aria-expanded={showExperienceModal}
                  >
                    <span className={selectedExperience ? 'text-gray-900' : 'text-gray-400'}>
                      {selectedExperience || 'Select your experience level'}
                    </span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                <div>
                  <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio/LinkedIn URL
                  </label>
                  <input
                    type="url"
                    id="portfolio"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 text-sm sm:text-base"
                    placeholder="https://yourportfolio.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you want to join our team? *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 resize-none text-sm sm:text-base"
                    placeholder="Tell us about yourself and why you'd be a great fit for our team..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={state.submitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105 active:scale-95"
                >
                  {state.submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} className="mr-2" />
                      Submit Application
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {showRoleModal && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4" onClick={() => setShowRoleModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] transform transition-all duration-300 ease-out animate-modal-scale-in" onClick={(e) => e.stopPropagation()} role="listbox">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Select Role</h3>
                <button onClick={() => setShowRoleModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200">
                  <X size={20} />
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {roleOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => handleRoleSelect(option)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                      selectedRole === option ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    role="option"
                    aria-selected={selectedRole === option}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showExperienceModal && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4" onClick={() => setShowExperienceModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] transform transition-all duration-300 ease-out animate-modal-scale-in" onClick={(e) => e.stopPropagation()} role="listbox">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Select Experience Level</h3>
                <button onClick={() => setShowExperienceModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200">
                  <X size={20} />
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {experienceOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => handleExperienceSelect(option)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                      selectedExperience === option ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    role="option"
                    aria-selected={selectedExperience === option}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>,
    document.body
  )
}

export default JoinTeamModal
