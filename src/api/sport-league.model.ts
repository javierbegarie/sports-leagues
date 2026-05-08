export interface SportLeague {
  id: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate: string;
  strBadge: string;
}

export interface LeagueFilters {
  search?: string;
  sports?: string[];
}
