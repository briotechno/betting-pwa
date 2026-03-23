import { fetchAPI, ApiResponse } from '../../utils/api';

/**
 * Controller for managing account and bet statements
 */
export const statementController = {
  /**
   * Get standard transaction context / account statement
   * @param loginToken The encrypted session token
   * @param sdate Start date (YYYY-MM-DD)
   * @param edate End date (YYYY-MM-DD)
   */
  getAccountStatement: async (loginToken: string, sdate: string, edate: string): Promise<ApiResponse> => {
    return await fetchAPI('/statement', { LoginToken: loginToken, sdate, edate });
  },

  /**
   * Get bet list/statement for a particular event ID
   * @param Eid The unique event/game ID
   * @param loginToken session token
   */
  getBetStatement: async (Eid: string, loginToken: string): Promise<ApiResponse> => {
    return await fetchAPI('/statementbet', { Eid, LoginToken: loginToken });
  },
};
