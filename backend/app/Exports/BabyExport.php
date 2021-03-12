<?php

namespace App\Exports;

use App\Models\Baby;
use Illuminate\Contracts\Support\Responsable;
use Illuminate\Support\Carbon;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class BabyExport implements FromCollection, Responsable, WithHeadings
{
    use Exportable;

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Baby::with('attendee')
            ->get()
            ->map(function ($row) {
                $data = $row->toArray();
                $data['created_at'] = Carbon::parse($row->created_at)->format('F d, Y h:i A');
                $data['updated_at'] = Carbon::parse($row->updated_at)->format('F d, Y h:i A');
                $data['attendee'] = $row->attendee->name;

                return $data;
            });
    }

    public function headings(): array
    {
        return array_keys($this->collection()->first());
    }
}
