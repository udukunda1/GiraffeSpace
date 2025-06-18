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
      ? "https://agrlink-backend.onrender.com/agritech/v1"
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
    console.log("hdtdrwywywuwuwiwqq");
    try {
      console.log("in try brock");
      const response = await axios.post(
        `${this.BASE_URL}/users/auth/register`,
        formData,
        {
          headers: this.getHeader(formData),
          withCredentials: true, // Enable credentials
        }
      );
      console.log("hdtdrwywywuwuwiwqq");
      console.log("response", response.data);
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
          withCredentials: true, // Enable credentials
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
  ): Promise<{ success: boolean; token?: string }> {
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
      return { success: response.data.success, token: response.data.token };
    } catch (error) {
      console.error("Error logging in with default password:", error);
      return { success: false };
    }
  }

  /** Get all users */
  static async getAllUser(): Promise<UserApiResponse> {
    try {
      const response = await axios.get(`${this.BASE_URL}/user/getAll`, {
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
        `${this.BASE_URL}/user/delete/${userId}`,
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

  static logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }

  static isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    return !!token;
  }

  static getUserRole(): string | null {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.role ?? null;
    } catch {
      return null;
    }
  }

  static isUser(): boolean {
    return this.getUserRole() === "Buyer";
  }

  static isSeller(): boolean {
    return this.getUserRole() === "Seller";
  }

  static isAdmin(): boolean {
    return this.getUserRole() === "Admin";
  }

  /** Add a new organization */
  static async addOrganization(orgData: any): Promise<any> {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/organizations`,
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
}

export default ApiService;