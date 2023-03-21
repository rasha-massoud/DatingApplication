<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Models\Block;
use App\Models\Favorite;

class ListController extends Controller
{
    function blocklist(){
        $blocks = Block::all();
        return response()->json([
            "blocks" => $blocks
        ]);
    }

    function favoriteList(){
        $favorites = Favorite::all();
        return response()->json([
            "favorites" => $favorites
        ]);
    }
}
