import React from 'react';
import { Component } from 'react';
import { GenericTable } from './GenericTable';
import * as axios from 'axios';
import { BazarekFilters } from './BazarekFilters/BazarekFilters';

export default class BazarekSearch extends Component {
  state = {
    search: '',
    limit: 40,
    price: 10,
    reviewsCount: 10,
    tags: [],
    reviews: [],
    categories: [],
    toPick: null,
    data: [],
  };

  componentDidMount() {
    axios.get('http://localhost:9090/toPick').then(resp => {
      this.setState({ toPick: resp.data });
    }, (e) => console.error(e));
    this.doSearch();
  }

  doSearch() {
    let url = 'http://localhost:9090/finder?';
    url += this.state.tags.map(t => `tag=${t}`).join('&') + '&'
    url += this.state.categories.map(t => `category=${t}`).join('&') + '&'
    url += this.state.reviews.map(t => `review=${t}`).join('&') + '&'
    url += `search=${this.state.search}&`
    url += `reviewsCount=${this.state.reviewsCount}&`
    url += `price=${this.state.price}&`
    url += `limit=${this.state.limit}&`
    axios.get(url, ).then(resp => {
        this.setState({ data: resp.data });
      }, (e) => console.error(e));
  }

  onChangeCategories(ev) {
    this.setState({ categories: ev?.map(e => e.value) });
    this.forceUpdate(() => this.doSearch());
  }

  onChangeReviews(ev) {
    this.setState({ reviews: ev?.map(e => e.value) });
    this.forceUpdate(() => this.doSearch());
  }

  onChangeTags(ev) {
    this.setState({ tags: ev?.map(e => e.value) });
    this.forceUpdate(() => this.doSearch());

  }

  onChangeReviewsCount(ev) {
    this.setState({ reviewsCount: ev });
    this.forceUpdate(() => this.doSearch());
  }

  onChangePrice(ev) {
    this.setState({ price: ev });
    this.forceUpdate(() => this.doSearch());
  }

  onChangeLimit(ev) {
    this.setState({ limit: ev });
    this.forceUpdate(() => this.doSearch());
  }

  onChangeSearch(ev) {
    this.setState({ search: ev });
    this.forceUpdate(() => this.doSearch());
  }

  render() {
    const Table = <>
      <BazarekFilters {...this.state.toPick} {...this.state}
                      onChangeCategories={this.onChangeCategories.bind(this)}
                      onChangeReviews={this.onChangeReviews.bind(this)}
                      onChangeTags={this.onChangeTags.bind(this)}
                      onChangeReviewsCount={this.onChangeReviewsCount.bind(this)}
                      onChangePrice={this.onChangePrice.bind(this)}
                      onChangeLimit={this.onChangeLimit.bind(this)}
                      onChangeSearch={this.onChangeSearch.bind(this)}
      />
      <GenericTable data={this.state.data} />
    </>;
    const Loading = <div>Loading data!</div>;

    return (
      <>
        <div className="px-3 py-3 pt-md-5 pb-m d-4 mx-auto">
          <h1 className="display-4">Search Bazarek Game</h1>
        </div>
        {this.state.toPick ? Table : Loading}
      </>
    );
  }
}
