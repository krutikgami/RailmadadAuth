import { AsyncHandler } from "../utils/AysncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = AsyncHandler(async (req, res) => {
 

  const { name, password, confirmpassword, mobileno,email } = req.body; 
  console.log("email:", email);

  
  if ( !name || !password || !confirmpassword || !mobileno || !email) {
    throw new ApiError(400, "All fields are Required");
  }else if(password != confirmpassword){
    return res.status(400).json(
      new ApiResponse(400, "Confirm Password is not valid") 
    );
  }

  const existedUser = await User.findOne({
    $or: [{ mobileno },{email}], 
})

  if (existedUser) {
    return res.status(400).json(
      new ApiResponse(400, "User Already existed!!") 
    );
  }
  
  const user = await User.create({
    name,
    password,
    confirmpassword,
    mobileno,
    email,
  });


  const createdUser = await User.findById(user._id).select(
    
    "-password " 
  );

  if (!createdUser) {
   
    return res.status(400).json(
      new ApiResponse(400, "User not created") 
    );
  }


  return res.status(200).json(
    new ApiResponse(200, createdUser, "User registered successfully") 
  );
});

const loginUser = AsyncHandler(async (req, res) => {
  const { mobileno, email, password } = req.body;

  console.log(mobileno || email);

  
  if ((!mobileno && !email) || !password) {
    throw new ApiError(400, "Mobile number or Email and Password are required");
  }

  const user = await User.findOne({
    $or: [{ mobileno }, { email }],
  });

  if (!user) {
    return res.status(400).json(
      new ApiResponse(400, "User Not found") 
    );
  }


  const isPasswordValid = await user.ispasswordCorrect(password);
  if (!isPasswordValid) {
    return res.status(400).json(
      new ApiResponse(400, "Password is Invalid") 
    );
  }


  const loggedInUser = await User.findById(user._id).select("-password").lean();

  if (loggedInUser) {
    console.log("User is Logged In");
  } else {
    console.log("User is not logged in");
  }


  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser },
        "User Logged In Successfully"
      )
    );
});



export { registerUser, loginUser};
