<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Models\Block;
use App\Models\Favorite;

class ListController extends Controller
{
    function blocklist(Request $request){
        $blocks = Block::where('user_id', $request->user_id)->get();
        return response()->json([
            "blocks" => $blocks
        ]);
    }

    function favoriteList(Request $request){
        $favorites = Favorite::where('user_id', $request->user_id)->get();
        return response()->json([
            "favorites" => $favorites
        ]);
    }
}
