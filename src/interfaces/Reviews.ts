export enum Reviews {
  MIXED = 'Mixed',
  NO_USER_REVIEWS = 'No user reviews',
  VERY_POSITIVE = 'Very Positive',
  MOSTLY_POSITIVE = 'Mostly Positive',
  POSITIVE = 'Positive',
  MOSTLY_NEGATIVE = 'Mostly Negative',
  OVERWHELMINGLY_POSITIVE = 'Overwhelmingly Positive',
  VERY_NEGATIVE = 'Very Negative',
  NEGATIVE = 'Negative',
  OVERWHELMINGLY_NEGATIVE = 'Overwhelmingly Negative',
}

export function reviewToNr(review: Reviews){
  switch(review){
    case Reviews.NO_USER_REVIEWS:
      return 0;
    case Reviews.OVERWHELMINGLY_NEGATIVE:
      return 1;
    case Reviews.VERY_NEGATIVE:
      return 2;
    case Reviews.NEGATIVE:
      return 3;
    case Reviews.MOSTLY_NEGATIVE:
      return 4;
    case Reviews.MIXED:
      return 5;
    case Reviews.POSITIVE:
      return 6;
    case Reviews.MOSTLY_POSITIVE:
      return 7;
    case Reviews.VERY_POSITIVE:
      return 8;
    case Reviews.OVERWHELMINGLY_POSITIVE:
      return 9;
    default:
      return 2;
  }
}
