import { Router } from 'express';

import ResourceController from '../controllers/ResourceController';
import NotFoundController from '../controllers/NotFoundController';

const routes = new Router();

routes.get('/api', (req, res) => {
  res.send('Oque está procurando aqui parece que já sei foi...');
});
routes.get('/api/v1', (req, res) => {
  res.send('Oque está procurando aqui parece que já sei foi...');
});

routes.get('/api/v1/search/:query', ResourceController.search);

routes.get('/api/v1/:type/:resourceId', ResourceController.find);
routes.get(
  '/api/v1/:type/:resourceId/recommendations',
  ResourceController.getRecommendations,
);
routes.get('/api/v1/:type/:resourceId/videos', ResourceController.getVideos);
routes.get('/api/v1/:type/:resourceId/images', ResourceController.getImages);
routes.get(
  '/api/v1/:type/:resourceId/seasons/:seasonNumberMax',
  ResourceController.getSeasons,
);

routes.get('*', NotFoundController.notFound);

export default routes;
