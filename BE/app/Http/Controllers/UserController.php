<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RegisteredUser;

class UserController extends Controller
{
    function registration(Request $request){
        $name = $request->name;
        $phone_number = $request->phone_number;
        $email = $request->email;
        $password = $request->password;
        $dob = $request->dob;
        $gender_id = $request->gender_id;
        $location = $request->location;
        $biography = $request->biography;

        $response=[];

        $emailValidator = Validator::make(['email' => $email], [
            'email' => 'required|email',
        ]);

        if($emailValidator ->fails()){
            $response["email_status"] = "Sorry! Invalid Email Format!";
            $emailCondition=false;
        }else{
            $response["email_status"] = "The Email Format is Valid!";
            $emailCondition=true;
        }
    
        if(preg_match('/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/', $password)) {
            $response["password_status"] = "Strong password.";
            $passwordCondition=true;
        } else {
            $response["password_status"] = "Password should be at least 8 characters in length and should include at least one upper case letter, one number, and one special character.";
            $passwordCondition=false;
        }
    
        $response["status"] = $passwordCondition && $emailCondition;
        if($response['status']){
            $email_exists = DB::table('registeredusers')->where('email', '=', $email)->exists();
            $hashed_password = Hash::make($password);
            if ($email_exists > 0) {
                $response['status'] = "failed";
            } else {
                DB::table('users')->insert([
                    'name' => $name,
                    'email' => $email,
                    'password' => $hashed_password,
                    'dob' => $dob,
                    'user_type_id' => $user_type_id
                ]);
                $response['status'] = "success";
            }
        }
        return response()->json($response);    
    }
}
