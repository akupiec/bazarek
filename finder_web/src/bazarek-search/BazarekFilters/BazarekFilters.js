import './filers.scss';
import React from 'react';
import AutoComplete from 'react-select';


function AutoSelectFilter({ options, name, onChange, and, onAndChange }) {
  const onChangeValues = (opts) => onChange(opts?.map(o => o.value) || [])

  let btnClassName = 'btn btn-outline-secondary';
  if (and) {
    btnClassName += ' active';
  }

  return (<div className={'input-group filter-' + name}>
    <div className="input-group-prepend">
      <button className={btnClassName} type="button" onClick={() => onAndChange(!and)}>&</button>
    </div>
    <div className="input-group-prepend">
      <label className="input-group-text">{name}</label>
    </div>
    <AutoComplete className="my-select-class" options={options} isMulti name={name} onChange={onChangeValues} />
  </div>);
}

function BasicInput({ name, value, onChange }) {
  const parseValue = (event) => {
    onChange(event.currentTarget.value);
  };
  return <div className={'input-group filter-' + name}>
    <div className="input-group-prepend">
      <span className="input-group-text">{name}</span>
    </div>
    <input type="text" className="form-control" value={value} onChange={parseValue} />
  </div>;
}

export function BazarekFilters({ pickers, filters, setFilters }) {
  const parser = t => ({ value: t.ID, label: t.Name });
  const tags = pickers.Tag?.map(parser);
  const reviews = pickers.Review?.map(parser);
  const categories = pickers.Category?.map(parser);

  const onChange = (name) => ev => setFilters({ ...filters, [name]: ev });
  return <div className="grid-filters">
    <AutoSelectFilter onChange={onChange('category')} options={categories} and={filters.categoriesAnd} onAndChange={onChange('categoriesAnd')} name="Categories" />
    <AutoSelectFilter onChange={onChange('review')} options={reviews} and={filters.reviewsAnd} onAndChange={onChange('reviewsAnd')} name="Reviews" />
    <AutoSelectFilter onChange={onChange('tag')} options={tags} and={filters.tagsAnd} onAndChange={onChange('tagsAnd')} name="Tags" />
    <BasicInput name="Reviews_Count" value={filters.reviewsCount} onChange={onChange('reviewsCount')} />
    <BasicInput name="Max Price" value={filters.price} onChange={onChange('price')} />
    <BasicInput name="Limit" value={filters.limit} onChange={onChange('limit')} />
    <BasicInput name="Search" value={filters.search} onChange={onChange('search')} />
  </div>;
}