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
        $blockedUserIds = $blocks->pluck('blocked_user_id');
        $blockedUsers = User::whereIn('id', $blockedUserIds)->get();        
        return response()->json([
            "blocks" => $blocks,
            "blockedUsers" => $blockedUsers
        ]);
    }

    function favoriteList(Request $request){
        $favorites = Favorite::where('user_id', $request->user_id)->get();
        $favoriteUserIds = $favorites->pluck('favorite_user_id');
        $favoriteUsers = User::whereIn('id', $favoriteUserIds)->get(); 
        return response()->json([
            "favorites" => $favorites,
            "favoriteUsers" => $favoriteUsers
        ]);
    }
}
