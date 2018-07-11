import React, { Component } from 'react';
import { graphql } from 'react-apollo';

import { getBookQuery } from '../queries/queries';


class BookDetail extends Component {
  displayBookDetails() {
    const { book } = this.props.data;
    if (book) {
      return (
        <div>
          <h2>{book.name}</h2>
          <p>{book.genre}</p>
          <p>{book.author.name}</p>
          <p>All other books</p>
          <ul className="other-books">
            {book.author.books.map(item => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
      )
    } else {
      return (
        <div> no book </div>
      )
    }
  }

  render() {
    return (
      <div id="book-details">
        {this.displayBookDetails()}
      </div>
    );
  }
}

export default graphql(getBookQuery, {
  options: (props) => (
    {
      variables: {
        id: props.bookId
      }
    }
  )
})(BookDetail);
