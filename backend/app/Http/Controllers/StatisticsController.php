<?php

namespace App\Http\Controllers;

use App\Models\ImmunizationRecord;
use App\Models\Medicine;
use App\Models\Patient;
use App\Models\PrenatalRecord;
use App\Models\Prescription;
use App\Models\PurchaseRequest;
use App\Models\Record;
use App\Models\User;

class StatisticsController extends Controller
{
    public function counts()
    {
        $medicines = Medicine::all();
        return [
            'medicine' => [
                'on_stock' => $medicines->filter(function (Medicine $medicine) {
                    return $medicine->available > 0;
                })
                    ->map(function (Medicine $medicine) {
                        return $medicine->available;
                    })->reduce(function ($previous, $next) {
                        return $previous + $next;
                    }, 0),
                'out_of_stock' => $medicines->filter(function (Medicine $medicine) {
                    return $medicine->available === 0;
                })->count(),
            ],
            'purchase_requests' => [
                'delivered' => PurchaseRequest::whereNotNull('delivered')->count(),
                'pending' => PurchaseRequest::whereNull('delivered')->count(),
            ],
            'prescriptions' => [
                'released' => Prescription::whereNotNull('released_at')->count(),
                'pending' => Prescription::whereNull('released_at')->count(),
            ],
            'patients' => Patient::count(),
            'regular_records' => Record::count(),
            'prenatal_records' => PrenatalRecord::count(),
            'users' => User::count(),
            'immunization_records' => ImmunizationRecord::count(),
        ];
    }

    public function years()
    {
        $now = now();
        return [
            'regular_records' => Record::whereYear('created_at', $now->year)->count(),
            'prenatal_records' => PrenatalRecord::whereYear('created_at', $now->year)->count(),
            'patients' => Patient::whereYear('created_at', $now->year)->count(),
        ];
    }

    public function quarters()
    {
        $now = now();
        $start = $now->startOfQuarter();
        $end = $now->endOfQuarter();
        return [
            'regular_records' => Record::whereBetween('created_at', [
                $start,
                $end,
            ])->count(),
            'prenatal_records' => PrenatalRecord::whereBetween('created_at', [
                $start,
                $end,
            ])->count(),
            'patients' => Patient::whereBetween('created_at', [
                $start,
                $end,
            ])->count(),
        ];
    }

    public function months()
    {
        $now = now();
        return [
            'current' => [
                'users' => User::whereYear('created_at', $now->year)
                    ->whereMonth('created_at', $now->month)
                    ->take(5)
                    ->latest()
                    ->get(),
                'regular_records' => Record::whereYear('created_at', $now->year)
                    ->whereMonth('created_at', $now->month)
                    ->with('doctor', 'patient')
                    ->take(5)
                    ->latest()
                    ->get(),
                'prenatal_records' => PrenatalRecord::whereYear('created_at', $now->year)
                    ->whereMonth('created_at', $now->month)
                    ->with('attendee', 'patient')
                    ->take(5)
                    ->latest()
                    ->get(),
            ],
            'patients' => Patient::whereYear('created_at', $now->year)
                ->get(['created_at'])
                ->map(function (Patient $model) {
                    $data = $model->toArray();
                    $data['month'] = $model->created_at->monthName;

                    return $data;
                })
                ->groupBy('month')
                ->map(function ($data) {
                    return count($data);
                }),
            'regular_records' => Record::whereYear('created_at', $now->year)
                ->get(['created_at'])
                ->map(function (Record $model) {
                    $data = $model->toArray();
                    $data['month'] = $model->created_at->monthName;

                    return $data;
                })
                ->groupBy('month')
                ->map(function ($data) {
                    return count($data);
                }),
            'prenatal_records' => PrenatalRecord::whereYear('created_at', $now->year)
                ->get(['created_at'])
                ->map(function (PrenatalRecord $model) {
                    $data = $model->toArray();
                    $data['month'] = $model->created_at->monthName;

                    return $data;
                })
                ->groupBy('month')
                ->map(function ($data) {
                    return count($data);
                }),
        ];
    }

    public function weeks()
    {
        $now = now();
        $start = $now->startOfWeek();
        $end = $now->endOfWeek();
        return [
            'regular_records' => Record::whereBetween('created_at', [
                $start,
                $end,
            ])->count(),
            'prenatal_records' => PrenatalRecord::whereBetween('created_at', [
                $start,
                $end,
            ])->count(),
            'patients' => Patient::whereBetween('created_at', [
                $start,
                $end,
            ])->count(),
        ];
    }

    public function daily()
    {
        $now = now();
        $start = $now->startOfDay();
        $end = $now->endOfDay();
        return [
            'regular_records' => Record::whereBetween('created_at', [
                $start,
                $end,
            ])->count(),
            'prenatal_records' => PrenatalRecord::whereBetween('created_at', [
                $start,
                $end,
            ])->count(),
            'patients' => Patient::whereBetween('created_at', [
                $start,
                $end,
            ])->count(),
        ];
    }
}
