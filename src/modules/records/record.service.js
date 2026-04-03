import supabase from "../../config/db.js";
import {logAction} from "../audit/audit.service.js";



export const createRecordService = async (data, user)=>{
    const {amount, type, category, date, notes} = data;
    if(!amount || !type || !data)
    {
        throw new Error("Required fields missing");
    }
    const {data:record,error} = await supabase.from("financial_records")
    .insert([
        {
            amount,
            type,
            category,
            date,
            notes,
            status:"PENDDING",
            created_by:user.userId,
            org_id:user.orgId,
        }
    ])
    .select()
    .single();
    if(error) throw new Error(error.message);
    await logAction({
      userId: user.userId,
      action: "CREATE",
      recordId: record.id,
      oldValue: null,
      newValue: record
    });
    return record;
};
export const getRecordsService = async (user, query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
  
    const from = (page - 1) * limit;
    const to = from + limit - 1;
  
    let dbQuery = supabase
      .from("financial_records")
      .select("id, amount, type, category, date, status, created_at", {
        count: "exact"
      })
      .eq("org_id", user.orgId)
      .order("created_at", { ascending: false })
      .range(from, to);
  
    const { type, category, status } = query;
  
    if (type) dbQuery = dbQuery.eq("type", type);
    if (category) dbQuery = dbQuery.eq("category", category);
    if (status) dbQuery = dbQuery.eq("status", status);
  
    const { data, error, count } = await dbQuery;
  
    if (error) throw new Error(error.message);
  
    return {
      records: data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  };

export const approveRecordService = async(recordID, user)=>{
  const {data: record, error} = await supabase
  .from("financial_records")
  .select("*")
  .eq("id",recordID)
  .single();
  if(error || !record) throw new Error("Record not Found");

  if(record.org_id !== user.orgId)
  {
     throw new Error("Unauthorized access");
  }
  if(record.status === "APPROVED")
  {
    throw new Error("Already approved");
  }
  const oldValue = record;
  const {data ,error: updateError} = await supabase
  .from("financial_records")
  .update({status: "APPROVED"})
  .eq("id",recordID)
  .select()
  .single()
  if(updateError) throw new Error(updateError.message);
  await logAction({
    userId:user.userId,
    action:"APPROVE",
    recordId:recordID,
    oldValue,
    newValue:data
  })
  return data;
};

export const rejectRecordService = async (recordID, user)=>
{
  const {data:record,error} = await supabase
  .from("financial_records")
  .select("*")
  .eq("id",recordID)
  .single();
  if(!record || error)
  {
    throw new Error("Record not found");
  }

  if(record.org_id !== user.orgId)
  {
    throw new Error("Unauthorized Access");
  }
  if(record.status === "REJECTED")
  {
    throw new Error("Already rejected");
  }
  const oldValue = record;
  const {data,error:updateError} = await supabase
  .from("financial_records")
  .update({status:"REJECTED"})
  .eq("id",recordID)
  .select()
  .single();
  
  if(updateError) throw new Error(updateError.message);
  await logAction({
    userId:user.userId,
    action:"REJECT",
    recordId:recordID,
    oldValue,
    newValue:data
  });
}


export const reopenRecordService = async (recordID, user) => {
  const { data: record, error } = await supabase
    .from("financial_records")
    .select("*")
    .eq("id", recordID)
    .single();

  if (error || !record) {
    throw new Error("Record not found");
  }

  if (record.org_id !== user.orgId) {
    throw new Error("Unauthorized Access");
  }

  if (record.status !== "REJECTED") {
    throw new Error("Only rejected records can be reopened");
  }

  if (
    user.role === "ANALYST" &&
    record.created_by !== user.userId
  ) {
    throw new Error("You can only reopen your own records");
  }
  const oldValue = record;
  const { data, error: updateError } = await supabase
    .from("financial_records")
    .update({ status: "PENDING" })
    .eq("id", recordID)
    .select()
    .single();

  if (updateError) {
    throw new Error(updateError.message);
  }
  await logAction({
    userId:user.userId,
    action:"REJECTED",
    recordId:recordID,
    oldValue,
    newValue:data
  });

  return data;
};