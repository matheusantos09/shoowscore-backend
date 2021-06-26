// Status Code | Http Code | Message
//
// 1 | 200 | Resource Loaded
// 2 | 401 | No provider key
// 3 | 404 | Resource not found, check your endpoint
// 4 | 500 | Database not found
// 5 | 503 | Database in maintenance
//
// SEARCH ---
//
// 10 | 200 | Resource Loaded
// 11 | 422 | Parameter required not found
//
// TV ---
//
// 20 | 200 | Resource Loaded
// 21 | 422 | Parameter required not found
//
// MOVIE ---
//
// 30 | 200 | Resource Loaded
// 31 | 422 | Parameter required not found

interface ErrorsInterface {
  code: number;
  http: number;
  message: string;
}

export const RESOURCE_LOAD_DEFAULT_1: ErrorsInterface = {
  code: 1,
  http: 200,
  message: 'Resource Loaded',
};

export const RESOURCE_ERRORS_DEFAULT_2: ErrorsInterface = {
  code: 2,
  http: 401,
  message: 'No provider key',
};

export const ERRORS_DEFAULT_3: ErrorsInterface = {
  code: 3,
  http: 404,
  message: 'Resource not found, check your endpoint',
};

export const ERRORS_DEFAULT_4: ErrorsInterface = {
  code: 4,
  http: 500,
  message: 'Database not found',
};

export const ERRORS_DEFAULT_5: ErrorsInterface = {
  code: 5,
  http: 503,
  message: 'Database in maintenance',
};

export const ERRORS_SEARCH_10: ErrorsInterface = {
  code: 10,
  http: 200,
  message: 'Resource Loaded',
};

export const ERRORS_SEARCH_11: ErrorsInterface = {
  code: 11,
  http: 422,
  message: 'Parameter required not found',
};

export const ERRORS_TV_20: ErrorsInterface = {
  code: 20,
  http: 200,
  message: 'Resource Loaded',
};

export const ERRORS_TV_21: ErrorsInterface = {
  code: 21,
  http: 422,
  message: 'Parameter required not found',
};

export const ERRORS_MOVIE_20: ErrorsInterface = {
  code: 30,
  http: 200,
  message: 'Resource Loaded',
};

export const ERRORS_MOVIE_21: ErrorsInterface = {
  code: 31,
  http: 422,
  message: 'Parameter required not found',
};
