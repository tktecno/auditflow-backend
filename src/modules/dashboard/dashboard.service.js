import supabase from "../../config/db.js";

export const getSummaryService = async(user)=>{
    const {data,error} = await supabase
    .from("financial_records")
    .select("amount, type")
    .eq("org_id",user.orgId)
    .eq("status","APPROVED");

    console.log("get summary : ",user.orgId);
    if(error) throw new Error(error.message);

    let totalIncome = 0;
    let totalExpense = 0;

    data.forEach((item)=>{
        if(item.type=="income") totalIncome+=Number(item.amount);
        if(item.type == "expense") totalExpense+=Number(item.amount);
    });
    return {
        totalIncome,
        totalExpense,
        netBalance:totalIncome-totalExpense
    };
};

export const getCategoryBreakdownService = async(user)=>{
    const {data,error}  = await supabase
    .from("financial_records")
    .select("amount, category")
    .eq("org_id",user.orgId)
    .eq("status","APPROVED");

    if(error) throw new Error(error.message);
    const breakdown = {};

    data.forEach((item)=>{
        const category = item.category || "uncategorized";
        if(!breakdown[category])
        {
            breakdown[category]=0;
        }
        breakdown[category] += Number(item.amount);
    });
    return breakdown;
};


export const getRecentRecordsService = async(user)=>{
    const {data, error} = await supabase
    .from("financial_records")
    .select("*")
    .eq("org_id",user.orgId)
    .order("created_at",{ascending:false})
    .limit(5);
    if(error) throw new Error(error.message);
    return data;
};