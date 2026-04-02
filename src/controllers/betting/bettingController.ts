import { fetchAPI, ApiResponse } from '../../utils/api';

export const bettingController = {
  /**
   * Place an odds bet on a 2-team selection (e.g. Win/Loss)
   * @param data The bet criteria (Team, Type (B/L))
   */
  place2TeamOddBet: async (data: {
    LoginToken: string;
    Eid: string;
    Amount: string | number;
    Rate: string | number;
    IP: string;
    Team: 'A' | 'B';
    Type: 'B' | 'L'; // Back or Lay
  }): Promise<ApiResponse> => {
    return await fetchAPI('/livedealodd2', data);
  },

  /**
   * Place an odds bet on a 3-team selection (e.g. Win/Loss/Draw)
   * @param data The bet criteria (Team, Type (B/L))
   */
  place3TeamOddBet: async (data: {
    LoginToken: string;
    Eid: string;
    Amount: string | number;
    Rate: string | number;
    IP: string;
    Team: 'A' | 'B' | 'C';
    Type: 'B' | 'L';
  }): Promise<ApiResponse> => {
    return await fetchAPI('/livedealodd3', data);
  },

  /**
   * Place a Bookmaker odds bet
   */
  placeBookmakerBet: async (data: any): Promise<ApiResponse> => {
    return await fetchAPI('/bookdealbodd', data);
  },

  /**
   * Place a fancy market bet (Yes/No)
   * @param data The bet criteria (Eid, No, Yes)
   */
  placeFancyBet: async (data: {
    LoginToken: string;
    Eid: string;
    Amount: string | number;
    Rate: string | number;
    IP: string;
    No: string | number;
    Yes: string | number;
    Type: 'B' | 'L';
  }): Promise<ApiResponse> => {
    return await fetchAPI('/dealfancy', data);
  },

  /**
   * Get fancy market chart visualization data
   * @param loginToken The encrypted session token
   * @param eid The event ID
   */
  getFancyChart: async (loginToken: string, eid: string): Promise<ApiResponse> => {
    return await fetchAPI('/fancychart', { LoginToken: loginToken, Eid: eid });
  },

  /**
   * Place line market bet
   */
  placeLineBet: async (data: any): Promise<ApiResponse> => {
    return await fetchAPI('/dealline', data);
  },

  /**
   * Place extra or goal market bet
   */
  placeExtraBet: async (data: any): Promise<ApiResponse> => {
    // Note: Same URL for extra and goal in spec
    return await fetchAPI('/dealextra', data);
  },

  /**
   * Place a racing or winner selection bet
   * @param data The selection information
   */
  placeWinnerBet: async (data: {
    LoginToken: string;
    Eid: string;
    Amount: string | number;
    Rate: string | number;
    IP: string;
    SelectionId: string;
    Type: 'B' | 'L';
  }): Promise<ApiResponse> => {
    return await fetchAPI('/dealwinner', data);
  },

  /**
   * Execute early cashout for active bets
   * @param loginToken The encrypted session token
   * @param eid The event ID
   */
  cashout: async (loginToken: string, eid: string): Promise<ApiResponse> => {
    return await fetchAPI('/cashout', { LoginToken: loginToken, Eid: eid });
  },

  /**
   * Get user bet history (all games)
   * @param loginToken The encrypted session token
   */
  getMyBets: async (loginToken: string): Promise<ApiResponse> => {
    return await fetchAPI('/mybets', { LoginToken: loginToken });
  },

  /**
   * Get bets for a particular game
   * @param loginToken The encrypted session token
   * @param gid The game ID
   */
  getBetsByGame: async (loginToken: string, gid: string): Promise<ApiResponse> => {
    return await fetchAPI('/sidebetlist', { LoginToken: loginToken, gid });
  },
};
