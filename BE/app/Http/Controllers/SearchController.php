<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class SearchController extends Controller
{
    function filter(Request $request){
        $category = $request->category;
        $filter_search = $request->filter_search;
        
        $users= User::where("$category", "=", "$filter_search")->get();
        return response()->json([
            "users" => $users
        ]);    
    }

    function search(Request $request){
        $user = User::where('name', $request->name)->first();
        return response()->json([
            "users" => $user
        ]);
    }
}
