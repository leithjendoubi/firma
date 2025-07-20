import express from 'express';
import {
  getNewestAdministration,
  updateAdministration,
  getTypeMarche,
  getCategorieProduitMarche,
  getProduits,
  getProduitTarifsParkillo,
  getTypeDesVendeurs,
  getTypeDesProducteurs,
  getAdministrationHistory,
  getProduitParCategorie
} from '../controllers/administrationController.js';
import adminAuth from '../middleware/adminAuth.js';

const administrationrouter = express.Router();

// Public read-only routes
administrationrouter.get('/', getNewestAdministration);
administrationrouter.get('/history', getAdministrationHistory);
administrationrouter.get('/type-marche', getTypeMarche);
administrationrouter.get('/categories-produits', getCategorieProduitMarche);
administrationrouter.get('/produits', getProduits);
administrationrouter.get('/tarifs-parkillo', getProduitTarifsParkillo);
administrationrouter.get('/types-vendeurs', getTypeDesVendeurs);
administrationrouter.get('/types-producteurs', getTypeDesProducteurs);

// Protected admin routes
administrationrouter.post('/', adminAuth, updateAdministration);
administrationrouter.post('/produitparcategorie', adminAuth, getProduitParCategorie);

export default administrationrouter;