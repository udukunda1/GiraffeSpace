export interface Role {
  roleId: string;
  roleName: string;
  permissions: string[];
}

export interface Organization {
  organizationId: string;
  organizationName: string;
  description: string;
  contactEmail: string;
  contactPhone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  postalCode: string | null;
  stateProvince: string | null;
  organizationType: string;
}

export interface User {
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bio: string | null;
  profilePictureURL: string | null;
  preferredLanguage: string | null;
  timezone: string | null;
  emailNotificationsEnabled: boolean;
  smsNotificationsEnabled: boolean;
  socialMediaLinks: any;
  dateOfBirth: string | null;
  gender: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  stateProvince: string | null;
  postalCode: string | null;
  country: string | null;
  role: Role;
  organizations: Organization[];
}

export interface UserResult {
  success: boolean;
  message: string;
  user: User;
  token?: string;
}

export interface UserApiResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
}

// Example mock data
export const users: User[] = [
  {
    userId: "f460b67c-d8a6-459d-9e6a-043176cf1213",
    username: "gison456",
    email: "gison28466@finfave.com",
    firstName: "gison",
    lastName: "Weber",
    phoneNumber: "+250780697450",
    bio: null,
    profilePictureURL: null,
    preferredLanguage: null,
    timezone: null,
    emailNotificationsEnabled: true,
    smsNotificationsEnabled: true,
    socialMediaLinks: null,
    dateOfBirth: null,
    gender: null,
    addressLine1: null,
    addressLine2: null,
    city: null,
    stateProvince: null,
    postalCode: null,
    country: null,
    role: {
      roleId: "44746a4c-2e7e-4c87-8c06-b56e7e0d5557",
      roleName: "GUEST",
      permissions: ["read:public"]
    },
    organizations: [
      {
        organizationId: "a38ff5ec-5f50-4e9f-ab30-b94d2d0a8c80",
        organizationName: "Independent",
        description: "Auto-created organization: Independent",
        contactEmail: "admin@independent.com",
        contactPhone: null,
        address: null,
        city: null,
        country: null,
        postalCode: null,
        stateProvince: null,
        organizationType: "General"
      }
    ]
  }
]

// Helper functions (update as needed for new structure)
export const getUserById = (id: string) => users.find((user) => user.userId === id)

export const getUserByEmail = (email: string) => users.find((user) => user.email === email)

export const getUserByUsername = (username: string) => users.find((user) => user.username === username)

export const getUsersByCountry = (country: string) =>
  users.filter((user) => (user.country || "").toLowerCase() === country.toLowerCase())

export const getUsersByCity = (city: string) => users.filter((user) => (user.city || "").toLowerCase() === city.toLowerCase())

export const searchUsers = (query: string) => {
  const lowercaseQuery = query.toLowerCase()
  return users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(lowercaseQuery) ||
      user.lastName.toLowerCase().includes(lowercaseQuery) ||
      user.username.toLowerCase().includes(lowercaseQuery) ||
      user.email.toLowerCase().includes(lowercaseQuery) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(lowercaseQuery),
  )
}

export const getUserStats = () => {
  const totalUsers = users.length
  return {
    totalUsers,
  }
}
