import { fetchAPI, ApiResponse } from '../../utils/api';

export const userController = {
  /**
   * Get user balance and exposure
   * @param loginToken The encrypted session token
   */
  getBalance: async (loginToken: string): Promise<ApiResponse> => {
    return await fetchAPI('/balance', { LoginToken: loginToken });
  },

  /**
   * Update stake button settings
   * @param loginToken The encrypted session token
   * @param stakes Object containing Label1 ... Stake6
   */
  editStake: async (loginToken: string, stakes: Record<string, string | number>): Promise<ApiResponse> => {
    return await fetchAPI('/editstake', { LoginToken: loginToken, ...stakes });
  },

  /**
   * Get user configured stake buttons
   * @param loginToken The encrypted session token
   */
  getStakeButtons: async (loginToken: string): Promise<ApiResponse> => {
    return await fetchAPI('/stakebutton', { LoginToken: loginToken });
  },

  /**
   * Get list of general offers
   * @param loginToken The encrypted session token
   */
  getOffers: async (loginToken: string): Promise<ApiResponse> => {
    return await fetchAPI('/offers', { LoginToken: loginToken });
  },

  /**
   * Get specific offer details
   * @param loginToken The encrypted session token
   * @param offerId The unique offer ID
   */
  getOfferDetail: async (loginToken: string, offerId: string): Promise<ApiResponse> => {
    return await fetchAPI('/offersdetail', { LoginToken: loginToken, OfferId: offerId });
  },

  /**
   * Claim an offer
   * @param loginToken The encrypted session token
   * @param offerId The unique offer ID
   */
  claimOffer: async (loginToken: string, offerId: string): Promise<ApiResponse> => {
    // Note: URL identical to offersdetail in spec
    return await fetchAPI('/offersdetail', { LoginToken: loginToken, OfferId: offerId });
  },

  /**
   * Get latest news
   * @param loginToken The encrypted session token
   */
  getNews: async (loginToken: string): Promise<ApiResponse> => {
    return await fetchAPI('/news', { LoginToken: loginToken });
  },

  /**
   * Get popup image (base64)
   * @param loginToken The encrypted session token
   */
  getPopupImage: async (loginToken: string): Promise<ApiResponse> => {
    return await fetchAPI('/popupimg', { LoginToken: loginToken });
  },

  /**
   * Add or remove an event from favorites
   * @param loginToken The encrypted session token
   * @param eid The event ID
   */
  toggleFavourite: async (loginToken: string, eid: string): Promise<ApiResponse> => {
    return await fetchAPI('/favourite', { LoginToken: loginToken, Eid: eid });
  },

  /**
   * Get account statement (Profit/Loss history)
   * @param loginToken The encrypted session token
   * @param sdate Start date (dd-mm-yyyy)
   * @param edate End date (dd-mm-yyyy)
   */
  getAccountStatement: async (loginToken: string, sdate: string, edate: string): Promise<ApiResponse> => {
    return await fetchAPI('/statement', { LoginToken: loginToken, sdate, edate });
  },
};
