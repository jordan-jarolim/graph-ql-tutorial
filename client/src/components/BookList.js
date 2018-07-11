import React, { Component } from 'react';
import { graphql } from 'react-apollo';

import { getBooksQuery } from '../queries/queries';

// components
import BookDetail from './BookDetail';


class BookList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: null,
    }
  }
  displayBooks() {
    let { data } = this.props;
    if (data.loading) {
      return <div>Loading books...</div>
    } else {
      return data.books.map(book => (
        <li onClick={(e) => { this.setState({ selected: book.id }) }} key={book.id}>{book.name}</li>
      ))
    }
  }

  render() {
    return (
      <div>
        <ul id="book-list">
          {this.displayBooks()}
        </ul>
        <BookDetail bookId={this.state.selected} />
      </div>
    );
  }
}

export default graphql(getBooksQuery)(BookList);
