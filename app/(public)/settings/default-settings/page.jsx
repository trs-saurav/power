'use client'
import React, { useState, useEffect } from 'react'
import { useAppContext } from '@/context/AppContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Loader2, Check } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function DefaultProfilePage() {
  const { getToken } = useAppContext()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [defaultSettings, setDefaultSettings] = useState({
    defaultAddress: null,
    paymentMethod: 'card',
    notifyOnOrders: true,
    notifyOnDelivery: true,
    newsAndUpdates: false,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = getToken()

      // Fetch addresses
      const addressResponse = await axios.get('/api/user/addresses', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setAddresses(addressResponse.data.addresses || [])

      // Fetch default settings
      const settingsResponse = await axios.get(
        '/api/user/default-settings',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      // Merge API response with default values to ensure all properties exist
      setDefaultSettings((prevSettings) => ({
        ...prevSettings,
        ...settingsResponse.data.settings,
      }))
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error('Failed to load settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSettingChange = (key, value) => {
    setDefaultSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true)
      const token = getToken()

      const response = await axios.post(
        '/api/user/default-settings',
        defaultSettings,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.status === 200) {
        toast.success('Default settings updated')
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Default Profile</h1>
        <p className="text-muted-foreground mt-2">
          Set your default preferences for faster checkout and personalization
        </p>
      </div>

      {/* Default Address */}
      <Card>
        <CardHeader>
          <CardTitle>Default Delivery Address</CardTitle>
          <CardDescription>
            This address will be pre-selected during checkout
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {addresses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No addresses available. Please add an address first.
            </p>
          ) : (
            <RadioGroup
              value={defaultSettings.defaultAddress || ''}
              onValueChange={(value) =>
                handleSettingChange('defaultAddress', value)
              }
            >
              {addresses.map((address) => (
                <div key={address._id} className="flex items-center space-x-2">
                  <RadioGroupItem value={address._id} id={address._id} />
                  <Label
                    htmlFor={address._id}
                    className="cursor-pointer flex-1"
                  >
                    <div>
                      <p className="font-medium">{address.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {address.street}, {address.city}, {address.state}{' '}
                        {address.zipCode}
                      </p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Default Payment Method</CardTitle>
          <CardDescription>
            Choose your preferred payment method
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={defaultSettings.paymentMethod}
            onValueChange={(value) =>
              handleSettingChange('paymentMethod', value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="card">Credit/Debit Card</SelectItem>
              <SelectItem value="paypal">PayPal</SelectItem>
              <SelectItem value="bank">Bank Transfer</SelectItem>
              <SelectItem value="wallet">Digital Wallet</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Separator />

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Control what notifications you receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Order Updates</p>
              <p className="text-sm text-muted-foreground">
                Receive notifications when your order status changes
              </p>
            </div>
            <input
              type="checkbox"
              checked={defaultSettings.notifyOnOrders ?? true}
              onChange={(e) =>
                handleSettingChange('notifyOnOrders', e.target.checked)
              }
              className="w-5 h-5 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Delivery Notifications</p>
              <p className="text-sm text-muted-foreground">
                Get notified when your package is delivered
              </p>
            </div>
            <input
              type="checkbox"
              checked={defaultSettings.notifyOnDelivery ?? true}
              onChange={(e) =>
                handleSettingChange('notifyOnDelivery', e.target.checked)
              }
              className="w-5 h-5 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">News & Updates</p>
              <p className="text-sm text-muted-foreground">
                Receive promotional offers and updates
              </p>
            </div>
            <input
              type="checkbox"
              checked={defaultSettings.newsAndUpdates ?? false}
              onChange={(e) =>
                handleSettingChange('newsAndUpdates', e.target.checked)
              }
              className="w-5 h-5 cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Button
        onClick={handleSaveSettings}
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
