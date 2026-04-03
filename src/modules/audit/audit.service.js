import supabase from "../../config/db.js"

export const logAction = async ({userId,action,recordId,oldValue,newValue})=>{
    const {error} = await supabase
    .from("audit_logs")
    .insert([
        {
            user_id:userId,
            action,
            record_id:recordId,
            old_value:oldValue,
            new_value:newValue
        }
    ]);
    if(error){
        console.error("Audit log error: ",error.message);
    }
};