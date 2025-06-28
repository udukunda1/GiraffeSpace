import axios, { AxiosRequestHeaders } from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
import type { User, UserResult, UserApiResponse } from "@/data/users";

interface UserFormData {
  [key: string]: any;
}

interface DecodedToken extends JwtPayload {
  role?: string;
}

class ApiService {
  static BASE_URL: string =
    process.env.NODE_ENV === "production"
      ? "https://giraffe-event-system-latest-axr9.onrender.com/api/v1"
      : "http://localhost:3000/api/v1";

  static getHeader(data?: any): Record<string, string> {
    const token = localStorage.getItem("token");
    const isFormData =
      typeof FormData !== "undefined" && data instanceof FormData;

    return {
      Authorization: `Bearer ${token}`,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    };
  }

  /** Register a new user */
  static async registerUser(formData: UserFormData): Promise<UserApiResponse> {
    // console.log("hdtdrwywywuwuwiwqq");
    try {
      // console.log("in try brock");
      const response = await axios.post(
        `${this.BASE_URL}/users/auth/register`,
        formData,
        {
          headers: this.getHeader(formData),
          withCredentials: true, // Enable credentials
        }
      );
      // console.log("hdtdrwywywuwuwiwqq");
      // console.log("response", response.data);
      return response.data;
    } catch (error) {
      console.error("Error signup:", error);
      throw error;
    }
  }

  /** Reset defaultPassword user */
  static async resetDefaultPassword(
    formData: UserFormData
  ): Promise<UserApiResponse> {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/users/auth/reset`,
        formData,
        {
          headers: this.getHeader(formData),
          withCredentials: true, // Enable credentials
        }
      );
      console.log("response", response.data);
      return response.data;
    } catch (error) {
      console.error("Error Reset defaultPassword:", error);
      throw error;
    }
  }

  /** Login a registered user */
  static async loginUser(formData: UserFormData): Promise<UserApiResponse> {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/users/auth/login`,
        formData,
        {
          headers: this.getHeader(formData),
           withCredentials: true // Enable credentials
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  /** Login with default password (special endpoint) */
  static async loginUserDefaultPassword(
    formData: UserFormData
  ): Promise<{ success: boolean; token?: string; resetToken?: string }> {
    console.log("hdtdrwywywuwuwiwqq");
    try {
      console.log("in try block");
      const response = await axios.post(
        `${this.BASE_URL}/users/auth/login/default`,
        formData,
        {
          headers: this.getHeader(formData),
          withCredentials: true, // Enable credentials
        }
      );
      console.log("response", response.data);
      return { success: response.data.success, token: response.data.token, resetToken: response.data.resetToken };
    } catch (error) {
      console.error("Error logging in with default password:", error);
      return { success: false };
    }
  }

  /** Get all users */
  static async getAllUser(): Promise<any> {
    try {
      const response = await axios.get(`${this.BASE_URL}/users`, {
        headers: this.getHeader(),
        withCredentials: true, // Enable credentials
      });

      return response.data;
    } catch (error) {
      console.error("Error get all user:", error);
      throw error;
    }
  }

  
  /** Reset defaultPassword user */
  static async forgetPassword(
    formData: UserFormData
  ): Promise<UserApiResponse> {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/users/auth/forgot`,
        formData,
        {
          headers: this.getHeader(formData),
          withCredentials: true, // Enable credentials
        }
      );
      console.log("response", response.data);
      return response.data;
    } catch (error) {
      console.error("Error Reset defaultPassword:", error);
      throw error;
    }
  }

  /** Get user by ID */
  static async getUserById(userId: string): Promise<UserApiResponse> {
    try {
      const response = await axios.get(`${this.BASE_URL}/users/${userId}`, {
        headers: this.getHeader(),
        withCredentials: true, // Enable credentials
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${userId}:`, error);
      throw error;
    }
  }

