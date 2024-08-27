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
    throw new ApiError(400, "Please check the confirm password");
  }

  const existedUser = await User.findOne({
    $or: [{ mobileno }], 
})

  if (existedUser) {
    throw new ApiError(400, "User with email or mobile no already exist");
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
   
    throw new ApiError(500, "Something went wrong while registring the user");
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
    throw new ApiError(400, "User not found");
  }


  const isPasswordValid = await user.ispasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid Password");
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
