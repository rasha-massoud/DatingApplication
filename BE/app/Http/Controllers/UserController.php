<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RegisteredUser;

class UserController extends Controller
{

    function registration(Request $request){
        $request = $request->email;
    }
}
