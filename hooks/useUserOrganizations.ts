import { useState, useEffect } from 'react'
import ApiService from '@/api/apiConfig'

interface Organization {
  organizationId: string;
  organizationName: string;
  description: string;
  contactEmail: string;
  contactPhone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  postalCode?: string | null;
  stateProvince?: string | null;
  organizationType?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

interface UseUserOrganizationsReturn {
  organizations: Organization[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserOrganizations = (userId?: string): UseUserOrganizationsReturn => {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUserOrganizations = async () => {
    if (!userId) {
      setOrganizations([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await ApiService.getUserById(userId)
      if (response && response.success && response.user && Array.isArray(response.user.organizations)) {
        setOrganizations(response.user.organizations)
        console.log("organizations assigned to user", response.user.organizations)
      } else {
        setOrganizations([])
        setError('No organizations found for this user.')
      }
    } catch (error) {
      setOrganizations([])
      setError('Failed to fetch user organizations')
      console.error('Error fetching user organizations:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserOrganizations()
  }, [userId])

  const refetch = async () => {
    await fetchUserOrganizations()
  }

  return {
    organizations,
    loading,
    error,
    refetch
  }
}