<?php

namespace App\Http\Controllers;

use App\Models\ImmunizationRecord;
use App\Models\Inventory;
use App\Models\Medicine;
use App\Models\PrenatalRecord;
use App\Models\Record;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ReportsController extends Controller
{
    public function patients()
    {
        $data = [];

        $regular = [];
        $prenatal = [];
        $immunization = [];

        foreach (Record::all() as $record) {
            if (!array_key_exists($record->patient->address, $regular)) {
                $regular[$record->patient->address] = 0;
            }

            $regular[$record->patient->address] += 1;
        }

        foreach (PrenatalRecord::all() as $record) {
            if (!array_key_exists($record->patient->address, $prenatal)) {
                $prenatal[$record->patient->address] = 0;
            }

            $prenatal[$record->patient->address] += 1;
        }

        foreach (ImmunizationRecord::all() as $record) {
            if (!array_key_exists($record->address, $immunization)) {
                $immunization[$record->address] = 0;
            }

            $immunization[$record->address] += 1;
        }

        foreach ($regular as $address => $count) {
            if (array_key_exists($address, $data)) {
                $data[$address]['regular'] = $count;
            } else {
                $data[$address] = [
                    'regular' => $count,
                    'prenatal' => 0,
                    'immunization' => 0,
                ];
            }
        }

        foreach ($prenatal as $address => $count) {
            if (array_key_exists($address, $data)) {
                $data[$address]['prenatal'] = $count;
            } else {
                $data[$address] = [
                    'regular' => 0,
                    'prenatal' => $count,
                    'immunization' => 0,
                ];
            }
        }

        foreach ($immunization as $address => $count) {
            if (array_key_exists($address, $data)) {
                $data[$address]['immunization'] = $count;
            } else {
                $data[$address] = [
                    'regular' => 0,
                    'prenatal' => 0,
                    'immunization' => $count,
                ];
            }
        }

        $response = [];

        foreach ($data as $address => $data) {
            $response[] = [
                'address' => $address,
            ] + $data;
        }

        return $response;
    }

    public function medicines()
    {
        return Medicine::all();
    }

    public function inventories()
    {
        return Inventory::all();
    }

    public function immunizations()
    {
        $data = [
            'bcg' => ['males' => 0, 'females' => 0],
            'penta' => ['males' => 0, 'females' => 0],
            'opv' => ['males' => 0, 'females' => 0],
            'hepa_b' => ['males' => 0, 'females' => 0],
            'measles' => ['males' => 0, 'females' => 0],
            'mmr' => ['males' => 0, 'females' => 0],
            'other' => ['males' => 0, 'females' => 0],
        ];

        $vaccines = array_keys($data);

        $gaps = [
            'at_birth',
            'fourteen_weeks',
            'nine_months',
            'six_weeks',
        ];

        foreach (ImmunizationRecord::all() as $record) {
            foreach ($vaccines as $key) {
                foreach ($gaps as $gap) {
                    try {
                        if ($record->info->{$key}->{$gap} !== 'N/A') {
                            if ($record->outcome === 'Male') {
                                $data[$key]['males'] += 1;
                            } else if ($record->outcome === 'Female') {
                                $data[$key]['females'] += 1;
                            }
                            break;
                        }
                    } catch (\Throwable $e) {
                    }
                }
            }
        }

        $response = [];

        foreach ($data as $vaccine => $data) {
            $response[] = [
                'vaccine' => ucwords(str_replace('_', ' ', $vaccine)),
            ] + $data;
        }

        return $response;
    }

    public function records()
    {
        $data = [];

        $diseases = [];

        foreach (Record::with('patient')->get() as $record) {
            if (!array_key_exists($record->diagnosis, $diseases)) {
                $diseases[$record->diagnosis] = [
                    'males' => 0,
                    'females' => 0,
                ];

                if ($record->patient->sex === 'Male') {
                    $diseases[$record->diagnosis]['males'] += 1;
                } else {
                    $diseases[$record->diagnosis]['females'] += 1;
                }
            }
        }

        foreach ($diseases as $disease => $counts) {
            $data[] = [
                'disease' => $disease,
            ] + $counts;
        }

        return $data;
    }

    public function prenatals()
    {
        $data = [];

        $addresses = [];

        $records = PrenatalRecord::with('patient')->get();

        foreach ($records as $record) {
            if (!array_key_exists($record->patient->address, $addresses)) {
                $addresses[$record->patient->address] = [
                    'males' => 0,
                    'females' => 0,
                    'live_births' => 0,
                    'death_births' => 0,
                    'nsd' => 0,
                    'cs' => 0,
                ];
            }
        }

        $immunizations = ImmunizationRecord::all();

        foreach ($immunizations as $immunization) {
            if (!array_key_exists($immunization->address, $addresses)) {
                $addresses[$immunization->address] = [
                    'males' => 0,
                    'females' => 0,
                    'live_births' => 0,
                    'death_births' => 0,
                    'nsd' => 0,
                    'cs' => 0,
                ];
            }
        }

        foreach ($immunizations as $immunization) {
            if (Str::lower($immunization->type_of_del) === 'nsd') {
                $addresses[$immunization->address]['nsd'] += 1;
            }

            if (Str::lower($immunization->type_of_del) === 'cs') {
                $addresses[$immunization->address]['cs'] += 1;
            }
        }

        foreach ($records as $record) {
            if ($record->patient->sex === 'Male') {
                $addresses[$record->patient->address]['males'] += 1;
            } else {
                $addresses[$record->patient->address]['females'] += 1;
            }

            if ($record->delivery_status === 'Alive') {
                $addresses[$record->patient->address]['live_births'] += 1;
            }

            if ($record->delivery_status === 'Deceased') {
                $addresses[$record->patient->address]['death_births'] += 1;
            }
        }

        foreach ($addresses as $address => $counts) {
            $data[] = [
                'address' => $address,
            ] + $counts;
        }

        return $data;
    }
}
