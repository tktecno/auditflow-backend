import { approveRecordService, createRecordService, getRecordsService, rejectRecordService, reopenRecordService } from "./record.service.js";

export const createRecord = async(req,res)=>{
    try {
        const result = await createRecordService(req.body,req.user);
        res.status(201).json({success: true, data:result});
    } catch (error) {
        res.status(400).json({success: false, message:error.message});
    }
};

export const getRecords = async(req,res)=>{
    try {
        const result = await getRecordsService(req.user, req.query);
        res.status(200).json({success:true, data:result});
    } catch (error) {
        res.status(400).json({success: false, message: error.message});
    }
};

export const approveRecord = async(req,res)=>{
    try {
        const result = await approveRecordService(req.params.id, req.user);
        res.status(200).json({success: true, data:result});
    } catch (error) {
        res.status(400).json({success: false, message:error.message});
    };
};

export const rejectRecord = async(req, res)=>{
    try {
        const result = await rejectRecordService(req.params.id, req.user);
        res.status(200).json({success: true, data: result});
    } catch (error) {
        res.status(400).json({success: false, message: error.message});
    };
};

export const reopenRecord = async(req, res)=>{
    try {
        const result = await reopenRecordService(req.params.id, req.user);
        res.status(200).json({success: true, data:result});
    } catch (error) {
        res.status(400).json({success: false, message: error.message});
    };
};

