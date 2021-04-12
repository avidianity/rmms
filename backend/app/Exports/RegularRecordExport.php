<?php

namespace App\Exports;

use App\Models\Record;
use Illuminate\Support\Carbon;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class RegularRecordExport implements FromCollection, WithHeadings
{
    use Exportable;

    private $fileName = 'regular-records.pdf';

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Record::with(['doctor', 'patient'])
            ->latest('case_number')
            ->get()
            ->map(function ($row) {
                $data = $row->toArray();
                $data['case_number'] = Carbon::parse($row->case_number)->format('F d, Y');
                $data['created_at'] = Carbon::parse($row->created_at)->format('F d, Y h:i A');
                $data['updated_at'] = Carbon::parse($row->updated_at)->format('F d, Y h:i A');
                $data['doctor'] = $row->doctor->name;
                $data['patient'] = $row->patient->name;

                return $data;
            });
    }

    public function headings(): array
    {
        return array_keys($this->collection()->first());
    }
}
