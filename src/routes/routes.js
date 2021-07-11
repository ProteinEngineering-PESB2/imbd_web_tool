const {Router} = require('express');
const router = Router();
const {
    renderIndex, 
    renderAntibody, 
    renderAntigen,
    renderEpitope,
    renderSearch,
    renderTools,
    renderAbout,
    renderStructure,
    getSequence,
    renderProfile,
    getAntibody,
    getEpitope,
    getAntigen,
    getGO,
    renderAlignment,
    renderMapping,
    renderPhysicochemical,
    renderPredict_values,
    renderPredict_interaction,
    renderStatistical,
    ServiceInteractions,
    uploadFile,
    ServicePhysicochemical,
    ServiceGeneOntology,
    ServicePFam,
    ServiceStructural,
    getFastaInfo,
    ServiceStatistical,
    ServiceMappingFilters,
    ServiceMappingFasta,
    ServiceAlignment,
    searchAntigen,
    searchAntibody,
    searchEpitope,
    getLengthCollection,
    getLengthCollectionQuery,
    getTerms,
    getRelations,
    renderProfileBase
} = require('../controllers/controller');
var multipart = require('connect-multiparty')
var uploadFolder = multipart({uploadDir: 'src/public/services'})
router.get('/', renderIndex); 
//Rutas
router.get('/antibody', renderAntibody);
router.get('/antigen', renderAntigen);
router.get('/epitope', renderEpitope);
router.get('/search', renderSearch);
router.get('/tools', renderTools);
router.get('/about', renderAbout);
router.get('/structure/:structure?', renderStructure);
router.post('/profile', renderProfile);
router.get('/alignment', renderAlignment);
router.get('/mapping', renderMapping);
router.get('/physicochemical', renderPhysicochemical);
router.get('/predict_values', renderPredict_values);
router.get('/predict_interaction', renderPredict_interaction);
router.get('/statistical', renderStatistical);
router.get('/profileBase', renderProfileBase)
//Apis
router.get('/getAntibody/:id?', getAntibody);
router.get('/getAntigen/:id?', getAntigen);
router.post('/getEpitope', getEpitope);
router.get('/getSequence/:structure?', getSequence);
router.post('/getGO', getGO);
router.post('/uploadFile', uploadFolder, uploadFile);
router.get('/getFastaInfo/:file?', getFastaInfo);
router.post('/searchAntibody', searchAntibody);
router.post('/searchAntigen', searchAntigen);
router.post('/searchEpitope', searchEpitope);
router.post('/getLengthCollection', getLengthCollection);
router.post('/getLengthCollectionQuery', getLengthCollectionQuery)
router.get('/getTerms/:query?', getTerms);
router.post('/getRelations', getRelations)
//Servicios
router.get('/ServiceInteractions/:pdb?/:type?', ServiceInteractions);
router.get('/ServicePhysicochemical/:file?', ServicePhysicochemical);
router.get('/ServiceGeneOntology/:file?', ServiceGeneOntology);
router.get('/ServicePFam/:file?', ServicePFam);
router.get('/ServiceStructural/:file?', ServiceStructural);
router.get('/ServiceStatistical/:file?', ServiceStatistical);
router.post('/ServiceMappingFilters', ServiceMappingFilters);
router.post('/ServiceMappingFasta/:file?', ServiceMappingFasta);
router.post('/ServiceAlignment', ServiceAlignment);
module.exports = router;