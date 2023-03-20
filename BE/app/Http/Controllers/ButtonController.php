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

class ButtonController extends Controller
{
    function block(Request $request){
        $user_id = $request->user_id;
        $blocked_user_id = $request->blocked_user_id;
        
        $response=[];

        $block= new Block;

        $block->user_id = $request->user_id;
        $block->blocked_user_id = $request->blocked_user_id;

        $block->save();
        $response['status'] = "success";
        
        return response()->json([
            'status' => $response['status']
        ]);   
    }

    function accept(Request $request){
        $user_id = $request->user_id;
        $favorite_user_id = $request->favorite_user_id;
        
        $response=[];

        $favorite= new Favorite;

        $favorite->user_id = $request->user_id;
        $favorite->favorite_user_id = $request->favorite_user_id;

        $favorite->save();
        $response['status'] = "success";
        
        return response()->json([
            'status' => $response['status']
        ]);   
    }
}
