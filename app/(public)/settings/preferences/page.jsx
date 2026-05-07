'use client'
import React, { useState, useEffect } from 'react'
import { useAppContext } from '@/context/AppContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function PreferencesPage() {
  const { getToken } = useAppContext()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newsletter: true,
    productUpdates: true,
    securityAlerts: true,
    language: 'en',
    timezone: 'UTC',
    theme: 'system',
  })

  useEffect(() => {
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    try {
      const token = getToken()
      const response = await axios.get('/api/user/preferences', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setPreferences(response.data.preferences || preferences)
    } catch (error) {
      console.error('Fetch error:', error)
      // Use default preferences if fetch fails
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreferenceChange = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSavePreferences = async () => {
    try {
      setIsSaving(true)
      const token = getToken()

      const response = await axios.post(
        '/api/user/preferences',
        preferences,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.status === 200) {
        toast.success('Preferences saved successfully')
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save preferences')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Preferences</h1>
        <p className="text-muted-foreground mt-2">
          Customize your notification and account settings
        </p>
      </div>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Choose how you want to receive updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive important updates via email
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.emailNotifications}
              onChange={(e) =>
                handlePreferenceChange('emailNotifications', e.target.checked)
              }
              className="w-5 h-5 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div>
              <p className="font-medium">SMS Notifications</p>
              <p className="text-sm text-muted-foreground">
                Get SMS alerts for urgent matters
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.smsNotifications}
              onChange={(e) =>
                handlePreferenceChange('smsNotifications', e.target.checked)
              }
              className="w-5 h-5 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">
                Browser push notifications for instant alerts
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.pushNotifications}
              onChange={(e) =>
                handlePreferenceChange('pushNotifications', e.target.checked)
              }
              className="w-5 h-5 cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Marketing Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Marketing & Communications</CardTitle>
          <CardDescription>
            Choose what marketing content you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div>
              <p className="font-medium">Newsletter</p>
              <p className="text-sm text-muted-foreground">
                Get our weekly newsletter with curated content
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.newsletter}
              onChange={(e) =>
                handlePreferenceChange('newsletter', e.target.checked)
              }
              className="w-5 h-5 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div>
              <p className="font-medium">Product Updates</p>
              <p className="text-sm text-muted-foreground">
                Get notified about new products and features
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.productUpdates}
              onChange={(e) =>
                handlePreferenceChange('productUpdates', e.target.checked)
              }
              className="w-5 h-5 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div>
              <p className="font-medium">Security Alerts</p>
              <p className="text-sm text-muted-foreground">
                Critical alerts about your account security
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.securityAlerts}
              onChange={(e) =>
                handlePreferenceChange('securityAlerts', e.target.checked)
              }
              className="w-5 h-5 cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* System Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>System Preferences</CardTitle>
          <CardDescription>
            Configure your system settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Language</label>
            <Select
              value={preferences.language}
              onValueChange={(value) =>
                handlePreferenceChange('language', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="hi">हिन्दी</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Timezone</label>
            <Select
              value={preferences.timezone}
              onValueChange={(value) =>
                handlePreferenceChange('timezone', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="EST">Eastern Standard Time</SelectItem>
                <SelectItem value="CST">Central Standard Time</SelectItem>
                <SelectItem value="MST">Mountain Standard Time</SelectItem>
                <SelectItem value="PST">Pacific Standard Time</SelectItem>
                <SelectItem value="IST">Indian Standard Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Theme</label>
            <Select
              value={preferences.theme}
              onValueChange={(value) =>
                handlePreferenceChange('theme', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System Default</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Button
        onClick={handleSavePreferences}
        disabled={isSaving}
        size="lg"
        className="gap-2"
      >
        {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
        {isSaving ? 'Saving...' : 'Save Preferences'}
      </Button>
    </div>
  )
}
