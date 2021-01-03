import { Router } from 'express';

import ResourceController from '../controllers/ResourceController';
import NotFoundController from '../controllers/NotFoundController';

const routes = new Router();

routes.get('/api', function (req, res) {
  res.send('Oque está procurando aqui parece que já sei foi...');
});

routes.get('/api/search/:query', ResourceController.search);

routes.get('/api/:type/:resourceId', ResourceController.find);
routes.get(
  '/api/:type/:resourceId/recommendations',
  ResourceController.getRecommendations,
);
routes.get('/api/:type/:resourceId/videos', ResourceController.getVideos);
routes.get('/api/:type/:resourceId/images', ResourceController.getImages);

routes.get('*', NotFoundController.notFound);

export default routes;
