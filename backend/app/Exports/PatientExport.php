<?php

namespace App\Exports;

use App\Models\Patient;
use Illuminate\Contracts\Support\Responsable;
use Illuminate\Support\Carbon;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class PatientExport implements FromCollection, Responsable, WithHeadings
{
    use Exportable;

    private $fileName = 'patients.xlsx';

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Patient::latest()
            ->get()
            ->map(function ($row) {
                $data = $row->toArray();
                $data['created_at'] = Carbon::parse($row->created_at)->format('F d, Y h:i A');
                $data['updated_at'] = Carbon::parse($row->updated_at)->format('F d, Y h:i A');

                return $data;
            });
    }

    public function headings(): array
    {
        return array_keys($this->collection()->first());
    }
}
