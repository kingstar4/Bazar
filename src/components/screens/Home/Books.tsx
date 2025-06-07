

import React from 'react';
import { Book } from '../../../navigation/types';
import CardUI from '../../customUI/CardUI';

type BooksProps = {
    item: Book;
}

const Books = ({item}: BooksProps) => {
    return (
      <CardUI item={item} />
    );
};

export default Books;
