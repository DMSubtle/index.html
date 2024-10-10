import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserPlusIcon, SendIcon, CheckIcon, XIcon } from 'lucide-react'

// Mock function to simulate sending SMS
const sendSMS = async (phone: string, message: string) => {
  // In a real application, this would call an API to send the SMS
  console.log(`Sending SMS to ${phone}: ${message}`)
  return new Promise(resolve => setTimeout(resolve, 1000))
}

type Guest = {
  id: number
  name: string
  phone: string
  status: 'Pending' | 'Confirmed' | 'Declined'
}

export default function Component() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [newGuest, setNewGuest] = useState({ name: '', phone: '' })

  const addGuest = () => {
    if (newGuest.name && newGuest.phone) {
      setGuests([...guests, { ...newGuest, id: Date.now(), status: 'Pending' }])
      setNewGuest({ name: '', phone: '' })
    }
  }

  const sendInvitation = async (guest: Guest) => {
    await sendSMS(guest.phone, `You're invited! Please respond with CONFIRM or DECLINE.`)
    // In a real app, you'd update the guest status based on the SMS response
  }

  const updateStatus = (id: number, status: 'Confirmed' | 'Declined') => {
    setGuests(guests.map(guest => 
      guest.id === id ? { ...guest, status } : guest
    ))
  }

  const stats = {
    total: guests.length,
    confirmed: guests.filter(g => g.status === 'Confirmed').length,
    declined: guests.filter(g => g.status === 'Declined').length,
    pending: guests.filter(g => g.status === 'Pending').length,
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">RSVP Manager</h1>
      
      <div className="flex space-x-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={newGuest.name}
            onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
            placeholder="Guest Name"
          />
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={newGuest.phone}
            onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})}
            placeholder="Phone Number"
          />
        </div>
        <Button onClick={addGuest} className="mt-8">
          <UserPlusIcon className="mr-2 h-4 w-4" /> Add Guest
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map(guest => (
            <TableRow key={guest.id}>
              <TableCell>{guest.name}</TableCell>
              <TableCell>{guest.phone}</TableCell>
              <TableCell>{guest.status}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => sendInvitation(guest)}>
                  <SendIcon className="mr-2 h-4 w-4" /> Send SMS
                </Button>
                <Button variant="outline" size="sm" className="ml-2" onClick={() => updateStatus(guest.id, 'Confirmed')}>
                  <CheckIcon className="mr-2 h-4 w-4" /> Confirm
                </Button>
                <Button variant="outline" size="sm" className="ml-2" onClick={() => updateStatus(guest.id, 'Declined')}>
                  <XIcon className="mr-2 h-4 w-4" /> Decline
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Attendance Summary</h2>
        <p>Total Guests: {stats.total}</p>
        <p>Confirmed: {stats.confirmed}</p>
        <p>Declined: {stats.declined}</p>
        <p>Pending: {stats.pending}</p>
      </div>
    </div>
  )
}