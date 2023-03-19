<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class AuthController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login','register']]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
        $credentials = $request->only('email', 'password');

        $token = Auth::attempt($credentials);
        if (!$token) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 401);
        }

        $user = Auth::user();
        return response()->json([
                'status' => 'success',
                'user' => $user,
                'authorisation' => [
                    'token' => $token,
                    'type' => 'bearer',
                ]
            ]);
    }

    public function register(Request $request){
        
        $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|regex:/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/',
            'dob' => 'required|date',
            'gender_id' => 'required|integer',
            'location' => 'required|string|max:255',
            'biography' => 'required|string',
            'profile' => 'required|string',
        ]);

        $response=[];

        $email_exists = DB::table('users')->where('email', '=', $request->email)->exists();
        if ($email_exists > 0) {
            $response['status'] = "failed";
        } else {
            $user= new User;

            $user->name = $request->name;
            $user->phone_number = $request->phone_number;
            $user->email = $request->email;
            $user->password = Hash::make($request->password);
            $user->dob = $request->dob;
            $user->gender_id = $request->gender_id;
            $user->location = $request->location;
            $user->biography = $request->biography;
            $user->profile = $request->profile;

            $user->save();
            $response['status'] = "success";
        }

        return response()->json([
            'status' => $response['status'],
            'message' => $response['status'] === "success" ? 'User created successfully' : 'User creation failed',
            'authorisation' => [
                'token' => $response['status'] === "success" ? auth()->guard('api')->login(User::where('email', $request->email)->first()) : null,
                'type' => 'bearer',
            ]
        ]);
    }

    public function logout()
    {
        Auth::logout();
        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out',
        ]);
    }

    public function refresh()
    {
        return response()->json([
            'status' => 'success',
            'user' => Auth::user(),
            'authorisation' => [
                'token' => Auth::refresh(),
                'type' => 'bearer',
            ]
        ]);
    }

}