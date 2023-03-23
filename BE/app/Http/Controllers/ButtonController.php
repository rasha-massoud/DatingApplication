<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\Block;
use App\Models\Favorite;
use App\Models\Profile;
use App\Models\Notification;

class ButtonController extends Controller
{
    function block(Request $request){
        $user_id = $request->user_id;
        $blocked_user_id = $request->blocked_user_id;
        
        $response=[];
        $condition = Block::where('user_id', $request->user_id)
                            ->where('blocked_user_id', $request->blocked_user_id)
                            ->first();

        if($condition){
            $response['status'] = "fails";
            $response['action'] = "no action";
        }
        else{
            $block= new Block;

            $block->user_id = $request->user_id;
            $block->blocked_user_id = $request->blocked_user_id;
            $block->save();

            $notification = new Notification;
            $notification->user_id = $request->user_id;
            $notification->on_user_id = $request->blocked_user_id;
            $notification->action = "block";
            $notification->save();

            $response['status'] = "success";
            $response['action'] = "block";
        }

        return response()->json([
            'status' => $response['status'],
            'action' => $response['action'],
        ]);   
    }

    function accept(Request $request){
        $user_id = $request->user_id;
        $favorite_user_id = $request->favorite_user_id;
        
        $response=[];
        $condition = Favorite::where('user_id', $request->user_id)
                            ->where('favorite_user_id', $request->favorite_user_id)
                            ->first();

        if($condition){
            $response['status'] = "fails";
            $response['action'] = "no action";
        }
        else{
            $favorite= new Favorite;

            $favorite->user_id = $request->user_id;
            $favorite->favorite_user_id = $request->favorite_user_id;   
            $favorite->save();

            $notification = new Notification;
            $notification->user_id = $request->user_id;
            $notification->on_user_id = $request->favorite_user_id;
            $notification->action = "favorite";
            $notification->save();

            $response['status'] = "success";
            $response['action'] = "favorite";
        }
        
        return response()->json([
            'status' => $response['status'],
            'action' => $response['action'],
        ]);   
    }

    function optionalProfile(Request $request){
        $user_id = $request->user_id;
        
        $response=[];
        $condition = Profile::where('user_id', $request->user_id)->first();

        if($condition){
            $condition = Profile::where('user_id', $request->user_id)->get();
            $response['status'] = "success";
            $response['profileData'] = $condition;
        }
        else{
            $response['status'] = "fails";
            $response['profileData'] = "No Additional Profiles";
        }
        
        return response()->json([
            'status' => $response['status'],
            'profileData' => $response['profileData']

        ]);   
    }
}
