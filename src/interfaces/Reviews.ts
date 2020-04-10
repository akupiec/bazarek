export enum Reviews {
  MIXED = 'Mixed',
  NO_USER_REVIEWS = 'No user reviews',
  '1_USER_REVIEWS' = '1 user reviews',
  '2_USER_REVIEWS' = '2 user reviews',
  '3_USER_REVIEWS' = '3 user reviews',
  '4_USER_REVIEWS' = '4 user reviews',
  '5_USER_REVIEWS' = '5 user reviews',
  '6_USER_REVIEWS' = '6 user reviews',
  '7_USER_REVIEWS' = '7 user reviews',
  '8_USER_REVIEWS' = '8 user reviews',
  '9_USER_REVIEWS' = '9 user reviews',
  VERY_POSITIVE = 'Very Positive',
  MOSTLY_NEGATIVE = 'Mostly Negative',
  MOSTLY_POSITIVE = 'Mostly Positive',
  POSITIVE = 'Positive',
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
