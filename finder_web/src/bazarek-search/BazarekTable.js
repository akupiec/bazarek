import React, { useEffect, useState } from 'react';
import { GenericTable } from './GenericTable/GenericTable';
import { BazarekFilters } from './BazarekFilters/BazarekFilters';
import { fetchGames, fetchPickers } from '../utils/finder.service';

export function BazarekTable({columns}) {
  const [games, setGames] = useState([]);
  const [pickers, setPickers] = useState({});
  const [filters, setFilters] = useState({
    limit: 40,
    search: '',
    price: 10,
    reviewsCount: 10,
    review: [],
    tag: [],
    category: [],
    gameType: [],
    reviewsAnd: false,
    tagsAnd: false,
    categoriesAnd: false,
  });

  useEffect(() => {
    fetchGames(filters).then(g => setGames(g));
    fetchPickers().then(p => setPickers(p));
  }, []);

  const onFilterChange = (newFilters) => {
    setFilters(newFilters)
    fetchGames(newFilters).then(g => setGames(g))
  }
  const doSearch = () => {
    fetchGames(filters).then(g => setGames(g))
  }

  return (
    <>
      <BazarekFilters pickers={pickers} filters={filters} setFilters={onFilterChange} />
      <GenericTable data={games} columns={columns} onDataChange={doSearch} />
    </>
  );
}

