<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Models\Block;
use App\Models\Favorite;
use App\Models\Notification;

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

    function notificationList(Request $request){
        $notifications = Notification::where('user_id', $request->user_id)->get();
        $UserIdsNotifications = $notifications->pluck('on_user_id');
        $userNotifications = User::whereIn('id', $UserIdsNotifications)->get();        
        return response()->json([
            "notifications" => $notifications,
            "userNotifications" => $userNotifications
        ]);
    }
}
