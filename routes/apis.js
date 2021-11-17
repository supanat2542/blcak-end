var express = require('express');
var router = express.Router();
const db = require('./queries');



router.get('/tags', db.getTag);
router.post('/tags', db.createTag);
router.put('/tags/:id', db.updateTag);
router.delete('/tags/:id', db.deleteTag);
router.get('/editdata',db.getEdit);
router.put('/updateData/:id',db.updateData);
router.get('/editItem',db.getEditItem);
router.put('/updateDataItem/:id',db.updateDataItem);

router.get('/taguse', db.getTaguse);
router.post('/taguse', db.createTaguse);
router.put('/taguse/:id', db.updateTaguse);
router.delete('/taguse/:id', db.deleteTaguse);

router.get('/locations', db.getLocation);
router.post('/locations', db.createLocation);
router.put('/locations/:id', db.updateLocation);
router.delete('/locations/:id', db.deleteLocation);

router.get('/scanner', db.getScanner);
router.post('/scanner', db.createScanner);
router.put('/scanner/:id', db.updateScanner);
router.delete('/scanner/:id', db.deleteScanner);

router.get('/visitors', db.getVisitor);
router.post('/visitors', db.createVisitor);
router.put('/visitors/:id', db.updateVisitor);
router.delete('/visitors/:id', db.deleteVisitor);
router.post('/visitors', db.createVisitor);

router.get('/items',db.getItem);
router.post('/items',db.createItem);
router.put('/items/:id', db.updateItem);



router.get('/scanlog', db.getScanlog);
router.get('/selectlog', db.getSelectlog);
router.post('/scanlog', db.createScanlog);
router.put('/scanlog/:id', db.updateScanlog);
router.delete('/scanlog/:id', db.deleteScanlog);
router.post('/scanlog', db.createScanlog);

router.get('/data', db.getData);
router.get('/data2', db.getData2)

module.exports = router;