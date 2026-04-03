import {Router} from 'express';

import {authMiddleware} from '../../middleware/auth.middleware.js';
import {permit} from '../../middleware/permission.middleware.js';
import {approveRecord, createRecord, deleteRecord, getRecords, rejectRecord, reopenRecord, updateRecord} from './record.controller.js'
const router = Router();

router.post("/",authMiddleware,permit("ADMIN","ANALYST"),createRecord);
router.get("/",authMiddleware,permit("ADMIN","ANALYST","VIEWER"),getRecords);
router.get("/test", (req, res) => {
    res.send("records route working");
});
router.patch("/:id/approve",authMiddleware,permit("ADMIN"),approveRecord);
router.patch("/:id/reject",authMiddleware,permit("ADMIN"),rejectRecord);
router.patch("/:id/reopen",authMiddleware,permit("ADMIN","ANALYST"),reopenRecord);
router.patch("/:id",authMiddleware,permit("ADMIN","ANALYST"),updateRecord);
router.delete("/:id",authMiddleware,permit("ADMIN","ANALYST"),deleteRecord);

export default router;