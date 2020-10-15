import './filers.css';
import React from 'react';
import AutoComplete from 'react-select';


function AutoSelectFilter({ options, name, onChange }) {
  return (<div className="input-group">
    <div className="input-group-prepend">
      <label className="input-group-text">{name}</label>
    </div>
    <AutoComplete className="my-select-class" options={options} isMulti name={name} onChange={onChange} />
  </div>);
}

function BasicInput({ name, value, onChange }) {
  const parseValue = (event) =>  {
    onChange(event.currentTarget.value)
  }
  return <div className="input-group">
    <div className="input-group-prepend">
      <span className="input-group-text">{name}</span>
    </div>
    <input type="text" className="form-control" value={value} onChange={parseValue} />
  </div>;
}

export function BazarekFilters({ Tag, Review, Category, reviewsCount, price,limit, search, onChangeCategories, onChangeReviews, onChangeTags, onChangeReviewsCount, onChangePrice, onChangeLimit, onChangeSearch }) {
  const parser = t => ({ value: t.ID, label: t.Name });
  const tags = Tag.map(parser);
  const reviews = Review.map(parser);
  const categories = Category.map(parser);
  return <>
    <AutoSelectFilter onChange={onChangeCategories} options={categories} name="Categories" />
    <AutoSelectFilter onChange={onChangeReviews} options={reviews} name="Reviews" />
    <AutoSelectFilter onChange={onChangeTags} options={tags} name="Tags" />
    <BasicInput name="Reviews Count" value={reviewsCount} onChange={onChangeReviewsCount} />
    <BasicInput name="Max Price" value={price} onChange={onChangePrice} />
    <BasicInput name="Limit" value={limit} onChange={onChangeLimit} />
    <BasicInput name="search" value={search} onChange={onChangeSearch} />
  </>;
}