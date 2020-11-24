import { TYPES as TMDB_TYPES } from '../services/tmdb/types';

class ResourceRepository {
  async defaultValidations(resourceId, type) {
    if (
      typeof resourceId === 'undefined' ||
      resourceId === '' ||
      typeof type === 'undefined' ||
      type === ''
    ) {
      // @TODO Melhorar o return das respostas de erro
      throw Error('Not found params required');
    }

    if (Object.values(TMDB_TYPES).indexOf(type) === -1) {
      throw Error('Type send not allowed');
    }

    if (isNaN(resourceId)) {
      throw Error('Resource ID not a number');
    }
  }

  async getRecommendationsValidations(resourceId, type) {
    if (
      typeof resourceId === 'undefined' ||
      resourceId === '' ||
      typeof type === 'undefined' ||
      type === ''
    ) {
      // @TODO Melhorar o return das respostas de erro

      throw Error('Not found params required');
    }

    if (type !== TMDB_TYPES.tv) {
      throw Error('Type send not allowed');
    }

    if (isNaN(resourceId)) {
      throw Error('Resource ID not a number');
    }
  }
}

export default new ResourceRepository();
