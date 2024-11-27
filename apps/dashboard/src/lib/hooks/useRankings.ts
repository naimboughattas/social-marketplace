import { useState, useEffect } from 'react';
import { mockInfluencers } from '../mock-data';

interface RankingInfluencer {
  rank: number;
  username: string;
  avatar: string;
  points: number;
  country: string;
  city: string;
}

export function useRankings() {
  const [globalRankings, setGlobalRankings] = useState<RankingInfluencer[]>([]);
  const [countryRankings, setCountryRankings] = useState<Record<string, RankingInfluencer[]>>({});
  const [cityRankings, setCityRankings] = useState<Record<string, RankingInfluencer[]>>({});

  useEffect(() => {
    // Simuler le chargement des classements depuis une API
    const rankings = mockInfluencers
      .map((inf, index) => ({
        rank: index + 1,
        username: inf.username,
        avatar: inf.profileImage,
        points: Math.floor(Math.random() * 10000),
        country: inf.country,
        city: inf.city
      }))
      .sort((a, b) => b.points - a.points)
      .map((inf, index) => ({ ...inf, rank: index + 1 }));

    // Classement global
    setGlobalRankings(rankings);

    // Classement par pays
    const byCountry = rankings.reduce((acc, curr) => {
      if (!acc[curr.country]) {
        acc[curr.country] = [];
      }
      acc[curr.country].push(curr);
      return acc;
    }, {} as Record<string, RankingInfluencer[]>);

    // Trier chaque pays
    Object.keys(byCountry).forEach(country => {
      byCountry[country].sort((a, b) => b.points - a.points);
      byCountry[country] = byCountry[country].map((inf, index) => ({
        ...inf,
        rank: index + 1
      }));
    });
    setCountryRankings(byCountry);

    // Classement par ville
    const byCity = rankings.reduce((acc, curr) => {
      if (!acc[curr.city]) {
        acc[curr.city] = [];
      }
      acc[curr.city].push(curr);
      return acc;
    }, {} as Record<string, RankingInfluencer[]>);

    // Trier chaque ville
    Object.keys(byCity).forEach(city => {
      byCity[city].sort((a, b) => b.points - a.points);
      byCity[city] = byCity[city].map((inf, index) => ({
        ...inf,
        rank: index + 1
      }));
    });
    setCityRankings(byCity);
  }, []);

  return {
    globalRankings,
    countryRankings,
    cityRankings
  };
}