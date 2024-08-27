import { AsyncHandler } from "../utils/AysncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// import jwt from "jsonwebtoken"
import { stringify } from "flatted";


const registerUser = AsyncHandler(async (req, res) => {
 

  const { name, password, confirmpassword, mobileno,email } = req.body; 
  console.log("email:", email);

  
  if ( !name || !password || !confirmpassword || (!mobileno && !email)) {
    throw new ApiError(400, "All fields are Required");
  }

var existedUser =" ";

 if(mobileno){
   existedUser = await User.findOne({
    $or: [{ name }, { mobileno }], 
  });
}else{
  existedUser = await User.findOne({
        $or: [{ name }, { email }], 
      });
}

  if (existedUser) {
    throw new ApiError(409, "User with username or email already exist");
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


  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully") 
  );
});

const loginUser = AsyncHandler(async (req, res) => {
  
  
  const {mobileno,password} = req.body;

  console.log(mobileno);

  //Step:2
  if (!mobileno && !password ) {
    throw new ApiError(400, "Username or Email is required");
  }

 

  const user = await User.findOne({
    $or: [{ mobileno }, { password }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  

  const isPasswordValid = await user.ispasswordCorrect(password); 
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Password");
  }

 
  const loggedInUser = User.findById(user._id).select(
    "-password "
  ).lean();

  if(loggedInUser){
    console.log("User is LoggedIn");
    
  }else{
    console.log("User is not loggedIn");
    
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {user: JSON.parse(stringify(loggedInUser))},
        "User LoggedIn Successfully"
      )
    );
});











// const logoutUser = AsyncHandler(async (req, res) => {
//   //Steps:
//   //Remove Tokens and cookie value

//   await User.findByIdAndUpdate(req.user._id, {
//     $set: {
//       refreshToken: undefined,
//     },
//   });
//   const options = {
//     httpOnly: true, //Through this user cannot modified the cookie, the cookie modify from server only
//     secure: true,
//   };
//   return res
//     .status(200)
//     .clearCookie("accessToken", options)
//     .clearCookie("refreshToken", options)
//     .json(new ApiResponse(200, {}, "User LoggedOut"));
// });

// const refreshAccessToken = AsyncHandler(async(req,res)=>{
//  const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken

//   if (!incomingRefreshToken) {
//     new ApiError(401,"Unauthorized Request")
//   }

// try {
//   const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
  
//   const user = await User.findById(decodedToken?._id)
  
//   if (!user) {
//     throw new ApiError(401,"Invalid refresh Token")
//   }
  
//   if (incomingRefreshToken !== user?.refreshToken) {
//     throw new ApiError(401,"Refresh Token is Expired")
//   }
  
//   const options = {
//     httpOnly: true, //Through this user cannot modified the cookie, the cookie modify from server
//     secure: true
//   }
//       const {accessToken,newrefreshToken} = await generateAccessandRefreshToken(user._id)
  
//       return res
//        .status(200)
//        .cookie("accessToken",accessToken,options)
//        .cookie("refreshToken",newrefreshToken,options)
//        .json(
//         new ApiResponse(200,{accessToken,refreshToken:newrefreshToken},
//           "Access Token Refreshed!!"
//         )
//        )
// } catch (error) {
//   throw new ApiError(401,error?.message || "Invalid refresh Token")
// }
// })

export { registerUser, loginUser};
