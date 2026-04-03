// src/modules/auth/auth.service.js
import supabase from "../../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  // check existing user
  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (existingUser) {
    throw new Error("User already exists");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create organization
  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .insert([{ name: `${name}'s Org` }])
    .select()
    .single();

  if (orgError) throw new Error(orgError.message);

  // get analyst role
  const { data: role, error: roleError } = await supabase
    .from("roles")
    .select("*")
    .eq("name", "ANALYST")
    .single();

  if (roleError) throw new Error(roleError.message);

  // create user
  const { data: user, error: userError } = await supabase
    .from("users")
    .insert([
      {
        name,
        email,
        password: hashedPassword,
        role_id: role.id,
        org_id: org.id,
        status: "ACTIVE"
      }
    ])
    .select()
    .single();

  if (userError) throw new Error(userError.message);

  // generate token
  const token = jwt.sign(
    {
      userId: user.id,
      role: role.name,
      orgId: org.id
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token };
};


export const loginUser = async ({ email, password }) => {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
  
    // find user
    const { data: user, error } = await supabase
      .from("users")
      .select("*, roles(name)")
      .eq("email", email)
      .single();
  
    if (error || !user) {
      throw new Error("Invalid credentials");
    }
  
    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
  
    // generate token
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.roles.name,
        orgId: user.org_id
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
  
    return { token };
  };