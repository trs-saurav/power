'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useAppContext } from '@/context/AppContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Loader2, Upload, X, CheckCircle2, Mail, Phone } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function ProfileSettingsPage() {
  const { data: session, update } = useSession()
  const { user, getToken, fetchUserData } = useAppContext()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [emailVerificationSent, setEmailVerificationSent] = useState(false)
  const [phoneVerificationSent, setPhoneVerificationSent] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    imageUrl: '',
    gender: '',
    phone: '',
    dateOfBirth: '',
    bio: '',
  })

  useEffect(() => {
    if (session?.user) {
      loadProfileData()
    }
  }, [session])

  const loadProfileData = async () => {
    try {
      setIsFetching(true)
      const token = getToken()
      if (!token) {
        console.log('⚠️ No token available')
        setIsFetching(false)
        return
      }

      console.log('📡 Fetching profile data...')
      console.log('🔑 Token:', token)
      const response = await axios.get('/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log('📥 Raw response:', response.data)

      if (response.data.success && response.data.data) {
        const data = response.data.data
        console.log('✅ Profile data received:', {
          name: data.name,
          email: data.email,
          gender: data.gender,
          phone: data.phone,
          dateOfBirth: data.dateOfBirth,
          bio: data.bio,
          imageUrl: data.imageUrl,
        })
        
        setFormData({
          name: data.name || '',
          email: data.email || '',
          imageUrl: data.imageUrl || '',
          gender: data.gender || '',
          phone: data.phone || '',
          dateOfBirth: data.dateOfBirth || '',
          bio: data.bio || '',
        })
        
        if (data.imageUrl) {
          setPreviewImage(data.imageUrl)
        }
      } else {
        console.log('⚠️ Unexpected response structure')
      }
    } catch (error) {
      console.error('❌ Fetch profile error:', error)
      console.error('Error response:', error.response?.data)
      // Set from session as fallback
      if (session?.user) {
        setFormData((prev) => ({
          ...prev,
          name: session.user.name || '',
          email: session.user.email || '',
          imageUrl: session.user.image || '',
        }))
        if (session.user.image) {
          setPreviewImage(session.user.image)
        }
      }
    } finally {
      setIsFetching(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleGenderChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file')
      return
    }

    try {
      setIsUploading(true)

      // Create FormData for file upload
      const formDataToSend = new FormData()
      formDataToSend.append('file', file)

      // Upload to your server (you'll need to create this endpoint)
      const response = await axios.post('/api/user/upload-image', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.imageUrl) {
        setFormData((prev) => ({
          ...prev,
          imageUrl: response.data.imageUrl,
        }))
        setPreviewImage(response.data.imageUrl)
        toast.success('Image uploaded successfully')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: '',
    }))
    setPreviewImage(null)
    toast.success('Image removed')
  }

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true)
      const token = getToken()

      if (!formData.name.trim()) {
        toast.error('Name is required')
        setIsLoading(false)
        return
      }

      if (!token) {
        toast.error('Authentication failed')
        setIsLoading(false)
        return
      }

      console.log('📝 Sending update request...')
      const payloadData = {
        name: formData.name.trim(),
        imageUrl: formData.imageUrl,
        gender: formData.gender,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        bio: formData.bio,
      }
      
      console.log('📤 Complete Payload:', JSON.stringify(payloadData, null, 2))
      console.log('🔑 Token:', token)

      const response = await axios.post('/api/user/update-profile', payloadData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 200) {
        console.log('✅ Profile updated successfully')
        console.log('📥 Response:', response.data)
        toast.success('Profile updated successfully!')
        
        // Update session
        await update({
          name: formData.name,
          image: formData.imageUrl,
        })
        
        // Refresh context
        await fetchUserData()
        
        // Reload data
        await loadProfileData()
      }
    } catch (error) {
      console.error('❌ Update error:', error)
      console.error('Response data:', error.response?.data)
      const errorMsg = error.response?.data?.message || error.message || 'Failed to update profile'
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendEmailVerification = async () => {
    try {
      const token = getToken()
      if (!token) {
        toast.error('Not authenticated')
        return
      }

      toast.promise(
        axios.post('/api/user/send-verification-email',
          { email: formData.email },
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        {
          loading: 'Sending verification email...',
          success: 'Check your inbox!',
          error: 'Failed to send email',
        }
      )
      setEmailVerificationSent(true)
      setTimeout(() => setEmailVerificationSent(false), 30000)
    } catch (error) {
      console.error('Email verification error:', error)
    }
  }

  const handleSendPhoneVerification = async () => {
    try {
      if (!formData.phone.trim()) {
        toast.error('Please enter a phone number')
        return
      }

      const token = getToken()
      if (!token) {
        toast.error('Not authenticated')
        return
      }

      toast.promise(
        axios.post('/api/user/send-verification-sms',
          { phone: formData.phone },
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        {
          loading: 'Sending verification code...',
          success: 'Code sent to your phone!',
          error: 'Failed to send code',
        }
      )
      setPhoneVerificationSent(true)
      setTimeout(() => setPhoneVerificationSent(false), 30000)
    } catch (error) {
      console.error('Phone verification error:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Update your personal information
        </p>
      </div>

      {/* Profile Picture Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Upload your photo to Cloudinary</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-border shadow-md">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-6xl">👤</span>
              )}
            </div>

            {/* Upload and Remove Buttons */}
            <div className="flex gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                />
                <Button
                  asChild
                  disabled={isUploading}
                  className="gap-2"
                >
                  <span>
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </span>
                </Button>
              </label>

              {previewImage && (
                <Button
                  onClick={handleRemoveImage}
                  variant="destructive"
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Remove
                </Button>
              )}
            </div>

            <p className="text-xs text-muted-foreground">JPG, PNG, GIF (Max 5MB)</p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            {isFetching ? 'Loading your data...' : 'Your profile details'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isFetching ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={handleGenderChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-muted flex-1"
                    />
                    <Button
                      onClick={handleSendEmailVerification}
                      disabled={emailVerificationSent}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      {emailVerificationSent ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          Sent
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          Verify
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendPhoneVerification}
                      disabled={phoneVerificationSent}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      {phoneVerificationSent ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          Sent
                        </>
                      ) : (
                        <>
                          <Phone className="w-4 h-4" />
                          Verify
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  maxLength="500"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-24 resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {formData.bio.length}/500 characters
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Save Button */}
      <Button
        onClick={handleUpdateProfile}
        disabled={isLoading || isFetching}
        size="lg"
        className="gap-2 w-full sm:w-auto"
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  )
}
