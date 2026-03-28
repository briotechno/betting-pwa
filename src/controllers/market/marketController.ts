import { fetchAPI, ApiResponse } from '../../utils/api';

export const marketController = {
  /**
   * Get list of market games by type (e.g. "Cricket,Football")
   * @param type The sports types comma separated
   */
  getGameList: async (type: string): Promise<ApiResponse> => {
    return await fetchAPI('/gamelist', { type });
  },

  /**
   * Get list of competitions by type
   * @param type The sport type (e.g. "Cricket", "Football")
   */
  getCompetitionList: async (type: string): Promise<ApiResponse> => {
    return await fetchAPI('/competition', { type });
  },

  /**
   * Get games for a specific competition
   * @param code The competition code (e.g. "101480")
   */
  getCompetitionGames: async (code: string): Promise<ApiResponse> => {
    return await fetchAPI('/competitiongames', { code });
  },

  /**
   * Get dynamic match rates/odds
   * @param marketId Comma separated market IDs
   */
  getLiveRates: async (marketId: string): Promise<ApiResponse> => {
    return await fetchAPI('/liverate', { MarketId: marketId });
  },

  /**
   * Get detailed game/event information (no login)
   * @param gid The game ID
   */
  getGameData: async (gid: string): Promise<ApiResponse> => {
    return await fetchAPI('/gamedata', { gid });
  },

  /**
   * Get rate for a particular game selection
   * @param data The game/market/event criteria
   */
  getGameRate: async (data: { gid: string; MarketId: string; eventid: string }): Promise<ApiResponse> => {
    return await fetchAPI('/gamerate', data);
  },

  /**
   * Get specialized event data for authenticated users
   * @param loginToken The encrypted session token
   * @param gid The game ID
   */
  getGameDataLogin: async (loginToken: string, gid: string): Promise<ApiResponse> => {
    return await fetchAPI('/gamedatalogin', { LoginToken: loginToken, gid });
  },

  /**
   * Get popular events
   */
  getPopularEvents: async (loginToken: string): Promise<ApiResponse> => {
    return await fetchAPI('/populareve', { LoginToken: loginToken });
  },

  /**
   * Search for games / events
   * @param loginToken The encrypted session token
   * @param keyword The search query
   */
  search: async (loginToken: string, keyword: string): Promise<ApiResponse> => {
    return await fetchAPI('/search', { LoginToken: loginToken, Keyword: keyword });
  },

  /**
   * Get multi market configurations for a user
   * @param loginToken The encrypted session token
   */
  getMultiMarketList: async (loginToken: string): Promise<ApiResponse> => {
    return await fetchAPI('/multimarket', { LoginToken: loginToken });
  },

  /**
   * Get rates for multiple market keys synchronously
   * @param marketId Master market string or placeholder
   * @param ids Bulk request array of gid/eid keys
   */
  getMultiMarketRate: async (marketId: string, ids: Array<{ gkey: string; ekey: string }>): Promise<ApiResponse> => {
    return await fetchAPI('/multimarketrate', { MarketId: marketId, Ids: ids });
  },

  /**
   * Get market analysis for live insights
   * @param loginToken The encrypted session token
   */
  getMarketAnalysis: async (loginToken: string): Promise<ApiResponse> => {
    return await fetchAPI('/marketanay', { LoginToken: loginToken });
  },
};
