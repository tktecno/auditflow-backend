import { getCategoryBreakdownService, getRecentRecordsService, getSummaryService } from "./dashboard.service.js";


export const getSummary = async (req, res)=>{
    try {
        const result = await getSummaryService(req.user);
        res.status(200).json({success: true, data : result});
    } catch (error) {
        res.status(400).json({success: false, message:error.message});
    };
};
export const getCategoryBreakdown = async (req, res)=>{
    try {
        const result = await getCategoryBreakdownService(req.user);
        res.status(200).json({success: true, data : result});
    } catch (error) {
        res.status(400).json({success: false, message:error.message});
    };
};
export const getRecentRecords = async (req, res)=>{
    try {
        const result = await getRecentRecordsService(req.user);
        res.status(200).json({success: true, data : result});
    } catch (error) {
        res.status(400).json({success: false, message:error.message});
    };
};