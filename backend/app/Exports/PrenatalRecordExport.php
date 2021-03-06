<?php

namespace App\Exports;

use App\Models\PrenatalRecord;
use Illuminate\Support\Carbon;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class PrenatalRecordExport implements FromCollection, WithHeadings
{
    use Exportable;

    private $fileName = 'prenatal-records.pdf';

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return PrenatalRecord::with(['attendee', 'patient'])
            ->latest('case_number')
            ->get()
            ->map(function ($row) {
                $data = $row->toArray();
                $data['case_number'] = Carbon::parse($row->case_number)->format('F d, Y');
                $data['created_at'] = Carbon::parse($row->created_at)->format('F d, Y h:i A');
                $data['updated_at'] = Carbon::parse($row->updated_at)->format('F d, Y h:i A');
                $data['attendee'] = $row->attendee->name;
                $data['patient'] = $row->patient->name;

                return $data;
            });;
    }

    public function headings(): array
    {
        return array_keys($this->collection()->first());
    }
}
