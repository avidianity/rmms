<?php

namespace App\Http\Controllers;

use App\Models\PrenatalRecord;
use App\Models\Prescription;
use App\Models\Record;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function __invoke(Request $request)
    {
        $data = $request->validate([
            'model' => ['required', 'string'],
            'keyword' => ['required', 'string']
        ]);

        $model = "App\\Models\\{$data['model']}";

        if (!class_exists($model)) {
            return response(['message' => 'Invalid search parameters.'], 400);
        }

        $builder = $model::search($data['keyword']);

        $builder = $this->appendRelationships($builder, $model);

        if ($request->input('paginate', 'true') === 'false') {
            return $builder->get();
        }

        return $builder->paginate(10);
    }

    protected function appendRelationships($builder, $model)
    {
        switch ($model) {
            case Prescription::class:
                return $builder->with([
                    'doctor',
                    'recordable.patient',
                ]);
            case Record::class:
                return $builder->with(['doctor', 'patient']);
            case PrenatalRecord::class:
                return $builder->with(['attendee', 'patient']);
            default:
                return $builder;
        }
    }
}