  /** Update user by ID */
  static async updateUserById(
    userId: string,
    updatedData: UserFormData
  ): Promise<UserApiResponse> {
    try {
      const response = await axios.put(
        `${this.BASE_URL}/users/${userId}`,
        updatedData,
        {
          headers: this.getHeader(updatedData),
          withCredentials: true, // Enable credentials
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating user with ID ${userId}:`, error);
      throw error;
    }
  }

  /** Delete user */
  static async deleteUser(userId: string): Promise<UserApiResponse> {
    try {
      const response = await axios.delete(
        `${this.BASE_URL}/user/${userId}`,
        {
          headers: this.getHeader(),
          withCredentials: true, // Enable credentials
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting user with ID ${userId}:`, error);
      throw error;
    }
  }

 //**** ORGANIZATION ROUTE *** */

  /** Add a new organization */
  static async addOrganization(orgData: any): Promise<any> {
    try {
      const requestData = { organizations: [orgData] }; // Try with organizations field
      
      
      const response = await axios.post(
        `${this.BASE_URL}/organizations/bulk`,
        requestData,
        {
          headers: this.getHeader(orgData),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding organization:", error);
      throw error;
    }
  }
   static async getAllOrganization(): Promise<any> {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/organizations/all`,

        {
          headers: this.getHeader(),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding organization:", error);
      throw error;
    }
  }
    static async getOrganizationById(orgId:string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/organizations/${orgId}`,

        {
          headers: this.getHeader(),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding organization:", error);
      throw error;
    }
  }
  static async updateOrganizationById(orgId:string,orgData: any): Promise<any> {
    try {
      const response = await axios.put(
        `${this.BASE_URL}/organizations/${orgId}`,
        orgData,
        {
          headers: this.getHeader(orgData),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding organization:", error);
      throw error;
    }
  }

  /** get venue by organization Id */
  static async getVenueByOrganizationId(orgId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/organizations/${orgId}/venues`,
        {
          headers: this.getHeader(),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching venues for organization with ID ${orgId}:`, error);
      throw error;
    }
  }

  /** Delete organization */
  static async deleteOrganization(orgId: string): Promise<any> {
    try {
      const response = await axios.delete(
        `${this.BASE_URL}/organizations/${orgId}`,
        {
          headers: this.getHeader(),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting organization with ID ${orgId}:`, error);
      throw error;
    }
  }

  //**** RESOURCE ROUTE *** */

  /** Get all resources */
  static async getAllResource(): Promise<any> {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/resources/find-all`,
        {
          headers: this.getHeader(),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  }

  /** Add a new resource */
  static async addResource(resourceData: { 
    resourceName: string;
    description: string;
    costPerUnit: number;
    quantity: number;
  }): Promise<any> {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/resources/create-resource`,
        resourceData,
        {
          headers: this.getHeader(resourceData),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding resource:", error);
      throw error;
    }
  }

  /** Get resource by ID */
  static async getResourceById(resourceId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/resources/find-one/${resourceId}`,
        {
          headers: this.getHeader(),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching resource with ID ${resourceId}:`, error);
      throw error;
    }
  }

  /** Update resource by ID */
  static async updateResourceById(resourceId: string, resourceData: any): Promise<any> {
    try {
      const response = await axios.put(
        `${this.BASE_URL}/resources/update-resource/${resourceId}`,
        resourceData,
        {
          headers: this.getHeader(resourceData),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating resource with ID ${resourceId}:`, error);
      throw error;
    }
  }

  /** Delete resource */
  static async deleteResource(resourceId: string): Promise<any> {
    try {
      const response = await axios.delete(
        `${this.BASE_URL}/resources/delete-resource/${resourceId}`,
        {
          headers: this.getHeader(),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting resource with ID ${resourceId}:`, error);
      throw error;
    }
  }

  //**** AMENITIES ROUTE *** */

  /** Add user to organization */
  static async addUserToOrganization(userId: string, orgId: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/organizations/${orgId}/users`,
        { userId },
        {
          headers: this.getHeader(),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error adding user with ID ${userId} to organization with ID ${orgId}:`, error);
      throw error;
    }
  }


/**** VENUES**** */

/** add new venues */
static async addNewVenue(venueData: any): Promise<any> {
  try { 
    const response = await axios.post(
      `${this.BASE_URL}/venue/add`,
      venueData,
      {
        headers: this.getHeader(venueData),
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding new venue:", error);        
    throw error;
  }
} 

  /** add venue to organization */



static async addVenueToOrganization(
  orgId: string,
  venueIds: string | string[]
): Promise<any> {
  try {
    // Normalize to array
    const idsArray = Array.isArray(venueIds) ? venueIds : [venueIds];

    const response = await axios.post(
      `${this.BASE_URL}/organizations/${orgId}/venues`,
      { venueIds: idsArray },
      {
        headers: this.getHeader(),
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error adding venue(s) to organization with ID ${orgId}:`, error);
    throw error;
  }
}



/** Get all venues by organizationId */
static async getVenuesByOrganizationId(orgId: string): Promise<any> {
  try {
    const response = await axios.get(
      `${this.BASE_URL}/organizations/${orgId}/venues`,
      {
        headers: this.getHeader(),
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching venues for organization with ID ${orgId}:`, error);
    throw error;
  }
}

/** remove venue from organization */
static async removeVenueFromOrganization(
  orgId: string,
 venueIds: string | string[]
): Promise<any> {
  try {
    // Normalize to array
    const idsArray = Array.isArray(venueIds) ? venueIds : [venueIds];
    const response = await axios.post(
      `${this.BASE_URL}/organizations/${orgId}/venues`,
      { venueIds: idsArray },
      {
        headers: this.getHeader(),
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error removing venue(s) from organization with ID ${orgId}:`, error);
    throw error;
  }
}





/** Create a new venue */
  static async createVenue(venueData: any): Promise<any> {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/venue/add-with-resources`,
        venueData,
        {
          headers: this.getHeader(venueData),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating venue:", error);
      throw error;
    }
  }
  /** Get all venues */
  static async getAllVenues(): Promise<any> {
    try {
      const response = await axios.get(`${this.BASE_URL}/venue/all`, {
        headers: this.getHeader(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all venues:", error);
      throw error;
    }
  }

  /** Get venue by ID */
  static async getVenueById(venueId: string): Promise<any> {      
    try {
      const response = await axios.get(`${this.BASE_URL}/venue/get/${venueId}`, {
        headers: this.getHeader(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching venue with ID ${venueId}:`, error);
      throw error;
    }
  }

  /** get venue by managerId*/
  static async getVenueByManagerId(managerId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.BASE_URL}/venue/manager-venues/${managerId}`, {
        headers: this.getHeader(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching venue with manager ID ${managerId}:`, error);
      throw error;
    }
  } 

  /** Update venue by ID */
  static async updateVenueById(
venueId: string, data: any): Promise<any> {  
    try {
      const response = await axios.put(
        `${this.BASE_URL}/venue/update/${venueId}`,
        {},
        {
          headers: this.getHeader(),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating venue with ID ${venueId}:`, error);
      throw error;
    }
}

/** update venue manager */
  static async updateVenueManager(
    venueId: string,
    managerId: string
  ): Promise<any> {
    try {
      const response = await axios.put(
        `${this.BASE_URL}/venue/updateVenueManager//${venueId}`,
        { managerId },
        {
          headers: this.getHeader(),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating manager for venue with ID ${venueId}:`, error);
      throw error;
    }
  }

  /** Delete venue */
  static async deleteVenue(venueId: string): Promise<any> {
    try {
      const response = await axios.delete(`${this.BASE_URL}/venue/remove/${venueId}`, {
        headers: this.getHeader(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting venue with ID ${venueId}:`, error);
      throw error;
    }
  }

  /*add-venue-require-admin-but-manager-available */
  static async addVenueRequireAdminButManagerAvailable( venueData: any): Promise<any> {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/venue/add`,
        venueData,
        {
          headers: this.getHeader(venueData),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating venue:", error);
      throw error;
    }
  }

  /* get available venue with request params startDate,endDate,startTime,endTime */
  static async getAvailableVenues(
    startDate: string,
    endDate: string,
    startTime: string,
    endTime: string,
    organizationId?: string
  ): Promise<any> {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/venue/available-venues`,
        {
          params: {
            startDate,
            endDate,
            startTime,
            endTime,
            ...(organizationId ? { organizationId } : {})
          },
          headers: this.getHeader(),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching available venues:", error);
      throw error;
    }
  }



  /** Aprove venue */
  static async approveVenue(venueId: string): Promise<any> {
    try {
      const response = await axios.put(
        `${this.BASE_URL}/venue/approve/${venueId}`,
        {},
        {
          headers: this.getHeader(),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error approving venue with ID ${venueId}:`, error);
      throw error;
    }
  }

  /*** cancel venue */
static async cancelVenue(venueId: string, data: any): Promise<any> {
  try {
    const response = await axios.put(
      `${this.BASE_URL}/venue/cancel/${venueId}`,
      data,
      {
        headers: this.getHeader(),
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error canceling venue with ID ${venueId}:`, error);
    throw error;
  }   
}

  /**************************************** */

            /** EVENT ******* */

  static async createEvent(eventData: any): Promise<any> {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/event`,
        eventData,
        {
          headers: this.getHeader(eventData),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  }

  /** Get all events */
  static async getAllEvents(): Promise<any> {
    try {
      const response = await axios.get(`${this.BASE_URL}/event`, {
        headers: this.getHeader(),
         withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all events:", error);
      throw error;
    }
  }

  /** Update event by ID */
  static async updateEventById(eventId: string, data: any): Promise<any> {
    try {
      const response = await axios.put(
        `${this.BASE_URL}/event/${eventId}`,
        data,
        {
          headers: this.getHeader(),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating event with ID ${eventId}:`, error);
      throw error;
    }
  }

  /** Get event by ID */
  static async getEventById(eventId: string): Promise<any> {  
    try {
      const response = await axios.get(`${this.BASE_URL}/event/${eventId}`, {
        headers: this.getHeader(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching event with ID ${eventId}:`, error);
      throw error;
    }
  }
  
/*** aprove event booking** */
static async approveEventBooking(eventId: string, data: any): Promise<any> {
  try {
    const response = await axios.put(
      `${this.BASE_URL}/event/approve/${eventId}`,
      data,
      {
        headers: this.getHeader(),
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error approving event booking with ID ${eventId}:`, error);
    throw error;
  }
}



/** vENUE BOOKING   */

/** get all booking */
static async getAllBookings(): Promise<any> {
  try {
    const response = await axios.get(`${this.BASE_URL}/venue-bookings`, {
      headers: this.getHeader(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    throw error;
  }


}

/*** get booking by bookingId**/
static async getBookingById(bookingId: string): Promise<any> {
  try {
    const response = await axios.get(`${this.BASE_URL}/venue-bookings/${bookingId}`, {
      headers: this.getHeader(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching booking with ID ${bookingId}:`, error);
    throw error;
  } 
}

/** get booking by status**/
static async getBookingByStatus(): Promise<any> {
  try {
    const response = await axios.get(`${this.BASE_URL}/event-bookings/status/pending`, {
      headers: this.getHeader(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching bookings with status :`, error);
    throw error;
  }
}

/*****  get booking by organizationId */
static async getBookingByOrganizationId(orgId: string): Promise<any> {
  try {
    const response = await axios.get(`${this.BASE_URL}/venue-bookings/organization/${orgId}`, {
      headers: this.getHeader(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching bookings for organization with ID ${orgId}:`, error);
    throw error;
  }

}


/*** get booking by venueID*/

static async getBookingByVenueId(venueId: string): Promise<any> {
  try {
    const response = await axios.get(`${this.BASE_URL}/venue-bookings/venue/${venueId}`, {
      headers: this.getHeader(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching bookings for venue with ID ${venueId}:`, error);
    throw error;
  }
}

/*** get booking by eventId*/
static async getBookingByEventId(eventId: string): Promise<any> {
  try {
    const response = await axios.get(`${this.BASE_URL}/venue-bookings/event/${eventId}`, {
      headers: this.getHeader(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching bookings for event with ID ${eventId}:`, error);
    throw error;
  }}


}
export default ApiService;
