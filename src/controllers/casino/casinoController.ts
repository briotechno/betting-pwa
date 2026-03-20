import { fetchAPI, ApiResponse } from '../../utils/api';

export const casinoController = {
  /**
   * Get list of available casino games by provider
   * @param provider The game provider string (e.g., "Spribe")
   */
  getCasinoGames: async (provider: string): Promise<ApiResponse> => {
    return await fetchAPI('/casinolist', { provider });
  },

  /**
   * Get authenticated URL to launch a casino game
   * @param data The game criteria (LoginToken, Game_id, Game_code)
   */
  openCasinoGame: async (data: {
    LoginToken: string;
    Game_id: string;
    Game_code: string;
  }): Promise<ApiResponse> => {
    return await fetchAPI('/csopen', data);
  },

  /**
   * Get authenticated URL for the sportsbook client
   * @param loginToken The encrypted session token
   */
  openSportsbook: async (loginToken: string): Promise<ApiResponse> => {
    // Note: URL identical to csopen in spec
    return await fetchAPI('/csopen', { LoginToken: loginToken });
  },
};
