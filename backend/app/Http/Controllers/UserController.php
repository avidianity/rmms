<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('admin')->only(['store', 'update', 'destroy']);
    }

    public function index(Request $request)
    {
        $builder = new User();
        if ($request->has('role') && in_array($role = $request->input('role'), User::ROLES)) {
            $builder = $builder->where('role', $role);
        }
        if ($request->input('paginate', 'true') === 'false') {
            return $builder->get();
        } else {
            return $builder->orderBy('role', 'ASC')->paginate(15);
        }
    }

    public function show(User $user)
    {
        return $user;
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique(User::class)],
            'password' => ['required', 'string', 'max:255'],
            'role' => ['required', 'string', Rule::in(User::ROLES)],
        ]);

        $data['password'] = Hash::make($data['password']);

        return User::create($data);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', Rule::unique(User::class)->ignoreModel($user)],
            'password' => ['nullable', 'string', 'max:255'],
        ]);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return $user;
    }

    public function destroy(User $user)
    {
        $user->delete();

        return response('', 204);
    }

    public function search(Request $request)
    {
        return User::search($request->input('keyword'))->paginate(15);
    }
}
