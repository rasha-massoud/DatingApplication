<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    function edit(Request $request){
        $phone_number = $request->phone_number;
        $password = $request->password;
        $location = $request->location;
        $biography = $request->biography;
        $profile = $request->profile;

        $response=[];
    
        if(preg_match('/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/', $password)) {
            $response["password_status"] = "Strong password.";
            $passwordCondition=true;
        } else {
            $response["password_status"] = "Password should be at least 8 characters in length and should include at least one upper case letter, one number, and one special character.";
            $passwordCondition=false;
        }
    
        if($response['password_status']){
            $email_exists = DB::table('registeredusers')->where('email', '=', $email)->exists();
            $hashed_password = Hash::make($password);
            if ($email_exists > 0) {
                $response['status'] = "failed";
            } else {
                DB::table('registeredusers')->insert([
                    'phone_number' => $phone_number,
                    'password' => $hashed_password,
                    'location' => $location,
                    'biography' => $biography,
                    'profile' => $profile
                ]);
                $response['status'] = "success";
            }
        }
        return response()->json($response);    
    }

    function getAllUsers(){
        $users = User::all();
        return response()->json([
            "users" => $users
        ]);
    }
}
