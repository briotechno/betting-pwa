import { fetchAPI, ApiResponse } from '../../utils/api';

export const walletController = {
  /**
   * List of available deposit methods / platform bank accounts
   * @param loginToken The encrypted session token
   */
  getDepositMethods: async (loginToken: string): Promise<ApiResponse> => {
    return await fetchAPI('/depositlist', { LoginToken: loginToken });
  },

  /**
   * Submit a deposit request with UTR and (optional) screenshot
   * @param data The deposit request data
   */
  requestDeposit: async (data: {
    LoginToken: string;
    Amount: string | number;
    Utr: string;
    BankId: string;
    Mime_type?: string;
    Screenshot?: string; // base64
  }): Promise<ApiResponse> => {
    return await fetchAPI('/deposit', data);
  },

  /**
   * Get user's deposit history
   * @param loginToken The encrypted session token
   */
  getDepositHistory: async (loginToken: string): Promise<ApiResponse> => {
    return await fetchAPI('/depositreq', { LoginToken: loginToken });
  },

  /**
   * Save bank account details for withdrawal
   * @param data The bank account request data
   */
  saveBankAccount: async (data: {
    LoginToken: string;
    ACname: string;
    Bank: string;
    ACholdername: string;
    ACno: string;
    Isfc: string;
  }): Promise<ApiResponse> => {
    return await fetchAPI('/bankac', data);
  },

  /**
   * Get user's saved bank accounts
   * @param loginToken The encrypted session token
   */
  getBankAccounts: async (loginToken: string): Promise<ApiResponse> => {
    return await fetchAPI('/useraclist', { LoginToken: loginToken });
  },

  /**
   * Delete a saved bank account
   * @param loginToken The encrypted session token
   * @param accountId The bank account ID
   */
  deleteBankAccount: async (loginToken: string, accountId: string | number): Promise<ApiResponse> => {
    return await fetchAPI('/delbankac', { LoginToken: loginToken, Id: accountId });
  },

  /**
   * Submit a withdrawal request
   * @param loginToken The encrypted session token
   * @param accountId Requested withdrawal bank account ID
   * @param amount The withdrawal amount
   */
  requestWithdrawal: async (loginToken: string, accountId: string | number, amount: string | number): Promise<ApiResponse> => {
    return await fetchAPI('/withdraw', { LoginToken: loginToken, Id: accountId, Amount: amount });
  },

  /**
   * Get user's withdrawal history
   * @param loginToken The encrypted session token
   * @param accountId Filter by specific account ID (optional)
   */
  getWithdrawalHistory: async (loginToken: string, accountId?: string | number): Promise<ApiResponse> => {
    return await fetchAPI('/withdrawlist', { LoginToken: loginToken, Id: accountId || '' });
  },

  /**
   * Get standard transaction context / account statement
   * @param loginToken The encrypted session token
   * @param sdate Start date (YYYY-MM-DD or similar string)
   * @param edate End date (YYYY-MM-DD)
   */
  getAccountStatement: async (loginToken: string, sdate: string, edate: string): Promise<ApiResponse> => {
    return await fetchAPI('/statement', { LoginToken: loginToken, sdate, edate });
  },

  /**
   * Get bet list/statement for a particular game ID
   * @param gid The unique game ID
   */
  getBetStatement: async (gid: string): Promise<ApiResponse> => {
    return await fetchAPI('/statementbet', { gid });
  },
};
