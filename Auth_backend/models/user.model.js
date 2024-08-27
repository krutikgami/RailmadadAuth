import mongoose,{Schema} from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new Schema( 
 {
    name:{
        type:String,
        required : true,
        lowercase:true,
        trim:true,
        index:true        
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
        required:true,
        unique:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true,                  
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


export const User = mongoose.model("User",userSchema)