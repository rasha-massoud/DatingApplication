<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    function edit(Request $request){
        $email = $request->email;
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
            $email_exists = User::where('email', $request->email)->first();
            if ($email_exists) {
                $user = User::where('email', $email)->first();
                $user->email = $request->email;
                $user->phone_number = $phone_number;
                $user->password = Hash::make($password);
                $user->location = $location;
                $user->biography = $biography;
                $user->profile = $profile;
                $user->save();
                
                $response['status'] = "success";
            } else {
                $response['status'] = "failed";
            }
        }
        return response()->json($response);    
    }

    function getAllUsers(Request $request){
        $users = User::where('gender_id','!=', $request->gender_id)->get();
        return response()->json([
            "users" => $users
        ]);
    }

    function profile(Request $request){
        $user_id = $request->user_id;
        $optional_profile1 = $request->optional_profile1;
        $optional_profile2 = $request->optional_profile2;
        $optional_profile3 = $request->optional_profile3;
        $response=[];

        $userProfiles_exists = profile::where('user_id', $request->user_id)->first();
        if ($userProfiles_exists){
            $profile= profile::where('user_id', $user_id)->first();
        }
        else{
            $profile= new profile;
        }
        $profile->user_id = $request->user_id;
        $profile->optional_profile1 = $request->optional_profile1;
        $profile->optional_profile2 = $request->optional_profile2;
        $profile->optional_profile3 = $request->optional_profile3;

        $profile->save();
        $response['status'] = "success";

        return response()->json([
            'status' => $response['status']
        ]);   
    }
}
