import { fetchAPI, ApiResponse } from '../../utils/api';

export const authController = {
  /**
   * Check if a username is available
   * @param username The username to check
   */
  checkUsername: async (username: string): Promise<ApiResponse> => {
    return await fetchAPI('/namecheck', { username });
  },

  /**
   * Send OTP to a mobile number
   * @param mobile The mobile number to send OTP to
   */
  sendOtp: async (mobile: string): Promise<ApiResponse> => {
    return await fetchAPI('/sendotp', { mobile });
  },

  /**
   * Create a new user account
   * @param data User registration data
   */
  createUser: async (data: { username: string; password: string; mobile: string; otp: string }): Promise<ApiResponse> => {
    return await fetchAPI('/createuser', data);
  },

  /**
   * Login a user
   * @param data Login credentials
   */
  login: async (data: { username: string; password: string; ip: string }): Promise<ApiResponse> => {
    return await fetchAPI('/login', data);
  },

  /**
   * Change user password
   * @param data Password change data
   */
  changePassword: async (data: { loginToken: string; oldpassword: string; newpassword: string }): Promise<ApiResponse> => {
    const { loginToken, ...rest } = data;
    return await fetchAPI('/changepass', { LoginToken: loginToken, ...rest });
  },

  /**
   * Initiate forgot password process
   * @param mobile The registered mobile number
   */
  forgotPassword: async (mobile: string): Promise<ApiResponse> => {
    return await fetchAPI('/forgotpass', { Mobile: mobile });
  },
};
