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
  requestWithdrawal: async (loginToken: string, accountId: string | number, amount: string | number, ip: string): Promise<ApiResponse> => {
    return await fetchAPI('/withdraw', { LoginToken: loginToken, Id: accountId, Amount: amount, IP: ip });
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
   * Submit a USDT deposit request
   * @param data The USDT deposit request data
   */
  depositUSDT: async (data: {
    LoginToken: string;
    Amount: string;
    usdt_ref: string;
    Mime_type: string;
    Screenshot: string; // base64
    txhash: string;
  }): Promise<ApiResponse> => {
    return await fetchAPI('/depositusdt', data);
  },

  /**
   * Update USDT wallet details
   * @param data The USDT wallet update data
   */
  updateUSDTWallet: async (data: {
    LoginToken: string;
    Waddress: string;
    Mime_type: string;
    Screenshot: string; // base64 QR
  }): Promise<ApiResponse> => {
    return await fetchAPI('/usdtwalletupdate', data);
  },

  /**
   * Fetch USDT wallet details
   * @param loginToken The user's login token
   */
  getUSDTWallet: async (loginToken: string): Promise<ApiResponse> => {
    return await fetchAPI('/usdtwallet', { LoginToken: loginToken });
  },

  /**
   * Submit a USDT withdrawal request
   * @param data The USDT withdrawal data
   */
  withdrawUSDT: async (data: {
    LoginToken: string;
    Amount: string;
    WalletAddress: string;
    Remark: string;
  }): Promise<ApiResponse> => {
    return await fetchAPI('/withdrawusdt', data);
  },
};
