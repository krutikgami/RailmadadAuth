import mongoose,{Schema} from "mongoose";
// import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new Schema( 
 {
    name:{
        type:String,
        required : true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true        //For optimize Searching in database
    },
    
    password:{
        type:String,
        required:[true,"Password is Required"]
    },
    confirmpassword:{
        type:String,
        required:[true,"Password is Required"]
    },
    mobileno:{
        type:Number,
    },
    email:{
        type:String,
        unique:true,
        lowercase:true,
        trim:true,                   //For optimize Searching in database
    },

    refreshToken:{
        type:String
    }
},{timestamps:true}
)

userSchema.pre("save",async function(next){
  if(!this.isModified("password")) return next()

  this.password = await bcrypt.hash(this.password,10)
   next()
})

userSchema.methods.ispasswordCorrect = async function(password){
  return await bcrypt.compare(password,this.password)
}

// userSchema.methods.generateAccessToken = function(){        //Short Lived Token for expire
//     jwt.sign(
//      {
//         _id : this._id,
//         email : this.email,
//         username: this.username,
//         fullName: this.fullName,
//     },
//     process.env.ACCESS_TOKEN_SECRET,
//     {
//         expiresIn:process.env.ACCESS_TOKEN_EXPIRY
//     } 
// )
// }

// userSchema.methods.generateRefreshToken = function(){    // Long Lived Token expire
//     jwt.sign(
//         {
//            _id : this._id,
//            email : this.email,
//            username: this.username,
//            fullName: this.fullName,
//        },
//        process.env.REFRESH_TOKEN_SECRET,
//        {
//            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
//        }
       
//    )
// }

export const User = mongoose.model("User",userSchema)